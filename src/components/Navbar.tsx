import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Search,
  MessageCircle,
  Truck,
  Heart,
  Store,
  ShieldCheck,
  Clock,
  Lock,
  Smartphone,
  Grid,
  Download,
} from 'lucide-react';
import { Product, StoreSettings } from '../types';

interface NavbarProps {
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
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs text-right">
      {/* Top Banner with Announcement & Mobile App CTA */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              {storeSettings?.announcementText || 'توصيل سريع لجميع المحافظات | اطلب الآن عبر واتساب مباشرة!'}
            </span>
            <span className="hidden md:inline-block text-emerald-300">|</span>
            <span className="hidden md:flex items-center gap-1 text-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              منتجات أصلية ١٠٠٪ ومضمونة
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
            {onOpenInstallApp && (
              <button
                onClick={onOpenInstallApp}
                className="px-2.5 py-0.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 transition-all cursor-pointer flex items-center gap-1 border border-amber-300 shadow-xs font-black text-[11px]"
              >
                <Download className="w-3 h-3 text-stone-950" />
                <span>تحميل التطبيق على الموبايل 📲</span>
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
              href={`https://wa.me/${(storeSettings?.contactWhatsApp || '201012345678').replace(/\D/g, '')}?text=مرحباً، أود الاستفسار عن منتجات المتجر`}
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
                  {storeSettings?.storeName || 'متجر العناية'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block font-medium">
                العناية بالبشرة والجسم والشعر • مستلزمات الأطفال • تسوق مباشر عبر واتساب
              </p>
            </div>
          </div>

          {/* Search Input on Desktop */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن منتج، ماركة، أو علاج..."
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
            {/* Install App mobile quick button */}
            {onOpenInstallApp && (
              <button
                onClick={onOpenInstallApp}
                className="md:hidden p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                title="تثبيت التطبيق على الهاتف"
              >
                <Smartphone className="w-4 h-4 text-amber-700" />
                <span className="text-[11px]">التطبيق</span>
              </button>
            )}

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
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold shadow-sm transition-all cursor-pointer"
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
              placeholder="ابحث عن منتج أو ماركة..."
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
            { id: 'hair', label: 'العناية بالشعر 💇‍♀️' },
            { id: 'body', label: 'العناية بالجسم والبشرة ✨' },
            { id: 'bundles', label: 'بكجات وعروض خاصة 🎁' },
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
