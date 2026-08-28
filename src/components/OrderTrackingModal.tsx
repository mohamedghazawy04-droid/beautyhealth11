import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  MessageCircle,
  Star,
  Receipt,
  Printer,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  MapPin,
  Phone,
  ShieldCheck,
  Calendar,
  CreditCard,
  Ban,
  ArrowRight,
  Filter,
  Check,
  Smartphone
} from 'lucide-react';
import { Order, Product, CartItem } from '../types';

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
  onReorder?: (items: CartItem[]) => void;
  onCancelOrder?: (orderId: string) => void;
  onRefreshOrders?: () => void;
  onOpenCustomerSupport?: (orderId: string) => void;
}

type TabType = 'all' | 'in_progress' | 'delivered' | 'cancelled';
type TimeFilter = 'all' | 'last_30_days' | 'last_3_months' | '2026';

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  onOpenReviewModal,
  onMarkDelivered,
  onReorder,
  onCancelOrder,
  onRefreshOrders,
  onOpenCustomerSupport,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [trackingDetailsOrder, setTrackingDetailsOrder] = useState<Order | null>(null);
  const [cancelPromptId, setCancelPromptId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto load saved phone number if exists
  useEffect(() => {
    if (isOpen && !searchQuery) {
      const savedPhone = localStorage.getItem('carehub_customer_phone');
      if (savedPhone) {
        // We can pre-fill or give a quick filter chip
      }
    }
  }, [isOpen]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (onRefreshOrders) {
      onRefreshOrders();
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Filter orders based on active tab, search, and time filter
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Tab filter
      if (activeTab === 'in_progress') {
        if (order.status === 'delivered' || order.status === 'cancelled') return false;
      } else if (activeTab === 'delivered') {
        if (order.status !== 'delivered') return false;
      } else if (activeTab === 'cancelled') {
        if (order.status !== 'cancelled') return false;
      }

      // 2. Search query (by Order ID, Phone, Customer Name, or Product Name)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesPhone = order.phone.includes(q);
        const matchesName = order.customerName.toLowerCase().includes(q);
        const matchesItem = order.items.some(
          (item) =>
            item.product.nameAr.toLowerCase().includes(q) ||
            item.product.name.toLowerCase().includes(q) ||
            item.product.brand.toLowerCase().includes(q)
        );
        if (!matchesId && !matchesPhone && !matchesName && !matchesItem) {
          return false;
        }
      }

      // 3. Time filter
      if (timeFilter !== 'all' && order.createdAt) {
        const orderDate = new Date(order.createdAt).getTime();
        const now = Date.now();
        const daysDiff = (now - orderDate) / (1000 * 3600 * 24);

        if (timeFilter === 'last_30_days' && daysDiff > 30) return false;
        if (timeFilter === 'last_3_months' && daysDiff > 90) return false;
        if (timeFilter === '2026') {
          const year = new Date(order.createdAt).getFullYear();
          if (year !== 2026) return false;
        }
      }

      return true;
    });
  }, [orders, activeTab, searchQuery, timeFilter]);

  if (!isOpen) return null;

  // Status badge config
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'new':
        return {
          text: 'تم استلام الطلب',
          desc: 'تم تأكيد طلبك بنجاح وجارٍ الإعداد',
          color: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-600',
          icon: Package,
          stepIndex: 0,
        };
      case 'preparing':
        return {
          text: 'جاري التجهيز والتغليف',
          desc: 'يتم تجهيز المنتجات من مستودع أكتوبر وزايد',
          color: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          icon: Clock,
          stepIndex: 1,
        };
      case 'with_courier':
        return {
          text: 'مع المندوب في الطريق إليك',
          desc: 'المندوب في طريقه لعنوانك في الوقت المحدد',
          color: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-purple-600',
          icon: Truck,
          stepIndex: 2,
        };
      case 'delivered':
        return {
          text: 'تم التسليم بنجاح',
          desc: 'تم تسليم الشحنة واستلامها',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-600',
          icon: CheckCircle2,
          stepIndex: 3,
        };
      case 'cancelled':
        return {
          text: 'طلب ملغي',
          desc: 'تم إلغاء هذا الطلب بناءً على رغبتكم',
          color: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-600',
          icon: Ban,
          stepIndex: -1,
        };
      default:
        return {
          text: 'قيد المعالجة',
          desc: 'جاري معالجة الطلب',
          color: 'bg-stone-50 text-stone-800 border-stone-200',
          dot: 'bg-stone-500',
          icon: Package,
          stepIndex: 0,
        };
    }
  };

  const steps = [
    { title: 'تم استلام الطلب', desc: 'تم إدخال الطلب بنجاح في النظام' },
    { title: 'جاري التجهيز والتعبئة', desc: 'تغليف آمن للمنتجات ومستحضرات العناية' },
    { title: 'خرج مع المندوب للتوصيل', desc: 'المندوب في طريقه لموقعك' },
    { title: 'تم التسليم بنجاح', desc: 'استلام المنتجات ومعاينتها' },
  ];

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/70 backdrop-blur-xs text-right overflow-y-auto">
      <div className="bg-[#f8f9fa] rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Amazon-Style Header */}
        <div className="bg-[#131921] text-white p-4 sm:p-5 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg">طلباتك (Your Orders)</h2>
                <span className="px-2 py-0.5 rounded-full bg-stone-800 text-pink-300 text-[11px] font-bold border border-stone-700">
                  {orders.length} طلب مسجل
                </span>
              </div>
              <p className="text-xs text-stone-300">
                تتبع الشحنات لحظياً، إعادة الطلب بنقرة واحدة، وعرض الفواتير بأسلوب أمازون
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-pink-300 hover:text-white flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer border border-stone-700 ${
                isRefreshing ? 'opacity-70' : ''
              }`}
              title="تحديث قائمة الطلبات"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">تحديث</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Amazon-Style Sub-Navigation Tabs */}
        <div className="bg-white border-b border-stone-200 px-4 sm:px-6 pt-3 shrink-0">
          <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto scrollbar-none border-b border-transparent">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'text-pink-700 border-b-2 border-pink-600'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              جميع الطلبات ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('in_progress')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'in_progress'
                  ? 'text-pink-700 border-b-2 border-pink-600'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>طلبات لم يتم تسليمها (جارية)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-pink-100 text-pink-800 text-[10px]">
                {orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('delivered')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'delivered'
                  ? 'text-pink-700 border-b-2 border-pink-600'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>تم تسليمها</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                {orders.filter((o) => o.status === 'delivered').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer ${
                activeTab === 'cancelled'
                  ? 'text-pink-700 border-b-2 border-pink-600'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              الطلبات الملغاة ({orders.filter((o) => o.status === 'cancelled').length})
            </button>
          </div>
        </div>

        {/* Amazon-Style Search & Period Filter Bar */}
        <div className="p-3 sm:p-4 bg-white border-b border-stone-200 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث في جميع الطلبات (اسم المنتج، رقم الطلب، الموبايل)..."
              className="w-full pl-9 pr-10 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:outline-none transition-all placeholder:text-stone-400 text-stone-900"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
              >
                مسح
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <Filter className="w-4 h-4 text-stone-500 hidden sm:block" />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
              aria-label="تصفية حسب الفترة الزمنية"
              className="w-full sm:w-auto px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm font-bold text-stone-700 focus:ring-2 focus:ring-pink-500 focus:outline-none cursor-pointer"
            >
              <option value="all">كل الفترات الزمنية</option>
              <option value="last_30_days">آخر 30 يوماً</option>
              <option value="last_3_months">آخر 3 أشهر</option>
              <option value="2026">عام 2026</option>
            </select>
          </div>
        </div>

        {/* Orders List Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-stone-200 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto shadow-inner">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">لم نتمكن من العثور على أي طلبات</h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                {searchQuery
                  ? `لا توجد نتائج مطابقة لـ "${searchQuery}". جرب البحث برقم هاتف أو اسم منتج مختلف.`
                  : 'لم تقم بإنشاء أي طلبات في هذه الفئة حتى الآن. تسوق منتجات العناية بالبشرة والشعر والطفل الآن!'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  إعادة ضبط البحث
                </button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusInfo = getStatusBadge(order.status);
              const StatusIcon = statusInfo.icon;
              const isExpanded = expandedOrderId === order.id;
              const isDelivered = order.status === 'delivered';
              const isCancelled = order.status === 'cancelled';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Amazon-Style Order Card Header Bar */}
                  <div className="bg-[#f0f2f2] px-4 py-3 border-b border-stone-200 text-xs text-stone-600 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                      <div>
                        <span className="block text-[11px] text-stone-500 font-medium uppercase tracking-wider">
                          تم وضع الطلب في
                        </span>
                        <span className="font-bold text-stone-800">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString('ar-EG', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'اليوم'}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[11px] text-stone-500 font-medium uppercase tracking-wider">
                          المجموع الكلي
                        </span>
                        <span className="font-black text-stone-900">
                          {order.total} جنيه مصري
                        </span>
                      </div>

                      <div>
                        <span className="block text-[11px] text-stone-500 font-medium uppercase tracking-wider">
                          إرسال إلى
                        </span>
                        <span className="font-bold text-stone-800 truncate max-w-[120px] inline-block align-bottom" title={order.customerName}>
                          {order.customerName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-left">
                        <span className="block text-[10px] text-stone-500 font-mono">
                          طلب #{order.id}
                        </span>
                        <button
                          onClick={() => setInvoiceOrder(order)}
                          className="text-xs font-bold text-pink-700 hover:text-pink-900 flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>عرض الفاتورة</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Main Order Card Body */}
                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Delivery Status Banner */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-3 h-3 rounded-full ${statusInfo.dot} animate-pulse`} />
                        <div>
                          <h4 className="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-2">
                            {statusInfo.text}
                          </h4>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {isDelivered
                              ? 'تم تسليم الشحنة بنجاح ومعاينة المنتجات'
                              : isCancelled
                              ? 'تم إلغاء الطلب'
                              : `موعد التوصيل المتوقع: ${
                                  order.estimatedDelivery || 'خلال ٢٤-٤٨ ساعة (أكتوبر وزايد)'
                                }`}
                          </p>
                        </div>
                      </div>

                      {/* Top Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setTrackingDetailsOrder(order)}
                          className="px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 active:scale-98 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          <Truck className="w-4 h-4" />
                          <span>تتبع الشحنة بالتفصيل</span>
                        </button>

                        <button
                          onClick={() =>
                            setExpandedOrderId(isExpanded ? null : order.id)
                          }
                          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          title="تفاصيل المنتجات"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Order Items Breakdown (Amazon Style Product Rows) */}
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-stone-50/70 border border-stone-200/80 hover:bg-white transition-colors"
                        >
                          {/* Product Info */}
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <img
                              src={item.product.image}
                              alt={item.product.nameAr}
                              className="w-16 h-16 object-cover rounded-xl border border-stone-200 bg-white shrink-0"
                            />
                            <div className="min-w-0">
                              <h5 className="font-bold text-stone-900 text-xs sm:text-sm line-clamp-1">
                                {item.product.nameAr}
                              </h5>
                              <p className="text-[11px] text-stone-500">
                                {item.product.brand} • الحجم: {item.product.volume}
                              </p>
                              <div className="text-xs font-bold text-pink-700 mt-1">
                                {item.product.price} ج × {item.quantity} ={' '}
                                <span className="font-extrabold">
                                  {item.product.price * item.quantity} ج
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Amazon-style per-item action buttons */}
                          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200">
                            {/* Buy it again button */}
                            {onReorder && (
                              <button
                                onClick={() => onReorder([item])}
                                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 active:scale-98 text-stone-950 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>شراء مرة أخرى (Buy it again)</span>
                              </button>
                            )}

                            {/* Product review button */}
                            {onOpenReviewModal && (
                              <button
                                onClick={() =>
                                  onOpenReviewModal(
                                    item.product,
                                    order.id,
                                    order.customerName,
                                    order.zoneName
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                                title="تقديم رأيك وتقييم المنتج وكتابة تعليق"
                              >
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                                <span>تقييم وكتابة رأيك</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Extended Order Details (Collapsible Drawer) */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-stone-200 space-y-3 animate-in fade-in duration-150">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Shipping address info */}
                          <div className="p-3 bg-stone-100 rounded-xl space-y-1">
                            <span className="font-bold text-stone-800 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-pink-600" />
                              عنوان الشحن والتوصيل:
                            </span>
                            <p className="text-stone-600 font-medium">
                              {order.customerName} - {order.phone}
                            </p>
                            <p className="text-stone-600">
                              {order.zoneName || 'أكتوبر وزايد'} - {order.detailedAddress}
                            </p>
                            {order.landmark && (
                              <p className="text-stone-500 text-[11px]">علامة مميزة: {order.landmark}</p>
                            )}
                          </div>

                          {/* Payment & pricing summary */}
                          <div className="p-3 bg-stone-100 rounded-xl space-y-1">
                            <span className="font-bold text-stone-800 flex items-center gap-1">
                              <CreditCard className="w-3.5 h-3.5 text-pink-600" />
                              تفاصيل الدفع:
                            </span>
                            <div className="flex justify-between text-stone-600">
                              <span>طريقة الدفع:</span>
                              <span className="font-bold text-stone-800">
                                {order.paymentMethod === 'cod'
                                  ? 'الدفع عند الاستلام'
                                  : order.paymentMethod === 'instapay'
                                  ? 'إنستاباي (InstaPay)'
                                  : 'محفظة إلكترونية'}
                              </span>
                            </div>
                            <div className="flex justify-between text-stone-600">
                              <span>رسوم التوصيل:</span>
                              <span>{order.deliveryFee > 0 ? `${order.deliveryFee} ج` : 'مجاناً'}</span>
                            </div>
                            {order.discount > 0 && (
                              <div className="flex justify-between text-emerald-700 font-bold">
                                <span>الخصم المطبق:</span>
                                <span>-{order.discount} ج</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Customer Support & Order Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                          {onOpenCustomerSupport ? (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onOpenCustomerSupport(order.id);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <MessageCircle className="w-4 h-4 text-pink-600" />
                              <span>استفسار أو مساعدة بشأن هذا الطلب (محادثة داخلية)</span>
                            </button>
                          ) : (
                            <a
                              href={`https://wa.me/201093629587?text=${encodeURIComponent(
                                `مرحباً، أود المساعدة بخصوص طلبي من متجر m&l رقم #${order.id}`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <MessageCircle className="w-4 h-4 text-emerald-600" />
                              <span>مساعدة بشأن هذا الطلب</span>
                            </a>
                          )}

                          {/* Cancel Order Action if still in new or preparing state */}
                          {!isDelivered && !isCancelled && onCancelOrder && (
                            <div>
                              {cancelPromptId === order.id ? (
                                <div className="flex items-center gap-2 bg-rose-50 p-1.5 rounded-xl border border-rose-200">
                                  <span className="text-[11px] text-rose-800 font-bold">
                                    تأكيد إلغاء الطلب؟
                                  </span>
                                  <button
                                    onClick={() => {
                                      onCancelOrder(order.id);
                                      setCancelPromptId(null);
                                    }}
                                    className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                                  >
                                    نعم، إلغاء
                                  </button>
                                  <button
                                    onClick={() => setCancelPromptId(null)}
                                    className="px-2 py-1 bg-white hover:bg-stone-100 text-stone-700 rounded-lg text-[11px] font-bold border border-stone-300 cursor-pointer"
                                  >
                                    تراجع
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setCancelPromptId(order.id)}
                                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  <span>طلب إلغاء الشحنة</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Amazon-Style Detailed Tracking Timeline Modal View */}
        {trackingDetailsOrder && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs text-right">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 bg-gradient-to-r from-pink-700 via-rose-700 to-pink-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-5 h-5" />
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base">
                      تتبع مسار الشحنة #{trackingDetailsOrder.id}
                    </h3>
                    <p className="text-[11px] text-pink-100">
                      تحديث لحظي لخطوات التوصيل في أكتوبر والشيخ زايد
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setTrackingDetailsOrder(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
                {/* Status Hero Box */}
                <div className="p-3.5 bg-pink-50 rounded-xl border border-pink-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-pink-800 font-medium">الحالة الراهنة:</span>
                    <h4 className="font-black text-sm text-pink-950 mt-0.5">
                      {getStatusBadge(trackingDetailsOrder.status).text}
                    </h4>
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-stone-500">التوصيل المتوقع:</span>
                    <div className="font-bold text-xs text-stone-800 mt-0.5">
                      {trackingDetailsOrder.estimatedDelivery || 'خلال ٢٤-٤٨ ساعة'}
                    </div>
                  </div>
                </div>

                {/* Vertical Step Timeline */}
                <div className="space-y-4 pr-3">
                  <h4 className="font-extrabold text-xs text-stone-900 border-b border-stone-200 pb-1.5">
                    سجل مراحل التوصيل:
                  </h4>
                  <div className="relative pr-6 border-r-2 border-pink-200 space-y-6 mr-3">
                    {steps.map((st, idx) => {
                      const currentStep = getStatusBadge(trackingDetailsOrder.status).stepIndex;
                      const isDone = currentStep >= 0 && idx <= currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div key={idx} className="relative">
                          <div
                            className={`absolute -right-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                              isDone
                                ? 'bg-pink-600 border-pink-600 text-white shadow-xs'
                                : 'bg-white border-stone-300 text-stone-300'
                            }`}
                          >
                            {isDone ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
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

                {/* Delivery Address */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                  <span className="font-bold text-stone-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-pink-600" />
                    عنوان المستلم:
                  </span>
                  <p className="text-stone-700 font-medium">
                    {trackingDetailsOrder.customerName} ({trackingDetailsOrder.phone})
                  </p>
                  <p className="text-stone-500">
                    {trackingDetailsOrder.zoneName || 'أكتوبر وزايد'} - {trackingDetailsOrder.detailedAddress}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-stone-50 border-t border-stone-200 flex justify-end">
                <button
                  onClick={() => setTrackingDetailsOrder(null)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  إغلاق نافذة التتبع
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Amazon-Style Invoice (Printable Modal) */}
        {invoiceOrder && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs text-right">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              
              {/* Header with Print button */}
              <div className="p-4 bg-stone-900 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-pink-400" />
                  <h3 className="font-extrabold text-sm sm:text-base">
                    فاتورة الشراء الإلكترونية (Invoice)
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintInvoice}
                    className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>طباعة الفاتورة</span>
                  </button>
                  <button
                    onClick={() => setInvoiceOrder(null)}
                    className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-white flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Printable invoice body */}
              <div className="p-6 overflow-y-auto space-y-6 text-stone-900 bg-white">
                {/* Store & Order Metadata */}
                <div className="flex justify-between items-start border-b border-stone-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-pink-700">متجر m&l للعناية والجمال</h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      منتجات العناية بالبشرة والشعر والطفل - ٦ أكتوبر والشيخ زايد
                    </p>
                    <p className="text-xs text-stone-500 font-mono">هاتف / واتساب: 01093629587</p>
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-stone-500 block">رقم الفاتورة:</span>
                    <span className="font-mono font-black text-sm text-stone-900">
                      INV-{invoiceOrder.id}
                    </span>
                    <span className="text-xs text-stone-500 block mt-1">تاريخ الطلب:</span>
                    <span className="text-xs font-bold text-stone-700">
                      {invoiceOrder.createdAt
                        ? new Date(invoiceOrder.createdAt).toLocaleDateString('ar-EG')
                        : 'اليوم'}
                    </span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl text-xs border border-stone-200">
                  <div>
                    <span className="text-stone-500 block mb-0.5">بيانات المستلم:</span>
                    <p className="font-bold text-stone-900">{invoiceOrder.customerName}</p>
                    <p className="font-mono text-stone-700">{invoiceOrder.phone}</p>
                  </div>
                  <div>
                    <span className="text-stone-500 block mb-0.5">عنوان التوصيل:</span>
                    <p className="font-medium text-stone-800">
                      {invoiceOrder.zoneName || 'أكتوبر وزايد'}
                    </p>
                    <p className="text-stone-600">{invoiceOrder.detailedAddress}</p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="border border-stone-200 rounded-xl overflow-hidden">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-3">المنتج</th>
                        <th className="p-3 text-center">الكمية</th>
                        <th className="p-3 text-center">السعر الفردي</th>
                        <th className="p-3 text-left">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {invoiceOrder.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-stone-50">
                          <td className="p-3 font-medium text-stone-900">
                            {item.product.nameAr}
                            <span className="block text-[10px] text-stone-500">
                              {item.product.brand} - {item.product.volume}
                            </span>
                          </td>
                          <td className="p-3 text-center font-bold">{item.quantity}</td>
                          <td className="p-3 text-center">{item.product.price} ج</td>
                          <td className="p-3 text-left font-black">
                            {item.product.price * item.quantity} ج
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total Calculations */}
                <div className="w-full sm:w-64 mr-auto space-y-1.5 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <div className="flex justify-between text-stone-600">
                    <span>المجموع الفرعي:</span>
                    <span className="font-bold">{invoiceOrder.subtotal || invoiceOrder.total} ج</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>مصاريف الشحن:</span>
                    <span>{invoiceOrder.deliveryFee > 0 ? `${invoiceOrder.deliveryFee} ج` : 'مجاني'}</span>
                  </div>
                  {invoiceOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>الخصم المطبق:</span>
                      <span>-{invoiceOrder.discount} ج</span>
                    </div>
                  )}
                  <div className="border-t border-stone-300 pt-2 flex justify-between text-sm font-black text-pink-700">
                    <span>الإجمالي النهائي:</span>
                    <span>{invoiceOrder.total} جنيه مصري</span>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="text-center text-stone-400 text-[11px] pt-4 border-t border-stone-200">
                  شكراً لتسوقك من متجر m&l للعناية والجمال • للاستفسار والدعم: 01093629587
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

