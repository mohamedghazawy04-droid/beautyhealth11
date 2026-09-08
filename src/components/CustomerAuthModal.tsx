import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Lock,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
  LogIn,
  UserPlus,
  ShieldCheck,
  Eye,
  EyeOff,
  Building,
  Check,
  HeartHandshake,
} from 'lucide-react';
import { CustomerAccount } from '../types';
import { OCTOBER_ZAYED_ZONES } from '../data/zones';
import { FallingLeaves } from './FallingLeaves';
import { db } from '../firebase';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  loggedInCustomer: CustomerAccount | null;
  onCustomerLogin: (customer: CustomerAccount) => void;
  onCustomerLogout?: () => void;
  showToast?: (message: string) => void;
  initialMode?: 'login' | 'register';
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  loggedInCustomer,
  onCustomerLogin,
  onCustomerLogout,
  showToast,
  initialMode = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>(initialMode);

  useEffect(() => {
    if (isOpen && initialMode) {
      setActiveTab(initialMode);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen, initialMode]);

  // Registration state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regZoneId, setRegZoneId] = useState(OCTOBER_ZAYED_ZONES[0]?.id || 'oct-1');
  const [regDetailedAddress, setRegDetailedAddress] = useState('');
  const [regBuildingNumber, setRegBuildingNumber] = useState('');
  const [regFloorNumber, setRegFloorNumber] = useState('');
  const [regApartmentNumber, setRegApartmentNumber] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Login state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanName = regName.trim();
    const cleanPhone = regPhone.trim().replace(/\D/g, '');

    if (!cleanName || cleanName.length < 3) {
      setErrorMsg('يرجى كتابة الاسم الثلاثي أو الثنائي بشكل صحيح');
      return;
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('يرجى إدخال رقم هاتف محمول مصري صحيح (11 رقم)');
      return;
    }

    if (!regPassword || regPassword.length < 4) {
      setErrorMsg('يرجى إنشاء كلمة مرور من 4 خانات على الأقل لحماية حسابك');
      return;
    }

    setLoading(true);

    try {
      const selectedZone =
        OCTOBER_ZAYED_ZONES.find((z) => z.id === regZoneId) || OCTOBER_ZAYED_ZONES[0];

      // Format customer object
      const customerId = 'cust_' + cleanPhone;
      const newCustomer: CustomerAccount = {
        id: customerId,
        name: cleanName,
        phone: cleanPhone,
        password: regPassword,
        city: selectedZone.city === 'zayed' ? 'الشيخ زايد' : '٦ أكتوبر',
        zoneId: selectedZone.id,
        zoneName: selectedZone.name,
        detailedAddress: regDetailedAddress.trim(),
        buildingNumber: regBuildingNumber.trim(),
        floorNumber: regFloorNumber.trim(),
        apartmentNumber: regApartmentNumber.trim(),
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        ordersCount: 0,
        totalSpent: 0,
      };

      // 1. Save to Cloud Firestore
      try {
        await setDoc(doc(db, 'customers', customerId), newCustomer, { merge: true });
      } catch (cloudErr) {
        console.warn('Firestore customer save note:', cloudErr);
      }

      // 2. Save session locally
      localStorage.setItem('carehub_logged_in_customer', JSON.stringify(newCustomer));
      localStorage.setItem('carehub_customer_phone', cleanPhone);
      localStorage.setItem('carehub_customer_display_name', cleanName);

      onCustomerLogin(newCustomer);
      setSuccessMsg(`أهلاً وسهلاً بك في متجر m&l يا ${cleanName}! تم إنشاء الحساب بنجاح 🌸`);
      showToast?.(`🌸 مرحباً بك يا ${cleanName}! تم إنشاء وتفعيل حسابك`);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMsg('حدث خطأ أثناء حفظ الحساب، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanPhone = loginPhone.trim().replace(/\D/g, '');

    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('يرجى إدخال رقم الهاتف المسجل به حسابك');
      return;
    }

    setLoading(true);

    try {
      let foundCustomer: CustomerAccount | null = null;

      // 1. Try checking in Firestore
      try {
        const q = query(collection(db, 'customers'), where('phone', '==', cleanPhone));
        const snap = await getDocs(q);
        if (!snap.empty) {
          foundCustomer = snap.docs[0].data() as CustomerAccount;
        }
      } catch (cloudErr) {
        console.warn('Firestore customer lookup note:', cloudErr);
      }

      // 2. Check LocalStorage fallback if not found in cloud
      if (!foundCustomer) {
        const localSaved = localStorage.getItem('carehub_logged_in_customer');
        if (localSaved) {
          try {
            const parsed = JSON.parse(localSaved) as CustomerAccount;
            if (parsed.phone && parsed.phone.replace(/\D/g, '') === cleanPhone) {
              foundCustomer = parsed;
            }
          } catch (e) {}
        }
      }

      // If customer found, verify password if set
      if (foundCustomer) {
        if (
          foundCustomer.password &&
          loginPassword &&
          foundCustomer.password !== loginPassword
        ) {
          setErrorMsg('كلمة المرور غير صحيحة، يرجى التأكد وإعادة المحاولة');
          setLoading(false);
          return;
        }

        foundCustomer.lastLoginAt = new Date().toISOString();

        // Update in Firestore
        try {
          await setDoc(doc(db, 'customers', foundCustomer.id), foundCustomer, { merge: true });
        } catch (e) {}

        localStorage.setItem('carehub_logged_in_customer', JSON.stringify(foundCustomer));
        localStorage.setItem('carehub_customer_phone', foundCustomer.phone);
        localStorage.setItem('carehub_customer_display_name', foundCustomer.name);

        onCustomerLogin(foundCustomer);
        setSuccessMsg(`مرحباً بعودتك مجدداً يا ${foundCustomer.name}! 🌟`);
        showToast?.(`🌟 مرحباً بعودتك يا ${foundCustomer.name}`);

        setTimeout(() => {
          onClose();
        }, 1100);
      } else {
        // First time entering with this phone: offer to register
        setErrorMsg('لم نعثر على حساب مسجل بهذا الرقم. يمكنك الضغط على "عميل جديد" للتسجيل بسهولة');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg('تعذر تسجيل الدخول، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="customer-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto animate-fadeIn"
      dir="rtl"
    >
      {/* Background Falling Leaves Animation Across the Screen */}
      <FallingLeaves count={26} />

      <div
        className="relative w-full max-w-4xl bg-stone-900 border border-amber-500/20 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col md:flex-row z-20"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(234, 179, 8, 0.1)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-30 p-2.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-all shadow-md backdrop-blur-sm"
          title="إغلاق"
        >
          <X size={20} />
        </button>

        {/* Artistic Scene Side: Mother & Child under Tree & French Street Lamp */}
        <div className="relative w-full md:w-5/12 bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950/40 p-6 md:p-8 flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-l border-amber-500/20">
          <style>{`
            @keyframes motherChildLivingBreath {
              0%, 100% {
                transform: scale(1.02) translateY(0px) rotate(0deg);
                filter: brightness(1.01) contrast(1.02);
              }
              32% {
                transform: scale(1.045) translateY(-3.5px) rotate(0.4deg);
                filter: brightness(1.06) contrast(1.04);
              }
              58% {
                transform: scale(1.038) translateY(-2px) rotate(0.2deg);
                filter: brightness(1.04) contrast(1.03);
              }
              82% {
                transform: scale(1.015) translateY(1.5px) rotate(-0.3deg);
                filter: brightness(0.99) contrast(1.01);
              }
            }

            @keyframes lampGlowFlicker {
              0%, 100% {
                opacity: 0.5;
                transform: scale(1);
              }
              25% {
                opacity: 0.75;
                transform: scale(1.15) rotate(1deg);
              }
              50% {
                opacity: 0.45;
                transform: scale(0.96) rotate(-1deg);
              }
              72% {
                opacity: 0.85;
                transform: scale(1.2) rotate(0.5deg);
              }
            }

            @keyframes softBreezeWave {
              0% {
                transform: translateX(-100%) skewX(-15deg);
                opacity: 0;
              }
              40% {
                opacity: 0.35;
              }
              70% {
                opacity: 0.2;
              }
              100% {
                transform: translateX(200%) skewX(-15deg);
                opacity: 0;
              }
            }

            @keyframes fireflyFloat1 {
              0%, 100% { transform: translate(0, 0) scale(0.8); opacity: 0.3; }
              50% { transform: translate(15px, -20px) scale(1.2); opacity: 0.9; }
            }

            @keyframes fireflyFloat2 {
              0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
              50% { transform: translate(-18px, -15px) scale(0.6); opacity: 0.2; }
            }

            .living-mother-child {
              animation: motherChildLivingBreath 6s ease-in-out infinite;
              transform-origin: 50% 85%;
              will-change: transform, filter;
            }

            .living-lamp-glow {
              animation: lampGlowFlicker 4.5s ease-in-out infinite;
              will-change: transform, opacity;
            }

            .breeze-sheen {
              animation: softBreezeWave 8s ease-in-out infinite;
            }

            .firefly-1 { animation: fireflyFloat1 5s ease-in-out infinite; }
            .firefly-2 { animation: fireflyFloat2 6.5s ease-in-out infinite 1.5s; }
          `}</style>

          {/* Subtle French Street Lamp Glow Overlay */}
          <div
            className="absolute top-6 right-6 w-36 h-36 bg-amber-400/25 rounded-full blur-3xl pointer-events-none living-lamp-glow"
          />

          {/* Warm Lamp Beam Casting Over Scene */}
          <div
            className="absolute top-0 right-10 w-48 h-64 bg-gradient-to-b from-amber-300/15 via-amber-400/5 to-transparent blur-2xl pointer-events-none rotate-12 living-lamp-glow"
          />

          {/* Falling Leaves directly over the illustration */}
          <FallingLeaves count={14} containerClassName="opacity-80" />

          {/* Top Title & Poetry */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium mb-3">
              <Sparkles size={14} className="text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>رعاية حنونة تليق بجمالكِ وطفلكِ</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-100 tracking-tight leading-snug">
              أهلاً بكِ في عالم <span className="text-amber-400 font-serif">m&l</span>
            </h2>
            <p className="text-xs text-stone-300/80 mt-2 leading-relaxed">
              تحت ظلال الراحة، وفي دفء عنايتك اليومية بجمالك ومستلزمات طفلك، نسعد بانضمامكِ لعائلتنا مع شحن وتوصيل فوري خلال ٢٤ ساعة.
            </p>
          </div>

          {/* Centered Artwork Image Container with Living Motion */}
          <div className="relative z-10 my-4 flex flex-col items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-amber-400/40 w-full max-w-[290px] md:max-w-full aspect-[4/3] group bg-stone-950">
              {/* Mother and Child Image with Breathing & Swaying Subtle Living Movement */}
              <img
                src="/mother-child-lamp.jpg"
                alt="سيدة وطفل يجلسان تحت الشجرة بجوار عمود إنارة فرنسي جميل"
                className="w-full h-full object-cover object-center living-mother-child"
                referrerPolicy="no-referrer"
              />

              {/* Soft breeze sheen passing through the tree canopy */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/15 to-transparent pointer-events-none breeze-sheen" />

              {/* Fireflies / warm ambient motes near mother and lamp */}
              <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-amber-300 blur-[0.5px] firefly-1 pointer-events-none" />
              <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-amber-400 blur-[0.5px] firefly-2 pointer-events-none" />

              {/* Artistic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/15 to-transparent pointer-events-none" />

              {/* Street lamp glow reflection badge */}
              <div className="absolute bottom-2.5 right-2.5 left-2.5 bg-stone-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center justify-between text-[11px] text-amber-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                  <span>أمان وعناية دافئة ونابضة بالحياة 🌸</span>
                </span>
                <span className="text-amber-300 font-serif font-bold text-[10px]">M&L Care</span>
              </div>
            </div>
          </div>

          {/* Benefits bullets */}
          <div className="relative z-10 space-y-2 pt-2 border-t border-stone-800/80 text-[11px] text-stone-300">
            <div className="flex items-center gap-2">
              <Check size={14} className="text-amber-400 shrink-0" />
              <span>حفظ عنوانك تلقائياً لسرعة تكرار الطلب في ضغطة واحدة</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={14} className="text-amber-400 shrink-0" />
              <span>إخطارات فورية بالعروض الحصرية وكوبونات الخصم</span>
            </div>
          </div>
        </div>

        {/* Form Registration List Side ("قائمة التسجيل") */}
        <div className="relative w-full md:w-7/12 p-6 md:p-8 bg-stone-900/95 flex flex-col justify-between">
          {/* Inner Header with Tabs: عميل جديد أو تسجيل عميل مسبق */}
          <div>
            <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                  <HeartHandshake className="text-amber-400" size={20} />
                  <span>قائمة التسجيل والحساب</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {activeTab === 'register' ? 'تسجيل عميل جديد لأول مرة' : 'تسجيل دخول عميل مسبق'}
                </p>
              </div>

              {/* Mode Toggle Switch */}
              <div className="flex bg-stone-950 p-1 rounded-2xl border border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                    activeTab === 'register'
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <UserPlus size={14} />
                  <span>عميل جديد</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                    activeTab === 'login'
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <LogIn size={14} />
                  <span>عميل مسبق</span>
                </button>
              </div>
            </div>

            {/* Error and Success Alerts */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-red-200 text-xs flex items-center gap-2 animate-shake">
                <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Already logged in state */}
            {loggedInCustomer ? (
              <div className="p-5 rounded-2xl bg-stone-950 border border-amber-500/30 text-center space-y-4 my-4">
                <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
                  <User size={28} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-stone-100">
                    أنت مسجل الدخول حالياً كـ:
                  </h4>
                  <p className="text-amber-400 font-bold text-lg mt-1">{loggedInCustomer.name}</p>
                  <p className="text-xs text-stone-400 mt-1" dir="ltr">
                    {loggedInCustomer.phone}
                  </p>
                  {loggedInCustomer.zoneName && (
                    <p className="text-xs text-stone-300 mt-1 flex items-center justify-center gap-1">
                      <MapPin size={12} className="text-amber-400" />
                      {loggedInCustomer.zoneName}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all"
                  >
                    متابعة التسوق والطلب
                  </button>
                  {onCustomerLogout && (
                    <button
                      type="button"
                      onClick={() => {
                        onCustomerLogout();
                        showToast?.('تم تسجيل الخروج بنجاح');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-all"
                    >
                      تسجيل الخروج
                    </button>
                  )}
                </div>
              </div>
            ) : activeTab === 'register' ? (
              /* ================== FORM 1: عميل جديد ================== */
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      الاسم الكامل <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="مثال: سارة أحمد محمود"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full pl-3 pr-9 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 placeholder:text-stone-600 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                      />
                      <User size={15} className="absolute right-3 top-2.5 text-stone-500" />
                    </div>
                  </div>

                  {/* Mobile Phone */}
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      رقم الهاتف (واتساب والتوصيل) <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="010XXXXXXXX"
                        dir="ltr"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full pl-3 pr-9 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 placeholder:text-stone-600 text-xs focus:outline-none focus:border-amber-500 transition-colors text-right"
                      />
                      <Phone size={15} className="absolute right-3 top-2.5 text-stone-500" />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    كلمة المرور (لحماية حسابك وسهولة الدخول) <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="أدخل 4 أحرف أو أرقام على الأقل"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 placeholder:text-stone-600 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                    />
                    <Lock size={15} className="absolute right-3 top-2.5 text-stone-500" />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute left-3 top-2.5 text-stone-500 hover:text-stone-300"
                    >
                      {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Delivery Zone Selection */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    منطقة السكن (٦ أكتوبر والشيخ زايد) <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={regZoneId}
                      onChange={(e) => setRegZoneId(e.target.value)}
                      className="w-full pl-3 pr-9 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-xs focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
                    >
                      {OCTOBER_ZAYED_ZONES.map((zone) => (
                        <option key={zone.id} value={zone.id} className="bg-stone-900 text-stone-200">
                          {zone.city === 'zayed' ? 'الشيخ زايد' : '٦ أكتوبر'} - {zone.name} ({zone.deliveryFee} ج توصيل)
                        </option>
                      ))}
                    </select>
                    <MapPin size={15} className="absolute right-3 top-2.5 text-stone-500 pointer-events-none" />
                  </div>
                </div>

                {/* Detailed Address */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    العنوان بالتفصيل (اسم الشارع / المجاورة / الكمبوند)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: شارع جمال عبد الناصر، أمام مول العرب"
                    value={regDetailedAddress}
                    onChange={(e) => setRegDetailedAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 placeholder:text-stone-600 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Building / Floor / Apt */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">رقم العمارة</label>
                    <input
                      type="text"
                      placeholder="عمارة 15"
                      value={regBuildingNumber}
                      onChange={(e) => setRegBuildingNumber(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">الدور</label>
                    <input
                      type="text"
                      placeholder="الدور 3"
                      value={regFloorNumber}
                      onChange={(e) => setRegFloorNumber(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">رقم الشقة</label>
                    <input
                      type="text"
                      placeholder="شقة 8"
                      value={regApartmentNumber}
                      onChange={(e) => setRegApartmentNumber(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-stone-950 border border-stone-800 rounded-lg text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus size={16} />
                      <span>تسجيل عميل جديد وتأكيد الحساب</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2 space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-xs text-amber-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>لديك حساب مسجل بالفعل؟</span>
                    <span className="font-bold">تسجيل الدخول هنا</span>
                  </button>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-[11px] text-stone-400 hover:text-stone-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>تخطي والدخول للمتجر كزائر الآن</span>
                      <span>←</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* ================== FORM 2: تسجيل عميل مسبق ================== */
              <form onSubmit={handleLogin} className="space-y-4 my-2">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-amber-400 shrink-0" />
                  <span>أهلاً بعودتك! أدخل رقم الهاتف المسجل لتسجيل الدخول فوراً واسترجاع عنوانك.</span>
                </div>

                {/* Login Phone */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    رقم الهاتف المسجل <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="010XXXXXXXX"
                      dir="ltr"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      className="w-full pl-3 pr-9 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 placeholder:text-stone-600 text-xs focus:outline-none focus:border-amber-500 transition-colors text-right"
                    />
                    <Phone size={16} className="absolute right-3 top-3 text-stone-500" />
                  </div>
                </div>

                {/* Login Password */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      placeholder="أدخل كلمة المرور"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 placeholder:text-stone-600 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                    />
                    <Lock size={16} className="absolute right-3 top-3 text-stone-500" />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute left-3 top-3 text-stone-500 hover:text-stone-300"
                    >
                      {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    * إذا كنت سجلت مسبقاً دون كلمة مرور، اترك الحقل فارغاً واضغط تسجيل الدخول.
                  </p>
                </div>

                {/* Submit Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn size={16} />
                      <span>تسجيل الدخول إلى حسابي</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2 space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-xs text-amber-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>ليس لديك حساب بعد؟</span>
                    <span className="font-bold">سجّل كعميل جديد الآن</span>
                  </button>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-[11px] text-stone-400 hover:text-stone-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>تخطي والدخول للمتجر كزائر الآن</span>
                      <span>←</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500">
            <span>جميع بيانات العملاء مشفرة ومحمية 🔒</span>
            <span className="text-amber-500/80 font-serif">M&L Pharmacy & Care</span>
          </div>
        </div>
      </div>
    </div>
  );
};
