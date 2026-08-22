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
  Star,
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
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-pink-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-pink-700 via-rose-700 to-pink-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg">تتبع طلبات متجر m&l</h2>
              <p className="text-xs text-pink-100">
                متابعة لحظية لحالة شحنتك ومندوب التوصيل في أكتوبر وزايد
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
        <div className="p-4 bg-pink-50/30 border-b border-pink-100">
          <div className="relative">
            <input
              type="text"
              value={searchIdOrPhone}
              onChange={(e) => setSearchIdOrPhone(e.target.value)}
              placeholder="ابحثي برقم الطلب (مثال: ORD-123456) أو رقم الموبايل..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-pink-200 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none text-stone-900"
            />
            <Search className="w-4 h-4 text-pink-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Orders Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mx-auto text-pink-300">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-stone-800 text-sm">لا توجد طلبات سابقة مسجلة على هذا الجهاز</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                عند قيامك بطلب منتجات من المتجر، ستتمكنين من تتبع حالة التوصيل وخطوات المندوب هنا مباشرة.
              </p>
            </div>
          ) : (
            <>
              {/* Order selector tabs if multiple */}
              {filteredOrders.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {filteredOrders.map((ord) => (
                    <button
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                        selectedOrder?.id === ord.id
                          ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-600 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-pink-50'
                      }`}
                    >
                      #{ord.id} ({ord.customerName})
                    </button>
                  ))}
                </div>
              )}

              {selectedOrder && (
                <div className="space-y-6">
                  {/* Summary Card */}
                  <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-stone-500">رقم الطلب:</div>
                      <div className="font-mono font-black text-sm text-pink-700">
                        #{selectedOrder.id}
                      </div>
                      <div className="text-xs text-stone-700 font-bold mt-1">
                        العميل: {selectedOrder.customerName}
                      </div>
                    </div>

                    <div className="text-left">
                      <div className="text-xs text-stone-500">الإجمالي:</div>
                      <div className="font-black text-sm text-pink-700">
                        {selectedOrder.total} جنيه
                      </div>
                      <div className="text-[11px] text-pink-700 font-bold mt-0.5">
                        {selectedOrder.estimatedDelivery || 'توصيل خلال ٢٤-٤٨ ساعة'}
                      </div>
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-xs text-stone-900 border-b border-pink-100 pb-1.5">
                      مراحل التوصيل:
                    </h4>
                    <div className="relative pr-6 border-r-2 border-pink-200 space-y-6 mr-3">
                      {steps.map((st, idx) => {
                        const currentStep = getStatusStepIndex(selectedOrder.status);
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div key={idx} className="relative">
                            <div
                              className={`absolute -right-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                                isDone
                                  ? 'bg-pink-600 border-pink-600 text-white'
                                  : 'bg-white border-stone-300 text-stone-300'
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <span className="text-[10px] font-bold">{idx + 1}</span>
                              )}
                            </div>

                            <div>
                              <h5
                                className={`text-xs font-bold ${
                                  isCurrent
                                    ? 'text-pink-700 font-black'
                                    : isDone
                                    ? 'text-stone-900'
                                    : 'text-stone-400'
                                }`}
                              >
                                {st.title} {isCurrent && '📍'}
                              </h5>
                              <p className="text-[11px] text-stone-500 mt-0.5">{st.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="space-y-2 pt-2 border-t border-pink-100">
                    <h4 className="font-bold text-xs text-stone-900">محتويات الشحنة:</h4>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl border border-pink-100 bg-white flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={item.product.image}
                              alt={item.product.nameAr}
                              className="w-10 h-10 object-cover rounded-lg border border-pink-50"
                            />
                            <div>
                              <div className="font-bold text-stone-900">{item.product.nameAr}</div>
                              <div className="text-stone-500 text-[11px]">
                                الكمية: {item.quantity} × {item.product.price} ج
                              </div>
                            </div>
                          </div>

                          {selectedOrder.status === 'delivered' && onOpenReviewModal && (
                            <button
                              onClick={() =>
                                onOpenReviewModal(
                                  item.product,
                                  selectedOrder.id,
                                  selectedOrder.customerName,
                                  selectedOrder.zoneName
                                )
                              }
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[11px] font-bold border border-amber-200 flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                              <span>تقييم</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick WhatsApp Support */}
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/201012345678?text=${encodeURIComponent(
                        `مرحباً خدمة عملاء متجر m&l، أود الاستفسار عن طلبي رقم #${selectedOrder.id}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 rounded-xl bg-pink-100/70 hover:bg-pink-200 text-pink-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer text-center no-underline"
                    >
                      <MessageCircle className="w-4 h-4 text-pink-700" />
                      <span>تواصل مع خدمة العملاء بخصوص هذا الطلب</span>
                    </a>
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
