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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-[0_-4px_20px_rgba(0,0,0,0.07)] px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around">
        {/* Home Button */}
        <button
          id="mobile-nav-home"
          type="button"
          onClick={() => {
            onSelectCategory('all');
            onScrollToTop();
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'text-emerald-700 font-extrabold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Home className={`w-5 h-5 ${activeCategory === 'all' ? 'stroke-[2.5px]' : ''}`} />
          <span className="text-[10px] mt-0.5 font-medium">الرئيسية</span>
        </button>

        {/* Categories Button */}
        <button
          id="mobile-nav-categories"
          type="button"
          onClick={onOpenCategories}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeCategory !== 'all'
              ? 'text-emerald-700 font-extrabold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">الأقسام</span>
        </button>

        {/* Wishlist Button */}
        <button
          id="mobile-nav-wishlist"
          type="button"
          onClick={onOpenWishlist}
          className="relative flex flex-col items-center justify-center py-1 px-2 rounded-xl text-stone-500 hover:text-stone-800 transition-all cursor-pointer"
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium">المفضلة</span>
        </button>

        {/* Orders Tracking */}
        <button
          id="mobile-nav-orders"
          type="button"
          onClick={onOpenOrderTracking}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-stone-500 hover:text-stone-800 transition-all cursor-pointer"
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">طلباتي</span>
        </button>

        {/* Cart Button */}
        <button
          id="mobile-nav-cart"
          type="button"
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 px-2 rounded-xl text-stone-500 hover:text-stone-800 transition-all cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium">السلة</span>
        </button>
      </div>
    </div>
  );
};
