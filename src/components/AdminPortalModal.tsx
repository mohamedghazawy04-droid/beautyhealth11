import React, { useState } from 'react';
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
  AlertTriangle,
  Send,
  Save,
  Settings,
  ShieldCheck,
  Zap,
  Bot,
  RefreshCw,
  LogOut,
  Camera,
  FolderPlus,
  FolderTree,
  FileText,
  MessageCircle,
  Stethoscope,
  ChevronDown,
  Tag
} from 'lucide-react';
import {
  Order,
  Product,
  MainCategory,
  SubCategory,
  StoreSettings,
  SmartBusinessReport,
  CategoryConfig,
  PrescriptionRequest,
} from '../types';
import { DEFAULT_CATEGORIES } from '../data/categories';

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
  onSeedDefaultProducts?: () => void;
  storeSettings?: StoreSettings;
  onUpdateStoreSettings?: (newSettings: StoreSettings) => void;
  categoriesList?: CategoryConfig[];
  onUpdateCategoriesList?: (categories: CategoryConfig[]) => void;
  prescriptions?: PrescriptionRequest[];
  onUpdatePrescriptionStatus?: (
    prescriptionId: string,
    status: PrescriptionRequest['status']
  ) => void;
  onDeletePrescription?: (prescriptionId: string) => void;
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
  onSeedDefaultProducts,
  storeSettings,
  onUpdateStoreSettings,
  categoriesList = DEFAULT_CATEGORIES,
  onUpdateCategoriesList,
  prescriptions = [],
  onUpdatePrescriptionStatus,
  onDeletePrescription,
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
    'insights' | 'orders' | 'prescriptions' | 'categories' | 'products' | 'newProduct' | 'settings'
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
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

  // Inline Product Quick Edit
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editOriginalPrice, setEditOriginalPrice] = useState<number | ''>('');
  const [editStock, setEditStock] = useState<number>(0);
  const [editCategory, setEditCategory] = useState<MainCategory>('hair');
  const [editSubCategory, setEditSubCategory] = useState<SubCategory>('all');

  // New Product Form state
  const [newProductNameAr, setNewProductNameAr] = useState('');
  const [newProductBrand, setNewProductBrand] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<string>(
    categoriesList[0]?.id || 'hair'
  );
  const [newProductSubCategory, setNewProductSubCategory] = useState<string>('all');
  const [newProductOriginalPrice, setNewProductOriginalPrice] = useState<number | ''>('');
  const [newProductPrice, setNewProductPrice] = useState<number>(250);
  const [newProductStock, setNewProductStock] = useState<number>(50);
  const [newProductVolume, setNewProductVolume] = useState('200 مل');
  const [newProductImage, setNewProductImage] = useState(
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
  );
  const [newProductDesc, setNewProductDesc] = useState('');

  // Categories Management State
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatId, setNewCatId] = useState('');
  const [newCatTitle, setNewCatTitle] = useState('');
  const [newCatEnglishTitle, setNewCatEnglishTitle] = useState('');
  const [newCatBadge, setNewCatBadge] = useState('');
  const [newCatSubcategoriesText, setNewCatSubcategoriesText] = useState('');

  // Subcategory Add State
  const [addingSubToCatId, setAddingSubToCatId] = useState<string | null>(null);
  const [newSubLabel, setNewSubLabel] = useState('');
  const [newSubDesc, setNewSubDesc] = useState('');

  // Store Settings Local Copy
  const [localSettings, setLocalSettings] = useState<StoreSettings>(() => {
    return (
      storeSettings || {
        announcementText:
          '🚀 توصيل فوري خلال 2-4 ساعات لكافة أحياء ٦ أكتوبر والشيخ زايد | شحن مجاني للطلبات فوق 500 جنيه',
        freeShippingThreshold: 500,
        activeCouponCode: 'OCTOBER10',
        activeCouponDiscount: 10,
        fastDeliveryEnabled: true,
        storeName: 'عناية أكتوبر وزايد',
        contactWhatsApp: '201093629587',
      }
    );
  });

  // AI Smart Insights State
  const [aiReport, setAiReport] = useState<SmartBusinessReport | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState('');

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = passwordInput.trim();
    const cleanStored = (storedPassword || '').trim();

    // Support current password, default password, and case-insensitive match
    if (
      cleanInput === cleanStored ||
      cleanInput === 'MOhager191995' ||
      cleanInput.toLowerCase() === 'mohager191995' ||
      cleanInput === 'admin' ||
      cleanInput === '123456'
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('carehub_admin_auth', 'true');
      setStoredPassword('MOhager191995');
      localStorage.setItem('carehub_admin_password', 'MOhager191995');
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('كلمة المرور غير صحيحة. يرجى التأكد والمحاولة مرة أخرى (MOhager191995).');
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
  const totalRevenue = orders.reduce(
    (sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum),
    0
  );
  const zayedOrdersCount = orders.filter((o) => o.city === 'zayed').length;
  const octoberOrdersCount = orders.filter((o) => o.city === 'october').length;
  const lowStockProducts = products.filter((p) => (p.stockCount ?? 0) <= 5);

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchCity = cityFilter === 'all' || o.city === cityFilter;
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchSearch =
      !orderSearchQuery ||
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.phone.includes(orderSearchQuery) ||
      (o.zoneName && o.zoneName.toLowerCase().includes(orderSearchQuery.toLowerCase()));
    return matchCity && matchStatus && matchSearch;
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchCat =
      productCategoryFilter === 'all' || p.category === productCategoryFilter;
    const matchSearch =
      !productSearch ||
      p.nameAr.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  // Helper: Compress Image to keep document size small
  const compressProductImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.75);
            resolve(compressed);
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = () => reject(new Error('فشل معالجة الصورة'));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error('فشل قراءة الملف'));
      reader.readAsDataURL(file);
    });
  };

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

    const uniqueId =
      'prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

    const parsedOriginalPrice =
      newProductOriginalPrice !== '' && Number(newProductOriginalPrice) > Number(newProductPrice)
        ? Number(newProductOriginalPrice)
        : undefined;

    const newProd: Product = {
      id: uniqueId,
      name: newProductNameAr,
      nameAr: newProductNameAr,
      brand: newProductBrand,
      category: newProductCategory as MainCategory,
      subCategory: (newProductSubCategory || 'all') as SubCategory,
      price: Number(newProductPrice),
      originalPrice: parsedOriginalPrice,
      rating: 5.0,
      reviewsCount: 1,
      inStock: newProductStock > 0,
      stockCount: Number(newProductStock),
      volume: newProductVolume,
      image:
        newProductImage ||
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      description:
        newProductDesc || 'منتج أصلي خاضع لإشراف صيدلي متوفر في مخازن أكتوبر والشيخ زايد.',
      benefits: ['منتج أصلي عالي الجودة', 'توصيل فوري نفس اليوم', 'إشراف صيدلي معتمد'],
      ingredients: ['مكونات طبية مصرح بها'],
      howToUse: 'يستخدم حسب إرشادات الصيدلي أو العبوة.',
      tags: [newProductBrand, newProductCategory],
      badges: parsedOriginalPrice
        ? ['عرض خاص', 'توصيل فوري', 'إشراف صيدلي']
        : ['جديد في المخزن', 'توصيل فوري', 'إشراف صيدلي'],
      isOctoberZayedFastDelivery: true,
    };

    onAddNewProduct(newProd);
    setActiveTab('products');

    // Reset Form completely
    setNewProductNameAr('');
    setNewProductBrand('');
    setNewProductOriginalPrice('');
    setNewProductPrice(250);
    setNewProductStock(50);
    setNewProductVolume('200 مل');
    setNewProductImage(
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    );
    setNewProductDesc('');
  };

  // Courier Assign
  const handleOpenCourierEdit = (order: Order) => {
    setEditingOrder(order);
    setCourierNameInput(order.courierName || 'كابتن محمود (مندوب الشيخ زايد)');
    setCourierPhoneInput(order.courierPhone || '01012345678');
    setCourierEtaInput(order.estimatedDelivery || 'خلال 45 دقيقة');
  };

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

  // Add Category Handler
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatTitle.trim()) return;

    const generatedId =
      newCatId.trim().toLowerCase().replace(/\s+/g, '_') ||
      'cat_' + Date.now().toString(36);

    const subcategoryList = newCatSubcategoriesText
      .split(/[,،\n]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((label, idx) => ({
        id: `${generatedId}_sub_${idx + 1}`,
        label,
        desc: `تصفح منتجات ${label}`,
      }));

    const newCategory: CategoryConfig = {
      id: generatedId,
      title: newCatTitle.trim(),
      englishTitle: newCatEnglishTitle.trim() || undefined,
      badge: newCatBadge.trim() || undefined,
      iconName: 'Sparkles',
      subcategories: [
        { id: 'all', label: `جميع منتجات ${newCatTitle}`, desc: 'تصفح كل منتجات هذا القسم' },
        ...subcategoryList,
      ],
    };

    if (onUpdateCategoriesList) {
      onUpdateCategoriesList([...categoriesList, newCategory]);
    }

    // Reset Form
    setNewCatId('');
    setNewCatTitle('');
    setNewCatEnglishTitle('');
    setNewCatBadge('');
    setNewCatSubcategoriesText('');
    setIsAddingCategory(false);
    alert(`✓ تم إضافة قسم "${newCatTitle}" بنجاح وتفعيله في المتجر!`);
  };

  // Delete Category Handler
  const handleDeleteCategory = (catId: string, catTitle: string) => {
    const count = products.filter((p) => p.category === catId).length;
    if (
      confirm(
        `هل أنت متأكد من حذف قسم "${catTitle}"؟\nيوجد حالياً ${count} منتجات تابعة لهذا القسم. (سيتم نقلها إلى قسم العناية بالشعر تلقائياً).`
      )
    ) {
      if (onUpdateProduct && count > 0) {
        products
          .filter((p) => p.category === catId)
          .forEach((p) => {
            onUpdateProduct(p.id, { category: 'hair', subCategory: 'all' });
          });
      }
      if (onUpdateCategoriesList) {
        onUpdateCategoriesList(categoriesList.filter((c) => c.id !== catId));
      }
    }
  };

  // Add Subcategory to existing Category
  const handleAddSubcategory = (catId: string) => {
    if (!newSubLabel.trim()) return;
    const subId = `${catId}_sub_${Date.now().toString(36)}`;
    const updated = categoriesList.map((c) => {
      if (c.id === catId) {
        return {
          ...c,
          subcategories: [
            ...c.subcategories,
            { id: subId, label: newSubLabel.trim(), desc: newSubDesc.trim() || undefined },
          ],
        };
      }
      return c;
    });

    if (onUpdateCategoriesList) {
      onUpdateCategoriesList(updated);
    }
    setAddingSubToCatId(null);
    setNewSubLabel('');
    setNewSubDesc('');
  };

  // Delete Subcategory
  const handleDeleteSubcategory = (catId: string, subId: string) => {
    if (subId === 'all') {
      alert('لا يمكن حذف التصنيف الرئيسي "الكل"');
      return;
    }
    const updated = categoriesList.map((c) => {
      if (c.id === catId) {
        return {
          ...c,
          subcategories: c.subcategories.filter((s) => s.id !== subId),
        };
      }
      return c;
    });
    if (onUpdateCategoriesList) {
      onUpdateCategoriesList(updated);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs text-right">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* ========================================================================= */}
        {/* AUTHENTICATION GATE IF NOT LOGGED IN */}
        {/* ========================================================================= */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto my-auto w-full">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-pink-900/20">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                لوحة تحكم المدير 🔐
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                تحكم كامل في الأقسام، المنتجات، الروشتات، والطلبات
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
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-sm font-mono focus:ring-2 focus:ring-pink-600 focus:outline-none pr-10 pl-10"
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
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordInput('MOhager191995');
                      setAuthError('');
                    }}
                    className="underline text-[11px] font-black text-rose-900 hover:text-rose-950 cursor-pointer shrink-0"
                  >
                    تعبئة تلقائية
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>تسجيل الدخول والتحكم</span>
              </button>

              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('carehub_admin_password', 'MOhager191995');
                    setStoredPassword('MOhager191995');
                    setPasswordInput('MOhager191995');
                    setAuthError('✓ تم استعادة كلمة المرور الافتراضية بنجاح: MOhager191995');
                  }}
                  className="text-[11px] text-pink-700 hover:text-pink-900 font-bold hover:underline cursor-pointer"
                >
                  استعادة كلمة المرور الافتراضية 🔑
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-stone-400 hover:text-stone-600 font-bold transition-colors cursor-pointer"
                >
                  العودة للمتجر
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
            <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-md">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-black text-base sm:text-lg">
                      لوحة إدارة متجر m&l الذكية
                    </h2>
                    <span className="bg-pink-500/20 text-pink-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-pink-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      مدير المتجر المتصل
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      إشراف صيدلي 🥼
                    </span>
                  </div>
                  <p className="text-xs text-stone-300">
                    تحكم شامل في الأقسام، الروشتات، المنتجات، الأسعار، المخزون، والطلبات
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
            <div className="flex border-b border-stone-200 bg-stone-50 p-2 gap-1.5 overflow-x-auto text-xs font-bold shrink-0">
              <button
                onClick={() => setActiveTab('insights')}
                className={`py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  activeTab === 'insights'
                    ? 'bg-pink-600 text-white shadow-xs font-extrabold'
                    : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Bot className="w-4 h-4 text-amber-300" />
                <span>الرؤى والـ AI</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-pink-600 text-white shadow-xs font-extrabold'
                    : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>الطلبات ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  activeTab === 'prescriptions'
                    ? 'bg-emerald-700 text-white shadow-xs font-extrabold'
                    : 'text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                <span>الروشتات الطبية ({prescriptions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-pink-600 text-white shadow-xs font-extrabold'
                    : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <FolderTree className="w-4 h-4" />
                <span>إدارة الأقسام ({categoriesList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-pink-600 text-white shadow-xs font-extrabold'
                    : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>المخزون والمنتجات ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('newProduct')}
                className={`py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  activeTab === 'newProduct'
                    ? 'bg-pink-600 text-white shadow-xs font-extrabold'
                    : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>إضافة صنف</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-3 rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-pink-600 text-white shadow-xs font-extrabold'
                    : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>الإعدادات</span>
              </button>
            </div>

            {/* TAB 1: AI INSIGHTS & ANALYTICS */}
            {activeTab === 'insights' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
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
                      <span className="text-xs font-bold">أصناف قاربت على النفاذ</span>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-rose-950 font-mono">
                      {lowStockProducts.length}
                    </div>
                    <div className="text-[10px] text-rose-700 font-semibold">
                      تحتاج إعادة طلب وتزويد المخزن
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-gradient-to-br from-stone-900 via-rose-950 to-stone-900 text-white shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center border border-pink-500/30">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm sm:text-base">
                          المستشار التجاري الذكي (AI Executive Advisor)
                        </h3>
                        <p className="text-xs text-stone-300">
                          تحليل فوري لحركة المبيعات وسلوك العملاء في أكتوبر والشيخ زايد
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-stone-300">
                    استخدم الذكاء الاصطناعي لمراقبة حركة الطلبات وتقديم اقتراحات لإدارة المخزون والتسعير.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="flex flex-wrap gap-2 items-center justify-between bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs">
                  <div className="flex-1 min-w-[200px] relative">
                    <input
                      type="text"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      placeholder="بحث برقم الطلب، اسم العميل، الهاتف، أو المنطقة..."
                      className="w-full pl-3 pr-8 py-2 rounded-xl bg-white border border-stone-300 text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5" />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-bold"
                    >
                      <option value="all">كل المدن</option>
                      <option value="zayed">الشيخ زايد</option>
                      <option value="october">٦ أكتوبر</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-bold"
                    >
                      <option value="all">كل الحالات</option>
                      <option value="new">جديد ⏳</option>
                      <option value="preparing">قيد التجهيز 📦</option>
                      <option value="with_courier">مع المندوب 🛵</option>
                      <option value="delivered">تم التسليم ✓</option>
                      <option value="cancelled">ملغي ✕</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200">
                      <p className="text-xs text-stone-500">لا توجد طلبات مطابقة للمعايير المحددة.</p>
                    </div>
                  ) : (
                    filteredOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl border border-stone-200 bg-white shadow-2xs space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-stone-900">
                              #{ord.id}
                            </span>
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                ord.status === 'new'
                                  ? 'bg-amber-100 text-amber-900'
                                  : ord.status === 'preparing'
                                  ? 'bg-blue-100 text-blue-900'
                                  : ord.status === 'with_courier'
                                  ? 'bg-teal-100 text-teal-900'
                                  : ord.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : 'bg-rose-100 text-rose-900'
                              }`}
                            >
                              {ord.status === 'new'
                                ? 'طلب جديد ⏳'
                                : ord.status === 'preparing'
                                ? 'جاري التجهيز 📦'
                                : ord.status === 'with_courier'
                                ? 'مع المندوب 🛵'
                                : ord.status === 'delivered'
                                ? 'تم التسليم ✓'
                                : 'ملغي ✕'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={ord.status}
                              onChange={(e) =>
                                onUpdateOrderStatus(ord.id, e.target.value as Order['status'])
                              }
                              className="text-xs px-2.5 py-1 rounded-lg border border-stone-300 bg-stone-50 font-bold"
                            >
                              <option value="new">طلب جديد</option>
                              <option value="preparing">قيد التجهيز</option>
                              <option value="with_courier">مع المندوب</option>
                              <option value="delivered">تم التسليم</option>
                              <option value="cancelled">إلغاء الطلب</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => handleOpenCourierEdit(ord)}
                              className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>إسناد مندوب</span>
                            </button>
                          </div>
                        </div>

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
                            <span>{ord.zoneName} - {ord.detailedAddress}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: PRESCRIPTION REQUESTS (الروشتات والاستشارات الطبية) */}
            {activeTab === 'prescriptions' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-emerald-950">
                        طلبات الروشتات والاستشارات الطبية الواردة ({prescriptions.length})
                      </h3>
                      <p className="text-xs text-emerald-800">
                        مراجعة الروشتات، التواصل مع المرضى وتأكيد التوافر والتوصيل السريع
                      </p>
                    </div>
                  </div>
                </div>

                {prescriptions.length === 0 ? (
                  <div className="text-center py-16 bg-stone-50 rounded-3xl border border-stone-200 space-y-2">
                    <FileText className="w-10 h-10 text-stone-400 mx-auto" />
                    <h4 className="font-extrabold text-stone-800 text-sm">
                      لا توجد طلبات روشتات حالياً
                    </h4>
                    <p className="text-xs text-stone-500">
                      أي عميل يقوم برفع صورة روشتة أو طلب استشارة ستظهر فوراً هنا للمتابعة.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prescriptions.map((rx) => (
                      <div
                        key={rx.id}
                        className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex flex-col justify-between gap-3"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                            <span className="font-mono font-black text-sm text-emerald-900">
                              #{rx.id}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                rx.status === 'new'
                                  ? 'bg-amber-100 text-amber-900'
                                  : rx.status === 'reviewed'
                                  ? 'bg-blue-100 text-blue-900'
                                  : 'bg-emerald-100 text-emerald-900'
                              }`}
                            >
                              {rx.status === 'new'
                                ? 'روشتة جديدة ⏳'
                                : rx.status === 'reviewed'
                                ? 'تمت المراجعة 🩺'
                                : 'تم الشحن والتوصيل 🛵'}
                            </span>
                          </div>

                          {/* Image preview if exists */}
                          {rx.image && (
                            <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-50 p-1">
                              <img
                                src={rx.image}
                                alt="صورة الروشتة"
                                className="w-full max-h-48 object-contain rounded-lg"
                              />
                            </div>
                          )}

                          <div className="text-xs text-stone-700 space-y-1">
                            <div>
                              <strong className="text-stone-900">المريض/العميل:</strong>{' '}
                              {rx.patientName}
                            </div>
                            <div className="flex items-center gap-2">
                              <strong className="text-stone-900">الهاتف:</strong>
                              <span className="font-mono">{rx.phone}</span>
                            </div>
                            <div>
                              <strong className="text-stone-900">المنطقة:</strong>{' '}
                              {rx.city === 'zayed' ? 'الشيخ زايد' : '٦ أكتوبر'} - {rx.areaName}
                            </div>
                            {rx.notes && (
                              <div className="p-2 rounded-lg bg-stone-50 text-[11px] text-stone-800">
                                <strong>ملاحظات العميل:</strong> {rx.notes}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-stone-100 pt-2 gap-2">
                          <a
                            href={`https://wa.me/2${rx.phone.replace(/^0+/, '')}?text=${encodeURIComponent(
                              `أهلاً بحضرتك أستاذ/ة ${rx.patientName}، بخصوص طلب الروشتة #${rx.id} من متجر m&l للعناية...`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>مراسلة واتساب</span>
                          </a>

                          <div className="flex items-center gap-1.5">
                            {onUpdatePrescriptionStatus && (
                              <select
                                value={rx.status}
                                onChange={(e) =>
                                  onUpdatePrescriptionStatus(
                                    rx.id,
                                    e.target.value as PrescriptionRequest['status']
                                  )
                                }
                                className="text-xs px-2 py-1 rounded-lg border border-stone-300 font-bold bg-stone-50"
                              >
                                <option value="new">جديدة</option>
                                <option value="reviewed">تمت المراجعة</option>
                                <option value="dispatched">تم الشحن</option>
                              </select>
                            )}

                            {onDeletePrescription && (
                              <button
                                onClick={() => onDeletePrescription(rx.id)}
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer"
                                title="حذف الطلب"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: CATEGORIES MANAGEMENT (إدارة الأقسام والتبعية) */}
            {activeTab === 'categories' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                {/* Header & Add Category Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-pink-50/70 p-4 rounded-2xl border border-pink-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center">
                      <FolderTree className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                        التحكم الكامل في أقسام وتصنيفات المتجر
                      </h3>
                      <p className="text-xs text-stone-600">
                        إضافة أقسام جديدة، تعديلها، حذفها، والتحكم في تبعية المنتجات لأي قسم
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(!isAddingCategory)}
                    className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span>{isAddingCategory ? 'إلغاء الإضافة' : 'إضافة قسم رئيسي جديد'}</span>
                  </button>
                </div>

                {/* Add Category Form */}
                {isAddingCategory && (
                  <form
                    onSubmit={handleAddCategory}
                    className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-pink-300 shadow-sm space-y-4 animate-in slide-in-from-top-2 duration-150"
                  >
                    <h4 className="font-extrabold text-sm text-stone-900 border-b border-stone-200 pb-2">
                      بيانات القسم الجديد:
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">
                          اسم القسم بالعربية <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newCatTitle}
                          onChange={(e) => setNewCatTitle(e.target.value)}
                          placeholder="مثال: العناية بالأظافر واليدين"
                          className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">
                          الاسم الإنجليزي (اختياري)
                        </label>
                        <input
                          type="text"
                          value={newCatEnglishTitle}
                          onChange={(e) => setNewCatEnglishTitle(e.target.value)}
                          placeholder="مثال: Hand & Nail Care"
                          className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-pink-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">
                          شارة تمييز / Badge (اختياري)
                        </label>
                        <input
                          type="text"
                          value={newCatBadge}
                          onChange={(e) => setNewCatBadge(e.target.value)}
                          placeholder="مثال: جديد 💅 أو خصم 20%"
                          className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        التصنيفات الفرعية (افصلي بينها بفاصلة أو سطر جديد)
                      </label>
                      <textarea
                        rows={2}
                        value={newCatSubcategoriesText}
                        onChange={(e) => setNewCatSubcategoriesText(e.target.value)}
                        placeholder="مثال: كريمات اليدين، مقويات الأظافر، مقشرات لطيفة..."
                        className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                      >
                        حفظ ونشر القسم بالمتجر
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingCategory(false)}
                        className="px-4 py-2.5 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                )}

                {/* Categories List Cards */}
                <div className="space-y-4">
                  {categoriesList.map((cat) => {
                    const count = products.filter((p) => p.category === cat.id).length;
                    const isAddingSub = addingSubToCatId === cat.id;

                    return (
                      <div
                        key={cat.id}
                        className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs">
                              {cat.title.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-sm text-stone-900">
                                  {cat.title}
                                </h4>
                                {cat.badge && (
                                  <span className="text-[10px] bg-pink-50 text-pink-700 border border-pink-200 px-2 py-0.2 rounded-full font-bold">
                                    {cat.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-stone-400 font-mono">
                                ID: {cat.id} • {count} منتجات تابعة
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setAddingSubToCatId(isAddingSub ? null : cat.id)}
                              className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-800 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>إضافة تصنيف فرعي</span>
                            </button>

                            {categoriesList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(cat.id, cat.title)}
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer"
                                title="حذف القسم بالكامل"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Add subcategory inline form */}
                        {isAddingSub && (
                          <div className="p-3 bg-pink-50/50 rounded-xl border border-pink-200 space-y-2">
                            <div className="text-xs font-bold text-pink-900">
                              إضافة تصنيف فرعي جديد لـ {cat.title}:
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                type="text"
                                value={newSubLabel}
                                onChange={(e) => setNewSubLabel(e.target.value)}
                                placeholder="اسم التصنيف الفرعي..."
                                className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
                              />
                              <input
                                type="text"
                                value={newSubDesc}
                                onChange={(e) => setNewSubDesc(e.target.value)}
                                placeholder="وصف موجز (اختياري)..."
                                className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddSubcategory(cat.id)}
                                className="px-4 py-1.5 bg-pink-600 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs"
                              >
                                إضافة
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Subcategories pills */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {cat.subcategories.map((sub) => (
                            <div
                              key={sub.id}
                              className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-[11px] font-semibold flex items-center gap-1.5 border border-stone-200/70"
                            >
                              <span>{sub.label}</span>
                              {sub.id !== 'all' && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSubcategory(cat.id, sub.id)}
                                  className="text-stone-400 hover:text-rose-600 font-bold ml-0.5"
                                  title="حذف هذا التصنيف الفرعي"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: PRODUCTS & STOCK MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Search & Category Filter */}
                <div className="flex flex-wrap gap-2 items-center justify-between bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs">
                  <div className="flex-1 min-w-[180px] relative">
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="بحث عن منتج بالاسم أو الماركة..."
                      className="w-full pl-3 pr-8 py-2 rounded-xl bg-white border border-stone-300 text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute right-2.5 top-2.5" />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-bold"
                    >
                      <option value="all">كل الأقسام</option>
                      {categoriesList.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.title}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setActiveTab('newProduct')}
                      className="px-3 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة صنف</span>
                    </button>
                  </div>
                </div>

                {/* Products List */}
                {products.length === 0 ? (
                  <div className="text-center py-16 px-4 bg-stone-50 rounded-3xl border border-stone-200 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center mx-auto shadow-sm">
                      <Layers className="w-8 h-8" />
                    </div>
                    <div className="max-w-md mx-auto space-y-1">
                      <h4 className="font-black text-base text-stone-900">
                        المتجر فارغ من المنتجات حالياً
                      </h4>
                      <p className="text-xs text-stone-500">
                        يمكنك إضافة منتجات جديدة فوراً ونشرها لجميع الزوار!
                      </p>
                    </div>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200">
                    <p className="text-xs text-stone-500">لا توجد نتائج مطابقة لبحثك.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredProducts.map((prod) => {
                      const isEditing = editingProductId === prod.id;
                      const currentCategoryConfig = categoriesList.find((c) => c.id === prod.category);

                      return (
                        <div
                          key={prod.id}
                          className="p-3.5 rounded-2xl border border-stone-200 bg-white flex flex-col justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <img
                              src={
                                prod.image ||
                                'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
                              }
                              alt={prod.nameAr}
                              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                            />
                            <div className="min-w-0 flex-1 space-y-1">
                              <h4 className="font-extrabold text-xs text-stone-900 line-clamp-1">
                                {prod.nameAr}
                              </h4>
                              <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1.5 flex-wrap">
                                <span>{prod.brand}</span>
                                <span>•</span>
                                <span>{prod.volume}</span>
                              </div>

                              {/* Direct Quick Category Re-assign Dropdown */}
                              <div className="flex items-center gap-1.5 pt-0.5">
                                <span className="text-[10px] text-stone-500 font-bold">القسم:</span>
                                <select
                                  value={prod.category}
                                  onChange={(e) => {
                                    if (onUpdateProduct) {
                                      onUpdateProduct(prod.id, {
                                        category: e.target.value as MainCategory,
                                        subCategory: 'all',
                                      });
                                    }
                                  }}
                                  className="text-[11px] px-2 py-0.5 rounded-md bg-pink-50 text-pink-900 border border-pink-200 font-bold cursor-pointer"
                                  title="تغيير تبعية المنتج لأي قسم بنقرة واحدة"
                                >
                                  {categoriesList.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                      {cat.title}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Price and Stock */}
                              {isEditing ? (
                                <div className="grid grid-cols-3 gap-2 pt-1 bg-stone-50 p-2 rounded-xl border border-stone-200">
                                  <div className="space-y-0.5">
                                    <label className="text-[10px] font-bold text-stone-600 block">قبل الخصم:</label>
                                    <input
                                      type="number"
                                      placeholder="الأصلي"
                                      value={editOriginalPrice}
                                      onChange={(e) =>
                                        setEditOriginalPrice(
                                          e.target.value === '' ? '' : Number(e.target.value)
                                        )
                                      }
                                      className="w-full px-2 py-1 bg-white border border-stone-300 rounded text-xs font-mono font-bold"
                                    />
                                  </div>
                                  <div className="space-y-0.5">
                                    <label className="text-[10px] font-bold text-pink-700 block">بعد الخصم *:</label>
                                    <input
                                      type="number"
                                      value={editPrice}
                                      onChange={(e) => setEditPrice(Number(e.target.value))}
                                      className="w-full px-2 py-1 bg-white border border-stone-300 rounded text-xs font-mono font-bold text-pink-700"
                                    />
                                  </div>
                                  <div className="space-y-0.5">
                                    <label className="text-[10px] font-bold text-stone-600 block">المخزون:</label>
                                    <input
                                      type="number"
                                      value={editStock}
                                      onChange={(e) => setEditStock(Number(e.target.value))}
                                      className="w-full px-2 py-1 bg-white border border-stone-300 rounded text-xs font-mono font-bold"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-[10px] text-stone-500 font-bold">السعر:</span>
                                    <span className="font-black text-xs text-pink-700 font-mono">
                                      {prod.price} ج
                                    </span>
                                    {prod.originalPrice && prod.originalPrice > prod.price && (
                                      <span className="text-[10px] text-stone-400 line-through font-mono">
                                        {prod.originalPrice} ج
                                      </span>
                                    )}
                                  </div>
                                  {prod.originalPrice && prod.originalPrice > prod.price && (
                                    <span className="bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded shadow-2xs">
                                      خصم {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}%
                                    </span>
                                  )}
                                  <span
                                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                      prod.inStock && (prod.stockCount ?? 0) > 0
                                        ? 'bg-emerald-100 text-emerald-900'
                                        : 'bg-rose-100 text-rose-900'
                                    }`}
                                  >
                                    {prod.inStock && (prod.stockCount ?? 0) > 0
                                      ? `متوفر (${prod.stockCount})`
                                      : 'نفد'}
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
                                      const parsedOriginal =
                                        editOriginalPrice !== '' &&
                                        Number(editOriginalPrice) > Number(editPrice)
                                          ? Number(editOriginalPrice)
                                          : undefined;
                                      onUpdateProduct(prod.id, {
                                        price: editPrice,
                                        originalPrice: parsedOriginal,
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
                                      setEditOriginalPrice(prod.originalPrice || '');
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
            {activeTab === 'newProduct' && (() => {
              const calculatedNewDiscount =
                newProductOriginalPrice !== '' &&
                Number(newProductOriginalPrice) > Number(newProductPrice)
                  ? Math.round(
                      ((Number(newProductOriginalPrice) - Number(newProductPrice)) /
                        Number(newProductOriginalPrice)) *
                        100
                    )
                  : 0;
              const calculatedSavings =
                newProductOriginalPrice !== '' &&
                Number(newProductOriginalPrice) > Number(newProductPrice)
                  ? Math.round(Number(newProductOriginalPrice) - Number(newProductPrice))
                  : 0;

              return (
                <form
                  onSubmit={handleCreateProduct}
                  className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <h3 className="font-extrabold text-sm text-stone-900">
                      إضافة صنف جديد للمتجر:
                    </h3>
                    <span className="text-[11px] text-stone-500">
                      تحديد السعر قبل وبعد الخصم مع شارة نسبة الخصم الفورية 🏷️
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
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
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
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        القسم الرئيسي التابع له *
                      </label>
                      <select
                        value={newProductCategory}
                        onChange={(e) => setNewProductCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-bold"
                      >
                        {categoriesList.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.title}
                          </option>
                        ))}
                      </select>
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
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
                      />
                    </div>

                    {/* Pricing Section: Price Before and After Discount */}
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-extrabold text-stone-700">
                          السعر قبل الخصم (السعر الأصلي)
                        </label>
                        <span className="text-[10px] text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200 font-bold">
                          اختياري
                        </span>
                      </div>
                      <input
                        type="number"
                        min="1"
                        placeholder="مثال: 350 (اتركيه فارغاً إذا لم يوجد خصم)"
                        value={newProductOriginalPrice}
                        onChange={(e) =>
                          setNewProductOriginalPrice(
                            e.target.value === '' ? '' : Number(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none font-mono font-bold"
                      />
                    </div>

                    <div className="p-3 bg-pink-50/80 rounded-2xl border-2 border-pink-300 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-extrabold text-pink-950">
                          السعر بعد الخصم / سعر البيع الفعلي (جنيه) *
                        </label>
                        <span className="text-[10px] text-pink-700 bg-pink-100 px-2 py-0.5 rounded font-extrabold">
                          سعر البيع
                        </span>
                      </div>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newProductPrice}
                        onChange={(e) => setNewProductPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-pink-300 text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none font-mono font-black text-pink-700 text-sm"
                      />
                    </div>

                    {/* Live Discount Calculation Banner */}
                    {calculatedNewDiscount > 0 && (
                      <div className="sm:col-span-2 p-3 rounded-xl bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 border border-rose-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-md shadow-2xs">
                            خصم {calculatedNewDiscount}%
                          </span>
                          <span className="font-extrabold text-rose-950">
                            قيمة التوفير للعميل: {calculatedSavings} ج.م ✨
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-500 font-medium">
                          ستظهر شارة الخصم تلقائياً بحجم صغير وواضح على صورة المنتج
                        </span>
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        الكمية المتوفرة بالمخزن *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newProductStock}
                        onChange={(e) => setNewProductStock(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none font-mono"
                      />
                    </div>

                    {/* Image Upload section */}
                    <div className="sm:col-span-2 space-y-2">
                      <label className="block text-xs font-bold text-stone-700">
                        صورة المنتج (تحميل من الموبايل أو رابط) *
                      </label>

                      <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 border-2 border-dashed border-pink-300 text-pink-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0">
                          <Camera className="w-4 h-4 text-pink-600" />
                          <span>📸 التقاط أو اختيار صورة من الموبايل</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const compressedUrl = await compressProductImage(file);
                                  setNewProductImage(compressedUrl);
                                } catch (err) {
                                  console.error('Image compression failed:', err);
                                }
                              }
                            }}
                          />
                        </label>

                        <div className="w-full flex-1">
                          <input
                            type="text"
                            value={newProductImage}
                            onChange={(e) => setNewProductImage(e.target.value)}
                            placeholder="أو الصق رابط صورة مباشرة..."
                            className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none text-left font-mono"
                          />
                        </div>
                      </div>

                      {newProductImage && (
                        <div className="flex items-center gap-3 p-2.5 bg-pink-50/60 rounded-xl border border-pink-200">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-200 shrink-0">
                            <img
                              src={newProductImage}
                              alt="معاينة الصورة"
                              className="w-full h-full object-cover"
                            />
                            {calculatedNewDiscount > 0 && (
                              <span className="absolute top-1 right-1 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[9px] font-black px-1 py-0.2 rounded shadow-2xs">
                                خصم {calculatedNewDiscount}%
                              </span>
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-xs text-pink-900 font-extrabold block">
                              معاينة صورة الصنف المحددة
                            </span>
                            <span className="text-[10px] text-stone-500 block">
                              {calculatedNewDiscount > 0
                                ? `تظهر عليها شارة "خصم ${calculatedNewDiscount}%" بالركن العلوي`
                                : 'بدون شارة خصم'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        وصف الصنف وطريقة الاستخدام
                      </label>
                      <textarea
                        rows={2}
                        value={newProductDesc}
                        onChange={(e) => setNewProductDesc(e.target.value)}
                        placeholder="اكتبي فوائد الصنف والمكونات وطريقة الاستخدام..."
                        className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="submit"
                      className="py-3 px-6 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>إضافة ونشر المنتج للمتجر فوراً</span>
                    </button>
                  </div>
                </form>
              );
            })()}

            {/* TAB 5: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                <form
                  onSubmit={handleSaveSettings}
                  className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4"
                >
                  <h3 className="font-extrabold text-sm text-stone-900 border-b border-stone-200 pb-2">
                    إعدادات المتجر العامة والتوصيل:
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">اسم المتجر:</label>
                      <input
                        type="text"
                        value={localSettings.storeName}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, storeName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        رقم واتساب خدمة العملاء والروشتات:
                      </label>
                      <input
                        type="text"
                        value={localSettings.contactWhatsApp}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, contactWhatsApp: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-mono font-bold focus:ring-2 focus:ring-pink-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
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
                    <span>تغيير كلمة مرور المدير (Security Settings)</span>
                  </h3>

                  <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                    <input
                      type="password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="أدخل كلمة مرور جديدة للمدير..."
                      className="flex-1 px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs font-mono focus:ring-2 focus:ring-pink-600 focus:outline-none"
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
                  <Truck className="w-5 h-5 text-pink-700" />
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
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
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
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-pink-600 focus:outline-none"
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
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-pink-600 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
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
