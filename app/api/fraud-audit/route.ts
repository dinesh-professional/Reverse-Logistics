import { NextRequest, NextResponse } from 'next/server';
import { updateReturnStatus } from '../../../lib/store';

// POST /api/fraud-audit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, routing } = body;

    if (!id || !action) {
      return NextResponse.json({ success: false, error: 'Missing return ID or action' }, { status: 400 });
    }

    const updated = updateReturnStatus(id, action, routing);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Return record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Audit processing error' }, { status: 500 });
  }
}
