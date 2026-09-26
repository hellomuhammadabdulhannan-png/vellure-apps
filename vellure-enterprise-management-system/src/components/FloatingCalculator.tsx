import React, { useState, useEffect, useRef } from 'react';
import {
  Calculator,
  X,
  Scale,
  DollarSign,
  Move,
  Minus,
  Maximize2,
  RotateCcw,
  Sparkles,
  GripHorizontal
} from 'lucide-react';
import { formatBDT } from '../utils/formatters';

interface FloatingCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FloatingCalculator: React.FC<FloatingCalculatorProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'cod' | 'perfume' | 'standard'>('cod');
  const [isMinimized, setIsMinimized] = useState(false);

  // Free movement & position state
  const [position, setPosition] = useState<{ x: number; y: number } | null>(() => {
    try {
      const saved = localStorage.getItem('vellure_calc_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch {
      // fallback to null
    }
    return null;
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Standard calculator state
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcEquation, setCalcEquation] = useState('');

  // Perfume Dilution state
  const [targetBottleMl, setTargetBottleMl] = useState(50);
  const [oilConcentrationPercent, setOilConcentrationPercent] = useState(30);
  const [alcoholDensity, setAlcoholDensity] = useState(0.81);

  // COD & Bill Math state
  const [subtotal, setSubtotal] = useState(6200);
  const [delivery, setDelivery] = useState(120);
  const [discount, setDiscount] = useState(0);
  const [advance, setAdvance] = useState(1000);

  // Initialize position to bottom-right if not set
  useEffect(() => {
    if (isOpen && position === null && typeof window !== 'undefined') {
      const width = isMinimized ? 280 : 380;
      const height = isMinimized ? 60 : 480;
      const initX = Math.max(20, window.innerWidth - width - 30);
      const initY = Math.max(80, window.innerHeight - height - 30);
      setPosition({ x: initX, y: initY });
    }
  }, [isOpen, position, isMinimized]);

  // Save position to localStorage on update
  useEffect(() => {
    if (position) {
      try {
        localStorage.setItem('vellure_calc_pos', JSON.stringify(position));
      } catch {
        // ignore
      }
    }
  }, [position]);

  // Dragging event handlers
  const handleStartDrag = (clientX: number, clientY: number) => {
    if (!position) return;
    setIsDragging(true);
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initX: position.x,
      initY: position.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      const cardWidth = containerRef.current?.offsetWidth || 380;
      const cardHeight = containerRef.current?.offsetHeight || 400;

      const maxX = Math.max(10, window.innerWidth - cardWidth - 10);
      const maxY = Math.max(10, window.innerHeight - cardHeight - 10);

      const nextX = Math.max(10, Math.min(maxX, dragStartRef.current.initX + dx));
      const nextY = Math.max(10, Math.min(maxY, dragStartRef.current.initY + dy));

      setPosition({ x: nextX, y: nextY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const dx = touch.clientX - dragStartRef.current.startX;
      const dy = touch.clientY - dragStartRef.current.startY;
      const cardWidth = containerRef.current?.offsetWidth || 380;
      const cardHeight = containerRef.current?.offsetHeight || 400;

      const maxX = Math.max(10, window.innerWidth - cardWidth - 10);
      const maxY = Math.max(10, window.innerHeight - cardHeight - 10);

      const nextX = Math.max(10, Math.min(maxX, dragStartRef.current.initX + dx));
      const nextY = Math.max(10, Math.min(maxY, dragStartRef.current.initY + dy));

      setPosition({ x: nextX, y: nextY });
    };

    const handleEndDrag = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEndDrag);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEndDrag);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEndDrag);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEndDrag);
    };
  }, [isDragging]);

  // Quick preset docking positions
  const dockTo = (corner: 'TR' | 'TL' | 'BR' | 'BL' | 'Center') => {
    const cardWidth = containerRef.current?.offsetWidth || (isMinimized ? 280 : 380);
    const cardHeight = containerRef.current?.offsetHeight || (isMinimized ? 60 : 460);

    let nextX = 20;
    let nextY = 80;

    if (corner === 'TR') {
      nextX = window.innerWidth - cardWidth - 24;
      nextY = 84;
    } else if (corner === 'TL') {
      nextX = 24;
      nextY = 84;
    } else if (corner === 'BR') {
      nextX = window.innerWidth - cardWidth - 24;
      nextY = window.innerHeight - cardHeight - 24;
    } else if (corner === 'BL') {
      nextX = 24;
      nextY = window.innerHeight - cardHeight - 24;
    } else if (corner === 'Center') {
      nextX = Math.max(10, (window.innerWidth - cardWidth) / 2);
      nextY = Math.max(10, (window.innerHeight - cardHeight) / 2);
    }

    setPosition({ x: Math.round(nextX), y: Math.round(nextY) });
  };

  if (!isOpen) return null;

  // Standard calc handlers
  const handleCalcNumber = (digit: string) => {
    setCalcDisplay((prev) => (prev === '0' ? digit : prev + digit));
  };

  const handleCalcOperator = (op: string) => {
    setCalcEquation(`${calcDisplay} ${op} `);
    setCalcDisplay('0');
  };

  const handleCalcClear = () => {
    setCalcDisplay('0');
    setCalcEquation('');
  };

  const handleCalcEquals = () => {
    try {
      const fullExpr = `${calcEquation}${calcDisplay}`.replace(/×/g, '*').replace(/÷/g, '/');
      const result = Function(`'use strict'; return (${fullExpr})`)();
      setCalcDisplay(String(Number(result.toFixed(2))));
      setCalcEquation('');
    } catch {
      setCalcDisplay('Error');
    }
  };

  // Perfume dilution calculations
  const pureOilMl = targetBottleMl * (oilConcentrationPercent / 100);
  const pureOilGrams = pureOilMl * 0.95;
  const alcoholMl = targetBottleMl - pureOilMl;
  const alcoholGrams = alcoholMl * alcoholDensity;
  const totalWeightGrams = pureOilGrams + alcoholGrams;

  // COD Calculation
  const calculatedCod = Math.max(0, subtotal + delivery - discount - advance);

  const isMobileScreen = typeof window !== 'undefined' && window.innerWidth < 640;

  let stylePos: React.CSSProperties = {
    right: '24px',
    bottom: '24px',
  };

  if (isMobileScreen) {
    stylePos = {
      left: '12px',
      right: '12px',
      bottom: isMinimized ? '76px' : '72px',
      width: 'auto',
      maxWidth: 'calc(100vw - 24px)',
    };
  } else if (position) {
    const maxX = Math.max(10, (typeof window !== 'undefined' ? window.innerWidth : 1000) - 390);
    const maxY = Math.max(10, (typeof window !== 'undefined' ? window.innerHeight : 800) - 480);
    const safeX = Math.max(12, Math.min(position.x, maxX));
    const safeY = Math.max(12, Math.min(position.y, maxY));
    stylePos = {
      left: `${safeX}px`,
      top: `${safeY}px`,
    };
  }

  return (
    <div
      ref={containerRef}
      style={stylePos}
      className={`no-print fixed z-50 bg-neutral-900 border border-amber-900/50 rounded-2xl shadow-2xl shadow-black/90 backdrop-blur-xl transition-shadow select-none ${
        isDragging ? 'shadow-amber-500/20 ring-2 ring-amber-500/50 cursor-grabbing' : ''
      } ${isMinimized ? 'w-80 max-w-[calc(100vw-24px)]' : 'w-[380px] max-w-[calc(100vw-24px)]'}`}
    >
      {/* Draggable Header */}
      <div
        onMouseDown={(e) => {
          // Only initiate drag if not clicking buttons or inputs
          if ((e.target as HTMLElement).closest('button, input, select')) return;
          handleStartDrag(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          if ((e.target as HTMLElement).closest('button, input, select')) return;
          if (e.touches.length === 1) {
            handleStartDrag(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        className="bg-neutral-950 px-3.5 py-2.5 border-b border-neutral-800 flex items-center justify-between cursor-grab active:cursor-grabbing rounded-t-2xl group"
        title="Click and drag anywhere to move / টেনে যেকোনো জায়গায় রাখুন"
      >
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <Calculator className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-serif-luxury font-bold text-neutral-100 tracking-wider">
                VELLURE Calculator
              </span>
              <span className="flex items-center text-[9px] font-mono font-medium text-amber-400/90 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/40">
                <Move className="w-2.5 h-2.5 mr-0.5 inline" />
                Moveable
              </span>
            </div>
            {isMinimized && (
              <span className="text-[10px] font-mono text-emerald-400 font-semibold block">
                COD: {formatBDT(calculatedCod)}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls: Minimize, Docking & Close */}
        <div className="flex items-center space-x-1">
          {/* Quick Corner Docking Dropdown or Buttons */}
          <div className="flex items-center space-x-0.5 bg-neutral-900 px-1 py-0.5 rounded-lg border border-neutral-800 text-[9px] font-mono text-neutral-400 mr-1">
            <button
              type="button"
              onClick={() => dockTo('TL')}
              className="px-1 py-0.5 hover:text-amber-400 hover:bg-neutral-800 rounded transition-colors"
              title="Dock Top-Left"
            >
              TL
            </button>
            <button
              type="button"
              onClick={() => dockTo('TR')}
              className="px-1 py-0.5 hover:text-amber-400 hover:bg-neutral-800 rounded transition-colors"
              title="Dock Top-Right"
            >
              TR
            </button>
            <button
              type="button"
              onClick={() => dockTo('BL')}
              className="px-1 py-0.5 hover:text-amber-400 hover:bg-neutral-800 rounded transition-colors"
              title="Dock Bottom-Left"
            >
              BL
            </button>
            <button
              type="button"
              onClick={() => dockTo('BR')}
              className="px-1 py-0.5 hover:text-amber-400 hover:bg-neutral-800 rounded transition-colors"
              title="Dock Bottom-Right"
            >
              BR
            </button>
          </div>

          {/* Minimize / Expand Toggle */}
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-neutral-400 hover:text-neutral-100 p-1 rounded-lg hover:bg-neutral-800 transition-colors"
            title={isMinimized ? 'Expand Calculator' : 'Minimize to compact pill'}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-red-400 p-1 rounded-lg hover:bg-neutral-800 transition-colors"
            title="Close Calculator"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* When Minimized: Compact Pill Content */}
      {isMinimized ? (
        <div className="p-2.5 bg-neutral-950/80 flex items-center justify-between text-xs font-mono rounded-b-2xl">
          <div className="text-[11px] text-neutral-300 flex items-center gap-1.5">
            <span className="text-neutral-500">Net COD:</span>
            <strong className="text-amber-400">{formatBDT(calculatedCod)}</strong>
          </div>
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="text-[10px] text-amber-400 hover:underline px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 font-sans"
          >
            Expand Details
          </button>
        </div>
      ) : (
        <>
          {/* Mode Tabs */}
          <div className="flex border-b border-neutral-800 bg-neutral-950/60 p-1 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('cod')}
              className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg flex items-center justify-center gap-1 transition-all ${
                activeTab === 'cod'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <DollarSign className="w-3 h-3" />
              <span>COD & Bill</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('perfume')}
              className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg flex items-center justify-center gap-1 transition-all ${
                activeTab === 'perfume'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Scale className="w-3 h-3" />
              <span>Oil & Dilution</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('standard')}
              className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg flex items-center justify-center gap-1 transition-all ${
                activeTab === 'standard'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Calculator className="w-3 h-3" />
              <span>Keypad</span>
            </button>
          </div>

          {/* Tab 1: COD & Customer Bill */}
          {activeTab === 'cod' && (
            <div className="p-4 space-y-3">
              <div className="bg-neutral-950 rounded-xl p-3 border border-neutral-800">
                <div className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider">
                  Net Collectible Cash on Delivery (COD)
                </div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                  {formatBDT(calculatedCod)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-0.5">Order Subtotal (৳)</label>
                  <input
                    type="number"
                    value={subtotal}
                    onChange={(e) => setSubtotal(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-0.5">Delivery Fee (৳)</label>
                  <input
                    type="number"
                    value={delivery}
                    onChange={(e) => setDelivery(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-0.5">VIP Discount (৳)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-0.5">Advance Received (৳)</label>
                  <input
                    type="number"
                    value={advance}
                    onChange={(e) => setAdvance(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 text-[11px] text-neutral-400 border-t border-neutral-800 flex justify-between items-center">
                <span>Total Bill: {formatBDT(subtotal + delivery - discount)}</span>
                <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-[10px]">
                  {calculatedCod === 0 ? 'Fully Paid' : 'Pending COD'}
                </span>
              </div>
            </div>
          )}

          {/* Tab 2: Perfume & Dilution Math */}
          {activeTab === 'perfume' && (
            <div className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-0.5">Target Size (ml)</label>
                  <select
                    value={targetBottleMl}
                    onChange={(e) => setTargetBottleMl(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-neutral-100 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  >
                    <option value={3}>3 ml (Attar Sample)</option>
                    <option value={6}>6 ml (Half Tola)</option>
                    <option value={12}>12 ml (Full Tola)</option>
                    <option value={30}>30 ml (Travel Spray)</option>
                    <option value={50}>50 ml (Signature Flacon)</option>
                    <option value={100}>100 ml (Grand Flacon)</option>
                    <option value={500}>500 ml (Batch Jug)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-0.5">Concentration (%)</label>
                  <select
                    value={oilConcentrationPercent}
                    onChange={(e) => setOilConcentrationPercent(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1.5 text-neutral-100 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  >
                    <option value={100}>100% (Pure Oil Attar)</option>
                    <option value={35}>35% (Royal Extrait)</option>
                    <option value={30}>30% (Extrait de Parfum)</option>
                    <option value={20}>20% (Eau de Parfum)</option>
                    <option value={15}>15% (Eau de Toilette)</option>
                  </select>
                </div>
              </div>

              <div className="bg-neutral-950 rounded-xl p-3 border border-neutral-800 space-y-2">
                <div className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider">
                  Batch Chemistry Breakdown
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-neutral-900/80 p-2 rounded-lg border border-amber-900/30">
                    <span className="text-[10px] text-amber-400 block font-medium">Fragrance Oil</span>
                    <span className="text-sm font-mono font-bold text-neutral-100">
                      {pureOilGrams.toFixed(2)} g
                    </span>
                    <span className="text-[10px] text-neutral-500 block">({pureOilMl.toFixed(1)} ml)</span>
                  </div>
                  <div className="bg-neutral-900/80 p-2 rounded-lg border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 block font-medium">Perfumer Alcohol</span>
                    <span className="text-sm font-mono font-bold text-neutral-100">
                      {alcoholGrams.toFixed(2)} g
                    </span>
                    <span className="text-[10px] text-neutral-500 block">({alcoholMl.toFixed(1)} ml)</span>
                  </div>
                </div>
                <div className="text-[10px] text-neutral-500 flex justify-between pt-1">
                  <span>Batch Weight: {totalWeightGrams.toFixed(2)} g</span>
                  <span>Density: 0.87 g/ml</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Standard Keypad */}
          {activeTab === 'standard' && (
            <div className="p-3">
              <div className="bg-neutral-950 rounded-xl p-3 border border-neutral-800 mb-3 text-right">
                <div className="text-[10px] font-mono text-neutral-500 h-4">{calcEquation}</div>
                <div className="text-2xl font-mono font-bold text-neutral-100 truncate">{calcDisplay}</div>
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={handleCalcClear}
                  className="py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-red-400 font-bold transition-colors"
                >
                  C
                </button>
                <button
                  type="button"
                  onClick={() => handleCalcOperator('÷')}
                  className="py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold transition-colors"
                >
                  ÷
                </button>
                <button
                  type="button"
                  onClick={() => handleCalcOperator('×')}
                  className="py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold transition-colors"
                >
                  ×
                </button>
                <button
                  type="button"
                  onClick={() => handleCalcOperator('-')}
                  className="py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold transition-colors"
                >
                  -
                </button>

                {['7', '8', '9'].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleCalcNumber(n)}
                    className="py-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-200 font-medium transition-colors"
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleCalcOperator('+')}
                  className="py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold transition-colors"
                >
                  +
                </button>

                {['4', '5', '6'].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleCalcNumber(n)}
                    className="py-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-200 font-medium transition-colors"
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleCalcEquals}
                  className="row-span-2 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition-colors flex items-center justify-center"
                >
                  =
                </button>

                {['1', '2', '3'].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleCalcNumber(n)}
                    className="py-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-200 font-medium transition-colors"
                  >
                    {n}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handleCalcNumber('0')}
                  className="col-span-2 py-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-200 font-medium transition-colors"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => handleCalcNumber('.')}
                  className="py-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-200 font-medium transition-colors"
                >
                  .
                </button>
              </div>
            </div>
          )}

          {/* Footer Drag Tip */}
          <div className="px-3 py-1.5 bg-neutral-950/70 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-500 font-mono rounded-b-2xl">
            <span className="flex items-center gap-1">
              <Move className="w-3 h-3 text-amber-500/70" />
              <span>Drag header to move anywhere</span>
            </span>
            <span className="text-neutral-400">Position Auto-Saved</span>
          </div>
        </>
      )}
    </div>
  );
};
