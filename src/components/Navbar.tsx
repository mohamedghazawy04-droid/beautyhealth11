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
  X,
} from 'lucide-react';
import { StoreSettings } from '../types';

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
  selectedZone?: any;
  onOpenZoneModal?: () => void;
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
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-xs text-right transition-all">
      {/* Top Banner: Elegant dark rose/berry banner with pink highlights */}
      <div className="bg-gradient-to-r from-[#3b0d21] via-[#5c1334] to-[#3b0d21] text-pink-100 text-[11px] sm:text-xs py-1 px-3 sm:px-4 border-b border-pink-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Announcement text */}
          <div className="flex items-center gap-2 truncate">
            <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-300 shrink-0" />
            <span className="truncate font-medium">
              {storeSettings?.announcementText || 'توصيل سريع لمحافظات مصر | عناية وأناقة فائقة لكِ ولطفلك!'}
            </span>
          </div>

          {/* Quick Links & Admin */}
          <div className="flex items-center gap-2 shrink-0">
            {onOpenInstallApp && (
              <button
                onClick={onOpenInstallApp}
                className="hidden sm:flex px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-300 hover:to-rose-300 text-stone-950 transition-all cursor-pointer items-center gap-1 font-black text-[10px] sm:text-[11px] shadow-xs"
              >
                <Download className="w-3 h-3" />
                <span>التطبيق 📲</span>
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
              href={`https://wa.me/${(storeSettings?.contactWhatsApp || '201012345678').replace(/\D/g, '')}?text=مرحباً، أود الاستفسار عن منتجات المتجر`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1 text-pink-300 hover:text-pink-100 font-bold transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>واتساب</span>
            </a>

            <button
              onClick={onOpenAdmin}
              className="px-2 py-0.5 rounded-md bg-rose-900/80 hover:bg-rose-800 text-pink-200 hover:text-white text-[10px] sm:text-[11px] font-black cursor-pointer flex items-center gap-1 border border-pink-700/60"
              title="لوحة تحكم المدير"
            >
              <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-pink-300" />
              <span>المدير</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar Row: Compact & Feminine Pink Theme */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Name: Signature Pink m&l with soft glow & elegant typography */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative group cursor-pointer">
              {/* Pink Glow Background */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-rose-400 rounded-2xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md font-black text-sm sm:text-base tracking-tight border border-pink-200/50">
                <span className="font-['Playfair_Display',Georgia,serif] lowercase font-black tracking-tighter drop-shadow-xs">
                  m<span className="text-pink-100 font-serif">&</span>l
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
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

          {/* Search Input on Desktop */}
          <div className="hidden md:flex flex-1 max-w-md relative mx-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحثي عن منتج، ماركة، أو علاج للبشرة والشعر..."
              className="w-full pl-4 pr-9 py-1.5 rounded-xl bg-pink-50/50 border border-pink-200/80 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all text-stone-800 placeholder:text-stone-400"
            />
            <Search className="w-3.5 h-3.5 text-pink-400 absolute right-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs bg-pink-100 hover:bg-pink-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Toggle Search for Mobile */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className={`md:hidden p-2 rounded-xl transition-colors cursor-pointer border ${
                showMobileSearch || searchQuery
                  ? 'bg-pink-50 text-pink-700 border-pink-300 ring-2 ring-pink-200'
                  : 'bg-stone-50 text-stone-700 border-stone-200'
              }`}
              title="بحث"
            >
              <Search className="w-4 h-4" />
            </button>

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

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="p-2 sm:p-2.5 rounded-xl bg-stone-50 hover:bg-pink-50 text-stone-700 hover:text-pink-600 border border-stone-200 hover:border-pink-200 transition-colors relative cursor-pointer"
              title="المفضلة"
            >
              <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-pink-500" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[9px] sm:text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-pink-500/20 transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-300 text-stone-950 text-[10px] sm:text-[11px] font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">السلة</span>
            </button>
          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {(showMobileSearch || searchQuery) && (
          <div className="mt-2 md:hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحثي عن منتج، ماركة، أو علاج..."
                className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-pink-50/70 border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all text-stone-800"
                autoFocus
              />
              <Search className="w-3.5 h-3.5 text-pink-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs bg-pink-100 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3 h-3 text-pink-700" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Horizontal Categories Scroll Bar: Feminine Pink & Rose Pills */}
        <nav className="flex items-center gap-1.5 sm:gap-2 pt-2 overflow-x-auto pb-0.5 scrollbar-none text-xs font-semibold">
          {onOpenCategories && (
            <button
              onClick={onOpenCategories}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg whitespace-nowrap bg-pink-100 hover:bg-pink-200 text-pink-900 font-extrabold transition-all cursor-pointer border border-pink-300 shadow-2xs shrink-0 text-[11px] sm:text-xs"
              title="تصفح جميع الأقسام بالتفصيل"
            >
              <Grid className="w-3 h-3 text-pink-700" />
              <span>الأقسام</span>
            </button>
          )}

          {[
            { id: 'all', label: 'الكل 🛍️' },
            { id: 'baby', label: 'الطفل والرضع 👶' },
            { id: 'hair', label: 'عناية الشعر 💇‍♀️' },
            { id: 'body', label: 'البشرة والجسم ✨' },
            { id: 'bundles', label: 'عروض وبكجات 🎁' },
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
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all cursor-pointer text-[11px] sm:text-xs shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-xs font-extrabold'
                  : 'bg-pink-50/60 text-stone-700 hover:bg-pink-100 hover:text-pink-900 border border-pink-100'
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
