import { DashboardView } from '@/components/dashboard-view';
import { SiteHeader } from '@/components/site-header';

export default function DashboardPage() {
  return <main><SiteHeader /><section className="page-intro dashboard-intro"><p className="eyebrow">Open repair network</p><h1>Repair knowledge that<br /><span>grows through use.</span></h1><p>A live view of structured cases, verified outcomes, and the objects MendSignal has helped keep in service.</p></section><DashboardView /></main>;
}
