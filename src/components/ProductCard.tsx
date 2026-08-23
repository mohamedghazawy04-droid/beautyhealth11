import React from 'react';
import {
  Star,
  Plus,
  Heart,
  Eye,
  Truck,
  Check,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  cartQuantity: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  isWishlisted,
  onToggleWishlist,
  cartQuantity,
}) => {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-stone-200/90 hover:border-pink-400 shadow-sm hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-stone-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.nameAr}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex flex-col gap-1 items-end z-10">
          {discountPercent > 0 && (
            <span
              id={`discount-badge-${product.id}`}
              className="bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-md shadow-md border border-white/30 tracking-tight whitespace-nowrap"
            >
              خصم {discountPercent}%
            </span>
          )}
          {product.badges && product.badges.length > 0 && (
            <span className="bg-slate-900/90 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm border border-slate-700">
              {product.badges[0]}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer shadow-md ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 ring-2 ring-rose-300'
              : 'bg-white/95 text-slate-600 hover:text-rose-600 hover:bg-white border border-stone-200'
          }`}
          title={isWishlisted ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute inset-x-2.5 bottom-2 sm:inset-x-4 sm:bottom-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-pink-300" />
          معاينة وتفاصيل
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-2 text-right">
        <div className="space-y-1">
          {/* Brand & Volume */}
          <div className="flex items-center justify-between text-[9px] sm:text-[11px]">
            <span className="font-black text-pink-800 uppercase tracking-wider bg-pink-100/80 px-2 py-0.5 rounded-md border border-pink-300 truncate max-w-[80px] sm:max-w-none">
              {product.brand}
            </span>
            <span className="bg-stone-100 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold text-slate-700 truncate border border-stone-200">
              {product.volume}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2 hover:text-pink-600 cursor-pointer transition-colors pt-0.5"
            title={product.nameAr}
          >
            {product.nameAr}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs">
            <div className="flex items-center gap-0.5 bg-amber-100 px-1.5 py-0.5 rounded-md border border-amber-300 text-amber-950 font-black text-[10px]">
              <Star className="w-3 h-3 fill-amber-500 text-amber-600 shrink-0" />
              <span>{typeof product.rating === 'number' ? product.rating.toFixed(1) : product.rating}</span>
            </div>
            <span className="text-slate-500 font-bold text-[10px]">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-stone-200 flex items-center justify-between gap-1 sm:gap-2">
          <div>
            <div className="flex items-baseline gap-0.5 sm:gap-1">
              <span className="text-sm sm:text-base font-black text-rose-700">
                {product.price}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-700 font-black">ج.م</span>
            </div>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-slate-400 font-bold line-through block -mt-0.5">
                {product.originalPrice} ج
              </span>
            )}
          </div>

          {/* Add To Cart */}
          <button
            onClick={() => onAddToCart(product)}
            className={`px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black transition-all flex items-center gap-1 cursor-pointer shadow-sm shrink-0 ${
              cartQuantity > 0
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-900/20'
                : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-pink-600/30'
            }`}
          >
            {cartQuantity > 0 ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-200" />
                <span>({cartQuantity})</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">أضيفي للسلة</span>
                <span className="sm:hidden">أضف</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
