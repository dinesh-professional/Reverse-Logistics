export type PlatformType = 'amazon' | 'flipkart' | 'meesho' | 'direct';

export interface ReturnRecord {
  id: string;
  customerName: string;
  productName: string;
  category: string;
  platform: PlatformType;
  marketplaceOrderId: string;
  lpnOrTrackId: string;
  status: 'In-Transit' | 'Flagged' | 'Cleared' | 'Under Audit';
  riskScore: number;
  fraudReason?: string;
  expectedImage: string;
  scannedImage: string;
  routing: string;
  date: string;
  platformRiskFactors?: string[];
  claimStatus?: 'Not Filed' | 'SAFE-T Drafted' | 'SPF Claimed' | 'Meesho Dispute Active' | 'Reimbursed';
  claimId?: string;
}

// In-Memory Global Return Database Store
let initialReturns: ReturnRecord[] = [
  {
    id: '#RT-991',
    customerName: 'Aarav Sharma',
    productName: 'Apple Watch Ultra 2 (Titanium)',
    category: 'Electronics',
    platform: 'amazon',
    marketplaceOrderId: '408-9821948-1102934',
    lpnOrTrackId: 'LPNIN982104921',
    status: 'Flagged',
    riskScore: 94,
    fraudReason: 'Mismatched Serial Number & Weight Deficit (-140g). Suspected empty box / dummy watch swap on Amazon FBA return.',
    expectedImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
    scannedImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    routing: 'Fraud Vault (FBA Hold)',
    date: 'Today, 10:45 AM',
    platformRiskFactors: [
      'Amazon LPN barcode scanned non-registered serial number',
      'Weight anomaly: Package 140g lighter than FBA catalog master',
      'High-risk buyer account: 3 returns in last 14 days'
    ],
    claimStatus: 'SAFE-T Drafted',
    claimId: 'SAFE-T-AMZ-99182'
  },
  {
    id: '#RT-994',
    customerName: 'Siddharth Patel',
    productName: 'Samsung Galaxy S24 Ultra (512GB)',
    category: 'Mobiles',
    platform: 'flipkart',
    marketplaceOrderId: 'OD309281928371192',
    lpnOrTrackId: 'FMPP-8829103',
    status: 'Flagged',
    riskScore: 89,
    fraudReason: 'IMEI Mismatch on Flipkart Return QC scan & Broken Brand Seal.',
    expectedImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
    scannedImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
    routing: 'High-Value Audit Desk',
    date: 'Today, 09:30 AM',
    platformRiskFactors: [
      'Flipkart Delivery Agent QC noted IMEI #358209... does not match invoice IMEI',
      'Tampered hologram sticker detected on phone casing',
      'Order returned within 4 hours of delivery'
    ],
    claimStatus: 'SPF Claimed',
    claimId: 'FK-SPF-2026-9012'
  },
  {
    id: '#RT-995',
    customerName: 'Ananya Deshmukh',
    productName: 'Designer Silk Kanjeevaram Saree',
    category: 'Apparel',
    platform: 'meesho',
    marketplaceOrderId: 'sub_ord_88291023',
    lpnOrTrackId: 'M-RET-99201',
    status: 'Flagged',
    riskScore: 85,
    fraudReason: 'Wrong Item Substitution: Synthetic Polyester fabric returned instead of Silk.',
    expectedImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
    scannedImage: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80',
    routing: 'Supplier Dispute Warehouse',
    date: 'Today, 08:15 AM',
    platformRiskFactors: [
      'Meesho Pickup Image AI comparison: Fabric texture score 18% match',
      'Missing original brand tag & care label',
      'Reseller buyer cluster flag detected'
    ],
    claimStatus: 'Meesho Dispute Active',
    claimId: 'MSH-DISP-4481'
  },
  {
    id: '#RT-992',
    customerName: 'Priya Patel',
    productName: 'Sony WH-1000XM5 Noise Cancelling Headset',
    category: 'Audio',
    platform: 'amazon',
    marketplaceOrderId: '402-8819201-4439120',
    lpnOrTrackId: 'LPNIN441029',
    status: 'In-Transit',
    riskScore: 24,
    fraudReason: undefined,
    expectedImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    scannedImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    routing: 'Refurbish Center Hub B',
    date: 'Today, 11:15 AM',
    platformRiskFactors: [],
    claimStatus: 'Not Filed'
  },
  {
    id: '#RT-993',
    customerName: 'Rahul Verma',
    productName: 'Logitech MX Master 3S Wireless Mouse',
    category: 'Peripherals',
    platform: 'flipkart',
    marketplaceOrderId: 'OD110293847281',
    lpnOrTrackId: 'FMPP-771029',
    status: 'Cleared',
    riskScore: 12,
    fraudReason: undefined,
    expectedImage: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80',
    scannedImage: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80',
    routing: 'Restock WH-1',
    date: 'Yesterday',
    platformRiskFactors: [],
    claimStatus: 'Not Filed'
  },
  {
    id: '#RT-990',
    customerName: 'Neha Gupta',
    productName: 'Keychron Q1 Pro Mechanical Keyboard',
    category: 'Electronics',
    platform: 'direct',
    marketplaceOrderId: 'WEB-981273',
    lpnOrTrackId: 'TRK-9812039',
    status: 'Flagged',
    riskScore: 88,
    fraudReason: 'Visual Scratch Anomaly & Missing Dongle Accessory.',
    expectedImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    scannedImage: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&q=80',
    routing: 'Recycle Unit 4',
    date: 'Yesterday',
    platformRiskFactors: [
      'Visual vision neural score 42% match',
      'Keycap wear pattern incongruent with purchase date'
    ],
    claimStatus: 'Not Filed'
  }
];

// Helper Store Functions
export function getReturns(filter?: string, search?: string, platformFilter?: string): ReturnRecord[] {
  return initialReturns.filter(item => {
    const matchesSearch = !search || 
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.customerName.toLowerCase().includes(search.toLowerCase()) ||
      item.marketplaceOrderId.toLowerCase().includes(search.toLowerCase()) ||
      item.lpnOrTrackId.toLowerCase().includes(search.toLowerCase());

    const matchesPlatform = !platformFilter || platformFilter === 'all' || item.platform === platformFilter;

    if (!matchesPlatform) return false;

    if (filter === 'Flagged') return matchesSearch && item.status === 'Flagged';
    if (filter === 'In-Transit') return matchesSearch && item.status === 'In-Transit';
    if (filter === 'Cleared') return matchesSearch && item.status === 'Cleared';
    if (filter === 'Under Audit') return matchesSearch && item.status === 'Under Audit';

    return matchesSearch;
  });
}

export function addReturn(record: ReturnRecord): ReturnRecord {
  initialReturns = [record, ...initialReturns];
  return record;
}

export function updateReturnStatus(
  id: string, 
  action: 'reject' | 'approve' | 'audit' | 'file_claim' | string, 
  routing?: string,
  claimDetails?: { claimStatus: ReturnRecord['claimStatus']; claimId: string }
): ReturnRecord | null {
  let updatedRecord: ReturnRecord | null = null;

  initialReturns = initialReturns.map(item => {
    if (item.id === id) {
      if (action === 'reject') {
        updatedRecord = { ...item, status: 'Flagged', routing: routing || 'Fraud Vault' };
      } else if (action === 'approve') {
        updatedRecord = { ...item, status: 'Cleared', riskScore: 10, routing: routing || 'Restock WH-1' };
      } else if (action === 'audit') {
        updatedRecord = { ...item, status: 'Under Audit', routing: routing || 'Fraud Vault' };
      } else if (action === 'file_claim' && claimDetails) {
        updatedRecord = { 
          ...item, 
          claimStatus: claimDetails.claimStatus, 
          claimId: claimDetails.claimId 
        };
      } else {
        updatedRecord = { ...item, routing: action };
      }
      return updatedRecord;
    }
    return item;
  });

  return updatedRecord;
}

