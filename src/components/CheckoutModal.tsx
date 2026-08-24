import React, { useState } from 'react';
import {
  X,
  MapPin,
  User,
  MessageCircle,
  AlertCircle,
  Truck,
  Sparkles,
  Navigation,
} from 'lucide-react';
import { CartItem, Order, PaymentMethod, StoreSettings, DeliveryZone } from '../types';
import { OCTOBER_ZAYED_ZONES } from '../data/zones';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedCoupon: string;
  discountAmount: number;
  onOrderCompleted: (order: Order) => void;
  onClearCart: () => void;
  storeSettings?: StoreSettings;
  selectedZone?: DeliveryZone;
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
  selectedZone: initialZone,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState<string>(
    initialZone?.id || OCTOBER_ZAYED_ZONES[0]?.id || 'oct-1'
  );
  const [detailedAddress, setDetailedAddress] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [floorNumber, setFloorNumber] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentZone =
    OCTOBER_ZAYED_ZONES.find((z) => z.id === selectedZoneId) || OCTOBER_ZAYED_ZONES[0];

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeThreshold = storeSettings?.freeShippingThreshold || 1000;
  const isFreeDelivery = subtotal >= freeThreshold || appliedCoupon === 'ZAYEDFREE';
  const rawDeliveryFee = currentZone.deliveryFee ?? 30;
  const deliveryFee = isFreeDelivery ? 0 : rawDeliveryFee;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);
  const remainingForFreeDelivery = Math.max(0, freeThreshold - subtotal);

  const defaultWhatsApp = storeSettings?.contactWhatsApp || '201093629587';
  const cleanWhatsAppNumber = defaultWhatsApp.replace(/\D/g, '');

  const handleSubmitOrder = () => {
    if (!customerName.trim()) {
      setErrorMsg('يرجى إدخال اسم العميل بالكامل');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMsg('يرجى إدخال رقم هاتف صحيح للتواصل');
      return;
    }
    if (!detailedAddress.trim()) {
      setErrorMsg('يرجى كتابة عنوان التوصيل بالتفصيل (اسم الشارع / المنطقة)');
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
      city: currentZone.city === 'zayed' ? 'الشيخ زايد' : '٦ أكتوبر',
      zoneId: currentZone.id,
      zoneName: currentZone.name,
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
      estimatedDelivery: currentZone.estimatedDeliveryTime || 'خلال ٢٤ ساعة من الطلب',
    };

    setTimeout(() => {
      try {
        localStorage.setItem('carehub_customer_phone', phone);
        const existingIds = JSON.parse(localStorage.getItem('carehub_my_order_ids') || '[]');
        if (!existingIds.includes(orderId)) {
          existingIds.unshift(orderId);
          localStorage.setItem('carehub_my_order_ids', JSON.stringify(existingIds));
        }
      } catch (e) {
        console.error('LocalStorage order save error:', e);
      }

      onOrderCompleted(newOrder);
      onClearCart();
      setIsSubmitting(false);
      onClose();

      const paymentName =
        paymentMethod === 'cod'
          ? 'كاش عند الاستلام'
          : paymentMethod === 'instapay'
          ? 'إنستاباي InstaPay'
          : paymentMethod === 'vodafone_cash'
          ? 'فودافون كاش'
          : 'بطاقة بنكية';

      const itemsText = items
        .map(
          (i, idx) =>
            `  ${idx + 1}. *${i.product.nameAr || i.product.name}*\n` +
            `     الكمية: ${i.quantity} × ${i.product.price} ج = *${i.product.price * i.quantity} جنيه*`
        )
        .join('\n');

      const fullAddressParts = [
        `المنطقة: ${currentZone.name}`,
        `الشارع/العنوان: ${detailedAddress}`,
        buildingNumber ? `عمارة/فيلا: ${buildingNumber}` : '',
        floorNumber ? `الدور: ${floorNumber}` : '',
        apartmentNumber ? `شقة: ${apartmentNumber}` : '',
        landmark ? `علامة مميزة: ${landmark}` : '',
      ]
        .filter(Boolean)
        .join(' - ');

      const distanceInfoText = currentZone.distanceKm
        ? ` (مسافة تقريبية: ${currentZone.distanceKm} كم | ${currentZone.distanceTier || 'توصيل محلي'})`
        : '';

      const deliveryFeeFormatted =
        deliveryFee === 0
          ? 'مجاني بالكامل 🎉 (طلبك 1000 جنيه أو أكثر)'
          : `${deliveryFee} جنيه (${currentZone.distanceTier || 'حسب المسافة'})`;

      const messageContent =
        `🌸 *طلب جديد من متجر m&l للعناية والجمال* 🌸\n` +
        `═══════════════════════\n` +
        `🧾 *رقم الأوردر:* #${orderId}\n` +
        `═══════════════════════\n` +
        `👤 *بيانات العميل:*\n` +
        `• *الاسم:* ${customerName}\n` +
        `• *رقم الهاتف:* ${phone}\n` +
        (alternatePhone ? `• *رقم بديل:* ${alternatePhone}\n` : '') +
        `• *منطقة التوصيل:* ${currentZone.name}${distanceInfoText}\n` +
        `• *العنوان بالتفصيل:* ${fullAddressParts}\n` +
        `═══════════════════════\n` +
        `📦 *المنتجات المطلوبة:*\n` +
        `${itemsText}\n` +
        `═══════════════════════\n` +
        `💰 *الحساب والتكلفة:*\n` +
        `• *قيمة المنتجات:* ${subtotal} جنيه\n` +
        (discountAmount > 0 ? `• *الخصم:* -${discountAmount} جنيه (${appliedCoupon})\n` : '') +
        `• *رسوم التوصيل (حسب المسافة):* ${deliveryFeeFormatted}\n` +
        `👉 *الإجمالي النهائي المطلوب دفعه:* *${grandTotal} جنيه*\n` +
        `• *طريقة الدفع:* ${paymentName}\n` +
        (notes ? `• *ملاحظات العميل:* ${notes}\n` : '') +
        `═══════════════════════\n` +
        `🚚 *موعد التسليم المتوقع:* خلال ٢٤ ساعة من وقت الطلب\n` +
        `شكراً لاختيارك متجر m&l 💕`;

      const waUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(messageContent)}`;
      window.open(waUrl, '_blank');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-pink-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-right">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-pink-700 via-rose-700 to-pink-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg">إتمام الطلب وإرساله للواتساب</h2>
              <p className="text-xs text-pink-100">
                حساب التوصيل حسب المسافة (نظام طلبات) | شحن مجاني فوق 1000 جنيه
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

          {/* Free Shipping Alert or Progress Banner */}
          {isFreeDelivery ? (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-900 text-xs font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>🎉 مبروك! حصلت على توصيل مجاني بالكامل لأن طلبك 1000 جنيه أو أكثر!</span>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-between gap-2 text-pink-900 text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-pink-600 shrink-0" />
                <span>
                  أضيفي منتجات بقيمة <strong className="font-bold text-pink-700">{remainingForFreeDelivery} جنيه</strong> للحصول على <strong>توصيل مجاني 100%</strong>!
                </span>
              </div>
            </div>
          )}

          {/* Section 1: Customer Info */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5 border-b border-pink-100 pb-1.5">
              <User className="w-4 h-4 text-pink-600" />
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
                  placeholder="اكتبي اسمك بالكامل هنا"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50/30 border border-pink-200 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50/30 border border-pink-200 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none font-mono text-left"
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
                placeholder="رقم آخر إن وجد لتأكيد الاستلام"
                className="w-full px-3.5 py-2 rounded-xl bg-pink-50/30 border border-pink-200 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none font-mono text-left"
              />
            </div>
          </div>

          {/* Section 2: Address & Zone / Distance Selection */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5 border-b border-pink-100 pb-1.5">
              <MapPin className="w-4 h-4 text-pink-600" />
              منطقة التوصيل وحساب المسافة:
            </h3>

            {/* Zone Selector (Talabat Style Distance Tiers) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                اختاري منطقتك في (٦ أكتوبر / الشيخ زايد / حدائق أكتوبر) <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-pink-500 focus:outline-none cursor-pointer"
              >
                {OCTOBER_ZAYED_ZONES.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} — {zone.distanceTier} ({zone.distanceKm} كم) — {isFreeDelivery ? 'الشحن مجاني 🎉' : `${zone.deliveryFee} ج`}
                  </option>
                ))}
              </select>
            </div>

            {/* Distance and Delivery Info Badge */}
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-stone-700">
                <Navigation className="w-4 h-4 text-pink-600" />
                <span>
                  المسافة المقدرة: <strong>{currentZone.distanceKm} كم</strong> ({currentZone.distanceTier})
                </span>
              </div>
              <div className="font-black text-pink-700">
                {isFreeDelivery ? (
                  <span className="text-emerald-600 font-extrabold">الشحن مجاناً 🎉</span>
                ) : (
                  <span>رسوم التوصيل: {deliveryFee} جنيه</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                اسم الشارع والحي بالتفصيل <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={detailedAddress}
                onChange={(e) => setDetailedAddress(e.target.value)}
                placeholder="مثال: شارع الجامعة، المجاورة الثانية، بجوار كمبوند..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50/30 border border-pink-200 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
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
                  className="w-full px-2.5 py-2 rounded-xl bg-pink-50/30 border border-pink-200 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">الدور</label>
                <input
                  type="text"
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(e.target.value)}
                  placeholder="الدور 2"
                  className="w-full px-2.5 py-2 rounded-xl bg-pink-50/30 border border-pink-200 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">رقم الشقة</label>
                <input
                  type="text"
                  value={apartmentNumber}
                  onChange={(e) => setApartmentNumber(e.target.value)}
                  placeholder="شقة 4"
                  className="w-full px-2.5 py-2 rounded-xl bg-pink-50/30 border border-pink-200 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                علامة مميزة (اختياري)
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="بجوار مدرسة، مول، مسجد، صيدلية..."
                className="w-full px-3.5 py-2 rounded-xl bg-pink-50/30 border border-pink-200 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-700">طريقة الدفع المفضلة:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-pink-600 bg-pink-50/70 text-pink-900 font-extrabold ring-1 ring-pink-500'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-pink-50/30'
                }`}
              >
                <span className="text-xs">💵 كاش عند الاستلام</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('instapay')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'instapay'
                    ? 'border-pink-600 bg-pink-50/70 text-pink-900 font-extrabold ring-1 ring-pink-500'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-pink-50/30'
                }`}
              >
                <span className="text-xs">📱 إنستاباي InstaPay</span>
              </button>
            </div>
          </div>

          {/* Section 4: Notes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              ملاحظات إضافية على الطلب أو التوصيل
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="مثال: يرجى الاتصال قبل الوصول بنصف ساعة..."
              className="w-full px-3.5 py-2 rounded-xl bg-pink-50/30 border border-pink-200 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-pink-50/50 border-t border-pink-100 flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-stone-500">
              قيمة الطلب: {subtotal} ج + التوصيل: {deliveryFee === 0 ? 'مجاني' : `${deliveryFee}ج`}
            </div>
            <div className="text-base sm:text-lg font-black text-pink-700">
              الإجمالي: {grandTotal} جنيه
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmitOrder}
            className="px-5 sm:px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-pink-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>تأكيد الطلب عبر واتساب 📲</span>
          </button>
        </div>
      </div>
    </div>
  );
};

