import React, { useState } from 'react';
import {
  FlaskConical,
  Receipt,
  Plus,
  Scale,
  DollarSign,
  Lock,
  Unlock,
  ChevronDown,
  Layers,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Trash2
} from 'lucide-react';
import { FragranceFormula, RawMaterialInvoice, FormulaIngredient } from '../../types';
import { formatBDT } from '../../utils/formatters';

interface FormulaVaultBuyingInvoicesProps {
  formulas: FragranceFormula[];
  buyingInvoices: RawMaterialInvoice[];
  onAddFormula: (formula: FragranceFormula) => void;
  onAddBuyingInvoice: (invoice: RawMaterialInvoice) => void;
}

export const FormulaVaultBuyingInvoices: React.FC<FormulaVaultBuyingInvoicesProps> = ({
  formulas,
  buyingInvoices,
  onAddFormula,
  onAddBuyingInvoice,
}) => {
  const [activeTab, setActiveTab] = useState<'vault' | 'invoices'>('vault');

  // Selected formula for detail view & batch scaling
  const [selectedFormula, setSelectedFormula] = useState<FragranceFormula>(formulas[0] || null);
  const [batchMultiplier, setBatchMultiplier] = useState<number>(1); // 1 bottle = default
  const [batchTargetVolume, setBatchTargetVolume] = useState<number>(50); // ml

  // New formula modal
  const [showAddFormulaModal, setShowAddFormulaModal] = useState(false);
  const [newFormulaName, setNewFormulaName] = useState('');
  const [newFormulaType, setNewFormulaType] = useState<FragranceFormula['type']>('Extrait de Parfum (30%)');
  const [newFormulaFamily, setNewFormulaFamily] = useState<FragranceFormula['olfactoryFamily']>('Oriental Woody');
  const [newFormulaSize, setNewFormulaSize] = useState(50);
  const [newMSRP, setNewMSRP] = useState(5800);
  const [newTopNotes, setNewTopNotes] = useState('Bergamot, Pink Pepper');
  const [newHeartNotes, setNewHeartNotes] = useState('Rosa Damascena, Cardamom');
  const [newBaseNotes, setNewBaseNotes] = useState('Sreemangal Oud, Sandalwood, Ambroxan');

  // New Buying Invoice modal
  const [showAddBuyingModal, setShowAddBuyingModal] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierLocation, setNewSupplierLocation] = useState('Sylhet, Bangladesh');
  const [newInvoiceNumber, setNewInvoiceNumber] = useState('');
  const [newPurchaseDate, setNewPurchaseDate] = useState('2026-09-25');
  const [newTotalCost, setNewTotalCost] = useState(150000);
  const [newPaymentStatus, setNewPaymentStatus] = useState<RawMaterialInvoice['paymentStatus']>('Paid');
  const [newPaymentMethod, setNewPaymentMethod] = useState('City Bank BD Transfer');
  const [newReceivedBy, setNewReceivedBy] = useState('Md. Abdul Hannan');
  const [newMaterialDescription, setNewMaterialDescription] = useState('Artisanal Agarwood Oil & Bottles');

  // Handle batch scale
  const handleScaleVolume = (targetMl: number) => {
    if (!selectedFormula) return;
    setBatchTargetVolume(targetMl);
    setBatchMultiplier(targetMl / selectedFormula.targetSizeMl);
  };

  const handleCreateFormula = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormulaName) return;

    const baseIngredients: FormulaIngredient[] = [
      { id: 'ING-NEW-1', name: 'Artisanal Agarwood Oil', category: 'Base Note', percentage: 20, gramsPer100g: 6, unitCostPerGram: 400 },
      { id: 'ING-NEW-2', name: 'Rosa Damascena / Floral Absolute', category: 'Heart Note', percentage: 15, gramsPer100g: 4.5, unitCostPerGram: 180 },
      { id: 'ING-NEW-3', name: 'Mysore Sandalwood Oil', category: 'Base Note', percentage: 15, gramsPer100g: 4.5, unitCostPerGram: 220 },
      { id: 'ING-NEW-4', name: 'Ambroxan & Fixative Blend', category: 'Fixative', percentage: 25, gramsPer100g: 7.5, unitCostPerGram: 45 },
      { id: 'ING-NEW-5', name: 'Citrus & Spice Top Notes', category: 'Top Note', percentage: 25, gramsPer100g: 7.5, unitCostPerGram: 50 },
    ];

    const calculatedCost = baseIngredients.reduce((acc, ing) => acc + (ing.gramsPer100g * ing.unitCostPerGram), 0) * (newFormulaSize / 100);
    const margin = Math.round(((newMSRP - calculatedCost) / newMSRP) * 100);

    const created: FragranceFormula = {
      id: `FOR-${Date.now().toString().slice(-4)}`,
      code: `VEL-${newFormulaName.slice(0, 3).toUpperCase()}-0${formulas.length + 1}`,
      name: newFormulaName,
      type: newFormulaType,
      olfactoryFamily: newFormulaFamily,
      description: `Proprietary formula blended in VELLURE Sreemangal laboratory.`,
      targetSizeMl: newFormulaSize,
      topNotes: newTopNotes.split(',').map(s => s.trim()),
      heartNotes: newHeartNotes.split(',').map(s => s.trim()),
      baseNotes: newBaseNotes.split(',').map(s => s.trim()),
      ingredients: baseIngredients,
      macerationDays: 45,
      costPerBottle: Math.round(calculatedCost),
      recommendedMSRP: newMSRP,
      profitMarginPercent: margin,
      isConfidential: true,
      createdDate: new Date().toISOString().split('T')[0]
    };

    onAddFormula(created);
    setSelectedFormula(created);
    setShowAddFormulaModal(false);
  };

  const handleCreateBuyingInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplierName || !newInvoiceNumber) return;

    const created: RawMaterialInvoice = {
      id: `RAW-${Date.now().toString().slice(-4)}`,
      invoiceNumber: newInvoiceNumber,
      supplierName: newSupplierName,
      supplierLocation: newSupplierLocation,
      purchaseDate: newPurchaseDate,
      items: [
        {
          materialName: newMaterialDescription,
          quantity: 1,
          unit: 'pieces',
          ratePerUnit: newTotalCost,
          subtotal: newTotalCost
        }
      ],
      totalCost: newTotalCost,
      taxOrDuty: 0,
      netPayable: newTotalCost,
      paymentStatus: newPaymentStatus,
      paymentMethod: newPaymentMethod,
      receivedBy: newReceivedBy
    };

    onAddBuyingInvoice(created);
    setShowAddBuyingModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Module Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 border border-amber-900/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                Module 4
              </span>
              <h1 className="text-xl sm:text-2xl font-serif-luxury font-bold text-neutral-100 flex items-center gap-2">
                <span>Formula Vault & Buying Invoices</span>
                <FlaskConical className="w-5 h-5 text-amber-400 inline" />
              </h1>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
              Master perfumery recipe book, ingredient ratios, bottle COGS & MSRP margins, production batch scaling, and raw agarwood buying invoice ledger.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {activeTab === 'vault' ? (
              <button
                onClick={() => setShowAddFormulaModal(true)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold text-xs tracking-wider transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Fragrance Formula</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAddBuyingModal(true)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold text-xs tracking-wider transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Log Buying Invoice</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 bg-neutral-900/60 p-1.5 rounded-xl gap-2">
        <button
          onClick={() => setActiveTab('vault')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'vault'
              ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Formula Vault & Batch Scaler ({formulas.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'invoices'
              ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Raw Material Buying Invoices ({buyingInvoices.length})</span>
        </button>
      </div>

      {/* TAB 1: Formula Vault & Batch Scaler */}
      {activeTab === 'vault' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Formula List */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
              <span>Maison Recipes</span>
              <span className="text-[10px] text-amber-400 font-mono">Confidential Vault</span>
            </div>

            <div className="space-y-2">
              {formulas.map((f) => {
                const isSelected = selectedFormula?.id === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => {
                      setSelectedFormula(f);
                      setBatchTargetVolume(f.targetSizeMl);
                      setBatchMultiplier(1);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-950/30'
                        : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-amber-400 block">
                          {f.code} • {f.type}
                        </span>
                        <h4 className="font-serif-luxury font-bold text-neutral-100 text-sm mt-0.5">
                          {f.name}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {f.profitMarginPercent}% Margin
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2 font-mono">
                      <span>COGS: {formatBDT(f.costPerBottle)}</span>
                      <span className="text-amber-300 font-bold">MSRP: {formatBDT(f.recommendedMSRP)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Recipe & Batch Scaler */}
          {selectedFormula && (
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 space-y-5 backdrop-blur-md">
                {/* Recipe Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        {selectedFormula.code}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {selectedFormula.olfactoryFamily} • {selectedFormula.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif-luxury font-bold text-neutral-100 mt-1">
                      {selectedFormula.name}
                    </h3>
                    {selectedFormula.bengaliName && (
                      <span className="text-xs text-amber-400/90 font-medium block">
                        {selectedFormula.bengaliName}
                      </span>
                    )}
                  </div>

                  {/* Financial Quick Glance */}
                  <div className="flex items-center space-x-3 text-xs font-mono">
                    <div className="bg-neutral-950 px-3 py-2 rounded-xl border border-neutral-800">
                      <span className="text-[10px] text-neutral-400 block">Bottle COGS</span>
                      <span className="text-sm font-bold text-neutral-100">
                        {formatBDT(selectedFormula.costPerBottle)}
                      </span>
                    </div>
                    <div className="bg-neutral-950 px-3 py-2 rounded-xl border border-neutral-800">
                      <span className="text-[10px] text-neutral-400 block">Retail MSRP</span>
                      <span className="text-sm font-bold text-amber-400">
                        {formatBDT(selectedFormula.recommendedMSRP)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed italic border-l-2 border-amber-500/40 pl-3">
                  "{selectedFormula.description}"
                </p>

                {/* Olfactory Pyramid Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                    <span className="text-[10px] uppercase font-mono text-amber-400 block font-semibold mb-1">
                      Top Notes (Opening)
                    </span>
                    <div className="text-neutral-200">
                      {selectedFormula.topNotes.join(', ')}
                    </div>
                  </div>
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                    <span className="text-[10px] uppercase font-mono text-amber-400 block font-semibold mb-1">
                      Heart Notes (Core)
                    </span>
                    <div className="text-neutral-200">
                      {selectedFormula.heartNotes.join(', ')}
                    </div>
                  </div>
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                    <span className="text-[10px] uppercase font-mono text-amber-400 block font-semibold mb-1">
                      Base Notes (Sillage)
                    </span>
                    <div className="text-neutral-200">
                      {selectedFormula.baseNotes.join(', ')}
                    </div>
                  </div>
                </div>

                {/* Batch Scaling Tool */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-amber-900/30 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <Scale className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-semibold text-neutral-200">
                        Production Batch Scaling Tool:
                      </span>
                    </div>
                    <span className="text-xs font-mono text-amber-400">
                      Current Target: <strong>{batchTargetVolume} ml</strong> ({Math.round(batchMultiplier * 10) / 10}x multiplier)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    {[
                      { label: 'Single Bottle (50ml)', val: 50 },
                      { label: 'Lab Sample (100ml)', val: 100 },
                      { label: 'Batch Flacon (250ml)', val: 250 },
                      { label: 'Master Demi (500ml)', val: 500 },
                      { label: '1 Liter Batch (1000ml)', val: 1000 },
                      { label: 'Commercial Tank (5000ml)', val: 5000 },
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        onClick={() => handleScaleVolume(preset.val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                          batchTargetVolume === preset.val
                            ? 'bg-amber-500 text-neutral-950 font-bold'
                            : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ingredients & Cost Calculation Table */}
                <div className="border border-neutral-800 rounded-xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-neutral-950 text-neutral-400 font-mono text-[10px] uppercase border-b border-neutral-800">
                      <tr>
                        <th className="py-2.5 px-3 text-left">Raw Material Ingredient</th>
                        <th className="py-2.5 px-3 text-left">Phase</th>
                        <th className="py-2.5 px-3 text-center">Batch Ratio</th>
                        <th className="py-2.5 px-3 text-center">Scaled Weight</th>
                        <th className="py-2.5 px-3 text-right">Unit Rate</th>
                        <th className="py-2.5 px-3 text-right">Estimated Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 bg-neutral-950/40 text-neutral-200 font-medium">
                      {selectedFormula.ingredients.map((ing) => {
                        const scaledGrams = ing.gramsPer100g * (batchTargetVolume / 100);
                        const scaledCost = scaledGrams * ing.unitCostPerGram;
                        return (
                          <tr key={ing.id} className="hover:bg-neutral-800/30">
                            <td className="py-2.5 px-3 font-semibold text-neutral-100">
                              {ing.name}
                            </td>
                            <td className="py-2.5 px-3 text-neutral-400 text-[11px]">
                              {ing.category}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono text-amber-400">
                              {ing.percentage}%
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-neutral-100">
                              {scaledGrams.toFixed(2)} g
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-neutral-400">
                              ৳{ing.unitCostPerGram}/g
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-amber-300 font-bold">
                              {formatBDT(scaledCost)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center text-xs text-neutral-400 pt-2 border-t border-neutral-800">
                  <span>Maceration Protocol: <strong>{selectedFormula.macerationDays} Days in darkness</strong></span>
                  <span className="font-mono text-emerald-400">
                    Total Batch Raw Material Cost: {formatBDT(
                      selectedFormula.ingredients.reduce(
                        (acc, ing) => acc + (ing.gramsPer100g * (batchTargetVolume / 100) * ing.unitCostPerGram),
                        0
                      )
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Raw Material Buying Invoice Tracker */}
      {activeTab === 'invoices' && (
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-md">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400" />
                Raw Material Buying Invoices Ledger ({buyingInvoices.length})
              </h3>
              <p className="text-xs text-neutral-400">
                Purchases for wild agarwood chips, French aroma molecules, crystal flacons, and Rongta thermal rolls.
              </p>
            </div>
            <div className="text-right font-mono text-xs">
              <span className="text-neutral-400 block text-[10px]">Total Sourcing Expenditure:</span>
              <span className="text-amber-400 font-bold text-sm">
                {formatBDT(buyingInvoices.reduce((acc, inv) => acc + inv.netPayable, 0))}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 text-neutral-400 font-medium uppercase tracking-wider text-[10px] border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Invoice # & Date</th>
                  <th className="py-3 px-4">Supplier & Origin</th>
                  <th className="py-3 px-4">Materials Purchased</th>
                  <th className="py-3 px-4">Received By</th>
                  <th className="py-3 px-4">Payment & Terms</th>
                  <th className="py-3 px-4 text-right">Net Cost (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {buyingInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-amber-400">{inv.invoiceNumber}</div>
                      <div className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{inv.purchaseDate}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-200">{inv.supplierName}</div>
                      <div className="text-[10px] text-neutral-500">{inv.supplierLocation}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="space-y-1">
                        {inv.items.map((item, idx) => (
                          <div key={idx} className="text-neutral-200">
                            <span>{item.materialName}</span>{' '}
                            <span className="text-neutral-400 font-mono text-[11px]">
                              ({item.quantity} {item.unit} @ ৳{item.ratePerUnit})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-neutral-300">
                      {inv.receivedBy}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          inv.paymentStatus === 'Paid'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {inv.paymentStatus === 'Paid' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span>{inv.paymentStatus}</span>
                      </span>
                      <div className="text-[10px] text-neutral-500 mt-1">{inv.paymentMethod}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-100 text-sm">
                      {formatBDT(inv.netPayable)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Fragrance Formula Modal */}
      {showAddFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-amber-900/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="text-base font-serif-luxury font-bold text-neutral-100 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-amber-400" />
                Store New Fragrance Formula in Vault
              </h3>
              <button
                onClick={() => setShowAddFormulaModal(false)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFormula} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Fragrance Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sreemangal Rain & White Amber"
                  value={newFormulaName}
                  onChange={(e) => setNewFormulaName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Concentration Type</label>
                  <select
                    value={newFormulaType}
                    onChange={(e) => setNewFormulaType(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
                  >
                    <option value="Pure Artisanal Attar">Pure Artisanal Attar</option>
                    <option value="Extrait de Parfum (30%)">Extrait de Parfum (30%)</option>
                    <option value="Eau de Parfum (20%)">Eau de Parfum (20%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Olfactory Family</label>
                  <select
                    value={newFormulaFamily}
                    onChange={(e) => setNewFormulaFamily(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
                  >
                    <option value="Oriental Woody">Oriental Woody</option>
                    <option value="Floral Amber">Floral Amber</option>
                    <option value="Fresh Aquatic Oud">Fresh Aquatic Oud</option>
                    <option value="Spicy Leather">Spicy Leather</option>
                    <option value="Gourmand Rose">Gourmand Rose</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Target Bottle Size (ml)</label>
                  <input
                    type="number"
                    value={newFormulaSize}
                    onChange={(e) => setNewFormulaSize(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Recommended Retail MSRP (৳)</label>
                  <input
                    type="number"
                    value={newMSRP}
                    onChange={(e) => setNewMSRP(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Top Notes (comma-separated)</label>
                <input
                  type="text"
                  value={newTopNotes}
                  onChange={(e) => setNewTopNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Heart Notes (comma-separated)</label>
                <input
                  type="text"
                  value={newHeartNotes}
                  onChange={(e) => setNewHeartNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Base Notes (comma-separated)</label>
                <input
                  type="text"
                  value={newBaseNotes}
                  onChange={(e) => setNewBaseNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddFormulaModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold text-xs"
                >
                  Save into Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Buying Invoice Modal */}
      {showAddBuyingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-amber-900/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="text-base font-serif-luxury font-bold text-neutral-100 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400" />
                Log Raw Material Purchase Invoice
              </h3>
              <button
                onClick={() => setShowAddBuyingModal(false)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBuyingInvoice} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Supplier Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sylhet Agarwood Distillers"
                    value={newSupplierName}
                    onChange={(e) => setNewSupplierName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Invoice Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SAD-9099-INV"
                    value={newInvoiceNumber}
                    onChange={(e) => setNewInvoiceNumber(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Location / Hub</label>
                  <input
                    type="text"
                    value={newSupplierLocation}
                    onChange={(e) => setNewSupplierLocation(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Purchase Date</label>
                  <input
                    type="date"
                    value={newPurchaseDate}
                    onChange={(e) => setNewPurchaseDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Material Items Description</label>
                <input
                  type="text"
                  value={newMaterialDescription}
                  onChange={(e) => setNewMaterialDescription(e.target.value)}
                  placeholder="e.g. 500g Wild Sreemangal Oud Oil & 1000 Crystal Tolas"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Total Net Cost (৳)</label>
                  <input
                    type="number"
                    value={newTotalCost}
                    onChange={(e) => setNewTotalCost(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Payment Status</label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Credit">Credit (Payable Later)</option>
                    <option value="Partial">Partial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Payment Method</label>
                  <input
                    type="text"
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Received By</label>
                  <input
                    type="text"
                    value={newReceivedBy}
                    onChange={(e) => setNewReceivedBy(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-100"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddBuyingModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-neutral-950 font-bold text-xs"
                >
                  Record Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
