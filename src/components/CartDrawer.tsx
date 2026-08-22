import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Truck,
  Sparkles,
  Zap,
  Tag,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { CartItem, DeliveryZone } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  selectedZone: DeliveryZone;
  onOpenZoneModal: () => void;
  onProceedToCheckout: () => void;
  appliedCoupon: string;
  onApplyCoupon: (code: string) => { success: boolean; message: string };
  onRemoveCoupon: () => void;
  discountAmount: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  selectedZone,
  onOpenZoneModal,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  discountAmount,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= selectedZone.freeDeliveryThreshold || appliedCoupon === 'ZAYEDFREE';
  const effectiveDeliveryFee = isFreeDelivery ? 0 : selectedZone.deliveryFee;
  const grandTotal = Math.max(0, subtotal - discountAmount + effectiveDeliveryFee);

  const amountNeededForFreeShipping = Math.max(0, selectedZone.freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / selectedZone.freeDeliveryThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = onApplyCoupon(couponInput.trim());
    setCouponFeedback(res);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-stone-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-stone-900 text-base">سلة مشترياتك</h2>
              <p className="text-xs text-stone-500">
                {items.length} {items.length === 1 ? 'منتج' : 'منتجات'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-3 bg-emerald-50 border-b border-emerald-100 text-xs">
          <div className="flex items-center justify-between text-emerald-900 font-bold mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-700" />
              {isFreeDelivery
                ? '🎉 تهانينا! الشحن مجاني لطلبك في ' + selectedZone.name
                : `أضف بـ ${amountNeededForFreeShipping} جنيه للحصول على شحن مجاني!`}
            </span>
          </div>
          <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${isFreeDelivery ? 100 : progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-stone-800 text-base">السلة فارغة حالياً</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  تصفحي أفضل منتجات العناية بالشعر والبشرة ومستلزمات الأطفال مع التوصيل الفوري بأكتوبر وزايد.
                </p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="p-3 rounded-2xl border border-stone-200 bg-white shadow-2xs flex items-center gap-3"
              >
                <img
                  src={item.product.image}
                  alt={item.product.nameAr}
                  className="w-16 h-16 object-cover rounded-xl border border-stone-100 shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1 text-right">
                  <h4 className="font-bold text-xs text-stone-900 line-clamp-1">
                    {item.product.nameAr}
                  </h4>
                  <div className="text-[11px] text-stone-500 font-medium">
                    {item.product.volume} • {item.product.brand}
                  </div>
                  <div className="font-black text-xs text-emerald-800">
                    {item.product.price} جنيه
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex flex-col items-end justify-between h-full gap-2">
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-stone-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5 bg-stone-100 px-1.5 py-0.5 rounded-lg border border-stone-200">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                      className="w-5 h-5 rounded flex items-center justify-center font-bold text-stone-700 hover:bg-stone-200 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-black text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, 1)}
                      className="w-5 h-5 rounded flex items-center justify-center font-bold text-stone-700 hover:bg-stone-200 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer: Coupons, Subtotal, Checkout Button */}
        {items.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3">
            {/* Coupon Code Section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-700" />
                    <span>تم تطبيق الكوبون: {appliedCoupon}</span>
                  </div>
                  <button
                    onClick={onRemoveCoupon}
                    className="text-rose-600 hover:text-rose-800 text-[11px] underline cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="كود الخصم (مثال: OCTOBER10)"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-xs uppercase font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    تطبيق
                  </button>
                </form>
              )}

              {couponFeedback && (
                <div
                  className={`text-[11px] mt-1 flex items-center gap-1 font-semibold ${
                    couponFeedback.success ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {couponFeedback.success ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {couponFeedback.message}
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-1 border-t border-stone-200">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-stone-900">{subtotal} جنيه</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>قيمة الخصم:</span>
                  <span>-{discountAmount} جنيه</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <span>التوصيل ({selectedZone.city === 'zayed' ? 'زايد' : 'أكتوبر'}):</span>
                  <button
                    onClick={onOpenZoneModal}
                    className="text-[10px] text-emerald-700 underline font-semibold cursor-pointer"
                  >
                    تغيير
                  </button>
                </span>
                <span className="font-bold text-stone-900">
                  {effectiveDeliveryFee === 0 ? (
                    <span className="text-emerald-700 font-black">مجاني 🎉</span>
                  ) : (
                    `${effectiveDeliveryFee} جنيه`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm font-black text-stone-950 pt-2 border-t border-stone-300">
                <span>الإجمالي النهائي:</span>
                <span className="text-base text-emerald-800">{grandTotal} جنيه</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition-all cursor-pointer"
            >
              <span>متابعة إتمام الطلب</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
