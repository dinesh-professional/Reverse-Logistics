import { NextRequest, NextResponse } from 'next/server';
import { getReturns, addReturn, ReturnRecord } from '../../../lib/store';

// GET /api/returns
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || undefined;
  const search = searchParams.get('search') || undefined;
  const platform = searchParams.get('platform') || undefined;

  const returns = getReturns(filter, search, platform);
  return NextResponse.json({ success: true, count: returns.length, data: returns });
}

// POST /api/returns
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const platform = body.platform || 'direct';

    const newRecord: ReturnRecord = {
      id: body.id ? (body.id.startsWith('#') ? body.id : `#${body.id}`) : `#RT-${Math.floor(100 + Math.random() * 900)}`,
      customerName: body.customerName || 'Live Customer Session',
      productName: body.productName || 'Returned Product',
      category: body.category || 'Electronics',
      platform,
      marketplaceOrderId: body.marketplaceOrderId || (
        platform === 'amazon' ? `408-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}` :
        platform === 'flipkart' ? `OD${Math.floor(10000000000000 + Math.random() * 90000000000000)}` :
        platform === 'meesho' ? `sub_ord_${Math.floor(10000000 + Math.random() * 90000000)}` :
        `WEB-${Math.floor(100000 + Math.random() * 900000)}`
      ),
      lpnOrTrackId: body.lpnOrTrackId || (
        platform === 'amazon' ? `LPNIN${Math.floor(100000000 + Math.random() * 900000000)}` :
        platform === 'flipkart' ? `FMPP-${Math.floor(1000000 + Math.random() * 9000000)}` :
        platform === 'meesho' ? `M-RET-${Math.floor(10000 + Math.random() * 90000)}` :
        `TRK-${Math.floor(100000 + Math.random() * 900000)}`
      ),
      status: body.status || 'In-Transit',
      riskScore: typeof body.fraudRisk === 'number' ? body.fraudRisk : 14,
      fraudReason: body.fraudReason,
      expectedImage: body.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      scannedImage: body.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      routing: body.routing || 'Refurbish Center Hub B',
      date: 'Just Now',
      platformRiskFactors: body.platformRiskFactors || [],
      claimStatus: body.claimStatus || 'Not Filed',
      claimId: body.claimId,
    };

    const saved = addReturn(newRecord);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}

