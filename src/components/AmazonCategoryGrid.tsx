import React, { useState } from 'react';
import {
  Baby,
  Scissors,
  Smile,
  Gift,
  Flame,
  ShieldCheck,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowLeft,
  Stethoscope,
  Grid,
  Layers
} from 'lucide-react';
import { MainCategory, SubCategory, Product, CategoryConfig } from '../types';
import { DEFAULT_CATEGORIES } from '../data/categories';

interface AmazonCategoryGridProps {
  products: Product[];
  categoriesList?: CategoryConfig[];
  onSelectCategory: (category: MainCategory, subCategory?: SubCategory) => void;
  onOpenCategoriesModal: () => void;
  defaultExpanded?: boolean;
}

export const AmazonCategoryGrid: React.FC<AmazonCategoryGridProps> = ({
  products,
  categoriesList = DEFAULT_CATEGORIES,
  onSelectCategory,
  onOpenCategoriesModal,
  defaultExpanded = false,
}) => {
  // Collapsed by default so products are immediately visible without taking excessive vertical space
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  // Static fallback image mapper for well-known subcategories
  const getSubcategoryImage = (catId: string, subId: string): string => {
    // Check if there is an actual product with this subcategory
    const matchingProd = products.find(
      (p) => p.category === catId && (subId === 'all' || p.subCategory === subId)
    );
    if (matchingProd && matchingProd.image) return matchingProd.image;

    // Default aesthetic category images
    const imageMap: Record<string, string> = {
      baby_wash_shampoo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80',
      diaper_cream: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=300&q=80',
      baby_oil_lotion: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300&q=80',
      baby_wipes_care: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80',
      shampoo: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&q=80',
      conditioner: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=300&q=80',
      hair_oil_serum: 'https://images.unsplash.com/photo-1608248597359-009139158319?w=300&q=80',
      curly_care: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&q=80',
      sunscreen: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&q=80',
      face_serum_cream: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80',
      body_lotion: 'https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=300&q=80',
      body_mist: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&q=80',
      mom_baby_bundle: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&q=80',
      hair_routine_bundle: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&q=80',
      glow_routine_bundle: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&q=80',
    };

    return (
      imageMap[subId] ||
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80'
    );
  };

  const handleDepartmentClick = (catId: MainCategory, subId: SubCategory = 'all') => {
    onSelectCategory(catId, subId);
    setTimeout(() => {
      const section = document.getElementById('products-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <section className="mx-3 sm:mx-6 lg:mx-8 mb-4 sm:mb-6 text-right">
      {/* Compact Collapsible Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-3 sm:p-3.5 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-pink-600 to-rose-600 inline-block shadow-xs shrink-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xs sm:text-sm md:text-base font-black text-slate-900">
                  تصفح حسب الأقسام (Shop by Department)
                </h2>
                <span className="text-[10px] bg-pink-100 text-pink-800 font-bold px-2 py-0.5 rounded-full border border-pink-200">
                  {categoriesList.length} أقسام
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                تصفحي مباشرة أو افتحي بطاقات الأقسام المصورة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {/* Quick Department Chips */}
            <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-stone-200">
              {categoriesList.map((dept) => (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => handleDepartmentClick(dept.id as MainCategory, 'all')}
                  className="px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-900 text-[11px] font-bold border border-pink-200/80 transition-colors cursor-pointer"
                >
                  {dept.title}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-900 text-xs font-black border border-pink-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              {isExpanded ? (
                <>
                  <span>إغلاق بطاقات الأقسام</span>
                  <ChevronUp className="w-3.5 h-3.5 text-pink-600" />
                </>
              ) : (
                <>
                  <span>عرض بطاقات الأقسام</span>
                  <ChevronDown className="w-3.5 h-3.5 text-pink-600" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenCategoriesModal}
              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Grid className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden sm:inline">القائمة الشاملة</span>
            </button>
          </div>
        </div>

        {/* Amazon 4-Card Department Grid (Only shown when expanded by user) */}
        {isExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4 mt-3 border-t border-stone-100 animate-in fade-in slide-in-from-top-2 duration-200">
            {categoriesList.map((dept) => {
              const displaySubs = dept.subcategories.filter((s) => s.id !== 'all').slice(0, 4);

              return (
                <div
                  key={dept.id}
                  className="bg-stone-50/70 rounded-2xl border border-stone-200 hover:border-pink-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden p-3 group"
                >
                  <div>
                    {/* Card Title & Badge */}
                    <div className="flex items-start justify-between gap-2 mb-2.5 pb-2 border-b border-stone-200">
                      <div>
                        <h3 className="font-black text-slate-900 text-xs sm:text-sm group-hover:text-pink-700 transition-colors">
                          {dept.title}
                        </h3>
                        {dept.englishTitle && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {dept.englishTitle}
                          </span>
                        )}
                      </div>
                      {dept.badge && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-900 border border-pink-200 shrink-0">
                          {dept.badge}
                        </span>
                      )}
                    </div>

                    {/* 2x2 Mini Product Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {displaySubs.map((sub, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            handleDepartmentClick(
                              dept.id as MainCategory,
                              sub.id as SubCategory
                            )
                          }
                          className="text-right group/item cursor-pointer flex flex-col p-1 rounded-xl hover:bg-pink-50 transition-colors bg-white border border-stone-100"
                        >
                          <div className="w-full aspect-square rounded-lg bg-stone-100 overflow-hidden mb-1 border border-stone-200/80 relative">
                            <img
                              src={getSubcategoryImage(dept.id, sub.id)}
                              alt={sub.label}
                              className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-250"
                              loading="lazy"
                            />
                          </div>
                          <span className="text-[10px] font-bold text-stone-800 group-hover/item:text-pink-700 leading-tight truncate">
                            {sub.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* See more Link */}
                  <button
                    type="button"
                    onClick={() =>
                      handleDepartmentClick(dept.id as MainCategory, 'all')
                    }
                    className="text-xs font-black text-pink-700 hover:text-pink-900 flex items-center justify-between pt-2 border-t border-stone-200/60 cursor-pointer group-hover:underline"
                  >
                    <span>عرض كافة منتجات {dept.title}</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
