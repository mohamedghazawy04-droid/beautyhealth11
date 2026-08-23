import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Baby,
  Scissors,
  Smile,
  Gift,
  Check,
  Layers,
  ChevronDown,
  ChevronUp,
  Menu,
  Flame,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Search,
  Heart,
  Stethoscope,
  ArrowLeft
} from 'lucide-react';
import { MainCategory, SubCategory, Product, CategoryConfig } from '../types';
import { DEFAULT_CATEGORIES } from '../data/categories';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: MainCategory;
  activeSubCategory: SubCategory;
  onSelectCategory: (category: MainCategory, subCategory?: SubCategory) => void;
  products: Product[];
  categoriesList?: CategoryConfig[];
}

export const CategoriesModal: React.FC<CategoriesModalProps> = ({
  isOpen,
  onClose,
  activeCategory,
  activeSubCategory,
  onSelectCategory,
  products,
  categoriesList = DEFAULT_CATEGORIES,
}) => {
  // Store which department accordion is currently open
  const [expandedDeptId, setExpandedDeptId] = useState<string | null>(
    activeCategory === 'all' ? (categoriesList[0]?.id || 'baby') : activeCategory
  );
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const getProductCount = (category: string, subCategory: string = 'all') => {
    if (category === 'all') return products.length;
    return products.filter((p) => {
      const matchCat = p.category === category;
      const matchSub = subCategory === 'all' || p.subCategory === subCategory;
      return matchCat && matchSub;
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

  const toggleDept = (deptId: string) => {
    setExpandedDeptId(expandedDeptId === deptId ? null : deptId);
  };

  // Icon selector helper
  const renderDeptIcon = (iconName?: string, id?: string) => {
    if (iconName === 'Baby' || id === 'baby') return <Baby className="w-5 h-5" />;
    if (iconName === 'Scissors' || id === 'hair') return <Scissors className="w-5 h-5" />;
    if (iconName === 'Smile' || id === 'body') return <Smile className="w-5 h-5" />;
    if (iconName === 'Gift' || id === 'bundles') return <Gift className="w-5 h-5" />;
    return <Sparkles className="w-5 h-5" />;
  };

  // Filter departments if search query is entered
  const filteredCategories = categoriesList.filter((dept) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const titleMatch = dept.title.toLowerCase().includes(query);
    const subMatch = dept.subcategories.some(
      (sub) => sub.label.toLowerCase().includes(query) || (sub.desc && sub.desc.toLowerCase().includes(query))
    );
    return titleMatch || subMatch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/75 backdrop-blur-xs flex justify-end text-right">
      <div
        id="amazon-departments-drawer"
        className="bg-white w-full max-w-lg md:max-w-xl h-full shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-left duration-250"
      >
        {/* Amazon Header */}
        <div className="bg-[#131921] text-white px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Menu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-stone-300 font-medium">تسوقي حسب</span>
                <h2 className="text-sm sm:text-base font-black tracking-wide text-white">
                  الأقسام (All Departments)
                </h2>
              </div>
              <p className="text-[11px] text-pink-300 font-medium">
                متجر m&l للعناية والطفل • إشراف صيدلي معتمد 🥼
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amazon Search / Quick Filter Bar */}
        <div className="bg-[#232f3e] px-4 py-2.5 shrink-0 flex items-center gap-2 border-t border-stone-800">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحثي عن قسم أو تصنيف فرعي..."
              className="w-full bg-white text-stone-900 placeholder:text-stone-400 text-xs py-2 pr-8 pl-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-2.5 top-2 text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Fast Action Top Bar: Shop All Products */}
        <div className="bg-stone-100 px-4 py-2 flex items-center justify-between shrink-0 border-b border-stone-200">
          <button
            type="button"
            onClick={() => handleCategoryClick('all', 'all')}
            className="flex items-center gap-2 text-xs font-extrabold text-stone-800 hover:text-pink-700 transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4 text-pink-600" />
            <span>عرض جميع منتجات المتجر</span>
            <span className="text-[10px] bg-pink-100 text-pink-800 px-1.5 py-0.2 rounded-md font-mono">
              ({products.length})
            </span>
          </button>

          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            توصيل فوري نفس اليوم
          </span>
        </div>

        {/* Scrollable Amazon Departments List (Zero clipping on mobile) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {filteredCategories.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-xs space-y-2">
              <p>لا توجد نتائج مطابقة لبحثك "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-pink-600 font-bold underline"
              >
                مسح البحث
              </button>
            </div>
          ) : (
            filteredCategories.map((dept) => {
              const isExpanded = expandedDeptId === dept.id;
              const isCurrentActive = activeCategory === dept.id;
              const deptProductCount = getProductCount(dept.id, 'all');

              return (
                <div
                  key={dept.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isCurrentActive
                      ? 'border-pink-300 ring-2 ring-pink-500/20 bg-white shadow-xs'
                      : 'border-stone-200 bg-white hover:border-pink-200'
                  }`}
                >
                  {/* Department Main Header Row */}
                  <div
                    onClick={() => toggleDept(dept.id)}
                    className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50/80 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isCurrentActive
                            ? 'bg-gradient-to-tr from-pink-600 to-rose-600 text-white shadow-xs'
                            : 'bg-pink-50 text-pink-700'
                        }`}
                      >
                        {renderDeptIcon(dept.iconName, dept.id)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-xs sm:text-sm font-black text-stone-900">
                            {dept.title}
                          </h3>
                          {dept.badge && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200/80">
                              {dept.badge}
                            </span>
                          )}
                          {isCurrentActive && (
                            <span className="text-[9px] bg-pink-600 text-white font-extrabold px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> محدد
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {dept.englishTitle && (
                            <span className="text-[10px] text-stone-400 font-mono">
                              {dept.englishTitle}
                            </span>
                          )}
                          <span className="text-[10px] text-pink-700 font-bold">
                            • {deptProductCount} منتج متوفر
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryClick(dept.id as MainCategory, 'all');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-800 text-[11px] font-extrabold border border-pink-200 transition-colors"
                        title="تصفح القسم بالكامل"
                      >
                        عرض الكل
                      </button>
                      <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-pink-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Subcategories (Amazon Sub-list) */}
                  {isExpanded && (
                    <div className="border-t border-stone-100 bg-stone-50/70 p-2 sm:p-3 space-y-1.5 animate-in slide-in-from-top-2 duration-150">
                      <div className="text-[11px] font-black text-stone-500 px-2 py-0.5">
                        التصنيفات الفرعية داخل {dept.title}:
                      </div>

                      {dept.subcategories.map((sub) => {
                        const isSubActive =
                          activeCategory === dept.id && activeSubCategory === sub.id;
                        const subCount = getProductCount(dept.id, sub.id);

                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() =>
                              handleCategoryClick(dept.id as MainCategory, sub.id as SubCategory)
                            }
                            className={`w-full p-2.5 rounded-xl text-right transition-all flex items-center justify-between cursor-pointer border ${
                              isSubActive
                                ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                                : 'bg-white hover:bg-pink-50/80 text-stone-800 border-stone-200/80'
                            }`}
                          >
                            <div className="min-w-0 flex-1 pl-2">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`text-xs font-bold ${
                                    isSubActive ? 'text-white font-black' : 'text-stone-900'
                                  }`}
                                >
                                  {sub.label}
                                </span>
                                {isSubActive && (
                                  <span className="text-[9px] bg-pink-800 text-pink-100 px-1.5 py-0.2 rounded font-bold">
                                    النشط
                                  </span>
                                )}
                              </div>
                              {sub.desc && (
                                <p
                                  className={`text-[10px] mt-0.5 truncate ${
                                    isSubActive ? 'text-pink-100' : 'text-stone-400'
                                  }`}
                                >
                                  {sub.desc}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span
                                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                                  isSubActive
                                    ? 'bg-pink-800 text-white'
                                    : 'bg-stone-100 text-stone-600'
                                }`}
                              >
                                {subCount}
                              </span>
                              <ArrowLeft
                                className={`w-3.5 h-3.5 ${
                                  isSubActive ? 'text-white' : 'text-stone-400'
                                }`}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Quick Deals Banner inside Drawer */}
          <div className="pt-2">
            <button
              onClick={() => handleCategoryClick('bundles', 'all')}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-between shadow-xs hover:opacity-95 transition-opacity cursor-pointer text-right"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs font-black">عروض وبكجات التوفير اليومية 🔥</div>
                  <div className="text-[10px] text-amber-100">خصومات حصرية وتوفير يصل إلى 30%</div>
                </div>
              </div>
              <span className="text-[11px] font-extrabold bg-white text-orange-600 px-2 py-0.5 rounded-lg shadow-2xs">
                تصفح العروض
              </span>
            </button>
          </div>
        </div>

        {/* Pharmacist Reassurance & Drawer Bottom Bar */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 shrink-0 space-y-2">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
            <Stethoscope className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-semibold leading-tight">
              جميع الأقسام والمنتجات خاضعة لإشراف صيادلة معتمدين لضمان الأمان والجودة الأصلية 100%.
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-pink-600" />
              <span>مخازن مجهزة ومرخصة في أكتوبر وزايد</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
