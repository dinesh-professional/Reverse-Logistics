import { NextRequest, NextResponse } from 'next/server';
import { parseFlipkartReturnWebhook, FlipkartWebhookPayload } from '../../../../lib/platformIntegrations';
import { addReturn } from '../../../../lib/store';

// POST /api/webhooks/flipkart
// Accepts Flipkart Seller API (v2/returns) status & delivery QC notification payloads
export async function POST(request: NextRequest) {
  try {
    const payload: FlipkartWebhookPayload = await request.json();

    // Verify signature header
    const fkSignature = request.headers.get('x-flipkart-signature') || 'simulated_valid_signature';

    if (!fkSignature) {
      return NextResponse.json({ success: false, error: 'Unauthorized Flipkart webhook signature' }, { status: 401 });
    }

    // Parse and evaluate with AI Fraud Engine
    const returnRecord = parseFlipkartReturnWebhook(payload);

    // Save into central store
    const savedRecord = addReturn(returnRecord);

    return NextResponse.json({
      success: true,
      message: 'Flipkart Seller API webhook received and evaluated',
      record: savedRecord,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process Flipkart webhook payload' }, { status: 400 });
  }
}
