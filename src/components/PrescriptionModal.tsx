import React, { useState } from 'react';
import {
  X,
  FileText,
  Camera,
  Upload,
  Phone,
  User,
  MapPin,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  SendHorizontal
} from 'lucide-react';
import { PrescriptionRequest, StoreSettings } from '../types';

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPrescription: (prescription: PrescriptionRequest) => void;
  storeSettings?: StoreSettings;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  isOpen,
  onClose,
  onSubmitPrescription,
  storeSettings,
}) => {
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState<'october' | 'zayed'>('zayed');
  const [areaName, setAreaName] = useState('');
  const [notes, setNotes] = useState('');
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdReqId, setCreatedReqId] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    // Reset modal state when closing
    setIsSubmitted(false);
    setErrorMsg('');
    setPatientName('');
    setPhone('');
    setAreaName('');
    setNotes('');
    setPrescriptionImage(null);
    setCreatedReqId('');
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('حجم الصورة كبير جداً، يرجى اختيار صورة أصغر من 5 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          setPrescriptionImage(canvas.toDataURL('image/jpeg', 0.8));
          setErrorMsg('');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setErrorMsg('يرجى كتابة الاسم بالكامل');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMsg('يرجى إدخال رقم هاتف صحيح للتواصل');
      return;
    }

    const newRequest: PrescriptionRequest = {
      id: 'RX-' + Math.floor(100000 + Math.random() * 900000),
      patientName: patientName.trim(),
      phone: phone.trim(),
      city,
      areaName: areaName.trim() || (city === 'zayed' ? 'الشيخ زايد' : '٦ أكتوبر'),
      notes: notes.trim(),
      image: prescriptionImage || undefined,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    setCreatedReqId(newRequest.id);
    onSubmitPrescription(newRequest);
    setIsSubmitted(true);
  };

  // Get Telegram direct link (custom username or fallback to direct bot)
  const telegramUsername = (storeSettings?.telegramUsername || 'ml_care_bot').replace('@', '');
  const telegramDirectUrl = `https://t.me/${telegramUsername}`;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 text-right"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200 relative">
        {/* Header with Pharmacist Trust & Clear Close Button */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 shadow-inner">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black">
                  إرسال روشتة أو استشارة طبية 📄
                </h2>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-200 font-extrabold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  صيدلي معتمد
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-medium">
                مراجعة صيدلانية فورية وتوصيل سريع في أكتوبر والشيخ زايد
              </p>
            </div>
          </div>

          {/* Prominent High-Contrast Close Button (X) */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="إغلاق"
            className="w-9 h-9 rounded-2xl bg-white/20 hover:bg-rose-600 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer border border-white/20 shadow-xs"
            title="إغلاق النافذة"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Pharmacist Guarantee Banner */}
        <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-200/80 flex items-center justify-between gap-2 text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-semibold leading-tight">
              يتم فحص الروشتة مباشرة بواسطة <strong>صيادلة متخصصين</strong> وتأكيد الأصناف والجرعات بأمان تام.
            </span>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-black text-stone-900">
              تم إرسال طلب الروشتة بنجاح! 🎉
            </h3>

            {/* Reassurance Message Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-emerald-950 text-right space-y-2">
              <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-emerald-900">
                <Stethoscope className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>سيتابع معك صيادلة متخصصون لمتابعة استفسارك فوراً</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                تم تحويل الروشتة وبياناتك تلقائياً وبشكل مباشر إلى <strong>تيليجرام إدارة الصيدلية والمتجر</strong>. يقوم الصيدلي المناوب حالياً بمراجعة الأصناف والجرعات وسيتواصل معك فوراً لتأكيد الطلب والتوصيل السريع لأكتوبر وزايد.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1 text-right">
              <div><strong>كود الطلب:</strong> <span className="font-mono font-bold text-emerald-700">{createdReqId}</span></div>
              <div><strong>اسم العميل:</strong> {patientName}</div>
              <div><strong>رقم الهاتف:</strong> {phone}</div>
              <div><strong>المنطقة:</strong> {city === 'zayed' ? 'الشيخ زايد' : '٦ أكتوبر'} ({areaName || 'العنوان المسجل'})</div>
              {prescriptionImage && <div className="text-emerald-700 font-bold">✓ تم إرفاق صورة الروشتة وإرسالها للصيدلي بنجاح</div>}
            </div>

            {/* Telegram Direct Action Button & Close Button */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <a
                href={telegramDirectUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <SendHorizontal className="w-4 h-4 text-sky-200" />
                <span>فتح محادثة تيليجرام الصيدلية 💬</span>
              </a>
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            {/* Upload Area */}
            <div>
              <label className="text-xs font-black text-stone-800 block mb-1.5">
                صورة الروشتة أو علبة المنتج الطبي / التجميلي 📸
              </label>

              {prescriptionImage ? (
                <div className="relative rounded-2xl border-2 border-emerald-400 overflow-hidden bg-stone-50 p-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={prescriptionImage}
                      alt="الروشتة"
                      className="w-16 h-16 object-cover rounded-xl border border-stone-200"
                    />
                    <div>
                      <span className="text-xs font-bold text-emerald-800 block">
                        ✓ تم إرفاق الصورة بنجاح
                      </span>
                      <span className="text-[11px] text-stone-500">جاهزة للمراجعة الصيدلانية</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPrescriptionImage(null)}
                    className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors cursor-pointer"
                  >
                    تغيير الصورة
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-stone-300 hover:border-emerald-500 hover:bg-emerald-50/40 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-stone-50/60">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-extrabold text-stone-800 block">
                      اضغط هنا لتصوير الروشتة أو رفع ملف من جهازك
                    </span>
                    <span className="text-[10px] text-stone-400">
                      يدعم صور الكاميرا، JPG ،PNG حتى 5 ميجابايت
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Patient Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  الاسم بالكامل <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="مثال: داليا محمد"
                    className="w-full px-3 py-2.5 pr-9 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-stone-50/50"
                  />
                  <User className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  رقم الموبايل للتواصل <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01012345678"
                    className="w-full px-3 py-2.5 pr-9 rounded-xl border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-stone-50/50"
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                </div>
              </div>
            </div>

            {/* City & Detailed Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  المدينة (توصيل فوري)
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-stone-50/50 font-bold"
                >
                  <option value="zayed">الشيخ زايد</option>
                  <option value="october">٦ أكتوبر</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  الحي / المنطقة / الكمبوند
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={areaName}
                    onChange={(e) => setAreaName(e.target.value)}
                    placeholder="مثال: بيفرلي هيلز / الحي المتميز"
                    className="w-full px-3 py-2.5 pr-9 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-stone-50/50"
                  />
                  <MapPin className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                </div>
              </div>
            </div>

            {/* Notes / Special Instructions */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                ملاحظات، أسماء المنتجات، أو استفسار طبي للصيدلي (اختياري)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="اكتبي أي أعراض، استفسار عن الجرعات، أو بدائل ترغبين في معرفتها..."
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-stone-50/50"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit & Cancel Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 hover:from-emerald-700 hover:to-teal-900 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Send className="w-4 h-4 text-emerald-200" />
                <span>إرسال الروشتة للصيدلي عبر تيليجرام 🩺</span>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="py-3.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer border border-stone-300/80"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
