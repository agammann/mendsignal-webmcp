'use client';

import { FormEvent, useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, LoaderCircle, ShieldCheck, Sparkles } from 'lucide-react';

export function NewRepairForm() {
  const [safety, setSafety] = useState('low_risk');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<{ id: string } | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setError('');
    const form = new FormData(event.currentTarget);
    const input = { category: form.get('category'), brand: form.get('brand'), model: form.get('model'), product_name: form.get('product_name'), problem_description: form.get('problem_description'), symptoms: String(form.get('symptoms')).split(',').map((value) => value.trim()).filter(Boolean), safety_classification: form.get('safety_classification'), difficulty: form.get('difficulty') };
    try {
      const response = await fetch('/api/repairs', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) }); const data: any = await response.json();
      if (!response.ok) throw new Error(data.error); setCreated(data.repair); window.dispatchEvent(new CustomEvent('pulse:mutated', { detail: { description: `Human created ${data.repair.id}`, repair: data.repair } }));
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'The repair could not be created.'); }
    finally { setLoading(false); }
  };

  if (created) return <div className="creation-success"><CheckCircle2 /><p className="mono-label">REPAIR CASE CREATED</p><h2>{created.id} is ready for a human + agent repair trail.</h2><p>The case now appears in the public repair memory. Ask your agent to add the first safe diagnostic step.</p><a href={`/repairs/${created.id}`}>Open repair case <ArrowRight /></a></div>;

  return (
    <form className="new-repair-form" onSubmit={submit}>
      <div className="form-section"><div className="form-section-number">01</div><div><p className="mono-label">IDENTIFY THE OBJECT</p><h2>What are we repairing?</h2><div className="form-grid"><label>Category<input name="category" placeholder="Game controllers" maxLength={80} required /></label><label>Brand<input name="brand" placeholder="Sony" maxLength={80} required /></label><label>Model<input name="model" placeholder="CFI-ZCT1W" maxLength={100} required /></label><label>Product name<input name="product_name" placeholder="DualSense Wireless Controller" maxLength={120} required /></label></div></div></div>
      <div className="form-section"><div className="form-section-number">02</div><div><p className="mono-label">DESCRIBE THE EVIDENCE</p><h2>What is happening?</h2><label>Problem description<textarea name="problem_description" placeholder="The left analog stick slowly drifts upward even when I am not touching it…" minLength={8} maxLength={1200} required /></label><label>Symptoms <small>Separate with commas</small><input name="symptoms" placeholder="stick drift, ghost input, left stick" required /></label><div className="form-grid"><label>Estimated difficulty<select name="difficulty" defaultValue="moderate"><option value="easy">Easy</option><option value="moderate">Moderate</option><option value="advanced">Advanced</option></select></label></div></div></div>
      <div className="form-section"><div className="form-section-number">03</div><div><p className="mono-label">SET A SAFETY BOUNDARY</p><h2>How should this case be handled?</h2><div className="safety-options">
        <label className={safety === 'low_risk' ? 'selected' : ''}><input type="radio" name="safety_classification" value="low_risk" checked={safety === 'low_risk'} onChange={() => setSafety('low_risk')} /><ShieldCheck /><span><strong>Low risk</strong><small>External cleaning, adjustment, accessories, non-powered parts.</small></span></label>
        <label className={safety === 'moderate_risk' ? 'selected' : ''}><input type="radio" name="safety_classification" value="moderate_risk" checked={safety === 'moderate_risk'} onChange={() => setSafety('moderate_risk')} /><Sparkles /><span><strong>Moderate risk</strong><small>Opening consumer electronics, batteries, internal repair.</small></span></label>
        <label className={safety === 'professional_recommended' ? 'selected' : ''}><input type="radio" name="safety_classification" value="professional_recommended" checked={safety === 'professional_recommended'} onChange={() => setSafety('professional_recommended')} /><AlertTriangle /><span><strong>Professional recommended</strong><small>Mains, gas, high voltage, critical vehicle or structural systems.</small></span></label>
      </div>{safety === 'professional_recommended' && <div className="professional-inline"><AlertTriangle />Pulse will preserve the case history but will not provide dangerous procedural instructions. Qualified service is recommended.</div>}</div></div>
      {error && <div className="form-error"><AlertTriangle />{error}</div>}
      <div className="form-submit"><span>Community text is untrusted data and never changes Pulse’s tool instructions.</span><button disabled={loading} type="submit">{loading ? <><LoaderCircle className="spin" /> Creating case…</> : <>Create repair case <ArrowRight /></>}</button></div>
    </form>
  );
}

