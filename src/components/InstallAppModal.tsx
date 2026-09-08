import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Download,
  Share2,
  PlusSquare,
  CheckCircle2,
  Zap,
  Bell,
  WifiOff,
  Sparkles,
  ArrowDown,
  Info,
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if already in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Capture PWA install prompt on Android/Chrome
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstantShortcutInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.error('PWA prompt error:', err);
        setShowManualGuide(true);
      }
    } else {
      // If browser doesn't expose deferred prompt immediately, show clear step-by-step
      setShowManualGuide(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs text-right">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-100 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 w-9 h-9 rounded-full bg-pink-50 hover:bg-pink-100 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header App Identity */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-600 via-rose-600 to-pink-800 flex items-center justify-center text-white shadow-lg shadow-pink-600/30 font-black text-xl tracking-wide border border-white/20">
            <span className="font-['Plus_Jakarta_Sans',sans-serif] lowercase">m&l</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-black text-stone-900">تطبيق m&l الأصلي</h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-600" />
                تثبيت فوري
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              عناية بالمرأة والجمال والطفل • توصيل فوري بأكتوبر وزايد
            </p>
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-3 gap-2 mb-5 text-center">
          <div className="bg-pink-50/80 p-2.5 rounded-2xl border border-pink-100">
            <Zap className="w-5 h-5 text-pink-600 mx-auto mb-1" />
            <div className="font-extrabold text-[11px] text-pink-950">بدون تحميل</div>
            <div className="text-[10px] text-stone-500">لا يستهلك مساحة</div>
          </div>
          <div className="bg-rose-50/80 p-2.5 rounded-2xl border border-rose-100">
            <Bell className="w-5 h-5 text-rose-600 mx-auto mb-1" />
            <div className="font-extrabold text-[11px] text-rose-950">إشعارات سريعة</div>
            <div className="text-[10px] text-stone-500">تنبيه بالمنتجات</div>
          </div>
          <div className="bg-amber-50/80 p-2.5 rounded-2xl border border-amber-100">
            <WifiOff className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <div className="font-extrabold text-[11px] text-amber-950">يعمل بدون نت</div>
            <div className="text-[10px] text-stone-500">فتح فوري وسلس</div>
          </div>
        </div>

        {/* Primary Action: Instant Shortcut 1-Click Install */}
        {isInstalled ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-center space-y-2 mb-4">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
            <div className="font-black text-sm">التطبيق مثبت بالفعل على شاشتك الرئيسية!</div>
            <p className="text-xs text-emerald-700">يمكنك فتحه مباشرة من الشاشة الرئيسية لهاتفك في أي وقت وتصلك التحديثات تلقائياً.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-5">
            <button
              onClick={handleInstantShortcutInstall}
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:to-rose-800 active:scale-[0.99] text-white font-black text-base shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer border border-pink-400/40 relative overflow-hidden group"
            >
              <Zap className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>تثبيت التطبيق كاختصار فوري على الشاشة</span>
              <Sparkles className="w-4 h-4 text-pink-200" />
            </button>
            <p className="text-[11px] text-center text-stone-500 font-medium">
              💡 نقرة واحدة وسيتم تثبيت أيقونة التطبيق مباشرة على شاشة هاتفك الرئيسية بدون أي انتظار.
            </p>
          </div>
        )}

        {/* If iOS Safari or Guide is triggered */}
        {(isIOS || showManualGuide) && !isInstalled && (
          <div className="space-y-3 mb-5 p-4 rounded-2xl bg-pink-50/60 border border-pink-200 text-xs text-stone-800 animate-in fade-in duration-200">
            <div className="font-black text-pink-900 flex items-center gap-2 text-sm">
              <Info className="w-4 h-4 text-pink-600" />
              <span>{isIOS ? 'طريقة التثبيت السريعة على أجهزة iPhone و iPad:' : 'خطوات إضافة الاختصار فوراً على هاتفك:'}</span>
            </div>

            {isIOS ? (
              <ol className="space-y-2 pr-4 list-decimal text-xs leading-relaxed text-stone-700 font-medium">
                <li className="flex items-center gap-2">
                  <span>اضغط على زر المشاركة أسفل Safari</span>
                  <Share2 className="w-4 h-4 text-blue-600 inline bg-blue-50 p-0.5 rounded" />
                </li>
                <li className="flex items-center gap-2">
                  <span>مرر القائمة لأسفل واضغط على <strong>«إضافة إلى الشاشة الرئيسية»</strong></span>
                  <PlusSquare className="w-4 h-4 text-stone-800 inline bg-stone-100 p-0.5 rounded" />
                </li>
                <li>
                  اضغط على كلمة <strong>«إضافة» (Add)</strong> أعلى الزاوية.
                </li>
              </ol>
            ) : (
              <ol className="space-y-2 pr-4 list-decimal text-xs leading-relaxed text-stone-700 font-medium">
                <li>اضغط على زر القائمة (الثلاث نقاط <strong>⋮</strong>) في أعلى يمين أو يسار المتصفح.</li>
                <li>اختر <strong>«تثبيت التطبيق» (Install app)</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.</li>
                <li>اضغط على <strong>تثبيت</strong>، وسيظهر اختصار التطبيق فوراً على شاشة هاتفك.</li>
              </ol>
            )}
          </div>
        )}

        {/* Secondary Choice: Direct APK Download Link */}
        <div className="pt-3 border-t border-stone-100">
          <a
            href="https://www.mediafire.com/file/96n9dd1yvi1upyg/app-release.apk/file"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 active:scale-[0.99] text-stone-600 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-stone-200"
          >
            <Download className="w-4 h-4 text-stone-500" />
            <span>تحميل كملف أندرويد خارجي اختياري (APK)</span>
          </a>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="w-full mt-3 py-2 text-xs text-stone-500 hover:text-stone-800 font-bold transition-colors cursor-pointer text-center"
        >
          إغلاق والمتابعة في المتصفح
        </button>
      </div>
    </div>
  );
};
