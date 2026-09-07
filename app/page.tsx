'use client';

import React, { useState, useEffect } from 'react';
import HeaderNav, { NavTab } from '../components/HeaderNav';
import ExecutiveOverview from '../components/ExecutiveOverview';
import AdminDashboard, { ReturnRecord } from '../components/AdminDashboard';
import CustomerReturnPortal from '../components/CustomerReturnPortal';
import PlatformIntegrationsView from '../components/PlatformIntegrationsView';
import PolicyRulesEngine from '../components/PolicyRulesEngine';
import FraudInspectionModal from '../components/FraudInspectionModal';
import PlatformIntegrationModal from '../components/PlatformIntegrationModal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [isIntegrationsModalOpen, setIsIntegrationsModalOpen] = useState<boolean>(false);
  const [selectedForInspection, setSelectedForInspection] = useState<ReturnRecord | null>(null);
  const [returnsList, setReturnsList] = useState<ReturnRecord[]>([]);

  const fetchReturns = async (platformFilter?: string) => {
    try {
      const url = platformFilter && platformFilter !== 'all'
        ? `/api/returns?platform=${platformFilter}`
        : '/api/returns';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setReturnsList(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch returns API:', err);
    }
  };

  useEffect(() => {
    fetchReturns(selectedPlatform);
  }, [selectedPlatform]);

  const handleReturnSubmitted = (newItemRecord: ReturnRecord) => {
    setReturnsList(prev => [newItemRecord, ...prev]);
  };

  const handleUpdateRouting = async (id: string, newRouting: string) => {
    try {
      const res = await fetch('/api/fraud-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: newRouting }),
      });
      const json = await res.json();
      if (json.success) {
        setReturnsList(prev =>
          prev.map(item => item.id === id ? { ...item, routing: newRouting } : item)
        );
      }
    } catch (err) {
      console.error('Error updating routing API:', err);
    }
  };

  const handleDecision = async (
    id: string,
    action: 'reject' | 'approve' | 'audit' | 'file_claim',
    routing?: string,
    claimDetails?: { claimStatus: ReturnRecord['claimStatus']; claimId: string }
  ) => {
    try {
      if (action === 'file_claim' && claimDetails) {
        setReturnsList(prev =>
          prev.map(item => item.id === id ? { ...item, claimStatus: claimDetails.claimStatus, claimId: claimDetails.claimId } : item)
        );
        if (selectedForInspection && selectedForInspection.id === id) {
          setSelectedForInspection(prev => prev ? { ...prev, claimStatus: claimDetails.claimStatus, claimId: claimDetails.claimId } : null);
        }
        return;
      }

      const res = await fetch('/api/fraud-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      const json = await res.json();
      if (json.success) {
        setReturnsList(prev =>
          prev.map(item => item.id === id ? json.data : item)
        );
      }
    } catch (err) {
      console.error('Error recording fraud decision API:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-transparent font-sans text-[#F1F5F9] selection:bg-purple-600 selection:text-white">

      {/* Top Navigation Bar */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedPlatform={selectedPlatform}
        setSelectedPlatform={setSelectedPlatform}
        onRefreshData={() => fetchReturns(selectedPlatform)}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

        {activeTab === 'overview' && (
          <ExecutiveOverview
            returnsList={returnsList}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSelectReturn={(rec) => setSelectedForInspection(rec)}
          />
        )}

        {(activeTab === 'returns' || activeTab === 'fraud_lab') && (
          <AdminDashboard
            returnsList={returnsList}
            onSelectReturnForInspection={(record) => setSelectedForInspection(record)}
            onUpdateRouting={handleUpdateRouting}
          />
        )}

        {activeTab === 'customer_portal' && (
          <CustomerReturnPortal
            onReturnSubmitted={handleReturnSubmitted}
          />
        )}

        {activeTab === 'stores' && (
          <PlatformIntegrationsView
            onReturnIngested={() => fetchReturns(selectedPlatform)}
          />
        )}

        {activeTab === 'policy_rules' && (
          <PolicyRulesEngine />
        )}

      </main>

      {/* Fraud Alert Deep Inspection Modal Drawer */}
      <FraudInspectionModal
        record={selectedForInspection}
        onClose={() => setSelectedForInspection(null)}
        onDecision={handleDecision}
      />

      {/* Quick Platform Modal */}
      <PlatformIntegrationModal
        isOpen={isIntegrationsModalOpen}
        onClose={() => setIsIntegrationsModalOpen(false)}
        onReturnIngested={() => fetchReturns(selectedPlatform)}
      />

    </div>
  );
}