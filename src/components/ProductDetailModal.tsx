import React, { useState } from 'react';
import {
  X,
  Star,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  Heart,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { Product, StoreSettings } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onOpenReviewModal?: (product: Product) => void;
  onOpenCustomerSupport?: (productName?: string) => void;
  selectedZone?: any;
  storeSettings?: StoreSettings;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onOpenReviewModal,
  onOpenCustomerSupport,
  selectedZone,
  storeSettings,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'howTo' | 'ingredients' | 'reviews'>('details');

  if (!product) return null;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const storeWhatsApp = storeSettings?.contactWhatsApp || '201093629587';
  const cleanWhatsApp = storeWhatsApp.replace(/\D/g, '');

  const inquiryWhatsAppMessage = encodeURIComponent(
    `*💬 استفسار عن منتج من متجر m&l*\n` +
    `━━━━━━━━━━━━━━━━━\n` +
    `📌 *المنتج:* ${product.nameAr || product.name}\n` +
    `🏷️ *البراند:* ${product.brand || '-'}\n` +
    `💵 *السعر:* ${product.price} جنيه\n` +
    `━━━━━━━━━━━━━━━━━\n` +
    `أود الاستفسار عن تفاصيل وطريقة استخدام وتوافر هذا المنتج.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-pink-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-right">
        {/* Modal Header */}
        <div className="p-4 border-b border-pink-100 flex items-center justify-between bg-pink-50/40">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span className="text-pink-700 font-bold">{product.brand}</span>
            <span>/</span>
            <span>{product.volume}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left: Product Image & Badges */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-pink-50/30 border border-pink-100 shadow-inner">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'}
                  alt={product.nameAr || product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-3 right-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-xs">
                    خصم {discountPercent}%
                  </span>
                )}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-300'
                      : 'bg-white/90 text-stone-600 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              {/* Delivery Notice */}
              <div className="p-3.5 rounded-2xl bg-pink-50/60 border border-pink-200/70 space-y-2">
                <div className="flex items-center gap-2 text-pink-950 font-bold text-xs">
                  <Truck className="w-4 h-4 text-pink-600 shrink-0" />
                  <span>توصيل خلال ٢٤ ساعة متاح في أكتوبر، زايد، وحدائق أكتوبر (مجاني فوق 1000ج)</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-pink-800 font-semibold pt-1 border-t border-pink-200/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-pink-600" />
                  <span>ضمان أصالة المنتج ١٠٠٪ مع إمكانية المعاينة عند الاستلام</span>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Controls */}
            <div className="md:col-span-7 space-y-4 text-right">
              <div>
                <span className="text-xs font-extrabold text-pink-800 bg-pink-100/70 px-2.5 py-1 rounded-lg">
                  {product.category === 'baby'
                    ? 'عناية الطفل والرضيع 👶'
                    : product.category === 'hair'
                    ? 'عناية الشعر والتساقط 💇‍♀️'
                    : product.category === 'body'
                    ? 'العناية بالجسم والبشرة ✨'
                    : 'بكج توفير وعروض 🎁'}
                </span>
                <h1 className="text-lg sm:text-2xl font-black text-stone-900 mt-2 leading-snug">
                  {product.nameAr || product.name}
                </h1>
                {product.name && product.nameAr !== product.name && (
                  <p className="text-xs text-stone-500 mt-0.5 font-mono">{product.name}</p>
                )}
              </div>

              {/* Rating & Volume */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating || 5.0}</span>
                  <span className="text-stone-400 font-normal">({product.reviewsCount || 1} تقييم)</span>
                </div>
                <span className="text-stone-300">•</span>
                <span className="font-bold text-stone-700">الحجم: {product.volume || 'حجم قياسي'}</span>
                <span className="text-stone-300">•</span>
                <span className="text-pink-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  متوفر في المخزن ({product.stockCount || 50} قطعة)
                </span>
              </div>

              {/* Price Block */}
              <div className="p-3.5 rounded-2xl bg-pink-50/30 border border-pink-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-stone-500">السعر:</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-pink-700">
                      {product.price} <span className="text-xs font-normal">جنيه</span>
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-stone-400 line-through">
                        {product.originalPrice} جنيه
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-pink-200 shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-lg bg-pink-50 hover:bg-pink-100 flex items-center justify-center font-bold text-stone-800 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-extrabold text-sm text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-pink-50 hover:bg-pink-100 flex items-center justify-center font-bold text-stone-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Safety Note if available */}
              {product.safetyNote && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-pink-50 border border-pink-200 text-pink-900 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-pink-600 shrink-0" />
                  <span>ملاحظة: {product.safetyNote}</span>
                </div>
              )}

              {/* Tabs for Information */}
              <div className="pt-2">
                <div className="flex border-b border-pink-100 gap-2 text-xs font-bold">
                  {[
                    { id: 'details', label: 'المميزات والفوائد' },
                    { id: 'howTo', label: 'طريقة الاستخدام' },
                    { id: 'ingredients', label: 'المكونات' },
                    { id: 'reviews', label: `التقييمات (${product.reviews?.length || 0})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`pb-2 px-2.5 transition-all border-b-2 cursor-pointer ${
                        activeTab === tab.id
                          ? 'border-pink-600 text-pink-700 font-black'
                          : 'border-transparent text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="py-3 text-xs leading-relaxed text-stone-700 min-h-[90px]">
                  {activeTab === 'details' && (
                    <div className="space-y-2">
                      <p className="text-stone-800 font-medium">{product.description || 'منتج عالي الجودة ومضمون.'}</p>
                      {product.benefits && product.benefits.length > 0 && (
                        <ul className="space-y-1 mt-2">
                          {product.benefits.map((b, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-stone-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {activeTab === 'howTo' && (
                    <div className="p-3 rounded-xl bg-pink-50/40 border border-pink-100">
                      <h4 className="font-bold text-stone-900 mb-1">إرشادات الاستخدام:</h4>
                      <p className="text-stone-700">{product.howToUse || 'استخدمي المنتج حسب التعليمات المرفقة على العبوة.'}</p>
                    </div>
                  )}

                  {activeTab === 'ingredients' && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {product.ingredients && product.ingredients.length > 0 ? (
                          product.ingredients.map((ing, idx) => (
                            <span
                              key={idx}
                              className="bg-pink-50/70 text-pink-900 border border-pink-100 px-2.5 py-1 rounded-lg text-[11px] font-medium"
                            >
                              {ing}
                            </span>
                          ))
                        ) : (
                          <span className="text-stone-500 text-xs">المكونات مدونة على العبوة الأصلية.</span>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-4">
                      {/* Overall Rating Summary Card */}
                      <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-200/70 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl sm:text-4xl font-black text-pink-900 font-mono">
                            {typeof product.rating === 'number' ? product.rating.toFixed(1) : (product.rating || '5.0')}
                          </div>
                          <div>
                            <div className="flex text-amber-500">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className="w-4 h-4 fill-amber-400 text-amber-500"
                                />
                              ))}
                            </div>
                            <div className="text-xs text-stone-600 font-bold mt-0.5">
                              متوسط التقييم من العميلات
                            </div>
                          </div>
                        </div>

                        {onOpenReviewModal && (
                          <button
                            type="button"
                            onClick={() => onOpenReviewModal(product)}
                            className="px-3.5 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <Star className="w-3.5 h-3.5 fill-white" />
                            <span>أضيفي تقييمك للمنتج</span>
                          </button>
                        )}
                      </div>

                      {/* List of Reviews */}
                      <div className="space-y-2.5">
                        {product.reviews && product.reviews.length > 0 ? (
                          product.reviews.map((rev) => {
                            const reviewImages = rev.images && rev.images.length > 0 ? rev.images : (rev.image ? [rev.image] : []);
                            return (
                              <div
                                key={rev.id}
                                className="p-3.5 rounded-2xl bg-pink-50/20 border border-pink-100 space-y-2"
                              >
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-stone-900">{rev.userName}</span>
                                    {rev.userArea && (
                                      <span className="text-[10px] bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full font-bold">
                                        مشتري موثق ({rev.userArea})
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-stone-400 text-[11px]">{rev.date}</span>
                                </div>
                                <div className="flex text-amber-500">
                                  {[...Array(rev.rating || 5)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-500" />
                                  ))}
                                </div>
                                <p className="text-stone-700 text-xs leading-relaxed">{rev.comment}</p>
                                {reviewImages.length > 0 && (
                                  <div className="flex flex-wrap gap-2 pt-1">
                                    {reviewImages.map((img, i) => (
                                      <img
                                        key={i}
                                        src={img}
                                        alt="Review attachment"
                                        className="w-14 h-14 object-cover rounded-xl border border-pink-200 shadow-2xs"
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-6 text-stone-400 text-xs">
                            لا توجد تقييمات سابقة بعد. كوني أول من يقيم هذا المنتج!
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-4 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>إضافة للسلة وتأكيد الطلب ({product.price * quantity} ج)</span>
                </button>

                {onOpenCustomerSupport ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCustomerSupport(product.nameAr || product.name);
                    }}
                    className="py-3 px-4 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-pink-600" />
                    <span>استفسار عن المنتج 💬</span>
                  </button>
                ) : (
                  <a
                    href={`https://wa.me/${cleanWhatsApp}?text=${inquiryWhatsAppMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer no-underline"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>إرسال استفسار للمدير 📲</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
