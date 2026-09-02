'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Check, CheckCircle2, Circle, Clock3, Coins, ExternalLink, Heart, LoaderCircle, ShieldCheck, ThumbsDown, ThumbsUp, Wrench } from 'lucide-react';
import type { RepairCase } from '@/lib/domain';
import { outcomeLabel, safetyLabel } from '@/lib/domain';

export function RepairDetail({ initialRepair }: { initialRepair: RepairCase }) {
  const [repair, setRepair] = useState(initialRepair);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');

  const refresh = async () => {
    try { const response = await fetch(`/api/repairs/${repair.id}`); const data: any = await response.json(); if (response.ok) setRepair(data.repair); } catch { /* Bundled fallback remains visible. */ }
  };
  useEffect(() => {
    const onMutation = (event: Event) => {
      const detail = (event as CustomEvent<{ repair?: RepairCase }>).detail;
      if (detail?.repair?.id === repair.id) setRepair(detail.repair); else refresh();
      setNotice('This case was updated through WebMCP.');
    };
    window.addEventListener('pulse:mutated', onMutation);
    return () => window.removeEventListener('pulse:mutated', onMutation);
  }, [repair.id]);

  const vote = async (voteType: string) => {
    setBusy(voteType); setNotice('');
    try { const response = await fetch(`/api/repairs/${repair.id}/votes`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ vote_type: voteType }) }); const data: any = await response.json(); if (!response.ok) throw new Error(data.error); setRepair(data.repair); setNotice('Your verification was added to the repair evidence.'); }
    catch { setNotice('The live database is not available in this preview.'); }
    finally { setBusy(''); }
  };

  const professional = repair.safety_classification === 'professional_recommended';
  return (
    <div className="detail-shell">
      <section className="detail-main">
        <div className="detail-kicker"><span className="mono-label">{repair.id} {repair.demo_record ? '· SYNTHETIC DEMO RECORD' : '· COMMUNITY CASE'}</span><span className={`safety-badge ${repair.safety_classification}`}><ShieldCheck /> {safetyLabel(repair.safety_classification)}</span></div>
        <h1>{repair.problem_description}</h1>
        <p className="detail-product">{repair.brand} {repair.product_name} <span>·</span> {repair.model} <span>·</span> {repair.category}</p>
        <div className="tag-list detail-tags">{repair.symptoms.map((symptom) => <span key={symptom}>{symptom}</span>)}</div>
        {notice && <div className="success-notice"><CheckCircle2 /> {notice}</div>}
        {professional && <div className="professional-banner"><AlertTriangle /><div><strong>Qualified service recommended</strong><p>This case is available for history and evidence only. Pulse does not provide procedural instructions for mains electricity, gas, high-voltage, critical vehicle systems, structural repair, or hazardous materials.</p></div></div>}

        <section className="timeline-section">
          <div className="section-heading"><div><p className="mono-label">CHRONOLOGICAL CASE HISTORY</p><h2>Diagnostic timeline</h2></div><span>{repair.diagnostic_steps.length} recorded tests</span></div>
          <ol className="timeline">
            <li className="complete"><span><Check /></span><div><small>Problem reported</small><strong>{repair.problem_description}</strong><p>Symptoms: {repair.symptoms.join(', ')}</p></div></li>
            {repair.diagnostic_steps.map((step) => <li key={step.id} className={step.status === 'completed' ? 'complete' : 'current'}><span>{step.status === 'completed' ? <Check /> : <Circle />}</span><div><small>Diagnostic test {step.sequence}</small><strong>{step.test}</strong><p>{step.reason}</p><div className="observation"><b>Expected</b> {step.expected_result}</div>{step.observed_result && <div className="observation result"><b>Observed by human</b> {step.observed_result}{step.notes && <em>{step.notes}</em>}</div>}</div></li>)}
            {repair.repair_attempts.map((attempt) => <li key={attempt.id} className="complete"><span><Wrench /></span><div><small>Repair attempted</small><strong>{attempt.repair_description}</strong><p>Parts: {attempt.parts_used.join(', ') || 'No parts'} · Estimated ${attempt.estimated_cost} · {attempt.difficulty}</p></div></li>)}
            <li className={repair.outcome ? 'complete outcome' : 'pending'}><span>{repair.outcome ? <CheckCircle2 /> : <Circle />}</span><div><small>Outcome</small><strong>{repair.outcome ? outcomeLabel(repair.outcome.outcome) : 'Awaiting a verified result'}</strong>{repair.outcome && <><p>{repair.outcome.final_fix}</p><div className="outcome-facts"><span><Coins /> ${repair.outcome.cost}</span><span><Clock3 /> {repair.outcome.time_minutes} minutes</span></div></>}</div></li>
          </ol>
        </section>
      </section>

      <aside className="detail-side">
        <section className="evidence-summary">
          <p className="mono-label">REPAIR EVIDENCE</p><h2>What the community observed</h2>
          <div className="evidence-big"><strong>{repair.votes.helpful}</strong><span>people found this case helpful</span></div>
          <div className="bar-row"><span>Worked for me <b>{repair.votes.worked_for_me}</b></span><div><i style={{ width: `${Math.min(100, repair.votes.worked_for_me / Math.max(1, repair.votes.worked_for_me + repair.votes.did_not_work) * 100)}%` }} /></div></div>
          <div className="bar-row negative"><span>Did not work <b>{repair.votes.did_not_work}</b></span><div><i style={{ width: `${Math.min(100, repair.votes.did_not_work / Math.max(1, repair.votes.worked_for_me + repair.votes.did_not_work) * 100)}%` }} /></div></div>
          {repair.outcome && <div className="evidence-facts"><span>Recorded outcome<strong>{outcomeLabel(repair.outcome.outcome)}</strong></span><span>Repair time<strong>{repair.outcome.time_minutes} min</strong></span><span>Actual cost<strong>${repair.outcome.cost}</strong></span><span>Difficulty<strong>{repair.difficulty}</strong></span></div>}
        </section>
        <section className="verification-card"><h3>Did this evidence help?</h3><p>Add your result to the shared repair memory.</p><button disabled={Boolean(busy)} onClick={() => vote('helpful')}>{busy === 'helpful' ? <LoaderCircle className="spin" /> : <Heart />} Helpful</button><button disabled={Boolean(busy)} onClick={() => vote('worked_for_me')}>{busy === 'worked_for_me' ? <LoaderCircle className="spin" /> : <ThumbsUp />} Worked for me</button><button disabled={Boolean(busy)} onClick={() => vote('did_not_work')}>{busy === 'did_not_work' ? <LoaderCircle className="spin" /> : <ThumbsDown />} Did not work</button></section>
        <section className="agent-prompt-card"><p className="mono-label">TRY WITH YOUR AGENT</p><h3>Continue this repair with WebMCP</h3><code>“Open {repair.id} and suggest the safest next diagnostic question.”</code><a href="/webmcp">See judge test prompts <ExternalLink /></a></section>
      </aside>
    </div>
  );
}

