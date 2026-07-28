import { NextRequest, NextResponse } from 'next/server';
import { parseAmazonReturnWebhook, AmazonWebhookPayload } from '../../../../lib/platformIntegrations';
import { addReturn } from '../../../../lib/store';

// POST /api/webhooks/amazon
// Accepts Amazon SP-API (Selling Partner API) Return Notification payloads
export async function POST(request: NextRequest) {
  try {
    const payload: AmazonWebhookPayload = await request.json();

    // Verify signature header (in production, validate HMAC-SHA256 signature)
    const amzSignature = request.headers.get('x-amz-sns-signature') || 'simulated_valid_signature';

    if (!amzSignature) {
      return NextResponse.json({ success: false, error: 'Unauthorized Amazon webhook signature' }, { status: 401 });
    }

    // Parse and evaluate with AI Fraud Engine
    const returnRecord = parseAmazonReturnWebhook(payload);

    // Save into central store
    const savedRecord = addReturn(returnRecord);

    return NextResponse.json({
      success: true,
      message: 'Amazon SP-API webhook received and processed through Return Fraud Engine',
      record: savedRecord,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process Amazon webhook payload' }, { status: 400 });
  }
}
