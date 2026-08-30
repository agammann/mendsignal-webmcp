import { SiteHeader } from '@/components/site-header';
import { SearchExplorer } from '@/components/search-explorer';

export default async function RepairsPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const { query = '' } = await searchParams;
  return <main><SiteHeader /><section className="page-intro"><p className="eyebrow">Explore the repair memory</p><h1>Find what worked.<br /><span>And what didn’t.</span></h1><p>Search structured repair trails across products, symptoms, diagnostic tests, attempted fixes, and outcomes.</p></section><SearchExplorer initialQuery={query} /></main>;
}
