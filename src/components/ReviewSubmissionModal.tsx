import React, { useState, useRef } from 'react';
import {
  X,
  Star,
  CheckCircle2,
  MapPin,
  User,
  MessageSquare,
  ShieldCheck,
  Send,
  Camera,
  Image as ImageIcon,
  Trash2,
  UploadCloud,
  Eye,
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
  const [images, setImages] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

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

  // Helper to compress image before adding to state
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة صالح (JPEG أو PNG أو WEBP)');
      return;
    }

    if (images.length >= 3) {
      setError('يمكنك إرفاق حتى 3 صور كحد أقصى لكل تقييم');
      return;
    }

    setIsProcessingImage(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setImages((prev) => [...prev, compressedDataUrl]);
        }
        setIsProcessingImage(false);
      };
      img.onerror = () => {
        setIsProcessingImage(false);
        setError('حدث خطأ أثناء معالجة الصورة');
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setIsProcessingImage(false);
      setError('حدث خطأ أثناء قراءة ملف الصورة');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        handleImageUpload(file);
      });
      // reset file input
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
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
      userArea: userArea.trim() || 'الشيخ زايد وأكتوبر',
      rating,
      comment: comment.trim(),
      images: images.length > 0 ? images : undefined,
      image: images.length > 0 ? images[0] : undefined,
    });

    // Reset and close
    setComment('');
    setSelectedQuickTags([]);
    setImages([]);
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
              <h2 className="font-extrabold text-base sm:text-lg">تقييم المنتج وتصوير التجربة</h2>
              <p className="text-xs text-emerald-200">
                شارك صور المنتج الحقيقية لزيادة المصداقية ومساعدة المشترين
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
                <span>المنطقة / المدينة</span>
              </label>
              <input
                type="text"
                value={userArea}
                onChange={(e) => setUserArea(e.target.value)}
                placeholder="مثال: الشيخ زايد، 6 أكتوبر، القاهرة..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Photo Upload with Camera Section */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-700" />
                <span>إرفاق صور المنتج الحقيقية (اختياري)</span>
              </label>
              <span className="text-[11px] font-bold text-emerald-700">
                {images.length} / 3 صور
              </span>
            </div>

            {/* Hidden file inputs for Camera and Gallery */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Action Buttons for Camera vs Gallery */}
            {images.length < 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  disabled={isProcessingImage}
                  className="py-2.5 px-3 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100/50 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>📸 فتح الكاميرا والتقاط صورة</span>
                </button>

                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={isProcessingImage}
                  className="py-2.5 px-3 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100/50 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-700" />
                  <span>🖼️ اختيار من معرض الصور</span>
                </button>
              </div>
            )}

            {isProcessingImage && (
              <div className="text-center py-2 text-xs text-emerald-800 font-bold animate-pulse">
                ⏳ جاري معالجة وضغط الصورة بجودة عالية...
              </div>
            )}

            {/* Uploaded Images Preview Thumbnails */}
            {images.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-stone-600">الصور المرفقة مع التقييم:</div>
                <div className="flex flex-wrap gap-2.5">
                  {images.map((imgSrc, idx) => (
                    <div
                      key={idx}
                      className="relative group w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-600 shadow-sm bg-stone-100"
                    >
                      <img
                        src={imgSrc}
                        alt={`صورة التقييم ${idx + 1}`}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setPreviewImage(imgSrc)}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md transition-colors cursor-pointer"
                        title="حذف الصورة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewImage(imgSrc)}
                        className="absolute bottom-1 left-1 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center shadow-md transition-colors cursor-pointer"
                        title="تكبير الصورة"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
              💡 صور المنتج والتغليف الطبيعية من هاتفك تزيد من مصداقية تقييمك وتكسب ثقة المشترين.
            </p>
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
              placeholder="اكتب تجربتك مع المنتج، مفعوله، ورأيك في جودة التغليف والتوصيل..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none resize-none"
              maxLength={400}
              required
            />
            <div className="flex justify-between items-center text-[10px] text-stone-400 mt-1">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-3 h-3" />
                سيتم نشر التقييم كـ مشتري موثق فوراً
              </span>
              <span>{comment.length} / 400 حرف</span>
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
              disabled={isProcessingImage}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>نشر التقييم مع الصور ⭐</span>
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

      {/* Lightbox / Zoom Modal for uploaded picture */}
      {previewImage && (
        <div
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-lg max-h-[85vh] bg-stone-900 rounded-2xl p-2 border border-stone-700">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="معاينة الصورة"
              className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
