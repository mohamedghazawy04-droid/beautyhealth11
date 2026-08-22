import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs text-right">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-pink-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-pink-50 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-stone-900 text-base sm:text-lg">
                قائمة المفضلة الخاصة بكِ
              </h2>
              <p className="text-xs text-stone-500">
                {wishlist.length} {wishlist.length === 1 ? 'منتج محفوظ' : 'منتجات محفوظة'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {wishlist.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mx-auto text-pink-300">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-stone-800 text-sm">لم تقومي بحفظ أي منتجات في المفضلة بعد</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                انقري على رمز القلب بجوار أي منتج لحفظه والرجوع إليه لاحقاً بسهولة.
              </p>
            </div>
          ) : (
            wishlist.map((product) => (
              <div
                key={product.id}
                className="p-3.5 rounded-2xl border border-pink-100 bg-white shadow-2xs flex items-center gap-3 justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={product.image}
                    alt={product.nameAr}
                    className="w-14 h-14 object-cover rounded-xl border border-pink-50 shrink-0"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="font-bold text-xs text-stone-900 line-clamp-1">
                      {product.nameAr}
                    </h4>
                    <div className="text-[11px] text-stone-500 font-medium">
                      {product.volume} • {product.brand}
                    </div>
                    <div className="font-black text-xs text-pink-700">
                      {product.price} جنيه
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onRemoveFromWishlist(product.id);
                    }}
                    className="px-3 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>نقل للسلة</span>
                  </button>

                  <button
                    onClick={() => onRemoveFromWishlist(product.id)}
                    className="p-2 text-stone-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                    title="إزالة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
