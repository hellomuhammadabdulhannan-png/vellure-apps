import React, { useState, useEffect } from 'react';
import {
  ModuleId,
  UserPermission,
  Invoice,
  FragranceFormula,
  RawMaterialInvoice,
  OperatingExpense,
  AssetCategory,
  QuickNote,
} from './types';
import {
  BRAND_DETAILS,
  MODULE_DEFINITIONS,
  INITIAL_USERS,
  INITIAL_INVOICES,
  INITIAL_FORMULAS,
  INITIAL_BUYING_INVOICES,
  INITIAL_OPERATING_EXPENSES,
  INITIAL_ASSET_BREAKDOWN,
  INITIAL_QUICK_NOTES,
  DEFAULT_INVENTORY_SHEET_URL,
} from './data/initialData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { AccessDenied } from './components/AccessDenied';
import { FloatingCalculator } from './components/FloatingCalculator';
import { CommandPalette } from './components/CommandPalette';
import { BackupRestoreModal } from './components/BackupRestoreModal';
import { WhatsAppTemplatesModal } from './components/WhatsAppTemplatesModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileMenuDrawer } from './components/MobileMenuDrawer';
import { LoginScreen } from './components/LoginScreen';

// 8 Modules
import { UserAccessManagement } from './components/modules/UserAccessManagement';
import { CustomerHistoryAnalytics } from './components/modules/CustomerHistoryAnalytics';
import { AIInsightsInventory } from './components/modules/AIInsightsInventory';
import { FormulaVaultBuyingInvoices } from './components/modules/FormulaVaultBuyingInvoices';
import { FinancialOverview } from './components/modules/FinancialOverview';
import { InvoiceGeneratorDispatch } from './components/modules/InvoiceGeneratorDispatch';
import { CourierThermalPrinter } from './components/modules/CourierThermalPrinter';
import { PremiumThankYouCard } from './components/modules/PremiumThankYouCard';

export default function App() {
  // Navigation & User session
  const [activeModule, setActiveModule] = useState<ModuleId>(1);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const explicitLocked = localStorage.getItem('vellure_explicit_lock');
      if (explicitLocked === 'true') {
        // User explicitly locked or logged out
        return false;
      }
      const raw = localStorage.getItem('vellure_auth_session') || sessionStorage.getItem('vellure_auth_session');
      if (raw) {
        const parsed = JSON.parse(raw);
        return !!parsed && !!parsed.userId;
      }
      // Default to active session as Super Admin so the navigation bar & Pages 7 and 8 are immediately open and visible!
      return true;
    } catch (e) {
      return true;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserPermission>(() => {
    const saved = localStorage.getItem('vellure_current_user') || sessionStorage.getItem('vellure_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.userId === 'USR-001' || parsed.username === 'abdul.hannan') {
          parsed.password = 'Kr100300500';
        }
        return parsed;
      } catch (e) {
        return INITIAL_USERS[0];
      }
    }
    return INITIAL_USERS[0];
  });

  // App persistent states
  const [users, setUsers] = useState<UserPermission[]>(() => {
    const saved = localStorage.getItem('vellure_users');
    if (saved) {
      try {
        const parsed: UserPermission[] = JSON.parse(saved);
        return parsed.map((u) => {
          if (u.userId === 'USR-001' || u.username === 'abdul.hannan') {
            return { ...u, password: 'Kr100300500' };
          }
          return u;
        });
      } catch (e) {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('vellure_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [formulas, setFormulas] = useState<FragranceFormula[]>(() => {
    const saved = localStorage.getItem('vellure_formulas');
    return saved ? JSON.parse(saved) : INITIAL_FORMULAS;
  });

  const [buyingInvoices, setBuyingInvoices] = useState<RawMaterialInvoice[]>(() => {
    const saved = localStorage.getItem('vellure_buying_invoices');
    return saved ? JSON.parse(saved) : INITIAL_BUYING_INVOICES;
  });

  const [operatingExpenses, setOperatingExpenses] = useState<OperatingExpense[]>(() => {
    const saved = localStorage.getItem('vellure_operating_expenses');
    return saved ? JSON.parse(saved) : INITIAL_OPERATING_EXPENSES;
  });

  const [assetBreakdown, setAssetBreakdown] = useState<AssetCategory[]>(() => {
    const saved = localStorage.getItem('vellure_assets');
    return saved ? JSON.parse(saved) : INITIAL_ASSET_BREAKDOWN;
  });

  const [quickNotes, setQuickNotes] = useState<QuickNote[]>(() => {
    const saved = localStorage.getItem('vellure_quick_notes');
    return saved ? JSON.parse(saved) : INITIAL_QUICK_NOTES;
  });

  const [sheetUrl, setSheetUrl] = useState<string>(() => {
    const saved = localStorage.getItem('vellure_sheet_url');
    return saved ? saved : DEFAULT_INVENTORY_SHEET_URL;
  });

  // Floating Calculator toggle
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Super-Toolkit Modals State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener for Super-Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Target invoice for quick navigations
  const [targetThermalInvoiceId, setTargetThermalInvoiceId] = useState<string>('');
  const [targetCardInvoice, setTargetCardInvoice] = useState<Invoice | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('vellure_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('vellure_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('vellure_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('vellure_formulas', JSON.stringify(formulas));
  }, [formulas]);

  useEffect(() => {
    localStorage.setItem('vellure_buying_invoices', JSON.stringify(buyingInvoices));
  }, [buyingInvoices]);

  useEffect(() => {
    localStorage.setItem('vellure_operating_expenses', JSON.stringify(operatingExpenses));
  }, [operatingExpenses]);

  useEffect(() => {
    localStorage.setItem('vellure_quick_notes', JSON.stringify(quickNotes));
  }, [quickNotes]);

  useEffect(() => {
    localStorage.setItem('vellure_sheet_url', sheetUrl);
  }, [sheetUrl]);

  // Handler helpers
  const handleAddUser = (newUser: UserPermission) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const handleUpdateUser = (updatedUser: UserPermission) => {
    setUsers((prev) => prev.map((u) => (u.userId === updatedUser.userId ? updatedUser : u)));
    if (currentUser.userId === updatedUser.userId) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.userId !== userId));
  };

  const handleAddInvoice = (newInv: Invoice) => {
    setInvoices((prev) => [newInv, ...prev]);
  };

  const handleUpdateInvoice = (updated: Invoice) => {
    setInvoices((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleMarkPrinted = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((i) => (i.id === invoiceId ? { ...i, thermalPrinted: true } : i))
    );
  };

  const handleAddFormula = (newFormula: FragranceFormula) => {
    setFormulas((prev) => [newFormula, ...prev]);
  };

  const handleAddBuyingInvoice = (newBuyInv: RawMaterialInvoice) => {
    setBuyingInvoices((prev) => [newBuyInv, ...prev]);
  };

  const handleAddOperatingExpense = (newExp: OperatingExpense) => {
    setOperatingExpenses((prev) => [newExp, ...prev]);
  };

  const handleAddQuickNote = (newNote: QuickNote) => {
    setQuickNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteQuickNote = (noteId: string) => {
    setQuickNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  // Cross-module navigations
  const handleNavigateToThermal = (invoiceId: string) => {
    setTargetThermalInvoiceId(invoiceId);
    setActiveModule(7);
  };

  const handleNavigateToCard = (inv: Invoice) => {
    setTargetCardInvoice(inv);
    setActiveModule(8);
  };

  const handleOpenGoogleSheet = () => {
    window.open(sheetUrl || DEFAULT_INVENTORY_SHEET_URL, '_blank');
  };

  // Operational alert counts
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingReviewsCount = invoices.filter(
    (inv) => inv.reviewReminderDate && inv.reviewReminderDate <= todayStr && inv.reviewStatus === 'Pending'
  ).length;
  const unprintedCount = invoices.filter((i) => !i.thermalPrinted).length;
  const lowMaterialsCount = buyingInvoices.filter((bi) =>
    bi.items.some((it) => it.quantity <= 2)
  ).length;
  const totalAlertsCount = unprintedCount + pendingReviewsCount + (lowMaterialsCount > 0 ? 1 : 0);

  // Restore database data handler
  const handleRestoreData = (restored: {
    invoices?: Invoice[];
    formulas?: FragranceFormula[];
    buyingInvoices?: RawMaterialInvoice[];
    operatingExpenses?: OperatingExpense[];
    assetBreakdown?: AssetCategory[];
    quickNotes?: QuickNote[];
    users?: UserPermission[];
  }) => {
    if (restored.invoices) setInvoices(restored.invoices);
    if (restored.formulas) setFormulas(restored.formulas);
    if (restored.buyingInvoices) setBuyingInvoices(restored.buyingInvoices);
    if (restored.operatingExpenses) setOperatingExpenses(restored.operatingExpenses);
    if (restored.assetBreakdown) setAssetBreakdown(restored.assetBreakdown);
    if (restored.quickNotes) setQuickNotes(restored.quickNotes);
    if (restored.users) setUsers(restored.users);
  };

  const handleLoginSuccess = (user: UserPermission, remember: boolean) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.removeItem('vellure_explicit_lock');
    const sessionData = JSON.stringify({
      userId: user.userId,
      username: user.username,
      role: user.role,
      loginAt: new Date().toISOString(),
    });
    if (remember) {
      localStorage.setItem('vellure_auth_session', sessionData);
      localStorage.setItem('vellure_current_user', JSON.stringify(user));
    } else {
      sessionStorage.setItem('vellure_auth_session', sessionData);
      sessionStorage.setItem('vellure_current_user', JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('vellure_explicit_lock', 'true');
    localStorage.removeItem('vellure_auth_session');
    localStorage.removeItem('vellure_current_user');
    sessionStorage.removeItem('vellure_auth_session');
    sessionStorage.removeItem('vellure_current_user');
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  };

  // If not authenticated, render Login Guard Screen
  if (!isAuthenticated) {
    return <LoginScreen users={users} onLoginSuccess={handleLoginSuccess} />;
  }

  // Access privilege check for active module
  const isAllowed = currentUser.allowedModules.includes(activeModule);
  const currentModuleDef = MODULE_DEFINITIONS.find((m) => m.id === activeModule)!;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        allUsers={users}
        onSwitchUser={setCurrentUser}
        onToggleCalculator={() => setIsCalculatorOpen(!isCalculatorOpen)}
        isCalculatorOpen={isCalculatorOpen}
        onOpenGoogleSheet={handleOpenGoogleSheet}
        unprintedCount={unprintedCount}
        onNavigateToThermalPrinter={() => setActiveModule(7)}
        onNavigateToCards={() => setActiveModule(8)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        notificationCount={totalAlertsCount}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onLogout={handleLogout}
      />

      {/* 8-Module Navigation Ribbon */}
      <Navigation
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        allowedModules={currentUser.allowedModules}
        modules={MODULE_DEFINITIONS}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8">
        {!isAllowed ? (
          <AccessDenied
            module={currentModuleDef}
            currentUser={currentUser}
            allUsers={users}
            onSwitchToAdmin={() => {
              const admin = users.find((u) => u.role === 'Super Admin') || users[0];
              setCurrentUser(admin);
            }}
          />
        ) : (
          <>
            {activeModule === 1 && (
              <UserAccessManagement
                users={users}
                onAddUser={handleAddUser}
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
                currentUser={currentUser}
              />
            )}

            {activeModule === 2 && (
              <CustomerHistoryAnalytics
                invoices={invoices}
                onOpenThermalPrinter={handleNavigateToThermal}
                onOpenThankYouCard={handleNavigateToCard}
              />
            )}

            {activeModule === 3 && (
              <AIInsightsInventory
                sheetUrl={sheetUrl}
                onUpdateSheetUrl={setSheetUrl}
                quickNotes={quickNotes}
                onAddQuickNote={handleAddQuickNote}
                onDeleteQuickNote={handleDeleteQuickNote}
              />
            )}

            {activeModule === 4 && (
              <FormulaVaultBuyingInvoices
                formulas={formulas}
                buyingInvoices={buyingInvoices}
                onAddFormula={handleAddFormula}
                onAddBuyingInvoice={handleAddBuyingInvoice}
              />
            )}

            {activeModule === 5 && (
              <FinancialOverview
                invoices={invoices}
                buyingInvoices={buyingInvoices}
                operatingExpenses={operatingExpenses}
                assetBreakdown={assetBreakdown}
                onAddOperatingExpense={handleAddOperatingExpense}
              />
            )}

            {activeModule === 6 && (
              <InvoiceGeneratorDispatch
                invoices={invoices}
                onAddInvoice={handleAddInvoice}
                onUpdateInvoice={handleUpdateInvoice}
                onNavigateToThermal={handleNavigateToThermal}
                onNavigateToCard={handleNavigateToCard}
                onToggleCalculator={() => setIsCalculatorOpen((prev) => !prev)}
                isCalculatorOpen={isCalculatorOpen}
                onOpenWhatsAppModal={() => setIsWhatsAppOpen(true)}
              />
            )}

            {activeModule === 7 && (
              <CourierThermalPrinter
                invoices={invoices}
                initialSelectedId={targetThermalInvoiceId}
                onMarkPrinted={handleMarkPrinted}
              />
            )}

            {activeModule === 8 && (
              <PremiumThankYouCard
                invoices={invoices}
                initialSelectedInvoice={targetCardInvoice}
              />
            )}
          </>
        )}
      </main>

      {/* Floating In-App Calculator */}
      <FloatingCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* Super-Toolkit: Global Fast Command Search (Ctrl+K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        invoices={invoices}
        formulas={formulas}
        users={users}
        onSelectModule={setActiveModule}
        onSelectInvoice={(invId) => {
          setTargetThermalInvoiceId(invId);
          setActiveModule(6);
        }}
        onToggleCalculator={() => setIsCalculatorOpen((prev) => !prev)}
        onOpenBackup={() => setIsBackupOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
      />

      {/* Super-Toolkit: Full System Data Backup & CSV Export */}
      <BackupRestoreModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        invoices={invoices}
        formulas={formulas}
        buyingInvoices={buyingInvoices}
        operatingExpenses={operatingExpenses}
        assetBreakdown={assetBreakdown}
        quickNotes={quickNotes}
        users={users}
        onRestoreData={handleRestoreData}
      />

      {/* Super-Toolkit: Customer WhatsApp Concierge Hub */}
      <WhatsAppTemplatesModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        invoices={invoices}
      />

      {/* Super-Toolkit: Operational Alerts & Dispatch Radar */}
      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        invoices={invoices}
        buyingInvoices={buyingInvoices}
        onNavigateToModule={setActiveModule}
        onSelectThermalInvoice={handleNavigateToThermal}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
      />

      {/* Mobile Menu & Drawer */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        allowedModules={currentUser.allowedModules}
        modules={MODULE_DEFINITIONS}
        currentUser={currentUser}
        allUsers={users}
        onSwitchUser={setCurrentUser}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleCalculator={() => setIsCalculatorOpen(!isCalculatorOpen)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        onOpenGoogleSheet={handleOpenGoogleSheet}
        unprintedCount={unprintedCount}
        onLogout={handleLogout}
      />

      {/* Mobile Bottom Navigation Dock */}
      <MobileBottomNav
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        unprintedCount={unprintedCount}
        notificationCount={totalAlertsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Footer (Hidden when printing thermal labels / cards) */}
      <footer className="no-print bg-neutral-950 border-t border-neutral-900 py-6 pb-24 md:pb-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-serif-luxury font-bold tracking-widest text-amber-400">
              {BRAND_DETAILS.name}
            </span>
            <span>• {BRAND_DETAILS.tagline}</span>
          </div>

          <div className="text-[11px] text-neutral-400">
            {BRAND_DETAILS.address} • Hotline: {BRAND_DETAILS.mobile} • {BRAND_DETAILS.email}
          </div>

          <div className="font-mono text-[10px] text-neutral-600">
            Enterprise System v1.0.0 • Session: {currentUser.fullName} ({currentUser.role})
          </div>
        </div>
      </footer>
    </div>
  );
}
