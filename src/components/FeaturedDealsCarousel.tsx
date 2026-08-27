import React, { useRef, useState, useEffect } from 'react';
import {
  Flame,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Percent,
  Plus,
  Check,
  Eye,
  Heart,
  Star,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Product } from '../types';

interface FeaturedDealsCarouselProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (product: Product) => void;
  cart: { product: Product; quantity: number }[];
}

export const FeaturedDealsCarousel: React.FC<FeaturedDealsCarouselProps> = ({
  products,
  onAddToCart,
  onQuickView,
  wishlist,
  onToggleWishlist,
  cart,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Filter products that have active discounts
  const dealProducts = products.filter(
    (p) => p.originalPrice && p.originalPrice > p.price
  );

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const currentScroll = Math.abs(scrollLeft);
      setCanScrollLeft(currentScroll > 10);
      setCanScrollRight(currentScroll < maxScroll - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [dealProducts]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 260;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 350);
    }
  };

  if (dealProducts.length === 0) {
    return null;
  }

  return (
    <section className="mx-3 sm:mx-6 lg:mx-8 mb-6 relative">
      {/* Container with soft rose & blush glowing gradient background */}
      <div className="bg-gradient-to-br from-pink-500/10 via-rose-500/10 to-purple-500/5 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-pink-200/90 shadow-xs relative overflow-hidden text-right">
        {/* Soft Decorative glow */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-pink-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-rose-400/15 rounded-full blur-2xl pointer-events-none" />

        {/* Carousel Header */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b-2 border-pink-200/80 relative z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-600 to-pink-700 text-white flex items-center justify-center shadow-md">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                  عروض وخصومات مميزة لكِ 🔥
                </h2>
                <span className="bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Percent className="w-3 h-3" />
                  {dealProducts.length} عرض حصري
                </span>
              </div>
              <p className="text-xs text-rose-950 font-bold mt-0.5">
                توفير فوري وعناية فائقة بأفضل الأسعار المتاحة
              </p>
            </div>
          </div>

          {/* Carousel Navigation Buttons (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                canScrollRight
                  ? 'bg-white hover:bg-pink-100 border-pink-300 text-pink-950 font-bold'
                  : 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
              }`}
              title="السابق"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                canScrollLeft
                  ? 'bg-white hover:bg-pink-100 border-pink-300 text-pink-950 font-bold'
                  : 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
              }`}
              title="التالي"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Carousel Track */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth relative z-10 overscroll-x-contain max-w-full touch-pan-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {dealProducts.map((product) => {
            const discountPercent = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;
            const savingsAmount = product.originalPrice
              ? Math.round(product.originalPrice - product.price)
              : 0;
            const isWishlisted = wishlist.includes(product.id);
            const cartItem = cart.find((i) => i.product.id === product.id);
            const inCartCount = cartItem ? cartItem.quantity : 0;

            return (
              <div
                key={product.id}
                className="w-[185px] sm:w-[245px] shrink-0 snap-start bg-white rounded-2xl border-2 border-pink-200/90 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Image & Ribbon Banner */}
                <div className="relative aspect-[4/3] w-full bg-stone-50 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.nameAr}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Top Floating Discount Badges */}
                  <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 items-end z-10">
                    <span className="bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-md shadow-md flex items-center gap-1 border border-white/30">
                      <Flame className="w-3 h-3 fill-white" />
                      خصم {discountPercent}%
                    </span>
                    {savingsAmount > 0 && (
                      <span className="bg-slate-900/90 text-pink-200 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md backdrop-blur-xs border border-slate-700">
                        وفري {savingsAmount}ج
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    className={`absolute top-1.5 left-1.5 w-7 h-7 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer shadow-md ${
                      isWishlisted
                        ? 'bg-rose-50 text-rose-600 ring-2 ring-rose-300'
                        : 'bg-white/95 text-slate-600 hover:text-rose-600 hover:bg-white border border-stone-200'
                    }`}
                    title={isWishlisted ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Body Details */}
                <div className="p-3 flex flex-col flex-1 justify-between gap-1.5 text-right">
                  <div className="space-y-1">
                    {/* Brand & Rating */}
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-black text-pink-900 uppercase bg-pink-100/90 px-2 py-0.5 rounded-md border border-pink-300 truncate max-w-[90px]">
                        {product.brand}
                      </span>
                      <div className="flex items-center gap-1 bg-amber-100 px-1.5 py-0.5 rounded-md text-amber-950 font-black border border-amber-300">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3
                      onClick={() => onQuickView(product)}
                      className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-2 hover:text-pink-600 cursor-pointer transition-colors leading-snug pt-0.5"
                      title={product.nameAr}
                    >
                      {product.nameAr}
                    </h3>
                  </div>

                  {/* Pricing and Add to Cart */}
                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between gap-1">
                    <div>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-sm sm:text-base font-black text-rose-700">
                          {product.price}
                        </span>
                        <span className="text-[10px] font-black text-slate-700">ج.م</span>
                      </div>
                      {product.originalPrice && (
                        <div className="text-[10px] text-slate-400 font-bold line-through -mt-0.5">
                          {product.originalPrice} ج
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onAddToCart(product)}
                      className={`h-8 px-3 rounded-xl font-black text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-sm shrink-0 ${
                        inCartCount > 0
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-950/20'
                          : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-pink-600/30'
                      }`}
                    >
                      {inCartCount > 0 ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-200" />
                          <span>({inCartCount})</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>شراء</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
