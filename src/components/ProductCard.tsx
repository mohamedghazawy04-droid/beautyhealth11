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
    <div className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-400/70 shadow-xs hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden group">
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.nameAr}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end z-10">
          {discountPercent > 0 && (
            <span className="bg-rose-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-xs">
              خصم {discountPercent}%
            </span>
          )}
          {product.badges && product.badges.length > 0 && (
            <span className="bg-emerald-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
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
          className={`absolute top-2.5 left-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer shadow-sm ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-300'
              : 'bg-white/80 backdrop-blur-xs text-stone-600 hover:text-rose-500 hover:bg-white'
          }`}
          title={isWishlisted ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute inset-x-4 bottom-3 py-2 rounded-xl bg-white/90 backdrop-blur-md text-stone-900 font-bold text-xs flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white cursor-pointer"
        >
          <Eye className="w-4 h-4 text-emerald-700" />
          معاينة وتفاصيل سريعة
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 text-right">
        <div className="space-y-1.5">
          {/* Brand & Volume */}
          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span className="font-bold text-emerald-700 uppercase tracking-wider">{product.brand}</span>
            <span className="bg-stone-100 px-2 py-0.5 rounded-md font-medium">{product.volume}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-bold text-stone-900 text-sm leading-snug line-clamp-2 hover:text-emerald-700 cursor-pointer transition-colors"
            title={product.nameAr}
          >
            {product.nameAr}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/80 text-amber-900 font-extrabold text-[11px]">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
              <span>{typeof product.rating === 'number' ? product.rating.toFixed(1) : product.rating}</span>
            </div>
            <span className="text-stone-400 text-[11px]">({product.reviewsCount} تقييم)</span>
          </div>

          {/* Fast Delivery Badge */}
          {product.isOctoberZayedFastDelivery && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold pt-0.5">
              <Truck className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>توصيل سريع متاح</span>
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-stone-900">
                {product.price} <span className="text-xs font-normal">جنيه</span>
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  {product.originalPrice} ج
                </span>
              )}
            </div>
          </div>

          {/* Add To Cart */}
          <button
            onClick={() => onAddToCart(product)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              cartQuantity > 0
                ? 'bg-emerald-800 text-white hover:bg-emerald-900 ring-2 ring-emerald-400/30'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            {cartQuantity > 0 ? (
              <>
                <Check className="w-3.5 h-3.5 text-amber-300" />
                <span>في السلة ({cartQuantity})</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>أضف للسلة</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
