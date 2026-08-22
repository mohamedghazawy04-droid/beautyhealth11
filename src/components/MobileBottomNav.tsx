import React from 'react';
import { Home, Grid, Heart, Package, ShoppingBag } from 'lucide-react';
import { MainCategory } from '../types';

interface MobileBottomNavProps {
  activeCategory: MainCategory;
  onSelectCategory: (cat: MainCategory) => void;
  onOpenCategories: () => void;
  onOpenCart: () => void;
  cartCount: number;
  onOpenWishlist: () => void;
  wishlistCount: number;
  onOpenOrderTracking: () => void;
  onScrollToTop: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenCategories,
  onOpenCart,
  cartCount,
  onOpenWishlist,
  wishlistCount,
  onOpenOrderTracking,
  onScrollToTop,
}) => {
  return (
    <div
      id="mobile-bottom-app-bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-100 shadow-[0_-2px_12px_rgba(244,63,94,0.06)] px-3 py-1 pb-[max(0.25rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home Button */}
        <button
          id="mobile-nav-home"
          type="button"
          onClick={() => {
            onSelectCategory('all');
            onScrollToTop();
          }}
          className={`flex flex-col items-center justify-center py-0.5 px-2 rounded-lg transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'text-pink-600 font-black'
              : 'text-stone-500 hover:text-pink-600'
          }`}
        >
          <Home className={`w-4 h-4 ${activeCategory === 'all' ? 'stroke-[2.5px] text-pink-600' : ''}`} />
          <span className="text-[9px] mt-0.5 font-medium leading-none">الرئيسية</span>
        </button>

        {/* Categories Button */}
        <button
          id="mobile-nav-categories"
          type="button"
          onClick={onOpenCategories}
          className={`flex flex-col items-center justify-center py-0.5 px-2 rounded-lg transition-all cursor-pointer ${
            activeCategory !== 'all'
              ? 'text-pink-600 font-black'
              : 'text-stone-500 hover:text-pink-600'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span className="text-[9px] mt-0.5 font-medium leading-none">الأقسام</span>
        </button>

        {/* Wishlist Button */}
        <button
          id="mobile-nav-wishlist"
          type="button"
          onClick={onOpenWishlist}
          className="relative flex flex-col items-center justify-center py-0.5 px-2 rounded-lg text-stone-500 hover:text-pink-600 transition-all cursor-pointer"
        >
          <div className="relative">
            <Heart className="w-4 h-4 text-pink-500" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-pink-600 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[9px] mt-0.5 font-medium leading-none">المفضلة</span>
        </button>

        {/* Orders Tracking */}
        <button
          id="mobile-nav-orders"
          type="button"
          onClick={onOpenOrderTracking}
          className="flex flex-col items-center justify-center py-0.5 px-2 rounded-lg text-stone-500 hover:text-pink-600 transition-all cursor-pointer"
        >
          <Package className="w-4 h-4" />
          <span className="text-[9px] mt-0.5 font-medium leading-none">طلباتي</span>
        </button>

        {/* Cart Button */}
        <button
          id="mobile-nav-cart"
          type="button"
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-0.5 px-2 rounded-lg text-stone-500 hover:text-pink-600 transition-all cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-pink-600 text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center animate-bounce shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[9px] mt-0.5 font-medium leading-none">السلة</span>
        </button>
      </div>
    </div>
  );
};

