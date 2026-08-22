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
  storeSettings?: StoreSettings;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onOpenReviewModal,
  storeSettings,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'howTo' | 'ingredients' | 'reviews'>('details');

  if (!product) return null;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const storeWhatsApp = storeSettings?.contactWhatsApp || '201012345678';
  const cleanWhatsApp = storeWhatsApp.replace(/\D/g, '');

  const whatsappMessage = encodeURIComponent(
    `مرحباً، أود طلب هذا المنتج مباشرة:\n- المنتج: ${product.nameAr || product.name}\n- السعر: ${product.price} جنيه\n- الكمية: ${quantity}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-right">
        {/* Modal Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span className="text-emerald-700 font-bold">{product.brand}</span>
            <span>/</span>
            <span>{product.volume}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left: Product Image & Badges */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'}
                  alt={product.nameAr || product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-xs">
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
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>توصيل سريع متاح مباشرة إلى باب بيتك</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold pt-1 border-t border-emerald-200/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ضمان أصالة المنتج ١٠٠٪ مع إمكانية المعاينة عند الاستلام</span>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Controls */}
            <div className="md:col-span-7 space-y-4 text-right">
              <div>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
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
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  متوفر في المخزن ({product.stockCount || 50} قطعة)
                </span>
              </div>

              {/* Price Block */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-stone-500">السعر:</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-stone-950">
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
                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-stone-300 shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-stone-800 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-extrabold text-sm text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-stone-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Safety Note if available */}
              {product.safetyNote && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>ملاحظة: {product.safetyNote}</span>
                </div>
              )}

              {/* Tabs for Information */}
              <div className="pt-2">
                <div className="flex border-b border-stone-200 gap-2 text-xs font-bold">
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
                          ? 'border-emerald-700 text-emerald-800 font-black'
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
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {activeTab === 'howTo' && (
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <h4 className="font-bold text-stone-900 mb-1">إرشادات الاستخدام:</h4>
                      <p className="text-stone-700">{product.howToUse || 'استخدم المنتج حسب التعليمات المرفقة على العبوة.'}</p>
                    </div>
                  )}

                  {activeTab === 'ingredients' && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {product.ingredients && product.ingredients.length > 0 ? (
                          product.ingredients.map((ing, idx) => (
                            <span
                              key={idx}
                              className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-lg text-[11px] font-medium"
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
                      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl sm:text-4xl font-black text-amber-900 font-mono">
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
                              متوسط التقييم من العملاء
                            </div>
                          </div>
                        </div>

                        {onOpenReviewModal && (
                          <button
                            type="button"
                            onClick={() => onOpenReviewModal(product)}
                            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <Star className="w-3.5 h-3.5 fill-white" />
                            <span>أضف تقييمك للمنتج</span>
                          </button>
                        )}
                      </div>

                      {/* List of Reviews */}
                      <div className="space-y-2.5">
                        {product.reviews && product.reviews.length > 0 ? (
                          product.reviews.map((rev) => (
                            <div
                              key={rev.id}
                              className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-stone-900">{rev.userName}</span>
                                  {rev.userArea && (
                                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
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
                              <p className="text-stone-800 text-xs font-medium leading-relaxed">{rev.comment}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 bg-stone-50 rounded-2xl border border-stone-200 p-4 space-y-2">
                            <p className="text-stone-500 text-xs">كن أول من يكتب تقييماً لهذا المنتج!</p>
                            {onOpenReviewModal && (
                              <button
                                type="button"
                                onClick={() => onOpenReviewModal(product)}
                                className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                              >
                                كتابة تقييم الآن
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Add to Cart & WhatsApp Order */}
              <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/15 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>إضافة للسلة ({product.price * quantity} جنيه)</span>
                </button>

                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>طلب مباشر عبر واتساب</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
