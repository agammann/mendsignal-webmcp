import { getRepairCase, logActivity } from '@/lib/database';
import { apiError } from '@/lib/validation';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const repair = await getRepairCase(id);
    if (!repair) return Response.json({ ok: false, error: 'Repair case not found.' }, { status: 404 });
    await logActivity('get_repair_case', `ChatGPT opened repair case ${id}`, id);
    return Response.json({ ok: true, repair });
  } catch (error) { return apiError(error); }
}
