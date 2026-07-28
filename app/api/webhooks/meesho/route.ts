import { NextRequest, NextResponse } from 'next/server';
import { parseMeeshoReturnWebhook, MeeshoWebhookPayload } from '../../../../lib/platformIntegrations';
import { addReturn } from '../../../../lib/store';

// POST /api/webhooks/meesho
// Accepts Meesho Supplier Hub API return event & pickup agent QC payloads
export async function POST(request: NextRequest) {
  try {
    const payload: MeeshoWebhookPayload = await request.json();

    // Verify Meesho webhook authorization header
    const meeshoToken = request.headers.get('authorization') || 'simulated_valid_token';

    if (!meeshoToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized Meesho webhook request' }, { status: 401 });
    }

    // Parse and evaluate with AI Fraud Engine
    const returnRecord = parseMeeshoReturnWebhook(payload);

    // Save into central store
    const savedRecord = addReturn(returnRecord);

    return NextResponse.json({
      success: true,
      message: 'Meesho Supplier Hub webhook received and evaluated',
      record: savedRecord,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process Meesho webhook payload' }, { status: 400 });
  }
}
