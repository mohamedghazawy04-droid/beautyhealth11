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
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

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

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      alert('لتثبيت التطبيق: افتحي قائمة خيارات المتصفح (⋮) ثم اضغطي على "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs text-right">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-pink-100 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
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
              <h3 className="text-lg font-black text-stone-900">تطبيق m&l للهواتف</h3>
              <span className="bg-pink-100 text-pink-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                تطبيق فوري
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              عناية بالمرأة والجمال والطفل (أكتوبر والشيخ زايد)
            </p>
          </div>
        </div>

        {/* Features list */}
        <div className="space-y-2.5 bg-pink-50/50 p-3.5 rounded-2xl border border-pink-100 mb-5 text-xs text-pink-950">
          <div className="flex items-center gap-2 font-bold">
            <Zap className="w-4 h-4 text-pink-600 shrink-0" />
            <span>تصفح وطلب فوري فائق السرعة وبدون الحاجة لمتجر التطبيقات.</span>
          </div>
          <div className="flex items-center gap-2 font-bold">
            <Bell className="w-4 h-4 text-pink-600 shrink-0" />
            <span>إشعارات حية وتتبع فوري للشحنة في ٦ أكتوبر والشيخ زايد.</span>
          </div>
          <div className="flex items-center gap-2 font-bold">
            <WifiOff className="w-4 h-4 text-pink-600 shrink-0" />
            <span>يعمل بسلاسة حتى مع انقطاع أو ضعف شبكة الإنترنت.</span>
          </div>
        </div>

        {/* Download Options */}
        <div className="space-y-3 mb-5">
          {/* Option 1: Direct APK Download Link */}
          <a
            href="https://www.mediafire.com/file/96n9dd1yvi1upyg/app-release.apk/file"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:to-rose-800 active:scale-[0.99] text-white font-black text-sm shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer border border-pink-400/40"
          >
            <Download className="w-5 h-5 animate-bounce" />
            <span>تحميل ملف التطبيق المباشر (Android APK) 📲</span>
          </a>
          <p className="text-[11px] text-center text-stone-500 font-medium">
            ملف APK أصلي مجاني جاهز للتثبيت على جميع هواتف أندرويد (سامسونج، شاومي، أوبو، وغيرها).
          </p>
        </div>

        {/* Installation Instructions */}
        {isInstalled ? (
          <div className="p-4 rounded-2xl bg-pink-100 text-pink-900 text-center space-y-2 mb-4">
            <CheckCircle2 className="w-8 h-8 mx-auto text-pink-600" />
            <div className="font-extrabold text-sm">التطبيق مثبت بالفعل على جهازك!</div>
            <p className="text-xs">يمكنك فتحه مباشرة من الشاشة الرئيسية لهاتفك.</p>
          </div>
        ) : isIOS ? (
          /* iOS Safari Guide */
          <div className="space-y-3 mb-5 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800">
            <div className="font-black text-stone-900 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-pink-600" />
              <span>طريقة التثبيت على أجهزة iPhone و iPad:</span>
            </div>
            <ol className="space-y-2 pr-4 list-decimal text-[11px] leading-relaxed text-stone-700 font-medium">
              <li className="flex items-center gap-1.5">
                اضغطي على زر <strong>المشاركة (Share)</strong>
                <Share2 className="w-3.5 h-3.5 text-blue-600 inline" /> في أسفل متصفح Safari.
              </li>
              <li className="flex items-center gap-1.5">
                مرري لأسفل واختاري <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home Screen)</strong>
                <PlusSquare className="w-3.5 h-3.5 text-stone-800 inline" />.
              </li>
              <li>
                اضغطي على <strong>«إضافة» (Add)</strong> في أعلى الزاوية.
              </li>
            </ol>
          </div>
        ) : (
          /* Android / Chrome One-Click Web PWA Install */
          <div className="space-y-2.5 mb-5 p-3.5 bg-pink-50/70 rounded-2xl border border-pink-100">
            <button
              onClick={handleInstallClick}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-pink-100 text-pink-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-pink-200 shadow-2xs"
            >
              <Smartphone className="w-4 h-4 text-pink-600" />
              <span>أو تثبيت كـ تطبيق ويب فوري (PWA Web)</span>
            </button>
            <p className="text-[10px] text-center text-stone-500">
              يضيف أيقونة مباشرة على الشاشة الرئيسية بدون تحميل ملفات.
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-800 font-bold transition-colors cursor-pointer"
        >
          إغلاق والمتابعة في المتصفح
        </button>
      </div>
    </div>
  );
};
