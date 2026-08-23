import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Search,
  Filter,
  CheckCircle2,
  ChevronDown,
  Gift,
  Zap,
  Star,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';
import { Product, DeliveryZone, CartItem, Order, MainCategory, SubCategory, ProductReview, StoreSettings } from './types';
import { PRODUCTS_DATA } from './data/products';
import { OCTOBER_ZAYED_ZONES } from './data/zones';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ZoneSelectorModal } from './components/ZoneSelectorModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { WishlistModal } from './components/WishlistModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { ReviewSubmissionModal } from './components/ReviewSubmissionModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { InstallAppModal } from './components/InstallAppModal';
import { CategoriesModal } from './components/CategoriesModal';
import { FeaturedDealsCarousel } from './components/FeaturedDealsCarousel';
import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
} from 'firebase/firestore';

export default function App() {
  // 1. Core State with Local Storage + Cloud Firestore Persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('carehub_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return PRODUCTS_DATA;
  });

  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(() => {
    const saved = localStorage.getItem('carehub_selected_zone');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return OCTOBER_ZAYED_ZONES[0]; // Beverly Hills / Zayed default
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('carehub_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('carehub_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('carehub_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Seed initial demo orders in October & Zayed
    return [
      {
        id: 'OCT-772150',
        customerName: 'نورهان هشام',
        phone: '01223456789',
        city: 'zayed',
        zoneId: 'zayed-2',
        zoneName: 'الشيخ زايد - الحي الثاني والتراخيص',
        detailedAddress: 'عمارة 14 - شارع النزهة',
        buildingNumber: '14',
        floorNumber: '3',
        apartmentNumber: '6',
        landmark: 'بجوار مجمع المحاكم',
        items: [
          { product: PRODUCTS_DATA[0], quantity: 1 },
          { product: PRODUCTS_DATA[2], quantity: 1 },
        ],
        subtotal: 635,
        deliveryFee: 0,
        discount: 0,
        total: 635,
        paymentMethod: 'vodafone_cash',
        status: 'delivered',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        estimatedDelivery: 'تم التسليم بنجاح',
        courierName: 'كابتن أحمد (مندوب أكتوبر وزايد)',
        courierPhone: '01011223344',
      },
      {
        id: 'OCT-984210',
        customerName: 'سارة عبد الله',
        phone: '01012345678',
        city: 'zayed',
        zoneId: 'zayed-1',
        zoneName: 'الشيخ زايد - بيفرلي هيلز وسوديك ويست',
        detailedAddress: 'كمبوند بيفرلي هيلز - مجاورة 2',
        buildingNumber: 'فيلا 12',
        floorNumber: 'الأرضي',
        apartmentNumber: '1',
        landmark: 'بجوار ذا ستريب مول',
        items: [
          { product: PRODUCTS_DATA[0], quantity: 1 },
          { product: PRODUCTS_DATA[1], quantity: 1 },
        ],
        subtotal: 715,
        deliveryFee: 0,
        discount: 71,
        total: 644,
        appliedCoupon: 'OCTOBER10',
        paymentMethod: 'instapay',
        status: 'with_courier',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        estimatedDelivery: 'خلال 45 دقيقة',
        courierName: 'كابتن محمود (مندوب الشيخ زايد)',
        courierPhone: '01099887766',
      },
    ];
  });

  // Store Settings (Manager configurable)
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('carehub_store_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      storeNameAr: 'M&l - متجر العناية ومستلزمات الأطفال',
      announcementText: 'توصيل سريع خلال ٢٤ ساعة في ٦ أكتوبر والشيخ زايد وحدائق أكتوبر 🚚 | شحن مجاني للطلبات فوق 1000 جنيه',
      contactPhone: '01093629587',
      contactWhatsApp: '201093629587',
      defaultDeliveryFee: 30,
      freeShippingThreshold: 1000,
      activeCoupons: [
        { code: 'OCTOBER10', discountPercent: 10, description: 'خصم 10% لجميع سكان 6 أكتوبر وزايد' },
        { code: 'ZAYEDFREE', discountPercent: 100, description: 'شحن مجاني لكافة أحياء الشيخ زايد' },
        { code: 'MOM2026', discountPercent: 15, description: 'خصم 15% على قسم العناية بالأم والطفل' }
      ]
    };
  });

  // Filter & Search States
  const [activeCategory, setActiveCategory] = useState<MainCategory>('all');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'priceLow' | 'priceHigh' | 'rating'>('featured');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  // Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState('');

  // Modals Visibility
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isInstallAppOpen, setIsInstallAppOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewModalProduct, setReviewModalProduct] = useState<Product | null>(null);
  const [reviewModalOrderId, setReviewModalOrderId] = useState<string | undefined>(undefined);
  const [reviewModalUserName, setReviewModalUserName] = useState<string | undefined>(undefined);
  const [reviewModalUserArea, setReviewModalUserArea] = useState<string | undefined>(undefined);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-time synchronization with Firestore for permanent cross-device persistence
  useEffect(() => {
    // 1. Listen for Products updates from Firestore
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (!snapshot.empty) {
          const prodsList: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Product;
            prodsList.push({
              ...data,
              id: docSnap.id,
            });
          });
          setProducts(prodsList);
          localStorage.setItem('carehub_products', JSON.stringify(prodsList));
        } else {
          // If Firestore is empty and PRODUCTS_DATA has items, seed them
          if (PRODUCTS_DATA.length > 0) {
            const batch = writeBatch(db);
            PRODUCTS_DATA.forEach((prod) => {
              const docRef = doc(db, 'products', prod.id);
              batch.set(docRef, prod);
            });
            batch.commit().catch((err) => console.error('Auto seed Firestore error:', err));
          }
        }
      },
      (error) => {
        console.error('Firestore products listener error:', error);
      }
    );

    // 2. Listen for Orders from Firestore (real-time cross-device sync)
    const unsubOrders = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        if (!snapshot.empty) {
          const ordersList: Order[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Order;
            ordersList.push({
              ...data,
              id: docSnap.id,
            });
          });
          // Sort newest first
          ordersList.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOrders(ordersList);
          localStorage.setItem('carehub_orders', JSON.stringify(ordersList));
        }
      },
      (error) => {
        console.error('Firestore orders listener error:', error);
      }
    );

    // 3. Listen for Store Settings
    const unsubSettings = onSnapshot(
      collection(db, 'storeSettings'),
      (snapshot) => {
        if (!snapshot.empty) {
          const settingsDoc = snapshot.docs[0];
          if (settingsDoc) {
            const settingsData = settingsDoc.data() as StoreSettings;
            setStoreSettings(settingsData);
            localStorage.setItem('carehub_store_settings', JSON.stringify(settingsData));
          }
        }
      },
      (error) => {
        console.error('Firestore settings listener error:', error);
      }
    );

    return () => {
      unsubProducts();
      unsubOrders();
      unsubSettings();
    };
  }, []);

  // Local fallback storage
  useEffect(() => {
    localStorage.setItem('carehub_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('carehub_selected_zone', JSON.stringify(selectedZone));
  }, [selectedZone]);

  useEffect(() => {
    localStorage.setItem('carehub_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('carehub_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('carehub_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('carehub_store_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`✓ تم إضافة "${product.nameAr}" إلى السلة`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`تمت الإزالة من المفضلة`);
        return prev.filter((p) => p.id !== product.id);
      }
      showToast(`❤ تم الحفظ في المفضلة`);
      return [...prev, product];
    });
  };

  // Coupon handling
  const handleApplyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'OCTOBER10') {
      setAppliedCoupon('OCTOBER10');
      return { success: true, message: 'تم تطبيق خصم 10% بنجاح على طلبك!' };
    }
    if (cleanCode === 'ZAYEDFREE') {
      setAppliedCoupon('ZAYEDFREE');
      return { success: true, message: 'تم تطبيق الشحن المجاني لأحياء زايد وأكتوبر!' };
    }
    if (cleanCode === 'MOM2026') {
      setAppliedCoupon('MOM2026');
      return { success: true, message: 'تم تطبيق خصم 15% على مستلزمات الطفل والأم!' };
    }
    return { success: false, message: 'كوبون غير صالح أو منتهي الصلاحية' };
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    showToast('تم إلغاء الكوبون');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const discountAmount = useMemo(() => {
    if (appliedCoupon === 'OCTOBER10') {
      return Math.round(subtotal * 0.1);
    }
    if (appliedCoupon === 'MOM2026') {
      return Math.round(subtotal * 0.15);
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  // Order created
  const handleOrderCompleted = async (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (e) {
      console.error('Failed to save order to Firestore:', e);
    }
    showToast(`🎉 تم تسجيل طلبك بنجاح برقم #${newOrder.id}`);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    let updatedOrderObj: Order | undefined;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = { ...o, status: newStatus };
          updatedOrderObj = updated;
          return updated;
        }
        return o;
      })
    );
    if (updatedOrderObj) {
      try {
        await setDoc(doc(db, 'orders', orderId), updatedOrderObj);
      } catch (e) {
        console.error('Failed to update order in Firestore:', e);
      }
    }
    showToast('تم تحديث حالة الطلب');
  };

  const handleUpdateOrderDetails = async (orderId: string, updates: Partial<Order>) => {
    let updatedOrderObj: Order | undefined;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = { ...o, ...updates };
          updatedOrderObj = updated;
          return updated;
        }
        return o;
      })
    );
    if (updatedOrderObj) {
      try {
        await setDoc(doc(db, 'orders', orderId), updatedOrderObj);
      } catch (e) {
        console.error('Failed to update order details in Firestore:', e);
      }
    }
    showToast('تم حفظ تعديلات الطلب والمندوب');
  };

  const handleDeleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (e) {
      console.error('Failed to delete order from Firestore:', e);
    }
    showToast('تم حذف الطلب نهائياً من السجل');
  };

  const handleAddNewProduct = async (newProd: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === newProd.id);
      if (exists) {
        return prev.map((p) => (p.id === newProd.id ? newProd : p));
      }
      return [newProd, ...prev];
    });
    try {
      await setDoc(doc(db, 'products', newProd.id), newProd);
      showToast('✓ تمت إضافة ونشر المنتج بنجاح في المتجر سحابياً');
    } catch (e) {
      console.error('Failed to sync new product to Firestore:', e);
      showToast('⚠️ تم حفظ المنتج محلياً');
    }
  };

  const handleUpdateProduct = async (productId: string, updates: Partial<Product>) => {
    let updatedFullProd: Product | undefined;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const merged = { ...p, ...updates };
          updatedFullProd = merged;
          return merged;
        }
        return p;
      })
    );
    if (detailProduct && detailProduct.id === productId) {
      setDetailProduct((prev) => (prev ? { ...prev, ...updates } : null));
    }
    if (updatedFullProd) {
      try {
        await setDoc(doc(db, 'products', productId), updatedFullProd);
      } catch (e) {
        console.error('Failed to update product in Firestore:', e);
      }
    }
    showToast('تم تعديل بيانات وسعر المنتج وحفظه بنجاح');
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (detailProduct && detailProduct.id === productId) {
      setDetailProduct(null);
    }
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (e) {
      console.error('Failed to delete product from Firestore:', e);
    }
    showToast('تم حذف المنتج نهائياً من المتجر');
  };

  const handleClearAllProducts = async () => {
    setProducts([]);
    localStorage.removeItem('carehub_products');
    try {
      const snap = await getDocs(collection(db, 'products'));
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    } catch (e) {
      console.error('Failed to clear products from Firestore:', e);
    }
    showToast('✓ تم إفراغ جميع منتجات المتجر وحفظ السجل');
  };

  const handleSeedDefaultProducts = async () => {
    setProducts(PRODUCTS_DATA);
    localStorage.setItem('carehub_products', JSON.stringify(PRODUCTS_DATA));
    try {
      const batch = writeBatch(db);
      PRODUCTS_DATA.forEach((prod) => {
        const docRef = doc(db, 'products', prod.id);
        batch.set(docRef, prod);
      });
      await batch.commit();
    } catch (e) {
      console.error('Failed to seed default products to Firestore:', e);
    }
    showToast('✓ تمت استعادة ونشر باقة المنتجات الاصلية سحابياً');
  };

  const handleUpdateStoreSettings = async (newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
    try {
      await setDoc(doc(db, 'storeSettings', 'main'), newSettings);
    } catch (e) {
      console.error('Failed to sync store settings to Firestore:', e);
    }
    showToast('تم حفظ إعدادات المتجر العامة سحابياً بنجاح');
  };

  // Open Review Submission Modal
  const handleOpenReviewModal = (
    product: Product,
    orderId?: string,
    customerName?: string,
    customerArea?: string
  ) => {
    setReviewModalProduct(product);
    setReviewModalOrderId(orderId);
    setReviewModalUserName(customerName);
    setReviewModalUserArea(customerArea);
    setIsReviewModalOpen(true);
  };

  // Submit Product Review and recalculate average rating
  const handleAddProductReview = async (
    productId: string,
    newRevData: Omit<ProductReview, 'id' | 'date'>
  ) => {
    const newReview: ProductReview = {
      ...newRevData,
      id: 'rev-' + Date.now(),
      date: 'اليوم (الآن)',
    };

    let updatedProductRef: Product | null = null;

    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const currentReviews = prod.reviews || [];
          const updatedReviews = [newReview, ...currentReviews];
          const newReviewsCount = (prod.reviewsCount || 0) + 1;
          // Calculate new weighted average rating accurately
          const totalScore =
            ((prod.rating || 5) * (prod.reviewsCount || 0)) + newRevData.rating;
          const newRating = Number((totalScore / newReviewsCount).toFixed(1));

          const updatedProd: Product = {
            ...prod,
            rating: newRating,
            reviewsCount: newReviewsCount,
            reviews: updatedReviews,
          };
          updatedProductRef = updatedProd;
          return updatedProd;
        }
        return prod;
      })
    );

    if (detailProduct && detailProduct.id === productId && updatedProductRef) {
      setDetailProduct(updatedProductRef);
    }

    if (updatedProductRef) {
      try {
        await setDoc(doc(db, 'products', productId), updatedProductRef);
      } catch (e) {
        console.error('Failed to sync review to Firestore:', e);
      }
    }

    showToast(`⭐ شكراً لك! تم نشر تقييمك (${newRevData.rating} نجوم) مع الصور بنجاح`);
  };

  // Brands list for filter
  const brandsList = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
    return ['all', ...Array.from(set)];
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (activeCategory !== 'all' && p.category !== activeCategory) {
        return false;
      }
      // Subcategory filter
      if (activeSubCategory !== 'all' && p.subCategory !== activeSubCategory) {
        return false;
      }
      // Brand filter
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.nameAr.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesTags && !matchesDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceLow') return a.price - b.price;
      if (sortBy === 'priceHigh') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [products, activeCategory, activeSubCategory, selectedBrand, searchQuery, sortBy]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col selection:bg-pink-600 selection:text-white pb-20 md:pb-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl shadow-2xl border border-pink-500/30 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-pink-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        selectedZone={selectedZone}
        onOpenZoneModal={() => setIsZoneModalOpen(true)}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrderTracking={() => setIsOrderTrackingOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenInstallApp={() => setIsInstallAppOpen(true)}
        onOpenCategories={() => setIsCategoriesModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActiveSubCategory('all');
        }}
        storeSettings={storeSettings}
        products={products}
        onSelectProduct={(p) => setDetailProduct(p)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full">
        {/* Hero Banner */}
        <HeroBanner
          selectedZone={selectedZone}
          onOpenZoneModal={() => setIsZoneModalOpen(true)}
          onSelectCategory={(cat) => {
            setActiveCategory(cat as any);
            setActiveSubCategory('all');
            const section = document.getElementById('products-section');
            if (section) {
              section.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* Hyperlocal Zone Delivery Bar for October & Zayed */}
        <div className="mx-3 sm:mx-6 lg:mx-8 mb-4 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-pink-100 shadow-2xs flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-right">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center shrink-0 font-bold">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs text-stone-500 font-medium">
                توصيل مخزن ٦ أكتوبر والشيخ زايد
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-stone-900">
                الحي: {selectedZone.name}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-xs font-semibold text-stone-700">
            <span className="bg-pink-50 text-pink-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-pink-200 flex items-center gap-1">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-600" />
              خلال {selectedZone.estimatedDeliveryTime}
            </span>
            <span className="bg-amber-50 text-amber-900 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-amber-200">
              التوصيل: {selectedZone.deliveryFee}ج
            </span>
            <button
              onClick={() => setIsZoneModalOpen(true)}
              className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold transition-colors cursor-pointer text-[10px] sm:text-xs"
            >
              تغيير
            </button>
          </div>
        </div>

        {/* Featured Deals Carousel (العروض والتخفيضات المميزة) */}
        <FeaturedDealsCarousel
          products={products}
          onAddToCart={handleAddToCart}
          onQuickView={(prod) => setDetailProduct(prod)}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          cart={cart}
        />

        {/* Products Catalog Section */}
        <div id="products-section" className="mx-3 sm:mx-6 lg:mx-8 space-y-4 sm:space-y-6 pb-16 scroll-mt-20">
          {/* Section Header with Category Title & Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
            <div>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-stone-900">
                {activeCategory === 'all'
                  ? 'جميع منتجات العناية والطفل 🛍️'
                  : activeCategory === 'baby'
                  ? 'منتجات العناية بالطفل والرضيع 👶'
                  : activeCategory === 'hair'
                  ? 'منتجات العناية بالشعر والتساقط 💇‍♀️'
                  : activeCategory === 'body'
                  ? 'منتجات العناية بالجسم والبشرة ✨'
                  : 'بكجات التوفير والهدايا الفاخرة 🎁'}
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
                عرض {filteredProducts.length} منتج أصلي متوفر للشحن الفوري
              </p>
            </div>

            {/* Sort & Brand Controls */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {/* Brand Selector */}
              <div className="flex items-center gap-1 bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-stone-200 text-[11px] sm:text-xs">
                <span className="text-stone-500 font-bold">الماركة:</span>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="bg-transparent font-extrabold text-stone-900 focus:outline-none cursor-pointer"
                >
                  <option value="all">الكل</option>
                  {brandsList.filter((b) => b !== 'all').map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1 bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-stone-200 text-[11px] sm:text-xs">
                <span className="text-stone-500 font-bold">الترتيب:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-extrabold text-stone-900 focus:outline-none cursor-pointer"
                >
                  <option value="featured">الأكثر طلباً</option>
                  <option value="rating">الأعلى تقييماً ★</option>
                  <option value="priceLow">السعر: من الأقل</option>
                  <option value="priceHigh">السعر: من الأعلى</option>
                </select>
              </div>
            </div>
          </div>

          {/* Subcategory Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
            <button
              onClick={() => setActiveSubCategory('all')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeSubCategory === 'all'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              الكل
            </button>

            {activeCategory === 'baby' && (
              <>
                <button
                  onClick={() => setActiveSubCategory('baby_wash_shampoo')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                    activeSubCategory === 'baby_wash_shampoo'
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  شامبو وغسول أطفال (لا دموع)
                </button>
                <button
                  onClick={() => setActiveSubCategory('diaper_cream')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                    activeSubCategory === 'diaper_cream'
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  علاج ومنع تسلخات الحفاض
                </button>
              </>
            )}

            {activeCategory === 'hair' && (
              <>
                <button
                  onClick={() => setActiveSubCategory('hair_oil_serum')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                    activeSubCategory === 'hair_oil_serum'
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  زيوت إنبات وسيرومات ترطيب
                </button>
                <button
                  onClick={() => setActiveSubCategory('curly_care')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                    activeSubCategory === 'curly_care'
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  عناية الشعر الكيرلي والحرارة
                </button>
              </>
            )}

            {activeCategory === 'body' && (
              <>
                <button
                  onClick={() => setActiveSubCategory('body_lotion')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                    activeSubCategory === 'body_lotion'
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  ترطيب الجسم وحاجز البشرة
                </button>
                <button
                  onClick={() => setActiveSubCategory('sunscreen')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                    activeSubCategory === 'sunscreen'
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  واقي شمس (صن بلوك)
                </button>
                <button
                  onClick={() => setActiveSubCategory('body_mist')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                    activeSubCategory === 'body_mist'
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  بودي ميست وعطور الجسم
                </button>
                <button
                  onClick={() => setActiveSubCategory('face_serum_cream')}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                    activeSubCategory === 'face_serum_cream'
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  سيرومات النضارة والمسام
                </button>
              </>
            )}
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-black text-stone-900 text-lg">المتجر فارغ وبانتظار إضافة المنتجات</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  يمكنك الآن إضافة وتصوير المنتجات مباشرة من هاتفك المحمول وتحديد الأسعار عبر بوابة الإدارة لتظهر للعملاء فوراً!
                </p>
              </div>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-extrabold transition-colors cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <span>🔐 فتح لوحة الإدارة وإضافة أول منتج</span>
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
              <Search className="w-12 h-12 text-stone-400 mx-auto" />
              <h3 className="font-bold text-stone-800 text-base">لم نجد منتجات مطابقة لبحثك</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                جربي البحث باسم آخر أو إعادة ضبط التصفيات!
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setActiveSubCategory('all');
                  setSelectedBrand('all');
                }}
                className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                عرض كل المنتجات
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
              {filteredProducts.map((product) => {
                const cartItem = cart.find((i) => i.product.id === product.id);
                const isWishlisted = wishlist.some((w) => w.id === product.id);

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    onQuickView={(p) => setDetailProduct(p)}
                    isWishlisted={isWishlisted}
                    onToggleWishlist={handleToggleWishlist}
                    cartQuantity={cartItem?.quantity || 0}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Hyperlocal 6th of October, Sheikh Zayed & October Gardens Features Highlights */}
        <section className="bg-gradient-to-br from-pink-950 via-rose-950 to-stone-950 text-white rounded-2xl mx-3 sm:mx-6 lg:mx-8 mb-6 p-4 sm:p-6 border border-pink-900/50 shadow-md">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-right">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-900/80 border border-pink-700/50 flex items-center justify-center text-pink-300 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-xs sm:text-sm text-white">
                  توصيل خلال ٢٤ ساعة فقط
                </h3>
                <p className="text-[11px] text-pink-100/80 leading-relaxed">
                  متاح في ٦ أكتوبر، الشيخ زايد، وحدائق أكتوبر مع شحن مجاني للطلبات فوق 1000 جنيه.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-900/80 border border-pink-700/50 flex items-center justify-center text-amber-300 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-xs sm:text-sm text-white">
                  منتجات أصلية ١٠٠٪ ومضمونة
                </h3>
                <p className="text-[11px] text-pink-100/80 leading-relaxed">
                  أصلية وموثوقة من الوكلاء المعتمدين مع إمكانية المعاينة عند الاستلام قبل الدفع.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-900/80 border border-pink-700/50 flex items-center justify-center text-pink-300 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-xs sm:text-sm text-white">
                  طلب فوري وخدمة عملاء نشطة
                </h3>
                <p className="text-[11px] text-pink-100/80 leading-relaxed">
                  لطلب الأوردر والاستفسار عبر الموبايل والواتساب: <span className="font-mono font-bold text-pink-300 dir-ltr inline-block">01093629587</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Slim & Compact Footer */}
      <footer className="bg-stone-950 text-stone-400 text-xs py-4 border-t border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-pink-400 font-black lowercase">m&l</span>
            <span className="text-stone-300 font-bold text-xs">متجر العناية والجمال والطفل</span>
            <span className="text-stone-600 hidden sm:inline">•</span>
            <span className="text-[11px] text-stone-400">توصيل خلال ٢٤ ساعة (أكتوبر • زايد • حدائق أكتوبر)</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-bold text-stone-300">
            <a
              href="tel:01093629587"
              className="text-pink-400 hover:text-pink-300 font-mono transition-colors"
            >
              📞 01093629587
            </a>
            <a
              href="https://wa.me/201093629587?text=مرحباً، أود الاستفسار وطلب أوردر من متجر m%26l"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              💬 واتساب الطلب
            </a>
            <button
              onClick={() => setIsOrderTrackingOpen(true)}
              className="hover:text-pink-400 transition-colors cursor-pointer"
            >
              تتبع الطلب
            </button>
            <button
              onClick={() => setIsZoneModalOpen(true)}
              className="hover:text-pink-400 transition-colors cursor-pointer"
            >
              المناطق
            </button>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hover:text-pink-400 transition-colors cursor-pointer"
            >
              المدير 🔒
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ZoneSelectorModal
        isOpen={isZoneModalOpen}
        onClose={() => setIsZoneModalOpen(false)}
        selectedZone={selectedZone}
        onSelectZone={(z) => {
          setSelectedZone(z);
          showToast(`تم تعيين منطقة التوصيل: ${z.name}`);
        }}
      />

      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={detailProduct ? wishlist.some((w) => w.id === detailProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        selectedZone={selectedZone}
        onOpenReviewModal={(prod) => handleOpenReviewModal(prod)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        selectedZone={selectedZone}
        onOpenZoneModal={() => {
          setIsCartOpen(false);
          setIsZoneModalOpen(true);
        }}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        discountAmount={discountAmount}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        appliedCoupon={appliedCoupon}
        discountAmount={discountAmount}
        onOrderCompleted={handleOrderCompleted}
        onClearCart={handleClearCart}
        storeSettings={storeSettings}
      />

      <OrderTrackingModal
        isOpen={isOrderTrackingOpen}
        onClose={() => setIsOrderTrackingOpen(false)}
        orders={orders}
        onOpenReviewModal={(prod, orderId, name, area) =>
          handleOpenReviewModal(prod, orderId, name, area)
        }
        onMarkDelivered={(orderId) => handleUpdateOrderStatus(orderId, 'delivered')}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={(id) => setWishlist((prev) => prev.filter((p) => p.id !== id))}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateOrderDetails={handleUpdateOrderDetails}
        onDeleteOrder={handleDeleteOrder}
        products={products}
        onAddNewProduct={handleAddNewProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onClearAllProducts={handleClearAllProducts}
        onSeedDefaultProducts={handleSeedDefaultProducts}
        storeSettings={storeSettings}
        onUpdateStoreSettings={handleUpdateStoreSettings}
      />

      <ReviewSubmissionModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setReviewModalProduct(null);
        }}
        product={reviewModalProduct}
        orderId={reviewModalOrderId}
        defaultUserName={reviewModalUserName}
        defaultUserArea={reviewModalUserArea}
        onSubmitReview={handleAddProductReview}
      />

      {/* Mobile Bottom Dock App Bar */}
      <MobileBottomNav
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActiveSubCategory('all');
        }}
        onOpenCategories={() => setIsCategoriesModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        wishlistCount={wishlist.length}
        onOpenOrderTracking={() => setIsOrderTrackingOpen(true)}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* All Categories Interactive Drawer / Modal */}
      <CategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        activeCategory={activeCategory}
        activeSubCategory={activeSubCategory}
        onSelectCategory={(cat, sub) => {
          setActiveCategory(cat);
          setActiveSubCategory(sub || 'all');
        }}
        products={products}
      />

      {/* Progressive Web App Install Modal */}
      <InstallAppModal
        isOpen={isInstallAppOpen}
        onClose={() => setIsInstallAppOpen(false)}
      />
    </div>
  );
}
