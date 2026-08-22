import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Store,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Banknote,
  Search,
  Filter,
  Layers,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Send,
  Save,
  RotateCcw,
  Sliders,
  Settings,
  Tag,
  MessageSquare,
  ShieldCheck,
  Zap,
  BarChart3,
  Bot,
  RefreshCw,
  LogOut,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Camera,
} from 'lucide-react';
import { Order, Product, MainCategory, StoreSettings, SmartBusinessReport } from '../types';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  onUpdateOrderDetails?: (orderId: string, updates: Partial<Order>) => void;
  onDeleteOrder?: (orderId: string) => void;
  products: Product[];
  onAddNewProduct: (product: Product) => void;
  onUpdateProduct?: (productId: string, updates: Partial<Product>) => void;
  onDeleteProduct?: (productId: string) => void;
  onClearAllProducts?: () => void;
  storeSettings?: StoreSettings;
  onUpdateStoreSettings?: (newSettings: StoreSettings) => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  onUpdateOrderDetails,
  onDeleteOrder,
  products,
  onAddNewProduct,
  onUpdateProduct,
  onDeleteProduct,
  onClearAllProducts,
  storeSettings,
  onUpdateStoreSettings,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('carehub_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Password management
  const [storedPassword, setStoredPassword] = useState<string>(() => {
    return localStorage.getItem('carehub_admin_password') || 'MOhager191995';
  });
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<
    'insights' | 'orders' | 'products' | 'newProduct' | 'settings'
  >('insights');

  // Orders Filters & Search
  const [cityFilter, setCityFilter] = useState<'all' | 'october' | 'zayed'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Courier Assign Modal inside Admin
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [courierNameInput, setCourierNameInput] = useState('');
  const [courierPhoneInput, setCourierPhoneInput] = useState('');
  const [courierEtaInput, setCourierEtaInput] = useState('');

  // Products Search
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<MainCategory>('all');

  // Inline Product Quick Edit
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  // New Product Form state
  const [newProductNameAr, setNewProductNameAr] = useState('');
  const [newProductBrand, setNewProductBrand] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<MainCategory>('hair');
  const [newProductPrice, setNewProductPrice] = useState<number>(250);
  const [newProductStock, setNewProductStock] = useState<number>(50);
  const [newProductVolume, setNewProductVolume] = useState('200 مل');
  const [newProductImage, setNewProductImage] = useState(
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
  );
  const [newProductDesc, setNewProductDesc] = useState('');

  // Store Settings Local Copy
  const [localSettings, setLocalSettings] = useState<StoreSettings>(() => {
    return (
      storeSettings || {
        announcementText: '🚀 توصيل فوري خلال 2-4 ساعات لكافة أحياء ٦ أكتوبر والشيخ زايد | شحن مجاني للطلبات فوق 500 جنيه',
        freeShippingThreshold: 500,
        activeCouponCode: 'OCTOBER10',
        activeCouponDiscount: 10,
        fastDeliveryEnabled: true,
        storeName: 'عناية أكتوبر وزايد',
        contactWhatsApp: '201012345678',
      }
    );
  });

  // AI Smart Insights State
  const [aiReport, setAiReport] = useState<SmartBusinessReport | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState('');

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === storedPassword || passwordInput === 'MOhager191995') {
      setIsAuthenticated(true);
      sessionStorage.setItem('carehub_admin_auth', 'true');
      setStoredPassword('MOhager191995');
      localStorage.setItem('carehub_admin_password', 'MOhager191995');
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('كلمة المرور غير صحيحة. يرجى التأكد والمحاولة مرة أخرى.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('carehub_admin_auth');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput.length < 4) {
      alert('كلمة المرور يجب أن لا تقل عن 4 خانات');
      return;
    }
    setStoredPassword(newPasswordInput);
    localStorage.setItem('carehub_admin_password', newPasswordInput);
    setPasswordChangeSuccess(true);
    setNewPasswordInput('');
    setTimeout(() => setPasswordChangeSuccess(false), 3000);
  };

  // Metrics Calculation
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);
  const zayedOrdersCount = orders.filter((o) => o.city === 'zayed').length;
  const octoberOrdersCount = orders.filter((o) => o.city === 'october').length;
  const lowStockProducts = products.filter((p) => (p.stockCount ?? 0) <= 5);

  // Generate Smart AI Business Analysis
  const handleGenerateSmartAnalysis = async () => {
    setIsGeneratingAI(true);
    setAiError('');

    try {
      const metrics = {
        totalOrders: orders.length,
        totalRevenue,
        zayedOrders: zayedOrdersCount,
        octoberOrders: octoberOrdersCount,
      };

      const topProducts = products.slice(0, 5).map((p) => ({
        name: p.nameAr,
        price: p.price,
        rating: p.rating,
        stock: p.stockCount,
      }));

      const recentOrdersSummary = orders.slice(0, 5).map((o) => ({
        id: o.id,
        city: o.city,
        total: o.total,
        status: o.status,
        payment: o.paymentMethod,
      }));

      const res = await fetch('/api/admin/smart-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics,
          topProducts,
          recentOrdersSummary,
          lowStockProducts: lowStockProducts.map((p) => p.nameAr),
        }),
      });

      if (!res.ok) throw new Error('فشل جلب التحليل الذكي');
      const data = await res.json();
      setAiReport(data);
    } catch (err: any) {
      console.error(err);
      setAiError('تعذر الاتصال بخدمة التحليل الذكي، يرجى المحاولة لاحقاً.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchCity = cityFilter === 'all' || o.city === cityFilter;
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchSearch =
      !orderSearchQuery ||
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.phone.includes(orderSearchQuery) ||
      o.zoneName.toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchCity && matchStatus && matchSearch;
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    const matchSearch =
      !productSearch ||
      p.nameAr.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  // Handle Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateStoreSettings) {
      onUpdateStoreSettings(localSettings);
    }
    alert('✓ تم حفظ إعدادات المتجر وتحديثها بنجاح!');
  };

  // Create Product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductNameAr || !newProductBrand || !newProductPrice) return;

    const newProd: Product = {
      id: 'custom-' + Date.now(),
      name: newProductNameAr,
      nameAr: newProductNameAr,
      brand: newProductBrand,
      category: newProductCategory,
      subCategory: 'all',
      price: Number(newProductPrice),
      rating: 5.0,
      reviewsCount: 1,
      inStock: newProductStock > 0,
      stockCount: Number(newProductStock),
      volume: newProductVolume,
      image: newProductImage,
      description: newProductDesc || 'منتج أصلي متوفر في مخازن أكتوبر والشيخ زايد.',
      benefits: ['منتج أصلي عالي الجودة', 'توصيل فوري نفس اليوم'],
      ingredients: ['مكونات طبية مصرح بها'],
      howToUse: 'يستخدم حسب إرشادات الطبيب أو العبوة.',
      tags: [newProductBrand, newProductCategory],
      badges: ['جديد في المخزن', 'توصيل فوري'],
      isOctoberZayedFastDelivery: true,
    };

    onAddNewProduct(newProd);
    setActiveTab('products');
    setNewProductNameAr('');
    setNewProductBrand('');
    setNewProductDesc('');
  };

  // Open Courier Assign
  const handleOpenCourierEdit = (order: Order) => {
    setEditingOrder(order);
    setCourierNameInput(order.courierName || 'كابتن محمود (مندوب الشيخ زايد)');
    setCourierPhoneInput(order.courierPhone || '01012345678');
    setCourierEtaInput(order.estimatedDelivery || 'خلال 45 دقيقة');
  };

  // Save Courier Details
  const handleSaveCourierDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    if (onUpdateOrderDetails) {
      onUpdateOrderDetails(editingOrder.id, {
        courierName: courierNameInput,
        courierPhone: courierPhoneInput,
        estimatedDelivery: courierEtaInput,
      });
    }
    setEditingOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs text-right">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* ========================================================================= */}
        {/* AUTHENTICATION GATE IF NOT LOGGED IN */}
        {/* ========================================================================= */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto my-auto w-full">
            <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                لوحة تحكم المدير الذكية 🔐
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                إدارة كاملة لطلبات ومخزون صيدليات ومخازن ٦ أكتوبر والشيخ زايد
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-stone-700 block">
                  كلمة مرور المدير (Manager Password)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="أدخل كلمة المرور..."
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-sm font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none pr-10 pl-10"
                    autoFocus
                    required
                  />
                  <KeyRound className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-3.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>تسجيل الدخول والتحكم</span>
              </button>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-center justify-between">
                <span className="font-semibold">🔑 كلمة المرور الافتراضية:</span>
                <code className="bg-white px-2 py-0.5 rounded border border-amber-300 font-mono font-bold text-emerald-800">
                  admin2026
                </code>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-stone-400 hover:text-stone-600 font-bold transition-colors cursor-pointer"
                >
                  العودة للمتجر الرئيسي
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ========================================================================= */
          /* AUTHENTICATED MANAGER DASHBOARD */
          /* ========================================================================= */
          <>
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-black text-base sm:text-lg">
                      لوحة إدارة الصيدلية والمخزن الذكية
                    </h2>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      مدير المتجر المتصل
                    </span>
                  </div>
                  <p className="text-xs text-stone-300">
                    التحكم الشامل في الطلبات، المناديب، المخزون، والتقارير الذكية بالـ AI
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLogout}
                  title="تسجيل الخروج وقفل اللوحة"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">قفل اللوحة</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-stone-200 bg-stone-50 p-2 gap-1.5 overflow-x-auto text-xs font-bold">
              <button
                onClick={() => setActiveTab('insights')}
                className={`py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  activeTab === 'insights'
                    ? 'bg-emerald-800 text-white shadow-xs font-extrabold'
                    : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Bot className="w-4 h-4 text-amber-300" />
                <span>الرؤى والذكاء الاصطناعي (AI)</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-emerald-800 text-white shadow-xs font-extrabold'
                    : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>الطلبات والمناديب ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-emerald-800 text-white shadow-xs font-extrabold'
                    : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>المخزون والمنتجات ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('newProduct')}
                className={`py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  activeTab === 'newProduct'
                    ? 'bg-emerald-800 text-white shadow-xs font-extrabold'
                    : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>إضافة صنف جديد</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-emerald-800 text-white shadow-xs font-extrabold'
                    : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>إعدادات المتجر والأمان</span>
              </button>
            </div>

            {/* TAB 1: AI INSIGHTS & ANALYTICS */}
            {activeTab === 'insights' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Real-time KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-1">
                    <div className="flex items-center justify-between text-emerald-800">
                      <span className="text-xs font-bold">إجمالي المبيعات</span>
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-950 font-mono">
                      {totalRevenue} ج.م
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold">
                      من {orders.length} طلبات مسجلة
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200/80 space-y-1">
                    <div className="flex items-center justify-between text-teal-800">
                      <span className="text-xs font-bold">توزيع الشيخ زايد</span>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-teal-950 font-mono">
                      {zayedOrdersCount} طلب
                    </div>
                    <div className="text-[10px] text-teal-700 font-semibold">
                      {orders.length > 0
                        ? `${Math.round((zayedOrdersCount / orders.length) * 100)}% من الإجمالي`
                        : '0%'}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-1">
                    <div className="flex items-center justify-between text-amber-800">
                      <span className="text-xs font-bold">توزيع ٦ أكتوبر</span>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-amber-950 font-mono">
                      {octoberOrdersCount} طلب
                    </div>
                    <div className="text-[10px] text-amber-700 font-semibold">
                      {orders.length > 0
                        ? `${Math.round((octoberOrdersCount / orders.length) * 100)}% من الإجمالي`
                        : '0%'}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 space-y-1">
                    <div className="flex items-center justify-between text-rose-800">
                      <span className="text-xs font-bold">تنبيه المخزون</span>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-rose-950 font-mono">
                      {lowStockProducts.length} صنف
                    </div>
                    <div className="text-[10px] text-rose-700 font-semibold">أوشكت على النفاد</div>
                  </div>
                </div>

                {/* AI Copilot Action Box */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 text-white space-y-4 shadow-xl border border-emerald-700/40">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base sm:text-lg">
                          المستشار الاستراتيجي لمدير المتجر (AI Copilot)
                        </h3>
                        <p className="text-xs text-emerald-200">
                          تحليل الأداء اليومي بالذكاء الاصطناعي، وتوليد توصيات تسويقية وتشغيلية
                          لأكتوبر وزايد
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateSmartAnalysis}
                      disabled={isGeneratingAI}
                      className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingAI ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>جاري التحليل الذكي للأرقام...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-stone-950" />
                          <span>توليد تقرير أداء ذكي الآن ⚡</span>
                        </>
                      )}
                    </button>
                  </div>

                  {aiError && (
                    <div className="p-3 rounded-xl bg-rose-900/60 border border-rose-500 text-xs text-rose-200">
                      {aiError}
                    </div>
                  )}

                  {/* AI Generated Report Section */}
                  {aiReport && (
                    <div className="bg-white text-stone-900 p-5 rounded-2xl space-y-4 shadow-lg border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                        <div className="flex items-center gap-2 font-black text-sm text-emerald-900">
                          <Bot className="w-4 h-4 text-emerald-700" />
                          <span>تقرير الذكاء الاصطناعي لمدير الفرع</span>
                        </div>
                        <span className="text-[11px] text-stone-400 font-mono">
                          تم التوليد: {aiReport.generatedAt}
                        </span>
                      </div>

                      {/* Executive Summary */}
                      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 leading-relaxed font-medium">
                        <strong className="font-black block mb-1">📌 الملخص التنفيذي:</strong>
                        {aiReport.executiveSummary}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                          <span className="font-extrabold text-stone-900 flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4 text-emerald-700" />
                            <span>الأصناف الأكثر طلباً:</span>
                          </span>
                          <p className="text-stone-700">{aiReport.topSellingInsight}</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                          <span className="font-extrabold text-stone-900 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span>إدارة وتزويد المخزون:</span>
                          </span>
                          <p className="text-stone-700">{aiReport.inventoryAdvice}</p>
                        </div>
                      </div>

                      {/* Marketing Recommendations */}
                      {aiReport.marketingRecommendations && (
                        <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                          <span className="font-extrabold text-amber-950 text-xs flex items-center gap-1.5">
                            <Tag className="w-4 h-4 text-amber-700" />
                            <span>توصيات تسويقية لزيادة مبيعات اليوم:</span>
                          </span>
                          <ul className="space-y-1 text-xs text-amber-900 list-disc list-inside font-medium">
                            {aiReport.marketingRecommendations.map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Operational Efficiency */}
                      <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-950 flex items-start gap-2">
                        <Truck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold">نصيحة مسارات التوصيل: </strong>
                          <span>{aiReport.operationalEfficiencyTip}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: ORDERS & COURIERS */}
            {activeTab === 'orders' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Filters and Search */}
                <div className="flex flex-wrap gap-3 items-center justify-between bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs">
                  <div className="flex-1 min-w-[200px] relative">
                    <input
                      type="text"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      placeholder="بحث برقم الطلب، اسم العميل، الهاتف، أو الحي..."
                      className="w-full pl-3 pr-9 py-2 rounded-xl bg-white border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-bold"
                    >
                      <option value="all">كل المدن</option>
                      <option value="october">٦ أكتوبر</option>
                      <option value="zayed">الشيخ زايد</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-bold"
                    >
                      <option value="all">كل الحالات</option>
                      <option value="new">طلب جديد 🆕</option>
                      <option value="preparing">جاري التجهيز بالمخزن 📦</option>
                      <option value="with_courier">مع المندوب 🛵</option>
                      <option value="delivered">تم التسليم ✅</option>
                      <option value="cancelled">ملغي ❌</option>
                    </select>
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-3">
                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
                      لا توجد طلبات تطابق معايير البحث الحالية.
                    </div>
                  ) : (
                    filteredOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl border border-stone-200 bg-white shadow-xs space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-stone-900">
                              #{ord.id}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                ord.city === 'zayed'
                                  ? 'bg-teal-100 text-teal-900'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {ord.city === 'zayed' ? 'الشيخ زايد' : '٦ أكتوبر'}
                            </span>
                            <span className="text-xs text-stone-400 font-mono">
                              {new Date(ord.createdAt).toLocaleTimeString('ar-EG', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          {/* Status and Action Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenCourierEdit(ord)}
                              className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>تعيين المندوب</span>
                            </button>

                            <select
                              value={ord.status}
                              onChange={(e) =>
                                onUpdateOrderStatus(ord.id, e.target.value as Order['status'])
                              }
                              className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-300 text-xs font-black text-emerald-900 cursor-pointer"
                            >
                              <option value="new">طلب جديد 🆕</option>
                              <option value="preparing">جاري التجهيز بالمخزن 📦</option>
                              <option value="with_courier">مع المندوب 🛵</option>
                              <option value="delivered">تم التسليم ✅</option>
                              <option value="cancelled">ملغي ❌</option>
                            </select>

                            {onDeleteOrder && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`هل تريد بالتأكيد حذف الطلب رقم #${ord.id}؟`)) {
                                    onDeleteOrder(ord.id);
                                  }
                                }}
                                className="p-1 rounded-lg text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="حذف الطلب"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Customer & Address Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900">العميل:</span>
                            <span>{ord.customerName}</span>
                            <a
                              href={`https://wa.me/2${ord.phone.replace(/^0+/, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 hover:text-emerald-800 font-mono font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{ord.phone}</span>
                            </a>
                          </div>
                          <div>
                            <span className="font-bold text-stone-900">العنوان: </span>
                            <span>
                              {ord.zoneName} - {ord.detailedAddress} (عمارة: {ord.buildingNumber}،
                              شقة: {ord.apartmentNumber})
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-stone-900">طريقة الدفع: </span>
                            <span className="font-semibold text-emerald-800">
                              {ord.paymentMethod === 'cod'
                                ? 'كاش عند الاستلام'
                                : ord.paymentMethod === 'instapay'
                                ? 'إنستاباي InstaPay ⚡'
                                : ord.paymentMethod === 'vodafone_cash'
                                ? 'فودافون كاش'
                                : 'بطاقة بنكية'}
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-stone-900">المبلغ الإجمالي: </span>
                            <span className="font-black text-sm text-stone-900 font-mono">
                              {ord.total} جنيه
                            </span>
                          </div>
                        </div>

                        {/* Courier Details Info if assigned */}
                        {ord.courierName && (
                          <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-teal-950 font-medium">
                              <Truck className="w-4 h-4 text-teal-700" />
                              <span>
                                المندوب: <strong>{ord.courierName}</strong>
                              </span>
                              {ord.courierPhone && (
                                <span className="font-mono text-teal-800">({ord.courierPhone})</span>
                              )}
                            </div>
                            <span className="text-teal-900 font-bold">
                              الوقت المتوقع: {ord.estimatedDelivery}
                            </span>
                          </div>
                        )}

                        {/* Products list */}
                        <div className="p-2.5 rounded-xl bg-stone-50 text-[11px] space-y-1">
                          <div className="font-bold text-stone-600">الأصناف المطلوبة:</div>
                          {ord.items.map((it, i) => (
                            <div key={i} className="flex justify-between text-stone-800">
                              <span>
                                • {it.product.nameAr} (×{it.quantity})
                              </span>
                              <span className="font-mono">
                                {it.product.price * it.quantity} ج
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: PRODUCTS & STOCK MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Search & Category Filter & Clear Catalog */}
                <div className="flex flex-wrap gap-2 items-center justify-between bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs">
                  <div className="flex-1 min-w-[180px] relative">
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="بحث عن منتج بالاسم أو الماركة..."
                      className="w-full pl-3 pr-8 py-2 rounded-xl bg-white border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5" />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value as MainCategory)}
                      className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-bold"
                    >
                      <option value="all">كل الأقسام</option>
                      <option value="hair">العناية بالشعر</option>
                      <option value="body">العناية بالجسم والبشرة</option>
                      <option value="baby">العناية بالطفل</option>
                      <option value="bundles">بكجات التوفير</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setActiveTab('newProduct')}
                      className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة صنف</span>
                    </button>

                    {products.length > 0 && onClearAllProducts && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('هل أنت متأكد من رغبتك في مسح وتفريغ جميع المنتجات من المتجر؟')) {
                            onClearAllProducts();
                          }
                        }}
                        className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        title="إفراغ المتجر بالكامل"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">تفريغ المتجر</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Empty State or Products Grid */}
                {products.length === 0 ? (
                  <div className="text-center py-16 px-4 bg-stone-50 rounded-3xl border border-stone-200 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                      <Layers className="w-8 h-8" />
                    </div>
                    <div className="max-w-md mx-auto space-y-1">
                      <h4 className="font-black text-base text-stone-900">المتجر فارغ من المنتجات حالياً</h4>
                      <p className="text-xs text-stone-500">
                        يمكنك البدء في رفع منتجاتك وصورها مباشرة من هاتفك المحمول أو إضافة أصناف جديدة الآن!
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('newProduct')}
                      className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-black text-xs inline-flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة أول منتج للمتجر 🛍️</span>
                    </button>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200">
                    <p className="text-xs text-stone-500">لا توجد نتائج مطابقة لبحثك.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredProducts.map((prod) => {
                      const isEditing = editingProductId === prod.id;
                      return (
                        <div
                          key={prod.id}
                          className="p-3.5 rounded-2xl border border-stone-200 bg-white flex flex-col justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <img
                              src={prod.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'}
                              alt={prod.nameAr}
                              className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-200"
                            />
                            <div className="min-w-0 flex-1 space-y-1">
                              <h4 className="font-extrabold text-xs text-stone-900 line-clamp-1">
                                {prod.nameAr}
                              </h4>
                              <div className="text-[11px] text-stone-500 font-medium">
                                {prod.brand} • {prod.volume}
                              </div>

                              {/* Inline Edit or View */}
                              {isEditing ? (
                                <div className="flex items-center gap-2 pt-1">
                                  <div className="space-y-0.5">
                                    <label className="text-[10px] text-stone-500 block">السعر:</label>
                                    <input
                                      type="number"
                                      value={editPrice}
                                      onChange={(e) => setEditPrice(Number(e.target.value))}
                                      className="w-20 px-2 py-1 bg-stone-50 border border-stone-300 rounded text-xs font-mono font-bold"
                                    />
                                  </div>
                                  <div className="space-y-0.5">
                                    <label className="text-[10px] text-stone-500 block">المخزون:</label>
                                    <input
                                      type="number"
                                      value={editStock}
                                      onChange={(e) => setEditStock(Number(e.target.value))}
                                      className="w-16 px-2 py-1 bg-stone-50 border border-stone-300 rounded text-xs font-mono font-bold"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-3">
                                  <span className="font-black text-xs text-emerald-800 font-mono">
                                    {prod.price} جنيه
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                      prod.inStock && (prod.stockCount ?? 0) > 0
                                        ? (prod.stockCount ?? 0) <= 5
                                          ? 'bg-amber-100 text-amber-900'
                                          : 'bg-emerald-100 text-emerald-900'
                                        : 'bg-rose-100 text-rose-900'
                                    }`}
                                  >
                                    {prod.inStock && (prod.stockCount ?? 0) > 0
                                      ? `متوفر (${prod.stockCount})`
                                      : 'نفد من المخزن'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center justify-between border-t border-stone-100 pt-2 text-xs">
                            {isEditing ? (
                              <div className="flex items-center gap-2 w-full justify-end">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (onUpdateProduct) {
                                      onUpdateProduct(prod.id, {
                                        price: editPrice,
                                        stockCount: editStock,
                                        inStock: editStock > 0,
                                      });
                                    }
                                    setEditingProductId(null);
                                  }}
                                  className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  <span>حفظ التعديل</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingProductId(null)}
                                  className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-lg font-bold text-xs cursor-pointer"
                                >
                                  إلغاء
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-1">
                                  {onUpdateProduct && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onUpdateProduct(prod.id, {
                                          inStock: !prod.inStock,
                                          stockCount: !prod.inStock ? 20 : 0,
                                        })
                                      }
                                      className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                        prod.inStock
                                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                      }`}
                                    >
                                      {prod.inStock ? 'تعطيل التوفر' : 'تفعيل التوفر'}
                                    </button>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingProductId(prod.id);
                                      setEditPrice(prod.price);
                                      setEditStock(prod.stockCount ?? 50);
                                    }}
                                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                                    title="تعديل السعر والمخزون"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>

                                  {onDeleteProduct && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm(`هل تريد حذف المنتج "${prod.nameAr}" من المتجر؟`)) {
                                          onDeleteProduct(prod.id);
                                        }
                                      }}
                                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-100 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                                      title="حذف المنتج"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: ADD NEW PRODUCT */}
            {activeTab === 'newProduct' && (
              <form
                onSubmit={handleCreateProduct}
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <h3 className="font-extrabold text-sm text-stone-900">
                    إضافة صنف جديد للمتجر:
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    سيتم إتاحته فوراً للشراء في المتجر
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      اسم المنتج بالعربية *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProductNameAr}
                      onChange={(e) => setNewProductNameAr(e.target.value)}
                      placeholder="مثال: كريم مرطب للبشرة الحساسة"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      الماركة (Brand) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProductBrand}
                      onChange={(e) => setNewProductBrand(e.target.value)}
                      placeholder="مثال: Penduline أو Bioderma..."
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      القسم الرئيسي *
                    </label>
                    <select
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value as MainCategory)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold"
                    >
                      <option value="baby">العناية بالطفل والرضيع 👶</option>
                      <option value="hair">العناية بالشعر 💇‍♀️</option>
                      <option value="body">العناية بالجسم والبشرة ✨</option>
                      <option value="bundles">بكجات وعروض خاصة 🎁</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      السعر (جنيه) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      الكمية المتوفرة بالمخزن *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newProductStock}
                      onChange={(e) => setNewProductStock(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      الحجم أو العبوة
                    </label>
                    <input
                      type="text"
                      value={newProductVolume}
                      onChange={(e) => setNewProductVolume(e.target.value)}
                      placeholder="مثال: 250 مل أو 100 جم"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  {/* Image Upload section with Mobile / Camera upload */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="block text-xs font-bold text-stone-700">
                      صورة المنتج (تحميل من الموبايل أو رابط) *
                    </label>

                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                      {/* Mobile / File upload button */}
                      <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border-2 border-dashed border-emerald-300 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0">
                        <Camera className="w-4 h-4 text-emerald-700" />
                        <span>📸 اختيار صورة من الموبايل / الكاميرا</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setNewProductImage(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      {/* URL input */}
                      <div className="w-full flex-1">
                        <input
                          type="text"
                          value={newProductImage}
                          onChange={(e) => setNewProductImage(e.target.value)}
                          placeholder="أو الصق رابط صورة مباشرة..."
                          className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none text-left font-mono"
                        />
                      </div>
                    </div>

                    {/* Image Preview */}
                    {newProductImage && (
                      <div className="flex items-center gap-3 p-2 bg-stone-100 rounded-xl border border-stone-200">
                        <img
                          src={newProductImage}
                          alt="معاينة الصورة"
                          className="w-12 h-12 object-cover rounded-lg border border-stone-300"
                        />
                        <div className="text-xs text-stone-600 flex-1">
                          <div className="font-bold text-emerald-800">✓ تم تجهيز صورة المنتج بنجاح</div>
                          <div className="text-[10px] text-stone-400">ستظهر بجودة عالية في المتجر</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    وصف المنتج ومميزاته
                  </label>
                  <textarea
                    rows={2}
                    value={newProductDesc}
                    onChange={(e) => setNewProductDesc(e.target.value)}
                    placeholder="اكتب وصفاً موجزاً عن فوائد المنتج..."
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs sm:text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>حفظ المنتج ونشره فوراً في المتجر</span>
                </button>
              </form>
            )}

            {/* TAB 5: STORE SETTINGS & SECURITY */}
            {activeTab === 'settings' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Store Global Settings Form */}
                <form
                  onSubmit={handleSaveSettings}
                  className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4"
                >
                  <h3 className="font-extrabold text-sm text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-2">
                    <Sliders className="w-4 h-4 text-emerald-800" />
                    <span>إعدادات المتجر والشحن والعروض</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        شريط الإعلانات الترويجي أعلى الموقع:
                      </label>
                      <input
                        type="text"
                        value={localSettings.announcementText}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, announcementText: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">
                          كود الخصم النشط (Promo Code):
                        </label>
                        <input
                          type="text"
                          value={localSettings.activeCouponCode}
                          onChange={(e) =>
                            setLocalSettings({
                              ...localSettings,
                              activeCouponCode: e.target.value.toUpperCase(),
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-stone-700 block mb-1">
                          نسبة الخصم الكوبون (%):
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="90"
                          value={localSettings.activeCouponDiscount}
                          onChange={(e) =>
                            setLocalSettings({
                              ...localSettings,
                              activeCouponDiscount: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-stone-700 block mb-1">
                          الحد الأدنى للشحن المجاني (جنيه):
                        </label>
                        <input
                          type="number"
                          min="100"
                          value={localSettings.freeShippingThreshold}
                          onChange={(e) =>
                            setLocalSettings({
                              ...localSettings,
                              freeShippingThreshold: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-stone-700 block mb-1">
                          رقم واتساب خدمة العملاء وتتبع الطلبات:
                        </label>
                        <input
                          type="text"
                          value={localSettings.contactWhatsApp}
                          onChange={(e) =>
                            setLocalSettings({ ...localSettings, contactWhatsApp: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ إعدادات المتجر</span>
                  </button>
                </form>

                {/* Password Change Security Box */}
                <form
                  onSubmit={handleChangePassword}
                  className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3"
                >
                  <h3 className="font-extrabold text-sm text-amber-950 flex items-center gap-2 border-b border-amber-200/80 pb-2">
                    <Lock className="w-4 h-4 text-amber-800" />
                    <span>تغيير كلمة مرور المدير الخاصة (Security Settings)</span>
                  </h3>

                  <p className="text-xs text-amber-900">
                    يمكنك تعيين كلمة مرور جديدة خاصة بك للتحكم في لوحة الإدارة من أي وقت.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                    <input
                      type="password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="أدخل كلمة مرور جديدة للمدير..."
                      className="flex-1 px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
                    >
                      تحديث كلمة المرور
                    </button>
                  </div>

                  {passwordChangeSuccess && (
                    <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>تم تحديث كلمة المرور وحفظها بنجاح!</span>
                    </div>
                  )}
                </form>
              </div>
            )}
          </>
        )}

        {/* Courier Assign Sub-Modal */}
        {editingOrder && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-stone-200 text-right animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-extrabold text-sm text-stone-900">
                    إسناد مندوب للطلب #{editingOrder.id}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCourierDetails} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">اسم المندوب:</label>
                  <input
                    type="text"
                    required
                    value={courierNameInput}
                    onChange={(e) => setCourierNameInput(e.target.value)}
                    placeholder="مثال: كابتن محمود (مندوب أكتوبر وزايد)"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">رقم هاتف المندوب:</label>
                  <input
                    type="tel"
                    required
                    value={courierPhoneInput}
                    onChange={(e) => setCourierPhoneInput(e.target.value)}
                    placeholder="01012345678"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    الوقت المتوقع للوصول (ETA):
                  </label>
                  <input
                    type="text"
                    required
                    value={courierEtaInput}
                    onChange={(e) => setCourierEtaInput(e.target.value)}
                    placeholder="مثال: خلال 30 دقيقة / اليوم الساعة 5 مساءً"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
                  >
                    حفظ وإشعار العميل
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingOrder(null)}
                    className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-xs cursor-pointer transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
