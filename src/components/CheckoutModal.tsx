import React, { useState } from 'react';
import {
  X,
  Truck,
  MapPin,
  Phone,
  User,
  Building,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Copy,
  Upload,
  MessageCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { CartItem, DeliveryZone, Order, PaymentMethod } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  selectedZone: DeliveryZone;
  onOpenZoneModal: () => void;
  appliedCoupon: string;
  discountAmount: number;
  onOrderCompleted: (order: Order) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  selectedZone,
  onOpenZoneModal,
  appliedCoupon,
  discountAmount,
  onOrderCompleted,
  onClearCart,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [floorNumber, setFloorNumber] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [instaPayReceiptUploaded, setInstaPayReceiptUploaded] = useState(false);
  const [copiedInstaPay, setCopiedInstaPay] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= selectedZone.freeDeliveryThreshold || appliedCoupon === 'ZAYEDFREE';
  const effectiveDeliveryFee = isFreeDelivery ? 0 : selectedZone.deliveryFee;
  const grandTotal = Math.max(0, subtotal - discountAmount + effectiveDeliveryFee);

  const instaPayId = 'carehub.october@instapay';
  const vodafoneCashNumber = '01012345678';

  const handleCopyInstaPay = () => {
    navigator.clipboard.writeText(instaPayId);
    setCopiedInstaPay(true);
    setTimeout(() => setCopiedInstaPay(false), 2500);
  };

  const handleSubmitOrder = (isWhatsAppDispatch: boolean = false) => {
    if (!customerName.trim()) {
      setErrorMsg('يرجى إدخال اسم العميل بالكامل');
      return;
    }
    if (!phone.trim() || phone.length < 11) {
      setErrorMsg('يرجى إدخال رقم هاتف صحيح مكون من ١١ رقماً للتواصل مع المندوب');
      return;
    }
    if (!detailedAddress.trim()) {
      setErrorMsg('يرجى كتابة اسم الشارع أو رقم العمارة أو الكمبوند بدقة في ٦ أكتوبر / زايد');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const orderId = 'OCT-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: orderId,
      customerName,
      phone,
      alternatePhone,
      city: selectedZone.city,
      zoneId: selectedZone.id,
      zoneName: selectedZone.name,
      detailedAddress,
      buildingNumber,
      floorNumber,
      apartmentNumber,
      landmark,
      items: [...items],
      subtotal,
      deliveryFee: effectiveDeliveryFee,
      discount: discountAmount,
      total: grandTotal,
      appliedCoupon,
      paymentMethod,
      notes,
      status: 'new',
      createdAt: new Date().toISOString(),
      estimatedDelivery: selectedZone.estimatedDeliveryTime,
      courierName: selectedZone.city === 'zayed' ? 'كابتن محمود (مندوب زايد)' : 'كابتن أحمد (مندوب أكتوبر)',
      courierPhone: '01099887766',
    };

    setTimeout(() => {
      onOrderCompleted(newOrder);
      onClearCart();
      setIsSubmitting(false);
      onClose();

      if (isWhatsAppDispatch) {
        // Build detailed Arabic WhatsApp message
        const itemsList = items
          .map((i, idx) => `${idx + 1}. ${i.product.nameAr} (الكمية: ${i.quantity}) - ${i.product.price * i.quantity} ج`)
          .join('\n');

        const paymentName =
          paymentMethod === 'cod'
            ? 'كاش عند الاستلام'
            : paymentMethod === 'instapay'
            ? 'إنستاباي InstaPay'
            : paymentMethod === 'vodafone_cash'
            ? 'فودافون كاش'
            : 'بطاقة بنكية';

        const waText = encodeURIComponent(
          `*طلب جديد من متجر عناية أكتوبر وزايد 🌸*\n` +
          `*رقم الطلب:* #${orderId}\n` +
          `*الاسم:* ${customerName}\n` +
          `*الهاتف:* ${phone}\n` +
          `*المدينة والمنطقة:* ${selectedZone.name}\n` +
          `*العنوان التفصيلي:* ${detailedAddress} (عمارة: ${buildingNumber || '-'}، دور: ${floorNumber || '-'}، شقة: ${apartmentNumber || '-'})\n` +
          `*علامة مميزة:* ${landmark || 'لا يوجد'}\n\n` +
          `*قائمة المنتجات:*\n${itemsList}\n\n` +
          `*المجموع الفرعي:* ${subtotal} جنيه\n` +
          `*الخصم:* ${discountAmount} جنيه\n` +
          `*رسوم التوصيل:* ${effectiveDeliveryFee === 0 ? 'مجاني' : effectiveDeliveryFee + ' جنيه'}\n` +
          `*الإجمالي النهائي:* ${grandTotal} جنيه\n` +
          `*طريقة الدفع:* ${paymentName}\n` +
          `*ملاحظات:* ${notes || 'لا يوجد'}`
        );

        window.open(`https://wa.me/201000000000?text=${waText}`, '_blank');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-right">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg">إتمام الطلب والتوصيل السريع</h2>
              <p className="text-xs text-emerald-200">
                توصيل فوري خلال {selectedZone.estimatedDeliveryTime} إلى {selectedZone.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Customer Info */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5 border-b border-stone-200 pb-1.5">
              <User className="w-4 h-4 text-emerald-700" />
              بيانات المستلم والتواصل:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  الاسم بالكامل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: ياسمين أحمد"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  رقم الهاتف (واتساب) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01012345678"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono text-left"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Address in October / Zayed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
              <h3 className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                عنوان التوصيل في ٦ أكتوبر / الشيخ زايد:
              </h3>
              <button
                type="button"
                onClick={onOpenZoneModal}
                className="text-xs font-bold text-emerald-800 underline hover:text-emerald-900 cursor-pointer"
              >
                تغيير المنطقة ({selectedZone.city === 'zayed' ? 'زايد' : 'أكتوبر'})
              </button>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-950">المنطقة المحددة: </span>
                <span className="text-emerald-800 font-semibold">{selectedZone.name}</span>
              </div>
              <span className="text-[11px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
                توصيل {selectedZone.estimatedDeliveryTime}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                اسم الشارع / الكمبوند / المجاورة <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={detailedAddress}
                onChange={(e) => setDetailedAddress(e.target.value)}
                placeholder="مثال: كمبوند بيفرلي هيلز - مجاورة 3، أو شارع جمال عبد الناصر - الحي المتميز..."
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">رقم العمارة/الفيلا</label>
                <input
                  type="text"
                  value={buildingNumber}
                  onChange={(e) => setBuildingNumber(e.target.value)}
                  placeholder="مثال: عمارة 14"
                  className="w-full px-2.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">الدور</label>
                <input
                  type="text"
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(e.target.value)}
                  placeholder="مثال: الدور الثالث"
                  className="w-full px-2.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">رقم الشقة</label>
                <input
                  type="text"
                  value={apartmentNumber}
                  onChange={(e) => setApartmentNumber(e.target.value)}
                  placeholder="شقة 6"
                  className="w-full px-2.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                علامة مميزة بالقرب منك (صيدلية، مول، مستشفى، بوابة كمبوند)
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="مثال: بجوار مول العرب، أو أمام مسجد الحصري، أو بوابة 2 بيفرلي هيلز..."
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5 border-b border-stone-200 pb-1.5">
              <CreditCard className="w-4 h-4 text-emerald-700" />
              طريقة الدفع المناسبة لك:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: COD */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                  paymentMethod === 'cod'
                    ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-white border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-extrabold text-stone-900">الدفع كاش عند الاستلام (COD)</div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    ادفع نقداً لمندوب التوصيل بعد استلام ومعاينة منتجاتك
                  </p>
                </div>
              </div>

              {/* Option 2: InstaPay */}
              <div
                onClick={() => setPaymentMethod('instapay')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                  paymentMethod === 'instapay'
                    ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-white border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Smartphone className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-extrabold text-stone-900">تحويل إنستاباي InstaPay ⚡</div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    تحويل فوري بدون أي رسوم إضافية
                  </p>
                </div>
              </div>

              {/* Option 3: Vodafone Cash */}
              <div
                onClick={() => setPaymentMethod('vodafone_cash')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                  paymentMethod === 'vodafone_cash'
                    ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-white border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Smartphone className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-extrabold text-stone-900">محفظة إلكترونية (فودافون كاش)</div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    تحويل على رقم المحفظة المعتمد
                  </p>
                </div>
              </div>

              {/* Option 4: Card */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                  paymentMethod === 'card'
                    ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-white border-stone-200 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-extrabold text-stone-900">بطاقة بنكية مع المندوب (POS)</div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    يحضر المندوب ماكينة فيزا عند التوصيل
                  </p>
                </div>
              </div>
            </div>

            {/* InstaPay Details Box */}
            {paymentMethod === 'instapay' && (
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-3 animate-in fade-in">
                <div className="text-xs font-extrabold text-purple-950 flex items-center justify-between">
                  <span>بيانات تحويل إنستاباي InstaPay:</span>
                  <span className="text-purple-700 font-mono text-xs">{grandTotal} جنيه</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-purple-200">
                  <span className="text-xs font-mono font-bold text-stone-800">{instaPayId}</span>
                  <button
                    type="button"
                    onClick={handleCopyInstaPay}
                    className="px-2.5 py-1 bg-purple-800 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedInstaPay ? 'تم النسخ!' : 'نسخ المعرف'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-purple-900">
                  <span>هل تم التحويل؟</span>
                  <button
                    type="button"
                    onClick={() => setInstaPayReceiptUploaded(!instaPayReceiptUploaded)}
                    className={`px-3 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                      instaPayReceiptUploaded
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-purple-900 border-purple-300'
                    }`}
                  >
                    {instaPayReceiptUploaded ? '✓ تم إرفاق الإشعار' : 'إرفاق إشعار التحويل'}
                  </button>
                </div>
              </div>
            )}

            {/* Vodafone Cash Box */}
            {paymentMethod === 'vodafone_cash' && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-1">
                <div className="font-bold text-rose-950">رقم تحويل فودافون كاش:</div>
                <div className="font-mono text-base font-black text-rose-700">{vodafoneCashNumber}</div>
                <p className="text-[11px] text-stone-600">
                  يرجى تحويل مبلغ {grandTotal} جنيه وسيتواصل معك المندوب لتأكيد الاستلام.
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              ملاحظات خاصة للمندوب (اختياري)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: يرجى الاتصال قبل الوصول بـ ١٥ دقيقة أو ترك الطلب مع الأمن..."
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Order Summary & Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-bold text-stone-700">الإجمالي النهائي المطلوب:</span>
            <span className="text-xl font-black text-emerald-800">{grandTotal} جنيه</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Direct Instant Web Order */}
            <button
              onClick={() => handleSubmitOrder(false)}
              disabled={isSubmitting}
              className="py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>تأكيد الطلب والتوصيل الآن</span>
            </button>

            {/* WhatsApp Order Dispatch */}
            <button
              onClick={() => handleSubmitOrder(true)}
              disabled={isSubmitting}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>تأكيد وإرسال الفاتورة عبر واتساب</span>
            </button>
          </div>

          <div className="text-center text-[11px] text-stone-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>منتجات أصلية معتمدة • حق المعاينة ورفض الاستلام مجاناً</span>
          </div>
        </div>
      </div>
    </div>
  );
};
