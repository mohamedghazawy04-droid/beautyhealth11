import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Search,
  MessageCircle,
  Truck,
  Heart,
  Clock,
  Lock,
  Smartphone,
  Grid,
  Download,
  X,
  TrendingUp,
  Flame,
  ArrowUpLeft,
  Stethoscope,
  FileText,
  ShieldCheck,
  Bell,
  Package,
  HardDrive
} from 'lucide-react';
import { StoreSettings, Product, CategoryConfig } from '../types';
import { DEFAULT_CATEGORIES } from '../data/categories';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenOrderTracking: () => void;
  onOpenAdmin: () => void;
  onOpenInstallApp?: () => void;
  onOpenCategories?: () => void;
  onOpenPrescription?: () => void;
  categoriesList?: CategoryConfig[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectCategory: (category: any) => void;
  activeCategory: string;
  storeSettings?: StoreSettings;
  selectedZone?: any;
  onOpenZoneModal?: () => void;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
  ordersCount?: number;
  onOpenGoogleDrive?: () => void;
  onOpenCustomerSupport?: () => void;
  unreadCustomerSupportCount?: number;
}

const POPULAR_SEARCHES = [
  'سيروم الهيالورونيك اسيد',
  'واقي شمس لاروش بوزيه',
  'شامبو أطفال خالي من السلفات',
  'مرطب بيبانثين للبشرة',
  'زيت الأرجان وروتين الشعر',
  'عروض وبكجات التوفير',
  'كريم الحفاض للأطفال',
  'لوشن مرطب للجسم',
];

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  onOpenOrderTracking,
  onOpenAdmin,
  onOpenInstallApp,
  onOpenCategories,
  onOpenPrescription,
  categoriesList = DEFAULT_CATEGORIES,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  activeCategory,
  storeSettings,
  products = [],
  onSelectProduct,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  ordersCount = 0,
  onOpenGoogleDrive,
  onOpenCustomerSupport,
  unreadCustomerSupportCount = 0,
}) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isDesktopFocused, setIsDesktopFocused] = useState(false);
  const [isMobileFocused, setIsMobileFocused] = useState(false);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(e.target as Node)
      ) {
        setIsDesktopFocused(false);
      }
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setIsMobileFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter matched products
  const cleanQuery = searchQuery.trim().toLowerCase();
  const matchedProducts = cleanQuery
    ? products
        .filter(
          (p) =>
            p.nameAr?.toLowerCase().includes(cleanQuery) ||
            p.name?.toLowerCase().includes(cleanQuery) ||
            p.brand?.toLowerCase().includes(cleanQuery) ||
            p.category?.toLowerCase().includes(cleanQuery)
        )
        .slice(0, 6)
    : [];

  const filteredPopularSearches = cleanQuery
    ? POPULAR_SEARCHES.filter((s) => s.toLowerCase().includes(cleanQuery))
    : POPULAR_SEARCHES;

  const handleSelectSuggestion = (term: string) => {
    onSearchChange(term);
    setIsDesktopFocused(false);
    setIsMobileFocused(false);
    setShowMobileSearch(false);
    const section = document.getElementById('products-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProductClick = (prod: Product) => {
    setIsDesktopFocused(false);
    setIsMobileFocused(false);
    if (onSelectProduct) {
      onSelectProduct(prod);
    } else {
      onSearchChange(prod.nameAr || prod.name);
    }
  };

  // Secret Logo Multi-Click Tracker
  const logoClickCountRef = useRef(0);
  const lastLogoClickTimeRef = useRef(0);

  const handleLogoSecretClick = () => {
    const now = Date.now();
    if (now - lastLogoClickTimeRef.current > 2200) {
      logoClickCountRef.current = 1;
    } else {
      logoClickCountRef.current += 1;
    }
    lastLogoClickTimeRef.current = now;

    if (logoClickCountRef.current >= 3) {
      logoClickCountRef.current = 0;
      if (onOpenAdmin) {
        onOpenAdmin();
      }
    }
  };

  // Secret Keyword Check for Search Bar
  const handleSearchInputChange = (val: string) => {
    const normalized = val.trim().toLowerCase();
    const secretKeywords = [
      'admin',
      'مدير',
      'ادمن',
      'm&l-admin',
      'control',
      'لوحة التحكم',
      'لوحة المدير',
      'mohager191995',
      'mladmin',
    ];

    if (secretKeywords.includes(normalized)) {
      onSearchChange('');
      setIsDesktopFocused(false);
      setIsMobileFocused(false);
      setShowMobileSearch(false);
      if (onOpenAdmin) {
        onOpenAdmin();
      }
      return;
    }
    onSearchChange(val);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-xs text-right transition-all">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#3b0d21] via-[#5c1334] to-[#3b0d21] text-pink-100 text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 border-b border-pink-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
          {/* Announcement text & Pharmacist Trust Reassurance */}
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full border border-emerald-400/30 shrink-0 text-[10px]">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>إشراف صيدلي معتمد 🥼</span>
            </span>
            <span className="truncate font-medium text-[11px]">
              {storeSettings?.announcementText ||
                'توصيل فوري 2-4 ساعات لأكتوبر وزايد | شحن مجاني للطلبات فوق 500 جنيه'}
            </span>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-2 shrink-0">
            {onOpenPrescription && (
              <button
                type="button"
                onClick={onOpenPrescription}
                className="px-2.5 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] sm:text-[11px] flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                title="إرسال صورة روشتة أو طلب خاص مع الصيدلي"
              >
                <FileText className="w-3 h-3 text-emerald-200" />
                <span>إرسال روشتة 📄</span>
              </button>
            )}

            <a
              href="https://www.mediafire.com/file/96n9dd1yvi1upyg/app-release.apk/file"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-300 hover:to-rose-300 text-stone-950 transition-all cursor-pointer items-center gap-1 font-black text-[10px] sm:text-[11px] shadow-xs"
              title="تحميل ملف تطبيق الأندرويد المباشر"
            >
              <Download className="w-3 h-3 animate-pulse" />
              <span>تحميل التطبيق APK 📲</span>
            </a>

            {onOpenInstallApp && (
              <button
                onClick={onOpenInstallApp}
                className="hidden sm:flex hover:text-white transition-colors cursor-pointer items-center gap-1 text-pink-200"
              >
                <Smartphone className="w-3 h-3 text-pink-300" />
                <span>خيارات التثبيت</span>
              </button>
            )}

            <button
              onClick={onOpenOrderTracking}
              className="hidden sm:flex hover:text-white transition-colors cursor-pointer items-center gap-1 text-pink-200"
            >
              <Clock className="w-3 h-3 text-pink-300" />
              <span>تتبع طلبك</span>
            </button>

            <a
              href={`https://wa.me/${(storeSettings?.contactWhatsApp || '201093629587').replace(/\D/g, '')}?text=${encodeURIComponent(
                'مرحباً، أود الاستفسار عن منتجات العناية من متجر m&l'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1 text-emerald-300 hover:text-emerald-100 font-bold transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>واتساب الصيدلي</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Name (With Secret 3-Click Admin Trigger) */}
          <div
            onClick={handleLogoSecretClick}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none"
            title="متجر m&l للعناية والجمال"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-rose-400 rounded-2xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md font-black text-sm sm:text-base tracking-tight border border-pink-200/50">
                <span className="font-['Playfair_Display',Georgia,serif] lowercase font-black tracking-tighter drop-shadow-xs">
                  m<span className="text-pink-100 font-serif">&</span>l
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-black text-lg sm:text-2xl text-stone-900 tracking-tight font-['Playfair_Display',Georgia,sans-serif]">
                  <span className="text-pink-600 font-bold">m</span>
                  <span className="text-rose-400 mx-0.5">&</span>
                  <span className="text-pink-600 font-bold">l</span>
                </span>
                <span className="bg-pink-50 text-pink-800 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border border-pink-200/80 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-pink-500" />
                  {storeSettings?.storeName || 'عالم الجمال والعناية'}
                </span>
              </div>
            </div>
          </div>

          {/* Search Input on Desktop with Live Autocomplete Suggestions & Secret Trigger */}
          <div ref={desktopSearchRef} className="hidden md:flex flex-1 max-w-md relative mx-2">
            <div className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsDesktopFocused(true)}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchInputChange(searchQuery);
                  }
                }}
                placeholder="ابحثي عن منتج، ماركة، أو علاج للبشرة والشعر..."
                className="w-full pl-8 pr-9 py-2 rounded-2xl bg-pink-50/60 border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all text-stone-800 placeholder:text-stone-400 shadow-2xs"
              />
              <Search className="w-4 h-4 text-pink-400 absolute right-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs bg-pink-100 hover:bg-pink-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Desktop Search Suggestions Dropdown */}
            {isDesktopFocused && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-pink-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[420px] overflow-y-auto">
                {/* Popular Keywords Section */}
                {filteredPopularSearches.length > 0 && (
                  <div className="px-3 pb-2 border-b border-pink-50">
                    <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-stone-600 mb-2">
                      <Flame className="w-3.5 h-3.5 text-rose-500" />
                      <span>{cleanQuery ? 'اقتراحات كلمات البحث:' : 'الأكثر بحثاً وشهرة في المتجر:'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {filteredPopularSearches.slice(0, 6).map((term, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onMouseDown={() => handleSelectSuggestion(term)}
                          className="px-2.5 py-1 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-900 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer border border-pink-100/80"
                        >
                          <TrendingUp className="w-2.5 h-2.5 text-pink-600" />
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Products Section */}
                {cleanQuery && (
                  <div className="pt-2 px-3">
                    <div className="text-[11px] font-extrabold text-stone-600 mb-2 flex items-center justify-between">
                      <span>منتجات متطابقة ({matchedProducts.length}):</span>
                      <span className="text-[10px] text-pink-600">اضغطي لمعاينة المنتج</span>
                    </div>

                    {matchedProducts.length > 0 ? (
                      <div className="space-y-1.5">
                        {matchedProducts.map((prod) => (
                          <div
                            key={prod.id}
                            onMouseDown={() => handleProductClick(prod)}
                            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-pink-50/70 transition-colors cursor-pointer border border-transparent hover:border-pink-200/60"
                          >
                            <img
                              src={prod.image}
                              alt={prod.nameAr || prod.name}
                              className="w-10 h-10 rounded-lg object-cover border border-pink-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-stone-900 truncate">
                                {prod.nameAr || prod.name}
                              </h4>
                              <div className="flex items-center gap-2 text-[10px] text-stone-500">
                                <span>{prod.brand}</span>
                                <span>•</span>
                                <span className="font-extrabold text-pink-700">{prod.price} جنيه</span>
                              </div>
                            </div>
                            <ArrowUpLeft className="w-3.5 h-3.5 text-pink-400" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-xs text-stone-400">
                        لم يتم العثور على منتجات مطابقة لـ "{cleanQuery}".
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Toggle Search for Mobile */}
            <button
              onClick={() => {
                setShowMobileSearch(!showMobileSearch);
                setIsMobileFocused(!showMobileSearch);
              }}
              className={`md:hidden p-2 rounded-xl transition-colors cursor-pointer border ${
                showMobileSearch || searchQuery
                  ? 'bg-pink-50 text-pink-700 border-pink-300 ring-2 ring-pink-200'
                  : 'bg-stone-50 text-stone-700 border-stone-200'
              }`}
              title="بحث"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile Prescription Button */}
            {onOpenPrescription && (
              <button
                type="button"
                onClick={onOpenPrescription}
                className="md:hidden px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-extrabold text-[10px] flex items-center gap-1 cursor-pointer"
                title="إرسال صورة الروشتة الطبية"
              >
                <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                <span>روشتة</span>
              </button>
            )}

            {/* Install App mobile quick button */}
            {onOpenInstallApp && (
              <button
                onClick={onOpenInstallApp}
                className="sm:hidden p-2 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 text-pink-900 border border-pink-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                title="تثبيت التطبيق"
              >
                <Smartphone className="w-3.5 h-3.5 text-pink-600" />
                <span>تطبيق</span>
              </button>
            )}

            {/* Notifications Button */}
            {onOpenNotifications && (
              <button
                type="button"
                onClick={onOpenNotifications}
                className="p-2 rounded-xl bg-pink-50/80 hover:bg-pink-100 text-pink-700 relative transition-all cursor-pointer border border-pink-200/70"
                title="مركز الإشعارات والتنبيهات"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-4.5 sm:h-4.5 bg-rose-600 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-pulse shadow-xs">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            {/* Customer In-App Support Chat Button */}
            {onOpenCustomerSupport && (
              <button
                type="button"
                onClick={onOpenCustomerSupport}
                className="p-2 rounded-xl bg-pink-50/80 hover:bg-pink-100 text-pink-700 relative transition-all cursor-pointer border border-pink-200/70"
                title="محادثة الدعم والاستفسارات"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCustomerSupportCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-4.5 sm:h-4.5 bg-emerald-600 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-bounce shadow-xs">
                    {unreadCustomerSupportCount}
                  </span>
                )}
              </button>
            )}

            {/* Orders Tracking Desktop Button (Amazon-Style Returns & Orders) */}
            <button
              type="button"
              onClick={onOpenOrderTracking}
              className="hidden md:flex items-center gap-2 py-1.5 px-3 rounded-xl bg-pink-50/80 hover:bg-pink-100 text-stone-900 border border-pink-200/80 transition-all cursor-pointer shadow-2xs group"
              title="طلباتك وتتبع الشحنات"
            >
              <div className="relative">
                <Package className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-pink-700 group-hover:scale-105 transition-transform" />
                {ordersCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 bg-pink-600 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs">
                    {ordersCount}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="block text-[9px] text-stone-500 font-bold leading-none">مشترياتك</span>
                <span className="text-xs font-black text-pink-950 leading-tight">طلباتك</span>
              </div>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="p-2 rounded-xl bg-pink-50/70 hover:bg-pink-100 text-pink-700 relative transition-colors cursor-pointer border border-pink-200/60"
              title="قائمة الرغبات والمفضلة"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-4.5 sm:h-4.5 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              className="py-1.5 px-3 sm:py-2 sm:px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white flex items-center gap-1.5 shadow-md shadow-pink-900/10 cursor-pointer transition-all active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-white text-pink-700 rounded-full text-[10px] font-black flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs sm:text-sm font-black hidden sm:inline">السلة</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Expandable with Secret Trigger) */}
        {showMobileSearch && (
          <div ref={mobileSearchRef} className="md:hidden mt-2 relative pt-1">
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onFocus={() => setIsMobileFocused(true)}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchInputChange(searchQuery);
                  }
                }}
                placeholder="ابحثي عن منتج، ماركة، أو علاج للبشرة والشعر..."
                className="w-full pl-8 pr-9 py-2 rounded-2xl bg-pink-50/70 border border-pink-300 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white text-stone-800 placeholder:text-stone-400"
              />
              <Search className="w-4 h-4 text-pink-500 absolute right-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs bg-pink-100 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile Dropdown Suggestions */}
            {isMobileFocused && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-pink-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[340px] overflow-y-auto">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-stone-600 mb-2">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>الأكثر بحثاً:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {filteredPopularSearches.slice(0, 5).map((term, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseDown={() => handleSelectSuggestion(term)}
                      className="px-2 py-1 rounded-xl bg-pink-50 text-pink-900 text-[10px] font-bold"
                    >
                      {term}
                    </button>
                  ))}
                </div>

                {cleanQuery && matchedProducts.length > 0 && (
                  <div className="pt-2 border-t border-pink-50 space-y-1">
                    {matchedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        onMouseDown={() => handleProductClick(prod)}
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-pink-50 text-right cursor-pointer"
                      >
                        <img
                          src={prod.image}
                          alt={prod.nameAr || prod.name}
                          className="w-8 h-8 rounded object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-stone-900 truncate">
                            {prod.nameAr || prod.name}
                          </p>
                          <p className="text-[10px] text-pink-700 font-extrabold">{prod.price} جنيه</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Amazon-Style Subnav Bar (All Departments + Dynamic Category Links) */}
        <nav className="flex items-center gap-1.5 sm:gap-2 pt-2 overflow-x-auto pb-0.5 scrollbar-none text-xs font-semibold border-t border-pink-50/70 mt-1 overscroll-x-contain max-w-full">
          {onOpenCategories && (
            <button
              onClick={onOpenCategories}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap bg-stone-900 hover:bg-stone-800 text-white font-extrabold transition-all cursor-pointer shadow-xs shrink-0 text-[11px] sm:text-xs"
              title="تصفح جميع الأقسام (All Departments)"
            >
              <Grid className="w-3.5 h-3.5 text-pink-400" />
              <span>الكل (كل الأقسام)</span>
            </button>
          )}

          {/* All items button */}
          <button
            onClick={() => {
              onSelectCategory('all');
              const section = document.getElementById('products-section');
              if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer text-[11px] sm:text-xs shrink-0 ${
              activeCategory === 'all'
                ? 'bg-pink-600 text-white shadow-xs font-black'
                : 'bg-stone-100/90 text-stone-700 hover:bg-pink-100 hover:text-pink-900 border border-stone-200/60 font-bold'
            }`}
          >
            جميع المنتجات 🛍️
          </button>

          {/* Dynamic Category Tabs */}
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                const section = document.getElementById('products-section');
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer text-[11px] sm:text-xs shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-pink-600 text-white shadow-xs font-black'
                  : 'bg-stone-100/90 text-stone-700 hover:bg-pink-100 hover:text-pink-900 border border-stone-200/60 font-bold'
              }`}
            >
              {cat.title} {cat.badge ? `(${cat.badge})` : ''}
            </button>
          ))}

          {onOpenPrescription && (
            <button
              type="button"
              onClick={onOpenPrescription}
              className="px-3 py-1.5 rounded-lg whitespace-nowrap bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 font-extrabold text-[11px] sm:text-xs shrink-0 flex items-center gap-1"
            >
              <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
              <span>اطلب بروشتة أو استشارة صيدلي 🥼</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
