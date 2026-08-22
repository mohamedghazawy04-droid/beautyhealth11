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
  MessageCircle,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { CartItem, Order, PaymentMethod, StoreSettings } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedCoupon: string;
  discountAmount: number;
  onOrderCompleted: (order: Order) => void;
  onClearCart: () => void;
  storeSettings?: StoreSettings;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedCoupon,
  discountAmount,
  onOrderCompleted,
  onClearCart,
  storeSettings,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [city, setCity] = useState('القاهرة والجيزة');
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
  const freeThreshold = storeSettings?.freeShippingThreshold || 400;
  const isFreeDelivery = subtotal >= freeThreshold || appliedCoupon === 'ZAYEDFREE';
  const deliveryFee = isFreeDelivery ? 0 : 25;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const instaPayId = 'carehub@instapay';
  const defaultWhatsApp = storeSettings?.contactWhatsApp || '201012345678';
  // Clean phone for wa.me link (digits only)
  const cleanWhatsAppNumber = defaultWhatsApp.replace(/\D/g, '');

  const handleCopyInstaPay = () => {
    navigator.clipboard.writeText(instaPayId);
    setCopiedInstaPay(true);
    setTimeout(() => setCopiedInstaPay(false), 2500);
  };

  const handleSubmitOrder = (isWhatsApp: boolean = true) => {
    if (!customerName.trim()) {
      setErrorMsg('يرجى إدخال اسم العميل بالكامل');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMsg('يرجى إدخال رقم هاتف صحيح للتواصل');
      return;
    }
    if (!detailedAddress.trim()) {
      setErrorMsg('يرجى كتابة عنوان التوصيل بالتفصيل (المنطقة / الشارع / المبنى)');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: orderId,
      customerName,
      phone,
      alternatePhone,
      city,
      zoneId: 'default',
      zoneName: city,
      detailedAddress,
      buildingNumber,
      floorNumber,
      apartmentNumber,
      landmark,
      items: [...items],
      subtotal,
      deliveryFee,
      discount: discountAmount,
      total: grandTotal,
      appliedCoupon,
      paymentMethod,
      notes,
      status: 'new',
      createdAt: new Date().toISOString(),
      estimatedDelivery: 'خلال 24-48 ساعة',
    };

    setTimeout(() => {
      onOrderCompleted(newOrder);
      onClearCart();
      setIsSubmitting(false);
      onClose();

      // Build structured Arabic WhatsApp Message
      const paymentName =
        paymentMethod === 'cod'
          ? 'كاش عند الاستلام'
          : paymentMethod === 'instapay'
          ? 'إنستاباي InstaPay'
          : paymentMethod === 'vodafone_cash'
          ? 'فودافون كاش'
          : 'بطاقة بنكية';

      const itemsText = items
        .map((i, idx) => `${idx + 1}. ${i.product.nameAr || i.product.name} (الكمية: ${i.quantity}) - ${i.product.price * i.quantity} ج`)
        .join('\n');

      const fullAddressParts = [
        detailedAddress,
        buildingNumber ? `عمارة/فيلا: ${buildingNumber}` : '',
        floorNumber ? `الدور: ${floorNumber}` : '',
        apartmentNumber ? `شقة: ${apartmentNumber}` : '',
        landmark ? `علامة مميزة: ${landmark}` : '',
      ]
        .filter(Boolean)
        .join(' - ');

      const messageContent =
        `*🛍️ طلب جديد من المتجر*\n` +
        `━━━━━━━━━━━━━━━━━\n` +
        `*رقم الطلب:* #${orderId}\n` +
        `*👤 اسم العميل:* ${customerName}\n` +
        `*📱 رقم الموبايل:* ${phone}${alternatePhone ? ` (رقم آخر: ${alternatePhone})` : ''}\n` +
        `*📍 عنوان التوصيل:* ${fullAddressParts}\n` +
        `━━━━━━━━━━━━━━━━━\n` +
        `*📦 المنتجات المطلوبة:*\n${itemsText}\n` +
        `━━━━━━━━━━━━━━━━━\n` +
        `*المجموع:* ${subtotal} جنيه\n` +
        (discountAmount > 0 ? `*الخصم:* -${discountAmount} جنيه\n` : '') +
        `*الشحن:* ${deliveryFee === 0 ? 'مجاني 🎉' : `${deliveryFee} جنيه`}\n` +
        `*💵 الإجمالي النهائي:* ${grandTotal} جنيه\n` +
        `*💳 طريقة الدفع:* ${paymentName}\n` +
        (notes ? `*📝 ملاحظات:* ${notes}\n` : '') +
        `━━━━━━━━━━━━━━━━━`;

      const waUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(messageContent)}`;
      window.open(waUrl, '_blank');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-right">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg">إتمام الطلب وإرساله للواتساب</h2>
              <p className="text-xs text-emerald-200">
                أدخل بيانات التوصيل وسيتم تحويل الأوردر برسالة واتساب مباشرة
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
              بيانات العميل والتواصل:
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
                  placeholder="اكتب اسمك هنا"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  رقم الموبايل (واتساب) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono text-left"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                رقم هاتف بديل (اختياري)
              </label>
              <input
                type="tel"
                value={alternatePhone}
                onChange={(e) => setAlternatePhone(e.target.value)}
                placeholder="رقم آخر إن وجد"
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono text-left"
              />
            </div>
          </div>

          {/* Section 2: Address */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5 border-b border-stone-200 pb-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" />
              عنوان التوصيل بالتفصيل:
            </h3>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                المدينة / المنطقة / اسم الشارع <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={detailedAddress}
                onChange={(e) => setDetailedAddress(e.target.value)}
                placeholder="مثال: الحي، اسم الشارع، أو اسم الكمبوند..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">رقم العمارة/الفيلا</label>
                <input
                  type="text"
                  value={buildingNumber}
                  onChange={(e) => setBuildingNumber(e.target.value)}
                  placeholder="عمارة 5"
                  className="w-full px-2.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">الدور</label>
                <input
                  type="text"
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(e.target.value)}
                  placeholder="الدور 2"
                  className="w-full px-2.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">رقم الشقة</label>
                <input
                  type="text"
                  value={apartmentNumber}
                  onChange={(e) => setApartmentNumber(e.target.value)}
                  placeholder="شقة 4"
                  className="w-full px-2.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                علامة مميزة بالقرب من العنوان (اختياري)
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="مثال: بجوار صيدلية، مسجد، سوبرماركت..."
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5 border-b border-stone-200 pb-1.5">
              <CreditCard className="w-4 h-4 text-emerald-700" />
              طريقة الدفع المفضلة:
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
                  <div className="font-extrabold text-stone-900">الدفع كاش عند الاستلام</div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    ادفع نقداً عند استلام ومعاينة الطلب
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
                    تحويل فوري بدون رسوم
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
                    تحويل لمحفظة المتجر
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
                  <div className="font-extrabold text-stone-900">بطاقة بنكية مع المندوب</div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    الدفع بالفيزا / ماستركارد
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              ملاحظات إضافية (اختياري)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: موعد محدد للتسليم، أو ملاحظات خاصة..."
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

          {/* Primary Action: Send to WhatsApp */}
          <button
            onClick={() => handleSubmitOrder(true)}
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 transition-all cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 animate-pulse" />
            <span>إرسال الطلب عبر واتساب وتأكيده 📲</span>
          </button>

          <div className="text-center text-[11px] text-stone-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>سيتم فتح محادثة الواتساب فوراً برسالة جاهزة تحتوي على كل بيانات الطلب</span>
          </div>
        </div>
      </div>
    </div>
  );
};
