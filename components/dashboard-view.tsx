'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, CheckCircle2, Clock3, Layers3, PackageCheck, TrendingUp } from 'lucide-react';
import { seedCases } from '@/lib/seed-data';

const fallback = (() => {
  const successful = seedCases.filter((item) => ['fixed','improved'].includes(item.outcome?.outcome ?? '')).length;
  const categories = Object.entries(seedCases.reduce<Record<string, number>>((acc, item) => ({ ...acc, [item.category]: (acc[item.category] ?? 0) + 1 }), {})).sort((a,b) => b[1]-a[1]).slice(0,6).map(([category,count]) => ({ category, count }));
  return { total_repair_cases: seedCases.length, successful_repairs: successful, estimated_items_kept_in_service: successful, success_rate: Math.round(successful / seedCases.length * 100), most_repaired_categories: categories, recently_solved_cases: seedCases.slice(-5).reverse() };
})();

export function DashboardView() {
  const [stats, setStats] = useState<any>(fallback);
  useEffect(() => { fetch('/api/statistics').then((response) => response.json() as Promise<any>).then((data) => data.ok && setStats(data.statistics)).catch(() => {}); }, []);
  const maxCategory = Math.max(...stats.most_repaired_categories.map((item: any) => item.count), 1);
  return <div className="dashboard-shell">
    <section className="metric-grid"><div><Layers3 /><span>Total repair cases</span><strong>{stats.total_repair_cases.toLocaleString()}</strong><small>Structured trails in the public memory</small></div><div><CheckCircle2 /><span>Successful repairs</span><strong>{stats.successful_repairs.toLocaleString()}</strong><small>{stats.success_rate}% fixed or improved</small></div><div><PackageCheck /><span>Items kept in service</span><strong>{stats.estimated_items_kept_in_service.toLocaleString()}</strong><small>Estimated from successful outcomes</small></div><div><TrendingUp /><span>Community signal</span><strong>{stats.success_rate}%</strong><small>Outcomes, not a confidence score</small></div></section>
    <div className="dashboard-grid"><section className="category-chart"><div className="section-heading"><div><p className="mono-label">MOST REPAIRED</p><h2>Categories in the memory</h2></div></div><div className="category-bars">{stats.most_repaired_categories.map((item: any) => <div key={item.category}><span>{item.category}<b>{item.count}</b></span><div><i style={{ width: `${item.count / maxCategory * 100}%` }} /></div></div>)}</div></section><section className="dashboard-callout"><p className="mono-label">WHY IT COMPOUNDS</p><h2>Every outcome makes the next search better.</h2><p>MendSignal records failed attempts alongside successes, so agents can compare evidence instead of repeating the most popular advice.</p><a href="/repairs">Explore repair evidence <ArrowUpRight /></a></section></div>
    <section className="recent-cases"><div className="section-heading"><div><p className="mono-label">LATEST OUTCOMES</p><h2>Recently solved cases</h2></div><a href="/repairs">View all repairs</a></div><div>{stats.recently_solved_cases.map((item: any) => <a key={item.id} href={`/repairs/${item.id}`}><span className="recent-status"><CheckCircle2 /></span><span><small>{item.id} · {item.category}</small><strong>{item.problem_description}</strong></span><span className="recent-meta"><Clock3 /> {item.outcome?.time_minutes ?? 0} min</span><ArrowUpRight /></a>)}</div></section>
  </div>;
}
