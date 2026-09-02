'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bot, CheckCircle2, CircleAlert, Radio, Search, Wrench } from 'lucide-react';
import type { AgentActivity } from '@/lib/domain';
import { webMcpToolContracts } from '@/lib/webmcp-contracts';

type Status = 'checking' | 'available' | 'unavailable';

const json = async (path: string, init?: RequestInit) => {
  const response = await fetch(path, { ...init, headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) } });
  const data: any = await response.json();
  if (!response.ok) throw new Error(data.error ?? 'Pulse request failed.');
  return data;
};

const slimCase = (repair: any) => ({
  case_id: repair.id, product: `${repair.brand} ${repair.product_name}`, model: repair.model,
  problem: repair.problem_description, symptoms: repair.symptoms, outcome: repair.outcome?.outcome ?? repair.status,
  final_fix: repair.outcome?.final_fix ?? null, safety_classification: repair.safety_classification,
  difficulty: repair.difficulty, evidence: repair.evidence ?? repair.votes,
});

export function WebMcpProvider() {
  const [status, setStatus] = useState<Status>('checking');
  const [activity, setActivity] = useState<AgentActivity[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState('Waiting for an agent');

  const refreshActivity = async () => {
    try {
      const data = await json('/api/activity?limit=6');
      setActivity(data.activity);
    } catch { /* Static preview has no D1 binding. */ }
  };

  useEffect(() => {
    const onMutation = (event: Event) => {
      const detail = (event as CustomEvent<{ description?: string }>).detail;
      setMessage(detail?.description ?? 'The page was updated through WebMCP');
      refreshActivity();
    };
    window.addEventListener('pulse:mutated', onMutation);
    return () => window.removeEventListener('pulse:mutated', onMutation);
  }, []);

  const toolDefinitions = useMemo<WebMcpTool[]>(() => {
    const changed = (description: string, repair?: any) => {
      window.dispatchEvent(new CustomEvent('pulse:mutated', { detail: { description, repair } }));
    };
    return [
      {
        ...webMcpToolContracts.searchRepairs,
        execute: async (input) => { const query = new URLSearchParams(Object.entries(input).filter(([,value]) => value !== undefined).map(([key,value]) => [key, String(value)])); const data = await json(`/api/repairs?${query}`); setMessage(`ChatGPT searched repairs · ${data.count} matches`); return JSON.stringify({ count: data.count, repairs: data.repairs.map(slimCase) }).slice(0, 1500); },
      },
      {
        ...webMcpToolContracts.getRepairCase,
        execute: async ({ case_id }) => { const data = await json(`/api/repairs/${encodeURIComponent(String(case_id))}`); setMessage(`ChatGPT opened ${case_id}`); return JSON.stringify({ ...slimCase(data.repair), diagnostic_steps: data.repair.diagnostic_steps, repair_attempts: data.repair.repair_attempts }).slice(0, 1500); },
      },
      {
        ...webMcpToolContracts.createRepairCase,
        execute: async (input) => { const data = await json('/api/repairs', { method: 'POST', body: JSON.stringify(input) }); changed(`ChatGPT created ${data.repair.id}`, data.repair); return JSON.stringify({ created: true, case: slimCase(data.repair), page: `/repairs/${data.repair.id}` }); },
      },
      {
        ...webMcpToolContracts.addDiagnosticStep,
        execute: async ({ case_id, ...input }) => { const data = await json(`/api/repairs/${encodeURIComponent(String(case_id))}/steps`, { method: 'POST', body: JSON.stringify(input) }); changed(`ChatGPT added a diagnostic step to ${case_id}`, data.repair); return JSON.stringify({ updated: true, case_id, diagnostic_step: data.repair.diagnostic_steps.at(-1) }); },
      },
      {
        ...webMcpToolContracts.addDiagnosticResult,
        execute: async ({ case_id, ...input }) => { const data = await json(`/api/repairs/${encodeURIComponent(String(case_id))}/results`, { method: 'POST', body: JSON.stringify(input) }); changed(`Human observation recorded for ${case_id}`, data.repair); return JSON.stringify({ updated: true, case_id, diagnostic_steps: data.repair.diagnostic_steps }); },
      },
      {
        ...webMcpToolContracts.recordRepairAttempt,
        execute: async ({ case_id, ...input }) => { const data = await json(`/api/repairs/${encodeURIComponent(String(case_id))}/attempts`, { method: 'POST', body: JSON.stringify(input) }); changed(`ChatGPT recorded a repair attempt for ${case_id}`, data.repair); return JSON.stringify({ updated: true, case_id, repair_attempt: data.repair.repair_attempts.at(-1) }); },
      },
      {
        ...webMcpToolContracts.recordRepairOutcome,
        execute: async ({ case_id, ...input }) => { const data = await json(`/api/repairs/${encodeURIComponent(String(case_id))}/outcome`, { method: 'POST', body: JSON.stringify(input) }); changed(`ChatGPT recorded ${input.outcome} for ${case_id}`, data.repair); return JSON.stringify({ updated: true, case: slimCase(data.repair) }); },
      },
      {
        ...webMcpToolContracts.markCaseHelpful,
        execute: async ({ case_id, vote_type }) => { const data = await json(`/api/repairs/${encodeURIComponent(String(case_id))}/votes`, { method: 'POST', body: JSON.stringify({ vote_type }) }); changed(`Community marked ${case_id} as ${String(vote_type).replaceAll('_',' ')}`, data.repair); return JSON.stringify({ updated: true, case_id, votes: data.repair.votes }); },
      },
      {
        ...webMcpToolContracts.listCommonFailures,
        execute: async (input) => { const query = new URLSearchParams(Object.entries(input).map(([key,value]) => [key, String(value)])); const data = await json(`/api/common-failures?${query}`); setMessage('ChatGPT compared common failures'); return JSON.stringify(data.common_failures).slice(0, 1500); },
      },
      {
        ...webMcpToolContracts.getRepairStatistics,
        execute: async () => { const data = await json('/api/statistics'); setMessage('ChatGPT reviewed repair statistics'); return JSON.stringify(data.statistics).slice(0, 1500); },
      },
    ];
  }, []);

  useEffect(() => {
    const context = document.modelContext ?? navigator.modelContext;
    if (!context) { setStatus('unavailable'); return; }
    const controller = new AbortController();
    Promise.all(toolDefinitions.map((tool) => context.registerTool(tool, { signal: controller.signal })))
      .then(() => { setStatus('available'); setMessage(`${toolDefinitions.length} WebMCP tools registered`); refreshActivity(); })
      .catch(() => setStatus('unavailable'));
    return () => controller.abort();
  }, [toolDefinitions]);

  return (
    <aside className={`webmcp-dock ${expanded ? 'expanded' : ''}`} aria-label="Agent activity">
      <button className="dock-summary" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
        <span className={`dock-icon ${status}`}><Bot /></span>
        <span><strong>Agent activity</strong><small>{message}</small></span>
        {status === 'available' ? <CheckCircle2 className="dock-state" /> : status === 'unavailable' ? <CircleAlert className="dock-state" /> : <Radio className="dock-state pulse" />}
      </button>
      {expanded && (
        <div className="dock-body">
          <div className="dock-status"><span className={`status-dot ${status}`} /> WebMCP {status === 'available' ? 'available' : status === 'unavailable' ? 'not detected · human interface remains available' : 'checking'}</div>
          <ol>
            {activity.length ? activity.map((item) => <li key={item.id}><span>{item.tool_name.includes('search') ? <Search /> : <Wrench />}</span><div><strong>{item.description}</strong><small>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small></div></li>) : <li><span><Radio /></span><div><strong>Ready for an agent</strong><small>Tools appear when WebMCP is available.</small></div></li>}
          </ol>
          <a href="/webmcp">View all {toolDefinitions.length} registered tools</a>
        </div>
      )}
    </aside>
  );
}

