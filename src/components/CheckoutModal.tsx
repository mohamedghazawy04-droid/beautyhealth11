import React, { useState } from 'react';
import {
  X,
  MapPin,
  User,
  AlertCircle,
  Truck,
  Sparkles,
  Navigation,
  Calendar,
  Clock,
  CheckCircle2,
  Check,
  Copy,
  MessageCircle,
  Package,
  ShieldCheck,
  ArrowRight,
  Headphones
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
  onOpenOrderTracking?: (orderId?: string) => void;
  onOpenCustomerSupport?: (orderId?: string) => void;
}

const TIME_SLOTS = [
  '10:00 ص - 02:00 ظهراً (فترة صباحية)',
  '02:00 ظهراً - 06:00 مساءً (فترة بعد الظهر)',
  '06:00 مساءً - 10:00 مساءً (فترة مسائية)',
  '08:00 مساءً - 11:30 مساءً (فترة ليلية)',
];

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
  onOpenOrderTracking,
  onOpenCustomerSupport,
}) => {
  // Calculate minimum delivery date (24 hours minimum from now)
  const minDeliveryDate = (() => {
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return d.toISOString().split('T')[0];
  })();

  const maxDeliveryDate = (() => {
    const d = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days ahead
    return d.toISOString().split('T')[0];
  })();

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

  // Delivery Timing Scheduling (Minimum 24 hours)
  const [deliveryTimingType, setDeliveryTimingType] = useState<'standard_24h' | 'scheduled'>('standard_24h');
  const [scheduledDate, setScheduledDate] = useState(minDeliveryDate);
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState(TIME_SLOTS[1]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  if (!isOpen) return null;

  const currentZone =
    OCTOBER_ZAYED_ZONES.find((z) => z.id === selectedZoneId) || OCTOBER_ZAYED_ZONES[0];

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Free shipping threshold check (1000 EGP or storeSettings)
  const freeThreshold = storeSettings?.freeShippingThreshold || 1000;
  const isFreeDelivery = subtotal >= freeThreshold;
  const deliveryFee = isFreeDelivery ? 0 : (currentZone.deliveryFee ?? currentZone.fee ?? 35);
  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const handleResetAndClose = () => {
    setCompletedOrder(null);
    onClose();
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

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

    if (deliveryTimingType === 'scheduled') {
      if (!scheduledDate) {
        setErrorMsg('يرجى تحديد تاريخ موعد التوصيل المجدول');
        return;
      }
      if (scheduledDate < minDeliveryDate) {
        setErrorMsg('الحد الأدنى لجدولة موعد التوصيل هو ٢٤ ساعة على الأقل من الآن');
        return;
      }
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const deliveryTimeDisplay =
      deliveryTimingType === 'scheduled'
        ? `موعد مجدول: ${scheduledDate} (${scheduledTimeSlot})`
        : 'توصيل خلال ٢٤ ساعة (أقرب موعد متاح)';

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
      estimatedDelivery: deliveryTimeDisplay,
      deliveryTimingType,
      scheduledDate: deliveryTimingType === 'scheduled' ? scheduledDate : undefined,
      scheduledTimeSlot: deliveryTimingType === 'scheduled' ? scheduledTimeSlot : undefined,
    };

    setTimeout(() => {
      try {
        localStorage.setItem('carehub_customer_phone', phone);
        localStorage.setItem('carehub_customer_display_name', customerName);
        const existingIds = JSON.parse(localStorage.getItem('carehub_my_order_ids') || '[]');
        if (!existingIds.includes(orderId)) {
          existingIds.unshift(orderId);
          localStorage.setItem('carehub_my_order_ids', JSON.stringify(existingIds));
        }
      } catch (err) {
        console.error('LocalStorage order save error:', err);
      }

      onOrderCompleted(newOrder);
      onClearCart();
      setIsSubmitting(false);
      setCompletedOrder(newOrder);
    }, 400);
  };

  // If order was successfully completed, show dedicated in-app confirmation view!
  if (completedOrder) {
    const storeWhatsApp = storeSettings?.contactWhatsApp || '201093629587';
    const cleanWhatsApp = storeWhatsApp.replace(/\D/g, '');
    
    const itemsSummary = completedOrder.items
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.product.nameAr || it.product.name}*\n   الكمية: ${it.quantity} | السعر: ${it.product.price * it.quantity} ج`
      )
      .join('\n');

    const managerAlertMessage = encodeURIComponent(
      `🚨 *إخطار بطلب جديد تم تسجيله على السيستم* 📦\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `🔢 *رقم الأوردر:* #${completedOrder.id}\n` +
      `👤 *اسم العميل:* ${completedOrder.customerName}\n` +
      `📱 *رقم الهاتف:* ${completedOrder.phone}\n` +
      (completedOrder.alternatePhone ? `📱 *هاتف بديل:* ${completedOrder.alternatePhone}\n` : '') +
      `📍 *المنطقة:* ${completedOrder.city || ''} - ${completedOrder.zoneName || ''}\n` +
      `🏢 *العنوان بالتفصيل:* ${completedOrder.detailedAddress}\n` +
      (completedOrder.buildingNumber || completedOrder.floorNumber || completedOrder.apartmentNumber
        ? `🚪 *بيانات المبنى:* عمارة ${completedOrder.buildingNumber || '-'} / دور ${completedOrder.floorNumber || '-'} / شقة ${completedOrder.apartmentNumber || '-'}\n`
        : '') +
      (completedOrder.landmark ? `🏷️ *علامة مميزة:* ${completedOrder.landmark}\n` : '') +
      `🚚 *موعد التوصيل:* ${completedOrder.estimatedDelivery || 'خلال ٢٤ ساعة'}\n` +
      `💳 *طريقة الدفع:* ${
        completedOrder.paymentMethod === 'cod'
          ? '💵 كاش عند الاستلام'
          : completedOrder.paymentMethod === 'instapay'
          ? '📱 إنستاباي InstaPay'
          : '💳 محفظة إلكترونية'
      }\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `🛒 *الأصناف المطلوبة:*\n${itemsSummary}\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `💵 *المجموع الفرعي:* ${completedOrder.subtotal} جنيه\n` +
      (completedOrder.discount ? `🎟️ *الخصم (${completedOrder.appliedCoupon}):* -${completedOrder.discount} جنيه\n` : '') +
      `🚚 *الشحن:* ${completedOrder.deliveryFee === 0 ? 'مجاني 🎉' : `${completedOrder.deliveryFee} جنيه`}\n` +
      `💰 *الإجمالي النهائي المطلوب:* *${completedOrder.total} جنيه*\n` +
      (completedOrder.notes ? `📝 *ملاحظات للطلب:* ${completedOrder.notes}\n` : '') +
      `━━━━━━━━━━━━━━━━━\n` +
      `✅ *تم حفظ الطلب بنجاح في قاعدة بيانات المتجر*`
    );

    const managerWhatsAppUrl = `https://wa.me/${cleanWhatsApp}?text=${managerAlertMessage}`;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs text-right">
        <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-pink-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Success Banner */}
          <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-center flex flex-col items-center justify-center relative">
            <button
              onClick={handleResetAndClose}
              className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 rounded-full bg-white/20 border border-white/40 flex items-center justify-center mb-3 shadow-inner">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black">تم تسجيل وتأكيد طلبك بنجاح! 🎉</h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-md">
              تم إدراج بياناتك وعنوانك في سيستم المتجر الداخلي لبدء التجهيز والتوصيل
            </p>
          </div>

          {/* Order Details Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
            {/* Order ID & Status Badge */}
            <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[11px] text-stone-500 font-bold block">رقم الأوردر المسجل:</span>
                <span className="text-base sm:text-lg font-mono font-black text-pink-700">
                  #{completedOrder.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyOrderId(completedOrder.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors shadow-2xs"
              >
                {copiedOrderId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span>نسخ الرقم</span>
                  </>
                )}
              </button>
            </div>

            {/* Delivery Details */}
            <div className="bg-pink-50/60 border border-pink-200/80 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-stone-800 border-b border-pink-200/60 pb-2">
                <span className="flex items-center gap-1.5 text-pink-700">
                  <Truck className="w-4 h-4" />
                  <span>موعد التسليم المتوقع:</span>
                </span>
                <span className="text-stone-900 font-black">{completedOrder.estimatedDelivery}</span>
              </div>
              <div className="flex items-center justify-between text-stone-600 pt-1">
                <span>اسم المستلم:</span>
                <span className="font-semibold text-stone-900">{completedOrder.customerName} ({completedOrder.phone})</span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>عنوان التوصيل:</span>
                <span className="font-semibold text-stone-900">
                  {completedOrder.zoneName} - {completedOrder.detailedAddress}
                </span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>طريقة الدفع:</span>
                <span className="font-semibold text-stone-900">
                  {completedOrder.paymentMethod === 'cod'
                    ? '💵 كاش عند الاستلام'
                    : completedOrder.paymentMethod === 'instapay'
                    ? '📱 إنستاباي InstaPay'
                    : '💳 محفظة إلكترونية'}
                </span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>الإجمالي المطلوب:</span>
                <span className="font-black text-pink-700 text-sm">{completedOrder.total} جنيه</span>
              </div>
            </div>

            {/* Manager WhatsApp Alert Trigger Button */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-xs text-emerald-950">إشعار فوري لمدير المتجر على واتساب</strong>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    الطلب مسجل بالنظام، ويمكنك أيضاً إرسال نسخة تفصيلية للمدير مباشرة لضمان أسرع استجابة وتأكيد فوري.
                  </p>
                </div>
              </div>
              <a
                href={managerWhatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer no-underline text-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>إرسال إشعار الأوردر لمدير المتجر عبر واتساب 📲</span>
              </a>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="space-y-2 pt-1">
              {onOpenOrderTracking && (
                <button
                  type="button"
                  onClick={() => {
                    handleResetAndClose();
                    onOpenOrderTracking(completedOrder.id);
                  }}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-pink-500/20 transition-all cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>تتبع حالة الأوردر ومكانه لايف 🚚</span>
                </button>
              )}

              {onOpenCustomerSupport && (
                <button
                  type="button"
                  onClick={() => {
                    handleResetAndClose();
                    onOpenCustomerSupport(completedOrder.id);
                  }}
                  className="w-full bg-white hover:bg-pink-50 border border-pink-200 text-pink-700 font-bold py-2.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Headphones className="w-4 h-4 text-pink-600" />
                  <span>استفسار وتواصل مع قسم خدمة العملاء 💬</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full text-stone-500 hover:text-stone-800 py-2 text-xs font-semibold"
              >
                متابعة التسوق في المتجر
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-pink-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-right">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-pink-700 via-rose-700 to-pink-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>تأكيد واستكمال الطلب</span>
                <span className="text-[10px] bg-pink-500/50 text-white font-medium px-2 py-0.5 rounded-full border border-pink-400/40">
                  توصيل ٦ أكتوبر والشيخ زايد
                </span>
              </h2>
              <p className="text-xs text-pink-100/90 mt-0.5">
                تأكيد فوري وآمن مباشرة في سيستم المتجر الداخلي
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white/90 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-red-700 text-xs font-bold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Customer Info */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5 border-b border-stone-100 pb-1.5">
              <User className="w-4 h-4 text-pink-600" />
              <span>بيانات العميل المستلم</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">الاسم بالكامل:</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: ياسمين أحمد"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:bg-white focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">رقم الهاتف الأساسي:</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="مثال: 01012345678"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:bg-white focus:border-pink-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                رقم هاتف بديل (اختياري):
              </label>
              <input
                type="tel"
                value={alternatePhone}
                onChange={(e) => setAlternatePhone(e.target.value)}
                placeholder="رقم آخر في حال انشغال الرقم الأساسي"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:bg-white focus:border-pink-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Address & Zone Details */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5 border-b border-stone-100 pb-1.5">
              <MapPin className="w-4 h-4 text-pink-600" />
              <span>عنوان وتفاصيل التوصيل (أكتوبر وزايد)</span>
            </h3>

            {/* Zone Selector dropdown */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">المنطقة الجغرافية:</label>
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50/40 border border-pink-200 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-pink-500 focus:outline-none cursor-pointer"
              >
                <optgroup label="الشيخ زايد">
                  {OCTOBER_ZAYED_ZONES.filter((z) => z.city === 'zayed').map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} - ({z.deliveryFee ?? z.fee ?? 35} ج توصيل)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="مدينة ٦ أكتوبر">
                  {OCTOBER_ZAYED_ZONES.filter((z) => z.city === 'october').map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} - ({z.deliveryFee ?? z.fee ?? 35} ج توصيل)
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Distance & Delivery Fee Highlight */}
            <div className="p-3 bg-gradient-to-r from-pink-50 to-rose-50/50 rounded-2xl border border-pink-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-pink-600 shrink-0" />
                <div>
                  <span className="font-bold text-stone-800">
                    {currentZone.name} ({currentZone.city === 'zayed' ? 'الشيخ زايد' : '٦ أكتوبر'})
                  </span>
                  <p className="text-[10px] text-stone-500">
                    رسوم التوصيل المحددة:{' '}
                    {isFreeDelivery ? (
                      <span className="text-emerald-700 font-bold">مجاني 🎉</span>
                    ) : (
                      <span className="text-pink-700 font-bold">
                        {currentZone.deliveryFee ?? currentZone.fee ?? 35} جنيه
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-white px-2 py-1 rounded-lg border border-pink-200 font-bold text-stone-700">
                {currentZone.distanceTier || 'توصيل محلي'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                اسم الشارع / الكمبوند / المجاورة:
              </label>
              <input
                type="text"
                required
                value={detailedAddress}
                onChange={(e) => setDetailedAddress(e.target.value)}
                placeholder="مثال: كمبوند بيفرلي هيلز - المرحلة الثانية - شارع 14"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:bg-white focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">رقم العمارة/الفيلا:</label>
                <input
                  type="text"
                  value={buildingNumber}
                  onChange={(e) => setBuildingNumber(e.target.value)}
                  placeholder="عمارة 12"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-center focus:bg-white focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">الدور:</label>
                <input
                  type="text"
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(e.target.value)}
                  placeholder="الدور 3"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-center focus:bg-white focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">رقم الشقة:</label>
                <input
                  type="text"
                  value={apartmentNumber}
                  onChange={(e) => setApartmentNumber(e.target.value)}
                  placeholder="شقة 6"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-center focus:bg-white focus:border-pink-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                علامة مميزة أو أقرب معلم (اختياري):
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="بجوار مول / صيدلية / مدرسة..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:bg-white focus:border-pink-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 3: Delivery Timing & Scheduling (Minimum 24 Hours) */}
          <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-pink-50/60 via-stone-50/60 to-rose-50/40 border border-pink-200/80">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-pink-200/60 pb-2">
              <h3 className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-pink-600" />
                <span>موعد وتوقيت التوصيل (الحد الأدنى للتجهيز والتوصيل: ٢٤ ساعة)</span>
              </h3>
              <span className="text-[10px] bg-pink-100 text-pink-800 font-bold px-2 py-0.5 rounded-full border border-pink-200">
                مرونة المواعيد
              </span>
            </div>

            {/* Timing Mode Switcher */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryTimingType('standard_24h')}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-start gap-2.5 ${
                  deliveryTimingType === 'standard_24h'
                    ? 'border-pink-600 bg-white text-stone-900 ring-2 ring-pink-500/20 shadow-xs'
                    : 'border-stone-200 bg-white/70 text-stone-600 hover:bg-white'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    deliveryTimingType === 'standard_24h'
                      ? 'border-pink-600 bg-pink-600 text-white'
                      : 'border-stone-300'
                  }`}
                >
                  {deliveryTimingType === 'standard_24h' && <CheckCircle2 className="w-3 h-3" />}
                </div>
                <div>
                  <div className="text-xs font-black text-stone-900 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-pink-600" />
                    <span>توصيل خلال ٢٤ ساعة</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    أقرب موعد متاح للتسليم مع تجهيز صيدلي محكم
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryTimingType('scheduled')}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-start gap-2.5 ${
                  deliveryTimingType === 'scheduled'
                    ? 'border-pink-600 bg-white text-stone-900 ring-2 ring-pink-500/20 shadow-xs'
                    : 'border-stone-200 bg-white/70 text-stone-600 hover:bg-white'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    deliveryTimingType === 'scheduled'
                      ? 'border-pink-600 bg-pink-600 text-white'
                      : 'border-stone-300'
                  }`}
                >
                  {deliveryTimingType === 'scheduled' && <CheckCircle2 className="w-3 h-3" />}
                </div>
                <div>
                  <div className="text-xs font-black text-stone-900 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-pink-600" />
                    <span>تحديد موعد مجدول مستقبلي 📅</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    اختاري يوماً ووقتاً يناسب جدولك (بعد ٢٤ ساعة فما فوق)
                  </p>
                </div>
              </button>
            </div>

            {/* Scheduled Date & Time Slot Details Picker */}
            {deliveryTimingType === 'scheduled' && (
              <div className="p-3.5 rounded-2xl bg-white border border-pink-200/90 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-pink-600" />
                      <span>تاريخ يوم التوصيل:</span>
                    </label>
                    <input
                      type="date"
                      min={minDeliveryDate}
                      max={maxDeliveryDate}
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-pink-50/40 border border-pink-200 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-stone-400 block mt-1">
                      * أقل موعد متاح هو بعد ٢٤ ساعة ({minDeliveryDate})
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-pink-600" />
                      <span>الفترة الزمنية المفضلة:</span>
                    </label>
                    <select
                      value={scheduledTimeSlot}
                      onChange={(e) => setScheduledTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-pink-50/40 border border-pink-200 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-pink-500 focus:outline-none cursor-pointer"
                    >
                      {TIME_SLOTS.map((slot, idx) => (
                        <option key={idx} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-pink-50/70 border border-pink-200/80 text-[11px] text-pink-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-pink-600 shrink-0" />
                  <span>
                    سيتم تجهيز طلبك بعناية وتسليمه للمندوب لزيارتكم يوم <strong>{scheduledDate}</strong> في الفترة: <strong>{scheduledTimeSlot}</strong>.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Payment Method */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-700">طريقة الدفع المفضلة:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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

              <button
                type="button"
                onClick={() => setPaymentMethod('vodafone_cash')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'vodafone_cash'
                    ? 'border-pink-600 bg-pink-50/70 text-pink-900 font-extrabold ring-1 ring-pink-500'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-pink-50/30'
                }`}
              >
                <span className="text-xs">💳 محفظة إلكترونية</span>
              </button>
            </div>
          </div>

          {/* Section 5: Notes */}
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
            disabled={isSubmitting}
            onClick={handleSubmitOrder}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-pink-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>جاري تسجيل الطلب...</span>
              </span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>تأكيد وتسجيل الأوردر 🛍️</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
