# 🛡️ ReturnTrust AI — Reverse Logistics & Fraud Detection System

An advanced, AI-powered reverse logistics and multi-channel return fraud detection platform built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

---

## ✨ Features

- **Multi-Marketplace Webhook Ingestion**: Native webhook parsers and automated verification for **Amazon SP-API**, **Flipkart Seller Hub**, **Meesho Supplier Hub**, and direct stores (**Shopify**, **WooCommerce**).
- **AI Return Fraud Intelligence**: Multi-factor fraud scoring evaluating LPN barcodes, IMEI mismatches, packaging weight deficits, visual fabric/texture match scores, and buyer return frequency.
- **Automated Seller Protection Claims**: One-click generation of formal dispute and reimbursement evidence dossiers for **Amazon SAFE-T**, **Flipkart SPF**, and **Meesho Supplier Dispute** programs.
- **Dynamic Logistics Routing Engine**: Automated routing rules to direct cleared inventory to restock warehouses, flagged items to fraud vaults, or defective units to diagnostic/refurbishment hubs.
- **Customer Return Experience Portal**: End-customer mobile return submission flow with step-by-step guidance, AI photo scan simulation, and merchant embed snippet generator.
- **Interactive Motion Canvas UI**: Dark cyberpunk glassmorphic interface with real-time neural particle constellation animations and dynamic cyber waves.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Design System**: Glassmorphism, animated aurora mesh, HTML5 interactive canvas motion background
- **APIs**: Next.js Serverless Route Handlers (`/api/returns`, `/api/fraud-audit`, `/api/verify-image`, `/api/webhooks/*`)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/dinesh-professional/Reverse-Logistics.git
cd Reverse-Logistics
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the dashboard.

---

## 📂 Project Structure

```
├── app/
│   ├── api/
│   │   ├── fraud-audit/         # Return audit decision & status update endpoint
│   │   ├── integrations/        # Marketplace credential management API
│   │   ├── returns/             # Returns queue GET/POST endpoints
│   │   ├── verify-image/        # AI computer vision neural model simulation
│   │   └── webhooks/            # Amazon, Flipkart, and Meesho webhook handlers
│   ├── globals.css              # Glassmorphism, glow effects, aurora mesh
│   ├── layout.tsx               # Root layout & global motion background
│   └── page.tsx                 # Main dashboard application shell
├── components/
│   ├── AdminDashboard.tsx       # Operations queue, filtering, and routing
│   ├── CustomerReturnPortal.tsx # Customer POV return flow & widget embed builder
│   ├── ExecutiveOverview.tsx    # Executive fraud loss metrics & analytics
│   ├── FraudInspectionModal.tsx # Side-by-side photo comparison & claim generator
│   ├── HeaderNav.tsx            # Navigation bar & platform filter
│   ├── MotionBackground.tsx     # Real-time particle constellation & cyber waves
│   ├── PlatformIntegrationsView.tsx # Webhook tester & connected store status
│   └── PolicyRulesEngine.tsx    # Configurable decision rules engine
└── lib/
    ├── platformIntegrations.ts  # Webhook parsers, scoring algorithms & claim generator
    └── store.ts                 # In-memory return database store
```

---

## 📄 License

MIT License. Free for open-source and commercial use.
