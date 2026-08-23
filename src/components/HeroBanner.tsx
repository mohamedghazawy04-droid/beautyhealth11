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
  Heart,
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
  storeWhatsApp = '201093629587',
}) => {
  const cleanWhatsApp = storeWhatsApp.replace(/\D/g, '');

  return (
    <div className="text-right">
      {/* Mobile Compact Hero: Feminine Rose/Berry Gradient with quick categories */}
      <div className="block sm:hidden mx-3 my-2.5 p-3.5 rounded-2xl bg-gradient-to-br from-[#3d0e23] via-[#5c1538] to-[#2c0919] text-white shadow-md border border-pink-500/20 relative overflow-hidden">
        {/* Soft Pink Ambient Light */}
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-pink-500/30 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-rose-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-200 text-[10px] font-bold">
              <Sparkles className="w-2.5 h-2.5 text-pink-300 animate-pulse" />
              منتجات أصلية ١٠٠٪ للعناية والجمال
            </span>
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=مرحباً، أود الاستفسار عن منتجات المتجر`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-pink-300 hover:text-pink-100 font-bold flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>واتساب المبيعات</span>
            </a>
          </div>

          <h1 className="text-sm font-extrabold leading-snug">
            جمالك وأناقتك يبدآن هنا ✨ عناية فائقة بالبشرة والشعر ومستلزمات طفلك
          </h1>

          {/* Quick Categories Bar on Mobile */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            <button
              onClick={() => onSelectCategory('baby')}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-pink-400/20 flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-95"
            >
              <span className="text-base">👶</span>
              <span className="text-[10px] font-bold mt-0.5 text-pink-100">الطفل</span>
            </button>
            <button
              onClick={() => onSelectCategory('hair')}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-pink-400/20 flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-95"
            >
              <span className="text-base">💇‍♀️</span>
              <span className="text-[10px] font-bold mt-0.5 text-pink-100">الشعر</span>
            </button>
            <button
              onClick={() => onSelectCategory('body')}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-pink-400/20 flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-95"
            >
              <span className="text-base">✨</span>
              <span className="text-[10px] font-bold mt-0.5 text-pink-100">البشرة</span>
            </button>
            <button
              onClick={() => onSelectCategory('bundles')}
              className="p-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-95 text-pink-200"
            >
              <span className="text-base">🎁</span>
              <span className="text-[10px] font-bold mt-0.5">البكجات</span>
            </button>
          </div>

          {/* Quick Android APK Download Button on Mobile */}
          <div className="pt-1 flex items-center gap-2">
            <a
              href="https://www.mediafire.com/file/96n9dd1yvi1upyg/app-release.apk/file"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow-xs border border-pink-300/40 active:scale-98 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل تطبيق الأندرويد (APK) 📲</span>
            </a>
          </div>
        </div>
      </div>

      {/* Desktop / Tablet Full Hero: Luxurious Feminine Velvet & Rose Gold Aesthetics */}
      <div className="hidden sm:block relative overflow-hidden bg-gradient-to-br from-[#2a0818] via-[#48102b] to-[#1a0510] text-white rounded-3xl my-4 mx-4 sm:mx-6 lg:mx-8 shadow-2xl border-2 border-pink-500/30">
        {/* Soft Glowing Orbs */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-rose-500/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-8 sm:py-10 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left / Main Text info */}
            <div className="lg:col-span-7 space-y-4">
              {/* Top Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/30 border border-pink-400/50 text-pink-200 text-xs font-black shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-pulse" />
                متجر المرأة العصرية: جمال، عناية، واهتمام فائق بطفلك 🌸
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug text-white drop-shadow-sm">
                أرقى منتجات <span className="text-pink-300 font-extrabold underline decoration-pink-500/50 underline-offset-4">العناية بالبشرة والشعر</span> ومستلزمات <span className="text-rose-200 font-extrabold">الطفل والرضيع</span>
              </h1>

              <p className="text-pink-100 text-xs sm:text-sm font-semibold leading-relaxed max-w-xl drop-shadow-xs">
                مجموعات أصلية وموثوقة 100% تم اختيارها بعناية لتمنحك الإشراقة والراحة. اطلبي عبر المتجر لتصلك المنتجات فوراً مع خدمة التوصيل السريع للمنزل.
              </p>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="https://www.mediafire.com/file/96n9dd1yvi1upyg/app-release.apk/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-400 hover:to-rose-400 text-white font-black text-xs sm:text-sm transition-all shadow-lg shadow-pink-600/40 cursor-pointer border border-pink-200/50 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Download className="w-4 h-4 text-white animate-bounce" />
                  <span>تحميل تطبيق الأندرويد (APK) 📲</span>
                </a>

                {onOpenInstallApp && (
                  <button
                    onClick={onOpenInstallApp}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-pink-300/40 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer backdrop-blur-md"
                  >
                    <Smartphone className="w-4 h-4 text-pink-200" />
                    <span>تثبيت كـ PWA</span>
                  </button>
                )}

                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=مرحباً، أود الاستفسار عن منتجات المتجر`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 border border-emerald-400/50 text-white font-black text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-emerald-950/20"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-200" />
                  <span>محادثة واتساب الصيدلي</span>
                </a>
              </div>
            </div>

            {/* Right Highlights Cards in Rich Glassmorphism */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              {/* Card 1: Baby Care */}
              <div
                onClick={() => onSelectCategory('baby')}
                className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-pink-300/30 hover:border-pink-300 transition-all cursor-pointer group backdrop-blur-md shadow-md"
              >
                <div className="text-3xl mb-1.5 drop-shadow-xs">👶</div>
                <h2 className="font-black text-white text-sm group-hover:text-pink-300 transition-colors">
                  عناية الطفل
                </h2>
                <p className="text-[11px] text-pink-100 font-medium mt-1 line-clamp-2">
                  شامبوهات ناعمة، كريمات حفاض، وعناية حديثي الولادة.
                </p>
                <span className="inline-block mt-2.5 text-[11px] text-pink-300 font-black group-hover:underline">
                  تسوقي للأطفال ←
                </span>
              </div>

              {/* Card 2: Hair Care */}
              <div
                onClick={() => onSelectCategory('hair')}
                className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-rose-300/30 hover:border-rose-300 transition-all cursor-pointer group backdrop-blur-md shadow-md"
              >
                <div className="text-3xl mb-1.5 drop-shadow-xs">💇‍♀️</div>
                <h2 className="font-black text-white text-sm group-hover:text-rose-300 transition-colors">
                  عناية الشعر
                </h2>
                <p className="text-[11px] text-pink-100 font-medium mt-1 line-clamp-2">
                  سيرومات تطويل وترميم، معالجات التقصف وكيرلي صحي.
                </p>
                <span className="inline-block mt-2.5 text-[11px] text-rose-300 font-black group-hover:underline">
                  تسوقي للشعر ←
                </span>
              </div>

              {/* Card 3: Body & Skin Care */}
              <div
                onClick={() => onSelectCategory('body')}
                className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-fuchsia-300/30 hover:border-fuchsia-300 transition-all cursor-pointer group backdrop-blur-md shadow-md"
              >
                <div className="text-3xl mb-1.5 drop-shadow-xs">✨</div>
                <h2 className="font-black text-white text-sm group-hover:text-fuchsia-300 transition-colors">
                  البشرة والجسم
                </h2>
                <p className="text-[11px] text-pink-100 font-medium mt-1 line-clamp-2">
                  مرطبات مخملية، واقي شمس، ومقشرات لتوحيد اللون.
                </p>
                <span className="inline-block mt-2.5 text-[11px] text-fuchsia-300 font-black group-hover:underline">
                  تسوقي للبشرة ←
                </span>
              </div>

              {/* Card 4: Bundles */}
              <div
                onClick={() => onSelectCategory('bundles')}
                className="p-4 rounded-2xl bg-gradient-to-br from-pink-500/30 to-rose-600/30 hover:from-pink-500/40 hover:to-rose-600/40 border border-pink-300/40 hover:border-pink-200 transition-all cursor-pointer group backdrop-blur-md shadow-md"
              >
                <div className="text-3xl mb-1.5 drop-shadow-xs">🎁</div>
                <h2 className="font-black text-white text-sm group-hover:text-pink-200 transition-colors">
                  بكجات التوفير
                </h2>
                <p className="text-[11px] text-pink-100 font-medium mt-1 line-clamp-2">
                  مجموعات متكاملة وهدايا مواليد راقية بأفضل الأسعار.
                </p>
                <span className="inline-block mt-2.5 text-[11px] text-pink-200 font-black group-hover:underline">
                  تصفحي البكجات ←
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
