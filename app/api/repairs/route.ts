import { createRepairCase, searchRepairs } from '@/lib/database';
import { mutationRateLimit } from '@/lib/rate-limit';
import { apiError, parseCreateCase } from '@/lib/validation';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const filters = Object.fromEntries(url.searchParams.entries());
    const repairs = await searchRepairs(filters);
    return Response.json({ ok: true, count: repairs.length, repairs });
  } catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  const limited = mutationRateLimit(request); if (limited) return limited;
  try {
    const repair = await createRepairCase(parseCreateCase(await request.json()));
    return Response.json({ ok: true, repair }, { status: 201 });
  } catch (error) { return apiError(error); }
}
