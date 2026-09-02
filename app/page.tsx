import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  Check,
  CircleDot,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';

const evidence = [
  { value: '12', label: 'reported this symptom' },
  { value: '8', label: 'attempted this repair' },
  { value: '6', label: 'reported fixed' },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Pulse home">
          <span className="brand-mark"><Wrench aria-hidden="true" /></span>
          <span>Pulse</span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/repairs">Explore Repairs</Link>
          <Link href="/repair/new">Start a Repair</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/webmcp">About WebMCP</Link>
        </nav>
        <Link className="header-cta" href="/repair/new">Contribute a repair <ArrowRight /></Link>
      </header>

      <section className="hero-shell">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles /> Open repair memory for humans and agents</div>
          <h1>Broken before?<br /><span>Someone may have already fixed it.</span></h1>
          <p className="hero-lede">
            Search real repair outcomes, troubleshoot with your AI agent, and contribute what worked back to the open web.
          </p>

          <form className="hero-search" action="/repairs">
            <Search aria-hidden="true" />
            <label className="sr-only" htmlFor="hero-query">Search repairs</label>
            <input id="hero-query" name="query" placeholder="Try “controller stick drift”" />
            <button type="submit">Search repairs <ArrowRight /></button>
          </form>

          <div className="connection-note">
            <span className="status-dot" />
            <strong>Agent connected?</strong>
            Pulse exposes structured repair tools directly through WebMCP.
          </div>

          <div className="hero-stats" aria-label="Community statistics">
            <div><strong>2,418</strong><span>repair cases</span></div>
            <div><strong>76%</strong><span>fixed or improved</span></div>
            <div><strong>$18</strong><span>median cost</span></div>
          </div>
        </div>

        <div className="evidence-stage" aria-label="Example repair evidence">
          <div className="case-card">
            <div className="case-card-top">
              <span className="case-category"><CircleDot /> Game controllers</span>
              <span className="risk-chip"><ShieldCheck /> Low risk</span>
            </div>
            <p className="case-id">CASE MS-1042 · DEMO RECORD</p>
            <h2>Left analog stick drifts upward</h2>
            <p>DualSense Wireless Controller · CFI-ZCT1W</p>
            <div className="symptom-row">
              <span>ghost input</span><span>stick drift</span><span>deadzone</span>
            </div>
            <div className="evidence-panel">
              <div className="evidence-heading">
                <span><Check /> Repair evidence</span>
                <strong>6 fixed</strong>
              </div>
              <div className="evidence-grid">
                {evidence.map((item) => (
                  <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>
                ))}
              </div>
              <div className="evidence-foot"><span>Median time <strong>24 min</strong></span><span>Typical cost <strong>$8–$15</strong></span></div>
            </div>
          </div>

          <aside className="agent-card">
            <div className="agent-card-title"><span><Bot /></span><div><strong>Agent activity</strong><small>Live WebMCP actions</small></div></div>
            <ol>
              <li><span><Search /></span><div><strong>ChatGPT searched repairs</strong><small>controller stick drift · 8 matches</small></div></li>
              <li><span><CircleDot /></span><div><strong>Opened case MS-1042</strong><small>Most community-confirmed result</small></div></li>
              <li className="active"><span><Wrench /></span><div><strong>Ready to troubleshoot</strong><small>Ask your agent to start a case</small></div></li>
            </ol>
          </aside>
        </div>
      </section>

      <section className="workflow-strip" aria-label="How Pulse works">
        <div><span>01</span><strong>Describe the symptom</strong><p>Share what you see, hear, or feel.</p></div>
        <ArrowRight aria-hidden="true" />
        <div><span>02</span><strong>Test with your agent</strong><p>Compare evidence and record observations.</p></div>
        <ArrowRight aria-hidden="true" />
        <div><span>03</span><strong>Remember the outcome</strong><p>Your result helps the next repair.</p></div>
      </section>
    </main>
  );
}
