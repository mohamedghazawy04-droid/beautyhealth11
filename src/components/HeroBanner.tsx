import React from 'react';
import {
  Truck,
  Sparkles,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  Gift,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { DeliveryZone } from '../types';

interface HeroBannerProps {
  selectedZone: DeliveryZone;
  onOpenZoneModal: () => void;
  onSelectCategory: (catId: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  selectedZone,
  onOpenZoneModal,
  onSelectCategory,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 text-white rounded-3xl my-4 mx-4 sm:mx-6 lg:mx-8 shadow-xl border border-emerald-800/40">
      {/* Decorative background effects */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-8 sm:py-12 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left / Main Text info */}
          <div className="lg:col-span-7 space-y-5 text-right">
            {/* Top Hyperlocal Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-bold shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              خدمة التوصيل السريع متاحة الآن في ٦ أكتوبر والشيخ زايد
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-snug">
              أفضل منتجات <span className="text-emerald-400">العناية بالجسم والشعر</span> ومستلزمات <span className="text-amber-300">الأطفال والرضع</span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
              نوفر لكِ أرقى الماركات الأصلية 100% (موستيلا، سودوكريم، سيرافي، لاروش، مييل، كانتو) مع خدمة توصيل فورية من المخزن مباشرة إلى باب بيتك في كافة كمبوندات وأحياء زايد وأكتوبر.
            </p>

            {/* Hyperlocal Destination Bar Card */}
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 max-w-xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <div className="text-stone-300">منطقة التوصيل المحددة:</div>
                  <div className="font-extrabold text-white text-sm">
                    {selectedZone.name}
                  </div>
                  <div className="text-emerald-300 text-[11px] flex items-center gap-1 font-medium mt-0.5">
                    <Clock className="w-3 h-3" />
                    وقت التوصيل المقدر: {selectedZone.estimatedDeliveryTime}
                  </div>
                </div>
              </div>
              <button
                onClick={onOpenZoneModal}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md"
              >
                تغيير الحي / المنطقة
              </button>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectCategory('bundles')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm transition-all shadow-lg shadow-amber-900/20 cursor-pointer"
              >
                <Gift className="w-4 h-4" />
                تصفح بكجات التوفير والهدايا
                <ArrowLeft className="w-4 h-4" />
              </button>
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
                شامبو موستيلا، سودوكريم، سيباميد، بيبانثين، ومناديل قطنية فائقة النعومة.
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
                زيوت إنبات الروزماري، روتين الكيرلي، معالجات أولابلكس وسيرومات الترطيب.
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
                كريمات سيرافي، واقي شمس لاروش SPF50+، ومقشرات دوف وبودي ميست عطري.
              </p>
              <span className="inline-block mt-3 text-[11px] text-teal-300 font-bold group-hover:underline">
                تسوق منتجات الجسم ←
              </span>
            </div>

            {/* Card 4: Active Coupons */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-900/30 border border-rose-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-rose-300 text-xs font-bold mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  كوبونات أكتوبر وزايد
                </div>
                <div className="text-white font-black text-sm">
                  كود: <span className="text-amber-300 font-mono bg-black/40 px-1.5 py-0.5 rounded">OCTOBER10</span>
                </div>
                <p className="text-[11px] text-stone-300 mt-1">
                  خصم 10% على أول طلب + شحن مجاني بكود <span className="font-mono text-emerald-300">ZAYEDFREE</span>
                </p>
              </div>
              <div className="text-[10px] text-rose-200 mt-2 font-medium">
                تطبق الكوبونات في السلة مباشرة
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
