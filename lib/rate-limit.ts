const windows = new Map<string, { count: number; resetAt: number }>();

export function mutationRateLimit(request: Request, limit = 30, windowMs = 60_000) {
  const forwarded = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'anonymous';
  const key = forwarded.split(',')[0].trim();
  const now = Date.now();
  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }
  if (current.count >= limit) return Response.json({ ok: false, error: 'Too many repair updates. Please wait a moment.' }, { status: 429 });
  current.count += 1;
  return null;
}
