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
} from 'lucide-react';

interface HeroBannerProps {
  onSelectCategory: (catId: string) => void;
  onOpenInstallApp?: () => void;
  storeWhatsApp?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectCategory,
  onOpenInstallApp,
  storeWhatsApp = '201012345678',
}) => {
  const cleanWhatsApp = storeWhatsApp.replace(/\D/g, '');

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 text-white rounded-3xl my-4 mx-4 sm:mx-6 lg:mx-8 shadow-xl border border-emerald-800/40 text-right">
      {/* Decorative background effects */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-8 sm:py-12 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left / Main Text info */}
          <div className="lg:col-span-7 space-y-5">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-bold shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              خدمة الطلب المباشر عبر واتساب متاحة الآن لجميع المدن
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-snug">
              أفضل منتجات <span className="text-emerald-400">العناية بالجسم والشعر</span> ومستلزمات <span className="text-amber-300">الأطفال والرضع</span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
              تصفح مجموعتنا المميزة من المنتجات الأصلية 100%، أضف ما يناسبك إلى السلة وسيتم إرسال تفاصيل طلبك وعنوانك برسالة واتساب فورية للتأكيد والتوصيل السريع.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {onOpenInstallApp && (
                <button
                  onClick={onOpenInstallApp}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-amber-900/20 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-stone-950" />
                  <span>تثبيت التطبيق على الموبايل 📲</span>
                </button>
              )}

              <a
                href={`https://wa.me/${cleanWhatsApp}?text=مرحباً، أود الاستفسار عن منتجات المتجر`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>محادثة واتساب مباشرة</span>
              </a>
            </div>
          </div>

          {/* Right Highlights Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            {/* Card 1: Baby Care */}
            <div
              onClick={() => onSelectCategory('baby')}
              className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-900/30 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer group"
            >
              <div className="text-2xl mb-2">👶</div>
              <h2 className="font-extrabold text-white text-base group-hover:text-amber-300 transition-colors">
                عناية الأطفال والرضع
              </h2>
              <p className="text-xs text-stone-300 mt-1">
                شامبوهات أطفال، كريمات الحفاض، مستلزمات النظافة ومجموعات حديثي الولادة.
              </p>
              <span className="inline-block mt-3 text-[11px] text-amber-300 font-bold group-hover:underline">
                تسوق منتجات الطفل ←
              </span>
            </div>

            {/* Card 2: Hair Care */}
            <div
              onClick={() => onSelectCategory('hair')}
              className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-900/30 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer group"
            >
              <div className="text-2xl mb-2">💇‍♀️</div>
              <h2 className="font-extrabold text-white text-base group-hover:text-emerald-300 transition-colors">
                عناية الشعر والتساقط
              </h2>
              <p className="text-xs text-stone-300 mt-1">
                زيوت وسيرومات إنبات الشعر، روتين الكيرلي، معالجات وترميم الشعر.
              </p>
              <span className="inline-block mt-3 text-[11px] text-emerald-300 font-bold group-hover:underline">
                تسوق منتجات الشعر ←
              </span>
            </div>

            {/* Card 3: Body & Skin Care */}
            <div
              onClick={() => onSelectCategory('body')}
              className="p-4 rounded-2xl bg-gradient-to-br from-teal-500/20 to-sky-900/30 border border-teal-500/30 hover:border-teal-400 transition-all cursor-pointer group"
            >
              <div className="text-2xl mb-2">✨</div>
              <h2 className="font-extrabold text-white text-base group-hover:text-teal-300 transition-colors">
                العناية بالجسم والبشرة
              </h2>
              <p className="text-xs text-stone-300 mt-1">
                كريمات الترطيب الفائقة، واقيات الشمس، مقشرات وعطور الجسم الفاخرة.
              </p>
              <span className="inline-block mt-3 text-[11px] text-teal-300 font-bold group-hover:underline">
                تسوق منتجات الجسم ←
              </span>
            </div>

            {/* Card 4: Bundles */}
            <div
              onClick={() => onSelectCategory('bundles')}
              className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-900/30 border border-rose-500/30 hover:border-rose-400 transition-all cursor-pointer group"
            >
              <div className="text-2xl mb-2">🎁</div>
              <h2 className="font-extrabold text-white text-base group-hover:text-rose-300 transition-colors">
                بكجات وعروض خاصة
              </h2>
              <p className="text-xs text-stone-300 mt-1">
                مجموعات توفير متكاملة وهدايا مواليد بأسعار مميزة.
              </p>
              <span className="inline-block mt-3 text-[11px] text-rose-300 font-bold group-hover:underline">
                تصفح البكجات ←
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
