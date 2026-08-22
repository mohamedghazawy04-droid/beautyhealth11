import React from 'react';
import {
  Truck,
  Sparkles,
  ShieldCheck,
  Zap,
  Gift,
  ArrowLeft,
  Smartphone,
  MessageCircle,
  Download,
  Flame,
  ChevronLeft,
} from 'lucide-react';

interface HeroBannerProps {
  onSelectCategory: (catId: string) => void;
  onOpenInstallApp?: () => void;
  storeWhatsApp?: string;
  selectedZone?: any;
  onOpenZoneModal?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectCategory,
  onOpenInstallApp,
  storeWhatsApp = '201012345678',
}) => {
  const cleanWhatsApp = storeWhatsApp.replace(/\D/g, '');

  return (
    <div className="text-right">
      {/* Mobile Compact Hero (sm:hidden): Sleek & Space-Saving so products stay right in view */}
      <div className="block sm:hidden mx-3 my-2.5 p-3 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white shadow-md border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-800/90 text-emerald-200 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              منتجات أصلية ١٠٠٪
            </span>
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=مرحباً، أود الاستفسار عن منتجات المتجر`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-emerald-300 font-bold flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>واتساب المبيعات</span>
            </a>
          </div>

          <h1 className="text-sm font-extrabold leading-snug">
            منتجات العناية بالبشرة والشعر ومستلزمات الأطفال والرضع
          </h1>

          {/* Quick Categories Bar on Mobile */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            <button
              onClick={() => onSelectCategory('baby')}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-95"
            >
              <span className="text-base">👶</span>
              <span className="text-[10px] font-bold mt-0.5 text-stone-200">الطفل</span>
            </button>
            <button
              onClick={() => onSelectCategory('hair')}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-95"
            >
              <span className="text-base">💇‍♀️</span>
              <span className="text-[10px] font-bold mt-0.5 text-stone-200">الشعر</span>
            </button>
            <button
              onClick={() => onSelectCategory('body')}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-95"
            >
              <span className="text-base">✨</span>
              <span className="text-[10px] font-bold mt-0.5 text-stone-200">البشرة</span>
            </button>
            <button
              onClick={() => onSelectCategory('bundles')}
              className="p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-95 text-amber-300"
            >
              <span className="text-base">🎁</span>
              <span className="text-[10px] font-bold mt-0.5">البكجات</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop / Tablet Full Hero (hidden on small mobile screens) */}
      <div className="hidden sm:block relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 text-white rounded-3xl my-4 mx-4 sm:mx-6 lg:mx-8 shadow-xl border border-emerald-800/40">
        {/* Decorative background effects */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-8 sm:py-10 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left / Main Text info */}
            <div className="lg:col-span-7 space-y-4">
              {/* Top Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-bold shadow-inner">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                توصيل سريع وطلب مباشر عبر واتساب متاح الآن
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug">
                أفضل منتجات <span className="text-emerald-400">العناية بالجسم والشعر</span> ومستلزمات <span className="text-amber-300">الأطفال والرضع</span>
              </h1>

              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-xl">
                تصفح مجموعتنا المميزة من المنتجات الأصلية 100%، أضف ما يناسبك إلى السلة وسيتم إرسال تفاصيل طلبك وعنوانك برسالة واتساب فورية للتأكيد والتوصيل السريع.
              </p>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {onOpenInstallApp && (
                  <button
                    onClick={onOpenInstallApp}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-stone-950" />
                    <span>تثبيت التطبيق على الموبايل 📲</span>
                  </button>
                )}

                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=مرحباً، أود الاستفسار عن منتجات المتجر`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>محادثة واتساب مباشرة</span>
                </a>
              </div>
            </div>

            {/* Right Highlights Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-2.5 sm:gap-3">
              {/* Card 1: Baby Care */}
              <div
                onClick={() => onSelectCategory('baby')}
                className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-900/30 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer group"
              >
                <div className="text-xl mb-1">👶</div>
                <h2 className="font-extrabold text-white text-sm group-hover:text-amber-300 transition-colors">
                  عناية الأطفال
                </h2>
                <p className="text-[11px] text-stone-300 mt-0.5 line-clamp-2">
                  شامبوهات، كريمات حفاض، ومجموعات حديثي الولادة.
                </p>
                <span className="inline-block mt-2 text-[10px] text-amber-300 font-bold group-hover:underline">
                  تسوق الطفل ←
                </span>
              </div>

              {/* Card 2: Hair Care */}
              <div
                onClick={() => onSelectCategory('hair')}
                className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-900/30 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer group"
              >
                <div className="text-xl mb-1">💇‍♀️</div>
                <h2 className="font-extrabold text-white text-sm group-hover:text-emerald-300 transition-colors">
                  عناية الشعر
                </h2>
                <p className="text-[11px] text-stone-300 mt-0.5 line-clamp-2">
                  زيوت وسيرومات إنبات، روتين الكيرلي والترميم.
                </p>
                <span className="inline-block mt-2 text-[10px] text-emerald-300 font-bold group-hover:underline">
                  تسوق الشعر ←
                </span>
              </div>

              {/* Card 3: Body & Skin Care */}
              <div
                onClick={() => onSelectCategory('body')}
                className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-teal-500/20 to-sky-900/30 border border-teal-500/30 hover:border-teal-400 transition-all cursor-pointer group"
              >
                <div className="text-xl mb-1">✨</div>
                <h2 className="font-extrabold text-white text-sm group-hover:text-teal-300 transition-colors">
                  الجسم والبشرة
                </h2>
                <p className="text-[11px] text-stone-300 mt-0.5 line-clamp-2">
                  كريمات ترطيب، واقي شمس، ومقشرات فاخرة.
                </p>
                <span className="inline-block mt-2 text-[10px] text-teal-300 font-bold group-hover:underline">
                  تسوق البشرة ←
                </span>
              </div>

              {/* Card 4: Bundles */}
              <div
                onClick={() => onSelectCategory('bundles')}
                className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-900/30 border border-rose-500/30 hover:border-rose-400 transition-all cursor-pointer group"
              >
                <div className="text-xl mb-1">🎁</div>
                <h2 className="font-extrabold text-white text-sm group-hover:text-rose-300 transition-colors">
                  بكجات وعروض
                </h2>
                <p className="text-[11px] text-stone-300 mt-0.5 line-clamp-2">
                  مجموعات توفير متكاملة وهدايا مواليد بأسعار مميزة.
                </p>
                <span className="inline-block mt-2 text-[10px] text-rose-300 font-bold group-hover:underline">
                  تصفح البكجات ←
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
