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
    <div className="bg-white rounded-xl sm:rounded-2xl border border-stone-200 hover:border-emerald-400/70 shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.nameAr}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 flex flex-col gap-0.5 sm:gap-1 items-end z-10">
          {discountPercent > 0 && (
            <span className="bg-rose-500 text-white text-[9px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-full shadow-2xs">
              خصم {discountPercent}%
            </span>
          )}
          {product.badges && product.badges.length > 0 && (
            <span className="bg-emerald-800 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-full shadow-2xs">
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
          className={`absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer shadow-xs ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-300'
              : 'bg-white/80 backdrop-blur-xs text-stone-600 hover:text-rose-500 hover:bg-white'
          }`}
          title={isWishlisted ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute inset-x-2.5 bottom-2 sm:inset-x-4 sm:bottom-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/90 backdrop-blur-md text-stone-900 font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-emerald-700" />
          معاينة وتفاصيل
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-2 text-right">
        <div className="space-y-1">
          {/* Brand & Volume */}
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-stone-500">
            <span className="font-extrabold text-emerald-700 uppercase tracking-wider truncate max-w-[80px] sm:max-w-none">
              {product.brand}
            </span>
            <span className="bg-stone-100 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-medium truncate">
              {product.volume}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-bold text-stone-900 text-xs sm:text-sm leading-snug line-clamp-2 hover:text-emerald-700 cursor-pointer transition-colors pt-0.5"
            title={product.nameAr}
          >
            {product.nameAr}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[10px] sm:text-xs">
            <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80 text-amber-900 font-extrabold text-[10px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500 shrink-0" />
              <span>{typeof product.rating === 'number' ? product.rating.toFixed(1) : product.rating}</span>
            </div>
            <span className="text-stone-400 text-[10px]">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between gap-1 sm:gap-2">
          <div>
            <div className="flex items-baseline gap-0.5 sm:gap-1">
              <span className="text-xs sm:text-base font-black text-stone-900">
                {product.price}
              </span>
              <span className="text-[9px] sm:text-xs text-stone-500">ج.م</span>
            </div>
            {product.originalPrice && (
              <span className="text-[9px] sm:text-xs text-stone-400 line-through block -mt-0.5">
                {product.originalPrice} ج
              </span>
            )}
          </div>

          {/* Add To Cart */}
          <button
            onClick={() => onAddToCart(product)}
            className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs shrink-0 ${
              cartQuantity > 0
                ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            {cartQuantity > 0 ? (
              <>
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
                <span>({cartQuantity})</span>
              </>
            ) : (
              <>
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">أضف للسلة</span>
                <span className="sm:hidden">أضف</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
