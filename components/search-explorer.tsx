'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Filter, LoaderCircle, Search, SlidersHorizontal, X } from 'lucide-react';
import { RepairCard } from './repair-card';
import { seedCases } from '@/lib/seed-data';
import type { RepairSearchResult } from '@/lib/domain';

const localResults = seedCases.map((repair, index) => ({ ...repair, relevance: 100 - index, evidence: { symptom_reports: repair.votes.helpful, attempts: repair.votes.worked_for_me + repair.votes.did_not_work, fixed: repair.votes.worked_for_me, improved: repair.outcome?.outcome === 'improved' ? 1 : 0, did_not_work: repair.votes.did_not_work, median_time_minutes: repair.outcome?.time_minutes ?? 0, typical_cost: repair.outcome ? `$${Math.max(0, repair.outcome.cost - 3)}–$${repair.outcome.cost + 5}` : 'Unknown' } })) as RepairSearchResult[];

const filterLocalResults = (query: string, category: string, outcome: string, difficulty: string) => {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return localResults.filter((item) => {
    const text = [item.category,item.brand,item.model,item.product_name,item.problem_description,...item.symptoms,item.outcome?.final_fix ?? ''].join(' ').toLowerCase();
    return terms.every((term) => text.includes(term)) && (!category || item.category === category) && (!outcome || item.outcome?.outcome === outcome) && (!difficulty || item.difficulty === difficulty);
  });
};

export function SearchExplorer({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('');
  const [outcome, setOutcome] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [results, setResults] = useState<RepairSearchResult[]>(localResults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = useMemo(() => [...new Set(seedCases.map((item) => item.category))].sort(), []);

  const runSearch = useCallback(async (filters: { query: string; category: string; outcome: string; difficulty: string }) => {
    const { query: searchQuery, category: searchCategory, outcome: searchOutcome, difficulty: searchDifficulty } = filters;
    setLoading(true); setError('');
    const params = new URLSearchParams({ limit: '30' });
    if (searchQuery.trim()) params.set('query', searchQuery.trim());
    if (searchCategory) params.set('category', searchCategory);
    if (searchOutcome) params.set('outcome', searchOutcome);
    if (searchDifficulty) params.set('difficulty', searchDifficulty);
    try {
      const response = await fetch(`/api/repairs?${params}`);
      const data = await response.json() as { repairs: RepairSearchResult[]; error?: string };
      if (!response.ok) throw new Error(data.error ?? 'Search failed.');
      setResults(data.repairs);
    } catch {
      setResults(filterLocalResults(searchQuery, searchCategory, searchOutcome, searchDifficulty));
      setError('Showing bundled demo records while the live database connects.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void runSearch({ query: initialQuery, category: '', outcome: '', difficulty: '' }), 0);
    return () => window.clearTimeout(timer);
  }, [initialQuery, runSearch]);

  return (
    <div className="explorer-layout">
      <aside className="filter-panel">
        <div className="filter-title"><Filter /> <strong>Filter evidence</strong></div>
        <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{categories.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Outcome<select value={outcome} onChange={(event) => setOutcome(event.target.value)}><option value="">Any outcome</option><option value="fixed">Fixed</option><option value="improved">Improved</option><option value="not_fixed">Not fixed</option><option value="professional_repair_required">Professional repair</option><option value="replacement_required">Replacement</option><option value="abandoned">Abandoned</option></select></label>
        <label>Difficulty<select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}><option value="">Any difficulty</option><option value="easy">Easy</option><option value="moderate">Moderate</option><option value="advanced">Advanced</option></select></label>
        <button className="secondary-button" onClick={() => void runSearch({ query, category, outcome, difficulty })}><SlidersHorizontal /> Apply filters</button>
        {(category || outcome || difficulty) && <button className="text-button" onClick={() => { setCategory(''); setOutcome(''); setDifficulty(''); }}>Clear filters <X /></button>}
        <div className="filter-note"><strong>Evidence, not confidence.</strong><p>We show what people attempted and what actually happened—not an unexplained AI score.</p></div>
      </aside>
      <section className="results-panel">
        <form className="explorer-search" onSubmit={(event) => { event.preventDefault(); void runSearch({ query, category, outcome, difficulty }); }}><Search /><label className="sr-only" htmlFor="repair-query">Search the repair memory</label><input id="repair-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Brand, model, symptom, or problem" /><button type="submit">{loading ? <LoaderCircle className="spin" /> : 'Search'}</button></form>
        <div className="results-heading"><div><p className="mono-label">PUBLIC REPAIR MEMORY</p><h1>{loading ? 'Searching repair evidence…' : `${results.length} repair cases`}</h1></div><span>Ranked by model match, symptom overlap, outcome, and community confirmation.</span></div>
        {error && <p className="inline-notice">{error}</p>}
        <div className="repair-grid">{results.map((repair) => <RepairCard key={repair.id} repair={repair} />)}</div>
        {!loading && !results.length && <div className="empty-state"><Search /><h2>No matching repair evidence yet</h2><p>Start a case and help create the first verified trail for this problem.</p><Link href="/repair/new">Start this repair</Link></div>}
      </section>
    </div>
  );
}
