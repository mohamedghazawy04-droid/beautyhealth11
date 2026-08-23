import React from 'react';
import {
  Baby,
  Scissors,
  Smile,
  Gift,
  Flame,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
  ArrowLeft,
  Stethoscope
} from 'lucide-react';
import { MainCategory, SubCategory, Product, CategoryConfig } from '../types';
import { DEFAULT_CATEGORIES } from '../data/categories';

interface AmazonCategoryGridProps {
  products: Product[];
  categoriesList?: CategoryConfig[];
  onSelectCategory: (category: MainCategory, subCategory?: SubCategory) => void;
  onOpenCategoriesModal: () => void;
}

export const AmazonCategoryGrid: React.FC<AmazonCategoryGridProps> = ({
  products,
  categoriesList = DEFAULT_CATEGORIES,
  onSelectCategory,
  onOpenCategoriesModal,
}) => {
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
    <section className="mx-3 sm:mx-6 lg:mx-8 mb-8 text-right">
      {/* Amazon-Style Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-pink-600 inline-block" />
            <h2 className="text-base sm:text-lg md:text-xl font-black text-stone-900">
              تسوقي حسب الأقسام (Shop by Department)
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
              <Stethoscope className="w-3 h-3 text-emerald-600" />
              إشراف صيدلي معتمد
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            تصنيفات منظمة على طريقة أمازون لتسهيل تصفح منتجاتكِ المفضلة
          </p>
        </div>

        <button
          onClick={onOpenCategoriesModal}
          className="text-xs sm:text-sm font-bold text-pink-700 hover:text-pink-900 flex items-center gap-1 hover:underline cursor-pointer self-start sm:self-auto"
        >
          <span>تصفح كافة الأقسام والتصنيفات</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Amazon 4-Card Department Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoriesList.map((dept) => {
          // Take top 4 subcategories (excluding 'all')
          const displaySubs = dept.subcategories.filter((s) => s.id !== 'all').slice(0, 4);

          return (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden p-4 group"
            >
              <div>
                {/* Card Title & Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-sm sm:text-base group-hover:text-pink-700 transition-colors">
                      {dept.title}
                    </h3>
                    {dept.englishTitle && (
                      <span className="text-[10px] text-stone-400 font-mono">
                        {dept.englishTitle}
                      </span>
                    )}
                  </div>
                  {dept.badge && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200 shrink-0">
                      {dept.badge}
                    </span>
                  )}
                </div>

                {/* 2x2 Mini Product Grid (Amazon Signature Quad Card) */}
                <div className="grid grid-cols-2 gap-2 mb-4">
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
                      className="text-right group/item cursor-pointer flex flex-col"
                    >
                      <div className="w-full aspect-square rounded-xl bg-stone-100 overflow-hidden mb-1.5 border border-stone-100 relative">
                        <img
                          src={getSubcategoryImage(dept.id, sub.id)}
                          alt={sub.label}
                          className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-stone-700 group-hover/item:text-pink-600 line-clamp-2 leading-tight">
                        {sub.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Link (See more) */}
              <button
                type="button"
                onClick={() => handleDepartmentClick(dept.id as MainCategory, 'all')}
                className="text-xs font-black text-pink-700 hover:text-pink-900 hover:underline flex items-center gap-1 pt-2 border-t border-stone-100 cursor-pointer"
              >
                <span>تصفح كل {dept.title}</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
