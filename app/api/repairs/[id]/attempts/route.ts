import { recordRepairAttempt } from '@/lib/database';
import { mutationRateLimit } from '@/lib/rate-limit';
import { apiError, parseAttempt } from '@/lib/validation';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const limited = mutationRateLimit(request); if (limited) return limited;
  try {
    const { id } = await context.params;
    const repair = await recordRepairAttempt(id, parseAttempt(await request.json()));
    if (!repair) return Response.json({ ok: false, error: 'Repair case not found.' }, { status: 404 });
    return Response.json({ ok: true, repair }, { status: 201 });
  } catch (error) { return apiError(error); }
}
