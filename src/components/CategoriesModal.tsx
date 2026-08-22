import React from 'react';
import { X, Sparkles, Baby, Scissors, Smile, Gift, ArrowLeft, Check, Layers } from 'lucide-react';
import { MainCategory, SubCategory, Product } from '../types';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: MainCategory;
  activeSubCategory: SubCategory;
  onSelectCategory: (category: MainCategory, subCategory?: SubCategory) => void;
  products: Product[];
}

export const CategoriesModal: React.FC<CategoriesModalProps> = ({
  isOpen,
  onClose,
  activeCategory,
  activeSubCategory,
  onSelectCategory,
  products,
}) => {
  if (!isOpen) return null;

  const categories = [
    {
      id: 'all' as MainCategory,
      title: 'جميع المنتجات',
      subtitle: 'تصفحي كل منتجات المتجر المتاحة للتوصيل الفوري',
      icon: Layers,
      color: 'from-pink-600 to-rose-700',
      badge: 'الكل',
      subcategories: [],
    },
    {
      id: 'baby' as MainCategory,
      title: 'العناية بالطفل والرضيع',
      subtitle: 'شامبو لطيف، كريم الحفاض، زيوت مرطبة، ومناديل مبللة نقية',
      icon: Baby,
      color: 'from-pink-500 to-rose-600',
      badge: 'الأكثر أماناً',
      subcategories: [
        { id: 'all' as SubCategory, label: 'كل منتجات الأطفال' },
        { id: 'baby_wash_shampoo' as SubCategory, label: 'شامبو وشاور الأطفال' },
        { id: 'diaper_cream' as SubCategory, label: 'كريمات الحفاض والالتهابات' },
        { id: 'baby_oil_lotion' as SubCategory, label: 'لوشن وزيوت ترطيب الرضع' },
        { id: 'baby_wipes_care' as SubCategory, label: 'مناديل مبللة وعناية يومية' },
      ],
    },
    {
      id: 'hair' as MainCategory,
      title: 'العناية بالشعر والتساقط',
      subtitle: 'سيروم علاجي، شامبو خالي من السلفات، وعناية الكيرلي',
      icon: Scissors,
      color: 'from-rose-500 to-fuchsia-700',
      badge: 'علاجي وطبيعي',
      subcategories: [
        { id: 'all' as SubCategory, label: 'كل منتجات الشعر' },
        { id: 'shampoo' as SubCategory, label: 'شامبو طبي وخالي من السلفات' },
        { id: 'conditioner' as SubCategory, label: 'بلسم وحمامات كريم' },
        { id: 'hair_oil_serum' as SubCategory, label: 'سيروم وزيوت تقوية الشعر' },
        { id: 'curly_care' as SubCategory, label: 'منتجات الشعر الكيرلي (Curly)' },
        { id: 'anti_hair_loss' as SubCategory, label: 'علاج التساقط وإنبات الفراغات' },
      ],
    },
    {
      id: 'body' as MainCategory,
      title: 'العناية بالجسم والبشرة',
      subtitle: 'لوشن ترطيب عميق، واقي شمس، مقشرات، ومعطرات الجسم',
      icon: Smile,
      color: 'from-pink-600 to-rose-600',
      badge: 'إشراقة وترطيب',
      subcategories: [
        { id: 'all' as SubCategory, label: 'كل منتجات البشرة والجسم' },
        { id: 'sunscreen' as SubCategory, label: 'واقي شمس وحماية فائقة' },
        { id: 'face_serum_cream' as SubCategory, label: 'سيروم وكريمات نضارة الوجه' },
        { id: 'body_lotion' as SubCategory, label: 'لوشن وزبدة ترطيب الجسم' },
        { id: 'body_wash_scrub' as SubCategory, label: 'غسول ومقشرات الجسم' },
        { id: 'body_mist' as SubCategory, label: 'معطرات وميست الجسم الفواحة' },
      ],
    },
    {
      id: 'bundles' as MainCategory,
      title: 'بكجات التوفير والهدايا',
      subtitle: 'مجموعات متكاملة بخصومات حصرية وتوفير إضافي',
      icon: Gift,
      color: 'from-rose-600 to-pink-800',
      badge: 'خصم حتى 30%',
      subcategories: [
        { id: 'all' as SubCategory, label: 'كل البكجات' },
        { id: 'mom_baby_bundle' as SubCategory, label: 'بكجات الأم والمولود' },
        { id: 'hair_routine_bundle' as SubCategory, label: 'روتين الشعر المتكامل' },
        { id: 'glow_routine_bundle' as SubCategory, label: 'مجموعة النضارة والتفتيح' },
      ],
    },
  ];

  const getProductCount = (catId: MainCategory, subId?: SubCategory) => {
    return products.filter((p) => {
      if (catId === 'all') return true;
      if (p.category !== catId) return false;
      if (subId && subId !== 'all') return p.subCategory === subId;
      return true;
    }).length;
  };

  const handleCategoryClick = (catId: MainCategory, subId: SubCategory = 'all') => {
    onSelectCategory(catId, subId);
    onClose();
    setTimeout(() => {
      const section = document.getElementById('products-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-right">
      <div
        id="categories-modal-sheet"
        className="bg-stone-50 w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-pink-100 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900">أقسام المتجر 🛍️</h2>
              <p className="text-xs text-stone-500 font-medium">
                اختاري القسم للتصفح الفوري لمنتجات العناية والطفل
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            const count = getProductCount(cat.id);

            return (
              <div
                key={cat.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isSelected
                    ? 'border-pink-500 ring-2 ring-pink-500/20 shadow-md shadow-pink-500/10'
                    : 'border-stone-200 hover:border-pink-200 shadow-xs'
                }`}
              >
                {/* Main Category Header Button */}
                <button
                  type="button"
                  onClick={() => handleCategoryClick(cat.id, 'all')}
                  className="w-full p-4 flex items-center justify-between gap-3 text-right hover:bg-pink-50/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-sm shrink-0`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-stone-900 text-base">{cat.title}</h3>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200/60">
                          {cat.badge}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-600 text-white flex items-center gap-1">
                            <Check className="w-3 h-3" /> المختار حالياً
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{cat.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-pink-800 bg-pink-50 px-2.5 py-1 rounded-xl border border-pink-100">
                      {count} منتج
                    </span>
                    <ArrowLeft className="w-4 h-4 text-stone-400" />
                  </div>
                </button>

                {/* Subcategories Pills if any */}
                {cat.subcategories.length > 0 && (
                  <div className="px-4 pb-3.5 pt-1 border-t border-stone-100 bg-pink-50/20 flex flex-wrap gap-1.5">
                    {cat.subcategories.map((sub) => {
                      const isSubSelected =
                        activeCategory === cat.id && activeSubCategory === sub.id;
                      const subCount = getProductCount(cat.id, sub.id);

                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleCategoryClick(cat.id, sub.id)}
                          className={`text-xs px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSubSelected
                              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-xs'
                              : 'bg-white text-stone-700 hover:bg-pink-50 hover:text-pink-800 border border-stone-200'
                          }`}
                        >
                          <span>{sub.label}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                              isSubSelected
                                ? 'bg-pink-900 text-pink-200'
                                : 'bg-stone-100 text-stone-500'
                            }`}
                          >
                            {subCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-white border-t border-stone-200 text-center text-xs text-stone-500 font-medium">
          ✨ جميع المنتجات متوفرة للشحن الفوري لنفس اليوم في ٦ أكتوبر والشيخ زايد
        </div>
      </div>
    </div>
  );
};
