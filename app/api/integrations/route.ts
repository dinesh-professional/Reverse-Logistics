import { NextRequest, NextResponse } from 'next/server';
import { getMarketplaceConfig, updateMarketplaceConfig } from '../../../lib/platformIntegrations';

// GET /api/integrations - Fetch connected platform API status & webhook URLs
export async function GET() {
  const config = getMarketplaceConfig();
  return NextResponse.json({ success: true, data: config });
}

// POST /api/integrations - Update connected platform API keys or credentials
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = updateMarketplaceConfig(body);
    return NextResponse.json({ success: true, message: 'Marketplace credentials updated', data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}
