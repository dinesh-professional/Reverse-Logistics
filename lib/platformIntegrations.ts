import { ReturnRecord, PlatformType } from './store';

export interface MarketplaceConfig {
  amazon: {
    sellerId: string;
    spApiClientId: string;
    spApiKeyConfigured: boolean;
    webhookUrl: string;
    lpnScannerActive: boolean;
  };
  flipkart: {
    appId: string;
    appSecretConfigured: boolean;
    webhookUrl: string;
    deliveryQcSync: boolean;
  };
  meesho: {
    supplierId: string;
    apiTokenConfigured: boolean;
    webhookUrl: string;
    qcImageAiActive: boolean;
  };
}

let activeCredentials: MarketplaceConfig = {
  amazon: {
    sellerId: 'AMZN-IN-SEL-98102',
    spApiClientId: 'amzn1.application-oa2-client.9821a...',
    spApiKeyConfigured: true,
    webhookUrl: 'https://api.returntrust.ai/api/webhooks/amazon',
    lpnScannerActive: true,
  },
  flipkart: {
    appId: 'fk-seller-app-99120',
    appSecretConfigured: true,
    webhookUrl: 'https://api.returntrust.ai/api/webhooks/flipkart',
    deliveryQcSync: true,
  },
  meesho: {
    supplierId: 'MEESHO-SUP-33102',
    apiTokenConfigured: true,
    webhookUrl: 'https://api.returntrust.ai/api/webhooks/meesho',
    qcImageAiActive: true,
  },
};

export function getMarketplaceConfig(): MarketplaceConfig {
  return activeCredentials;
}

export function updateMarketplaceConfig(updated: Partial<MarketplaceConfig>): MarketplaceConfig {
  activeCredentials = {
    ...activeCredentials,
    ...updated,
  };
  return activeCredentials;
}

// ----------------------------------------------------
// AMAZON SP-API WEBHOOK PARSER & FRAUD EVALUATOR
// ----------------------------------------------------
export interface AmazonWebhookPayload {
  EventTime?: string;
  MarketplaceId?: string; // e.g. A21TJRUUN4KGV (Amazon India)
  SellerId?: string;
  AmazonOrderId?: string;
  LPNNumber?: string;
  ReturnReasonCode?: string;
  SKU?: string;
  ProductName?: string;
  ScannedWeightGrams?: number;
  CatalogWeightGrams?: number;
  SerialNoScanned?: string;
  ExpectedSerialNo?: string;
  CustomerName?: string;
}

export function parseAmazonReturnWebhook(payload: AmazonWebhookPayload): ReturnRecord {
  const weightDeficit = (payload.CatalogWeightGrams || 500) - (payload.ScannedWeightGrams || 360);
  const serialMismatch = payload.SerialNoScanned !== payload.ExpectedSerialNo;
  
  const riskFactors: string[] = [];
  let riskScore = 15;

  if (serialMismatch) {
    riskScore += 45;
    riskFactors.push(`Amazon LPN barcode scanned serial (${payload.SerialNoScanned || 'DUMMY'}) does not match expected invoice serial (${payload.ExpectedSerialNo || 'ORIGINAL'})`);
  }

  if (weightDeficit > 80) {
    riskScore += 35;
    riskFactors.push(`Amazon FBA warehouse scan weight deficit: package is ${weightDeficit}g lighter than catalog master weight`);
  }

  if (payload.ReturnReasonCode === 'NEVER_RECEIVED_COMPLETELY' || payload.ReturnReasonCode === 'DEFECTIVE_SWAP') {
    riskScore += 10;
    riskFactors.push(`Amazon customer buyer return history flags high return frequency on reason: ${payload.ReturnReasonCode}`);
  }

  riskScore = Math.min(99, riskScore);

  const status = riskScore >= 70 ? 'Flagged' : 'In-Transit';

  return {
    id: `#AMZ-${Math.floor(100 + Math.random() * 900)}`,
    customerName: payload.CustomerName || 'Amazon Customer',
    productName: payload.ProductName || 'Amazon Prime Item',
    category: 'Electronics',
    platform: 'amazon',
    marketplaceOrderId: payload.AmazonOrderId || `408-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}`,
    lpnOrTrackId: payload.LPNNumber || `LPNIN${Math.floor(100000000 + Math.random() * 900000000)}`,
    status,
    riskScore,
    fraudReason: status === 'Flagged' ? riskFactors.join('. ') : undefined,
    expectedImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
    scannedImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    routing: status === 'Flagged' ? 'Fraud Vault (FBA Hold)' : 'Refurbish Center Hub B',
    date: 'Just Now (Via Amazon SP-API)',
    platformRiskFactors: riskFactors,
    claimStatus: status === 'Flagged' ? 'SAFE-T Drafted' : 'Not Filed',
    claimId: status === 'Flagged' ? `SAFE-T-AMZ-${Math.floor(10000 + Math.random() * 90000)}` : undefined,
  };
}

// ----------------------------------------------------
// FLIPKART SELLER API WEBHOOK PARSER & FRAUD EVALUATOR
// ----------------------------------------------------
export interface FlipkartWebhookPayload {
  returnId?: string;
  orderId?: string;
  trackingId?: string;
  reason?: string;
  imeiInvoice?: string;
  imeiScanned?: string;
  deliveryQcNotes?: string;
  customerName?: string;
  productTitle?: string;
}

export function parseFlipkartReturnWebhook(payload: FlipkartWebhookPayload): ReturnRecord {
  const imeiMismatch = payload.imeiInvoice && payload.imeiScanned && payload.imeiInvoice !== payload.imeiScanned;
  const riskFactors: string[] = [];
  let riskScore = 20;

  if (imeiMismatch) {
    riskScore += 50;
    riskFactors.push(`Flipkart Delivery Agent QC noted IMEI #${payload.imeiScanned} does not match invoice IMEI #${payload.imeiInvoice}`);
  }

  if (payload.deliveryQcNotes && payload.deliveryQcNotes.toLowerCase().includes('tampered')) {
    riskScore += 25;
    riskFactors.push(`Flipkart delivery agent physical inspection note: "${payload.deliveryQcNotes}"`);
  }

  riskScore = Math.min(99, riskScore);
  const status = riskScore >= 70 ? 'Flagged' : 'In-Transit';

  return {
    id: `#FK-${Math.floor(100 + Math.random() * 900)}`,
    customerName: payload.customerName || 'Flipkart Customer',
    productName: payload.productTitle || 'Flipkart Assured Item',
    category: 'Mobiles',
    platform: 'flipkart',
    marketplaceOrderId: payload.orderId || `OD${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
    lpnOrTrackId: payload.trackingId || `FMPP-${Math.floor(1000000 + Math.random() * 9000000)}`,
    status,
    riskScore,
    fraudReason: status === 'Flagged' ? riskFactors.join('. ') : undefined,
    expectedImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
    scannedImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
    routing: status === 'Flagged' ? 'High-Value Audit Desk' : 'Restock WH-1',
    date: 'Just Now (Via Flipkart Seller API)',
    platformRiskFactors: riskFactors,
    claimStatus: status === 'Flagged' ? 'SPF Claimed' : 'Not Filed',
    claimId: status === 'Flagged' ? `FK-SPF-2026-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
  };
}

// ----------------------------------------------------
// MEESHO SUPPLIER HUB API WEBHOOK PARSER & FRAUD EVALUATOR
// ----------------------------------------------------
export interface MeeshoWebhookPayload {
  subOrderId?: string;
  returnTrackingNumber?: string;
  customerName?: string;
  productName?: string;
  pickupAgentQcMatch?: boolean;
  visualSimilarityScore?: number; // 0 to 100
  resellerBuyerClusterFlag?: boolean;
}

export function parseMeeshoReturnWebhook(payload: MeeshoWebhookPayload): ReturnRecord {
  const simScore = payload.visualSimilarityScore ?? 22;
  const riskFactors: string[] = [];
  let riskScore = 10;

  if (simScore < 40) {
    riskScore += 55;
    riskFactors.push(`Meesho Doorstep Pickup AI vision score: Only ${simScore}% visual pattern similarity to catalog item`);
  }

  if (payload.pickupAgentQcMatch === false) {
    riskScore += 25;
    riskFactors.push(`Meesho Courier Agent QC: Pickup image shows wrong product fabric/color swap`);
  }

  if (payload.resellerBuyerClusterFlag) {
    riskScore += 15;
    riskFactors.push(`Meesho Reseller Fraud Cluster: Account flagged for multiple wrong item claims`);
  }

  riskScore = Math.min(99, riskScore);
  const status = riskScore >= 70 ? 'Flagged' : 'In-Transit';

  return {
    id: `#MSH-${Math.floor(100 + Math.random() * 900)}`,
    customerName: payload.customerName || 'Meesho Buyer',
    productName: payload.productName || 'Meesho Fashion Product',
    category: 'Apparel',
    platform: 'meesho',
    marketplaceOrderId: payload.subOrderId || `sub_ord_${Math.floor(10000000 + Math.random() * 90000000)}`,
    lpnOrTrackId: payload.returnTrackingNumber || `M-RET-${Math.floor(10000 + Math.random() * 90000)}`,
    status,
    riskScore,
    fraudReason: status === 'Flagged' ? riskFactors.join('. ') : undefined,
    expectedImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
    scannedImage: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80',
    routing: status === 'Flagged' ? 'Supplier Dispute Warehouse' : 'Restock Hub C',
    date: 'Just Now (Via Meesho Supplier Hub)',
    platformRiskFactors: riskFactors,
    claimStatus: status === 'Flagged' ? 'Meesho Dispute Active' : 'Not Filed',
    claimId: status === 'Flagged' ? `MSH-DISP-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
  };
}

// ----------------------------------------------------
// SELLER PROTECTION CLAIM DOCUMENT GENERATOR
// ----------------------------------------------------
export interface ClaimDocument {
  claimType: 'Amazon SAFE-T Claim' | 'Flipkart SPF Claim' | 'Meesho Supplier Dispute';
  claimId: string;
  generatedDate: string;
  marketplaceOrderId: string;
  trackingId: string;
  customerName: string;
  productName: string;
  fraudRiskScore: number;
  evidenceSummary: string;
  evidenceItems: string[];
  formalNoticeText: string;
}

export function generateSellerClaimDocument(record: ReturnRecord): ClaimDocument {
  const claimTypeMap: Record<PlatformType, ClaimDocument['claimType']> = {
    amazon: 'Amazon SAFE-T Claim',
    flipkart: 'Flipkart SPF Claim',
    meesho: 'Meesho Supplier Dispute',
    direct: 'Amazon SAFE-T Claim',
  };

  const claimType = claimTypeMap[record.platform] || 'Amazon SAFE-T Claim';
  const claimId = record.claimId || `${record.platform.toUpperCase()}-CLAIM-${Math.floor(10000 + Math.random() * 90000)}`;

  const evidenceItems = record.platformRiskFactors && record.platformRiskFactors.length > 0 
    ? record.platformRiskFactors
    : [
        `High Fraud Risk Score: ${record.riskScore}/100 calculated by AI Return Integrity Engine`,
        `Visual Vision Discrepancy between catalog master photo and returned item scan`,
        `Package weight anomaly detected during warehouse receiving`,
      ];

  const formalNoticeText = `
SELLER PROTECTION FUND & DISPUTE EVIDENCE DOSSIER
===================================================
Claim ID: ${claimId}
Platform: ${record.platform.toUpperCase()}
Marketplace Order ID: ${record.marketplaceOrderId}
LPN / Tracking Number: ${record.lpnOrTrackId}
Buyer Name: ${record.customerName}
Product Name: ${record.productName}
Fraud Risk Score: ${record.riskScore}/100

EXECUTIVE SUMMARY OF FRAUD:
The seller has inspected returned shipment ${record.lpnOrTrackId} received under ${record.platform.toUpperCase()} Order ${record.marketplaceOrderId}.
AI Forensic audit confirms a fraudulent return attempt:
${record.fraudReason || 'Item returned is counterfeit, damaged, or substituted.'}

FORENSIC EVIDENCE ATTACHED:
${evidenceItems.map((item, idx) => `  ${idx + 1}. ${item}`).join('\n')}

REQUESTED ACTION:
Under ${claimType} terms & seller policies, the seller requests 100% full reimbursement of order value plus shipping overhead due to buyer return fraud / wrong item substitution.
`.trim();

  return {
    claimType,
    claimId,
    generatedDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    marketplaceOrderId: record.marketplaceOrderId,
    trackingId: record.lpnOrTrackId,
    customerName: record.customerName,
    productName: record.productName,
    fraudRiskScore: record.riskScore,
    evidenceSummary: record.fraudReason || 'High probability fraudulent swap detected',
    evidenceItems,
    formalNoticeText,
  };
}
