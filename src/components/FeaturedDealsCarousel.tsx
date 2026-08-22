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
        <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-pink-200/70 relative z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-pink-600 text-white flex items-center justify-center shadow-xs">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
                  عروض وخصومات مميزة لكِ
                </h2>
                <span className="bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                  <Percent className="w-2.5 h-2.5" />
                  {dealProducts.length} عرض حصري
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-pink-900/70 font-medium">
                توفير فوري وعناية فائقة بأفضل الأسعار
              </p>
            </div>
          </div>

          {/* Carousel Navigation Buttons (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                canScrollRight
                  ? 'bg-white hover:bg-pink-50 border-pink-200 text-pink-900'
                  : 'bg-pink-50/50 border-pink-100 text-stone-300 cursor-not-allowed'
              }`}
              title="السابق"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                canScrollLeft
                  ? 'bg-white hover:bg-pink-50 border-pink-200 text-pink-900'
                  : 'bg-pink-50/50 border-pink-100 text-stone-300 cursor-not-allowed'
              }`}
              title="التالي"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Carousel Track */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-2.5 sm:gap-4 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory scroll-smooth relative z-10"
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
                className="w-[175px] sm:w-[240px] shrink-0 snap-start bg-white rounded-xl sm:rounded-2xl border border-pink-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Image & Ribbon Banner */}
                <div className="relative aspect-[4/3] w-full bg-pink-50/50 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.nameAr}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Top Floating Discount Badges */}
                  <div className="absolute top-1.5 right-1.5 flex flex-col gap-0.5 items-end z-10">
                    <span className="bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5 fill-white" />
                      خصم {discountPercent}%
                    </span>
                    {savingsAmount > 0 && (
                      <span className="bg-[#3d0e23]/90 text-pink-200 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded-md backdrop-blur-xs">
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
                    className={`absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer shadow-xs ${
                      isWishlisted
                        ? 'bg-pink-50 text-pink-600 ring-1 ring-pink-300'
                        : 'bg-white/80 backdrop-blur-xs text-stone-600 hover:text-pink-500 hover:bg-white'
                    }`}
                    title={isWishlisted ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                  >
                    <Heart className={`w-3 h-3 ${isWishlisted ? 'fill-pink-500 text-pink-500' : ''}`} />
                  </button>
                </div>

                {/* Body Details */}
                <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between gap-1.5">
                  <div className="space-y-0.5">
                    {/* Brand & Rating */}
                    <div className="flex items-center justify-between text-[9px] sm:text-[10px]">
                      <span className="font-extrabold text-pink-700 uppercase bg-pink-50 px-1.5 py-0.5 rounded border border-pink-200/60 truncate max-w-[90px]">
                        {product.brand}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3
                      onClick={() => onQuickView(product)}
                      className="font-bold text-stone-900 text-[11px] sm:text-xs line-clamp-2 hover:text-pink-600 cursor-pointer transition-colors leading-snug pt-0.5"
                      title={product.nameAr}
                    >
                      {product.nameAr}
                    </h3>
                  </div>

                  {/* Pricing and Add to Cart */}
                  <div className="pt-1.5 border-t border-pink-100 flex items-center justify-between gap-1">
                    <div>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xs sm:text-sm font-black text-pink-700">
                          {product.price}
                        </span>
                        <span className="text-[9px] font-bold text-stone-500">ج.م</span>
                      </div>
                      {product.originalPrice && (
                        <div className="text-[9px] text-stone-400 line-through -mt-0.5">
                          {product.originalPrice} ج
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onAddToCart(product)}
                      className={`h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg font-bold text-[10px] sm:text-xs flex items-center gap-1 transition-all cursor-pointer shadow-2xs shrink-0 ${
                        inCartCount > 0
                          ? 'bg-rose-900 text-white hover:bg-rose-950'
                          : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white'
                      }`}
                    >
                      {inCartCount > 0 ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>({inCartCount})</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
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
