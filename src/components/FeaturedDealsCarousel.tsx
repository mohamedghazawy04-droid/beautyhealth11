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
      // In RTL or standard scroll Left/Right
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
      const scrollAmount = 320;
      // Note: for RTL containers, scrollLeft can be negative or positive depending on browser implementation
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
    <section className="mx-4 sm:mx-6 lg:mx-8 mb-8 relative">
      {/* Container with distinct border & soft glowing gradient background */}
      <div className="bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-emerald-500/10 rounded-3xl p-4 sm:p-6 border border-amber-200/80 shadow-sm relative overflow-hidden text-right">
        {/* Subtle Decorative Elements */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-rose-400/15 rounded-full blur-2xl pointer-events-none" />

        {/* Carousel Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-200/60 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                  العروض والتخفيضات المميزة
                </h2>
                <span className="bg-rose-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Percent className="w-3 h-3" />
                  {dealProducts.length} عرض حصري
                </span>
              </div>
              <p className="text-xs text-stone-600 font-medium mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                توفير فوري على المنتجات الأكثر طلباً في أكتوبر وزايد
              </p>
            </div>
          </div>

          {/* Carousel Navigation Buttons (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                canScrollRight
                  ? 'bg-white hover:bg-amber-50 border-amber-300 text-stone-800'
                  : 'bg-stone-100 border-stone-200 text-stone-300 cursor-not-allowed'
              }`}
              title="السابق"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                canScrollLeft
                  ? 'bg-white hover:bg-amber-50 border-amber-300 text-stone-800'
                  : 'bg-stone-100 border-stone-200 text-stone-300 cursor-not-allowed'
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
          className="flex gap-4 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x snap-mandatory scroll-smooth relative z-10"
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
                className="w-[240px] sm:w-[270px] shrink-0 snap-start bg-white rounded-2xl border border-amber-200/90 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Image & Ribbon Banner */}
                <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.nameAr}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Top Floating Discount Badges */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                    <span className="bg-gradient-to-r from-rose-600 to-amber-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-white" />
                      خصم {discountPercent}%
                    </span>
                    {savingsAmount > 0 && (
                      <span className="bg-emerald-900/90 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs shadow-xs">
                        وفر {savingsAmount} ج.م
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer shadow-xs ${
                      isWishlisted
                        ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-300'
                        : 'bg-white/80 backdrop-blur-xs text-stone-600 hover:text-rose-500 hover:bg-white'
                    }`}
                    title={isWishlisted ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  {/* Quick View Button on Hover */}
                  <button
                    onClick={() => onQuickView(product)}
                    className="absolute inset-x-3 bottom-2.5 py-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-900 backdrop-blur-md text-white font-bold text-xs flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-300" />
                    عرض التفاصيل
                  </button>
                </div>

                {/* Body Details */}
                <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
                  <div className="space-y-1">
                    {/* Brand & Rating */}
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-extrabold text-amber-800 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                        {product.brand}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{product.rating}</span>
                        <span className="text-stone-400 text-[10px]">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3
                      onClick={() => onQuickView(product)}
                      className="font-bold text-stone-900 text-xs sm:text-sm line-clamp-2 hover:text-emerald-800 cursor-pointer transition-colors leading-snug pt-0.5"
                      title={product.nameAr}
                    >
                      {product.nameAr}
                    </h3>
                  </div>

                  {/* Pricing and Add to Cart */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-lg font-black text-rose-600">
                          {product.price}
                        </span>
                        <span className="text-[10px] font-bold text-stone-500">ج.م</span>
                      </div>
                      {product.originalPrice && (
                        <div className="text-[11px] text-stone-400 line-through font-semibold -mt-1">
                          {product.originalPrice} ج.م
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onAddToCart(product)}
                      className={`h-9 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                        inCartCount > 0
                          ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                          : 'bg-amber-500 hover:bg-amber-600 text-white'
                      }`}
                    >
                      {inCartCount > 0 ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>في السلة ({inCartCount})</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>شراء بالعرض</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="flex sm:hidden items-center justify-center gap-1 text-[11px] text-stone-500 mt-2 font-medium">
          <span>👈 اسحب لليسار لمشاهدة بقية العروض الحصرية</span>
        </div>
      </div>
    </section>
  );
};
