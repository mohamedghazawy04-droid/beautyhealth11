import React, { useState } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Phone,
  Search,
  MessageCircle,
  AlertCircle,
  Building,
  Star,
  Sparkles,
} from 'lucide-react';
import { Order, Product } from '../types';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onOpenReviewModal?: (
    product: Product,
    orderId?: string,
    customerName?: string,
    customerArea?: string
  ) => void;
  onMarkDelivered?: (orderId: string) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  onOpenReviewModal,
  onMarkDelivered,
}) => {
  const [searchIdOrPhone, setSearchIdOrPhone] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  if (!isOpen) return null;

  const filteredOrders = orders.filter((o) => {
    if (!searchIdOrPhone) return true;
    return (
      o.id.toLowerCase().includes(searchIdOrPhone.toLowerCase()) ||
      o.phone.includes(searchIdOrPhone) ||
      o.customerName.toLowerCase().includes(searchIdOrPhone.toLowerCase())
    );
  });

  const getStatusStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'new':
        return 0;
      case 'preparing':
        return 1;
      case 'with_courier':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  const steps = [
    { title: 'تم استلام الطلب', desc: 'تم إدخال الطلب بالنظام المركزي' },
    { title: 'جاري التجهيز والتغليف', desc: 'تجهيز المنتجات من مخزن أكتوبر وزايد' },
    { title: 'مع مندوب التوصيل', desc: 'المندوب في طريقه لعنوانك' },
    { title: 'تم التسليم بنجاح', desc: 'استلام ومعاينة المنتجات' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs text-right">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg">تتبع طلبات أكتوبر وزايد</h2>
              <p className="text-xs text-emerald-200">
                متابعة لحظية لحالة شحنتك ومندوب التوصيل
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

        {/* Search Bar */}
        <div className="p-4 bg-stone-50 border-b border-stone-200">
          <div className="relative">
            <input
              type="text"
              value={searchIdOrPhone}
              onChange={(e) => setSearchIdOrPhone(e.target.value)}
              placeholder="ابحث برقم الطلب (مثال: OCT-123456) أو رقم الهاتف..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-stone-800 text-sm">لا توجد طلبات مسجلة بعد في جلستك</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                عند إتمام أي طلب جديد سيظهر هنا تلقائياً لتتبع خط سير المندوب والتسليم.
              </p>
            </div>
          ) : (
            <>
              {/* Order selector tabs if multiple */}
              {filteredOrders.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {filteredOrders.map((ord) => (
                    <button
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                        selectedOrder?.id === ord.id
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      طلب #{ord.id} ({ord.total} ج)
                    </button>
                  ))}
                </div>
              )}

              {selectedOrder && (
                <div className="space-y-6">
                  {/* Order Overview Card */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-stone-900 font-mono">
                          طلب #{selectedOrder.id}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          {selectedOrder.city === 'zayed' ? 'الشيخ زايد' : '٦ أكتوبر'}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        العميل: {selectedOrder.customerName} • {selectedOrder.phone}
                      </div>
                      <div className="text-xs text-stone-700 font-semibold mt-0.5">
                        العنوان: {selectedOrder.zoneName} - {selectedOrder.detailedAddress}
                      </div>
                    </div>

                    <div className="text-left">
                      <div className="text-xs text-stone-500">الإجمالي:</div>
                      <div className="text-lg font-black text-emerald-800 font-mono">
                        {selectedOrder.total} جنيه
                      </div>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-xs text-stone-900 border-b border-stone-200 pb-1.5">
                      مراحل التجهيز والتوصيل:
                    </h3>

                    <div className="relative pl-6 space-y-5">
                      {steps.map((step, idx) => {
                        const currentStepIdx = getStatusStepIndex(selectedOrder.status);
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div key={idx} className="flex items-start gap-3 relative">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors z-10 ${
                                isDone
                                  ? 'bg-emerald-700 text-white shadow-xs'
                                  : 'bg-stone-200 text-stone-500'
                              }`}
                            >
                              {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                            </div>

                            <div className="space-y-0.5">
                              <div
                                className={`text-xs font-bold ${
                                  isCurrent
                                    ? 'text-emerald-900 font-black'
                                    : isDone
                                    ? 'text-stone-900'
                                    : 'text-stone-400'
                                }`}
                              >
                                {step.title} {isCurrent && '(الحالة الحالية)'}
                              </div>
                              <div className="text-[11px] text-stone-500">{step.desc}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivered Celebration & Rating Banner */}
                  {selectedOrder.status === 'delivered' ? (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-amber-500/15 border border-amber-300 space-y-2.5">
                      <div className="flex items-center gap-2 text-amber-950 font-black text-xs sm:text-sm">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>تم تسليم طلبك بنجاح! شاركنا رأيك وتقييمك للمنتجات</span>
                      </div>
                      <p className="text-stone-700 text-xs leading-relaxed">
                        تقييمك بالنجوم والتعليق يساعد عملاء وأمهات مدينتي ٦ أكتوبر والشيخ زايد في اختيار المنتجات الأنسب، وتحديث متوسط التقييم العام!
                      </p>
                    </div>
                  ) : (
                    onMarkDelivered && (
                      <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-stone-600 font-semibold">
                          هل استلمت الشحنة من المندوب بالفعل؟
                        </span>
                        <button
                          type="button"
                          onClick={() => onMarkDelivered(selectedOrder.id)}
                          className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          تأكيد الاستلام والتقييم ⭐
                        </button>
                      </div>
                    )
                  )}

                  {/* Courier Card */}
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-stone-900">
                          {selectedOrder.courierName || 'مندوب التوصيل السريع'}
                        </div>
                        <div className="text-emerald-800 font-semibold text-[11px]">
                          {selectedOrder.status === 'delivered'
                            ? 'تم التسليم والمعاينة بنجاح ✓'
                            : `وقت الوصول المتوقع: ${selectedOrder.estimatedDelivery}`}
                        </div>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/201000000000?text=مرحباً، أود الاستفسار عن وصول طلبي رقم ${selectedOrder.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>تواصل مع الدعم</span>
                    </a>
                  </div>

                  {/* Products in this order with rating action */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-stone-800">محتويات الطلب:</h4>
                      <span className="text-[11px] text-stone-500 font-medium">
                        اضغط لتقييم أي منتج استلمته بالنجوم
                      </span>
                    </div>

                    <div className="space-y-2">
                      {selectedOrder.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs p-3 rounded-2xl bg-stone-50 border border-stone-200"
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <img
                              src={item.product.image}
                              alt={item.product.nameAr}
                              className="w-11 h-11 rounded-xl object-cover border border-stone-200 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="font-extrabold text-stone-900 block truncate">
                                {item.product.nameAr}
                              </span>
                              <div className="flex items-center gap-2 text-stone-500 text-[11px] mt-0.5">
                                <span>كمية: {item.quantity}</span>
                                <span>•</span>
                                <span className="text-emerald-800 font-bold">
                                  {item.product.price * item.quantity} جنيه
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Rate Product Action */}
                          {onOpenReviewModal && (
                            <button
                              type="button"
                              onClick={() =>
                                onOpenReviewModal(
                                  item.product,
                                  selectedOrder.id,
                                  selectedOrder.customerName,
                                  `${selectedOrder.city === 'zayed' ? 'الشيخ زايد' : '٦ أكتوبر'} - ${selectedOrder.zoneName}`
                                )
                              }
                              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0 self-end sm:self-center"
                            >
                              <Star className="w-3.5 h-3.5 fill-stone-950" />
                              <span>قيّم هذا المنتج ⭐</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
