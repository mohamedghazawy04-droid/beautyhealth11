import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  MapPin,
  Search,
  Phone,
  MessageCircle,
  Truck,
  Heart,
  Store,
  ChevronDown,
  ShieldCheck,
  Clock,
  Lock,
  Smartphone,
  Grid,
} from 'lucide-react';
import { DeliveryZone, Product, StoreSettings } from '../types';

interface NavbarProps {
  selectedZone: DeliveryZone;
  onOpenZoneModal: () => void;
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenOrderTracking: () => void;
  onOpenAdmin: () => void;
  onOpenInstallApp?: () => void;
  onOpenCategories?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectCategory: (category: any) => void;
  activeCategory: string;
  storeSettings?: StoreSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedZone,
  onOpenZoneModal,
  cartCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  onOpenOrderTracking,
  onOpenAdmin,
  onOpenInstallApp,
  onOpenCategories,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  activeCategory,
  storeSettings,
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner: October & Zayed Fast Delivery Guarantee */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              {storeSettings?.announcementText ||
                'توصيل سريع لنفس اليوم (٦٠-١٢٠ دقيقة) في ٦ أكتوبر والشيخ زايد'}
            </span>
            <span className="hidden md:inline-block text-emerald-300">|</span>
            <span className="hidden md:flex items-center gap-1 text-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              منتجات أصلية ١٠٠٪ ومضمونة من الوكلاء والصيدليات
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
            {onOpenInstallApp && (
              <button
                onClick={onOpenInstallApp}
                className="px-2.5 py-0.5 rounded-full bg-amber-400/25 hover:bg-amber-400/40 text-amber-300 transition-all cursor-pointer flex items-center gap-1 border border-amber-400/50 shadow-xs"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-extrabold text-[11px]">تثبيت التطبيق 📲</span>
              </button>
            )}
            <button
              onClick={onOpenOrderTracking}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-emerald-200"
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تتبع طلبك</span>
            </button>
            <a
              href={`https://wa.me/${storeSettings?.contactWhatsApp || '201012345678'}?text=مرحباً، أود الاستفسار عن منتجات متجر M&l`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-emerald-300 transition-colors text-emerald-300 font-bold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">واتساب المبيعات</span>
            </a>
            <button
              onClick={onOpenAdmin}
              className="px-2 py-0.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 hover:text-amber-200 transition-colors text-[11px] font-black cursor-pointer flex items-center gap-1 border border-emerald-700"
            >
              <Lock className="w-3 h-3 text-amber-300" />
              <span>لوحة المدير 🔐</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-stone-900 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 font-black text-lg tracking-wider">
              <span>M&l</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl md:text-3xl text-stone-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                  M<span className="text-emerald-600">&</span>l
                </span>
                <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  {storeSettings?.storeNameAr || 'عناية وأطفال'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block font-medium">
                العناية بالبشرة والجسم والشعر • مستلزمات الأطفال والرضع (أكتوبر وزايد)
              </p>
            </div>
          </div>

          {/* Hyperlocal Zone Picker Button */}
          <button
            onClick={onOpenZoneModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 transition-all text-right group cursor-pointer"
            title="تغيير منطقة التوصيل"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="hidden lg:block text-xs leading-tight">
              <div className="text-[10px] text-stone-500 font-medium">التوصيل إلى:</div>
              <div className="font-bold text-stone-900 group-hover:text-emerald-800 flex items-center gap-1">
                {selectedZone.name}
                <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-emerald-600" />
              </div>
            </div>
            <span className="lg:hidden text-xs font-bold text-stone-800">
              {selectedZone.city === 'zayed' ? 'زايد' : 'أكتوبر'}
            </span>
          </button>

          {/* Search Input on Desktop */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن منتج (موستيلا، سودوكريم، سيرافي، زيت روزماري، كيرلي...)"
              className="w-full pl-4 pr-10 py-2 rounded-xl bg-stone-100 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-stone-800 placeholder:text-stone-400"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs bg-stone-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="p-2.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-600 border border-stone-200 transition-colors relative cursor-pointer"
              title="المفضلة"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-950 text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">السلة</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن منتج، ماركة، أو علاج..."
              className="w-full pl-4 pr-10 py-2 rounded-xl bg-stone-100 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-stone-800"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Categories Bar */}
        <nav className="flex items-center gap-2 pt-3 overflow-x-auto pb-1 scrollbar-none text-xs sm:text-sm font-medium">
          {onOpenCategories && (
            <button
              onClick={onOpenCategories}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-extrabold transition-all cursor-pointer border border-emerald-300 shadow-xs shrink-0"
              title="تصفح جميع الأقسام بالتفصيل"
            >
              <Grid className="w-3.5 h-3.5 text-emerald-700" />
              <span>الأقسام (تصفح الكل)</span>
            </button>
          )}

          {[
            { id: 'all', label: 'كل المنتجات 🛍️' },
            { id: 'baby', label: 'العناية بالطفل والرضيع 👶' },
            { id: 'hair', label: 'العناية بالشعر والتساقط 💇‍♀️' },
            { id: 'body', label: 'العناية بالجسم والبشرة ✨' },
            { id: 'bundles', label: 'بكجات التوفير السريعة 🎁' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                const section = document.getElementById('products-section');
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer font-bold ${
                activeCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
