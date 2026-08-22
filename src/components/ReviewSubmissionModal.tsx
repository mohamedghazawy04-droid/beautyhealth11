import React, { useState } from 'react';
import {
  X,
  Star,
  Sparkles,
  CheckCircle2,
  MapPin,
  User,
  MessageSquare,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { Product, ProductReview } from '../types';

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  orderId?: string;
  defaultUserName?: string;
  defaultUserArea?: string;
  onSubmitReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => void;
}

export const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({
  isOpen,
  onClose,
  product,
  orderId,
  defaultUserName = '',
  defaultUserArea = '',
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [userName, setUserName] = useState(defaultUserName || 'عميل موثق');
  const [userArea, setUserArea] = useState(defaultUserArea || 'الشيخ زايد');
  const [comment, setComment] = useState('');
  const [selectedQuickTags, setSelectedQuickTags] = useState<string[]>([]);
  const [error, setError] = useState('');

  if (!isOpen || !product) return null;

  const ratingDescriptions = [
    '',
    'سيء - لم ينل إعجابي 😞',
    'مقبول - بحاجة لتحسين 😐',
    'جيد - مطابق للوصف 🙂',
    'ممتاز جداً - أنصح به 👍',
    'رائع وفائق الجودة! ⭐⭐⭐⭐⭐',
  ];

  const quickTags = [
    '✨ منتج أصلي ومضمون',
    '🚀 توصيل فائق السرعة',
    '🌸 رائحة جذابة ومنعشة',
    '👶 لطيف جداً على بشرة الطفل',
    '💆‍♀️ فرق ملحوظ في الشعر',
    '💧 ترطيب عميق يدوم طويلاً',
    '📦 تغليف أنيق وآمن',
  ];

  const toggleQuickTag = (tag: string) => {
    if (selectedQuickTags.includes(tag)) {
      setSelectedQuickTags(selectedQuickTags.filter((t) => t !== tag));
      setComment((prev) => prev.replace(tag, '').trim());
    } else {
      setSelectedQuickTags([...selectedQuickTags, tag]);
      setComment((prev) => (prev ? `${prev} - ${tag}` : tag));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError('يرجى إدخال اسمك أو اسم العميل');
      return;
    }
    if (!comment.trim()) {
      setError('يرجى كتابة تعليق قصير عن تجربتك مع المنتج');
      return;
    }

    onSubmitReview(product.id, {
      userName: userName.trim(),
      userArea: userArea.trim() || '٦ أكتوبر وزايد',
      rating,
      comment: comment.trim(),
    });

    // Reset and close
    setComment('');
    setSelectedQuickTags([]);
    setError('');
    onClose();
  };

  const currentRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs text-right">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Star className="w-5 h-5 fill-amber-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg">تقييم المنتج بعد الاستلام</h2>
              <p className="text-xs text-emerald-200">
                رأيك يساعد عملاء أكتوبر والشيخ زايد في اختيار الأفضل
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Product Summary Card */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
            <img
              src={product.image}
              alt={product.nameAr}
              className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
            />
            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="text-[11px] font-bold text-emerald-800 uppercase">
                {product.brand} • {product.volume}
              </div>
              <h4 className="font-extrabold text-xs sm:text-sm text-stone-900 truncate">
                {product.nameAr}
              </h4>
              {orderId && (
                <div className="text-[11px] text-stone-500 font-mono">
                  طلب رقم: #{orderId}
                </div>
              )}
            </div>
          </div>

          {/* Star Rating Section */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-center space-y-2">
            <label className="text-xs font-bold text-amber-950 block">
              ما هو تقييمك للمنتج؟ (اضغط على النجوم)
            </label>
            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                  title={`${star} نجوم`}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= currentRating
                        ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                        : 'text-stone-300 hover:text-amber-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-xs font-extrabold text-amber-900 min-h-[1.25rem]">
              {ratingDescriptions[currentRating]}
            </div>
          </div>

          {/* User Name & Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>الاسم / اللقب</span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="مثال: سارة، أم ياسين..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>المنطقة / الحي</span>
              </label>
              <input
                type="text"
                value={userArea}
                onChange={(e) => setUserArea(e.target.value)}
                placeholder="مثال: الشيخ زايد - بيفرلي هيلز"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Tag Pills */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-stone-500 block">
              عبارات سريعة مقترحة (اضغط للإضافة):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleQuickTag(tag)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    selectedQuickTags.includes(tag)
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Comment Text Area */}
          <div>
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5 mb-1">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
              <span>رأيك وتعليقك بعد الاستخدام</span>
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب تجاربك مع المنتج، تأثيره، ورأيك في سرعة التوصيل في مدينتي أكتوبر وزايد..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none resize-none"
              maxLength={300}
              required
            />
            <div className="flex justify-between items-center text-[10px] text-stone-400 mt-1">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-3 h-3" />
                سيتم نشر التقييم كـ مشتري موثق فوراً
              </span>
              <span>{comment.length} / 300 حرف</span>
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
              {error}
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 border-t border-stone-200 flex gap-2">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>نشر التقييم وتحديث المتوسط ⭐</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
