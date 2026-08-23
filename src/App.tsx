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
  Stethoscope,
  FileText
} from 'lucide-react';
import {
  Product,
  DeliveryZone,
  CartItem,
  Order,
  MainCategory,
  SubCategory,
  ProductReview,
  StoreSettings,
  CategoryConfig,
  PrescriptionRequest,
} from './types';
import { PRODUCTS_DATA } from './data/products';
import { OCTOBER_ZAYED_ZONES } from './data/zones';
import { DEFAULT_CATEGORIES } from './data/categories';
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
import { PrescriptionModal } from './components/PrescriptionModal';
import { FeaturedDealsCarousel } from './components/FeaturedDealsCarousel';
import { AmazonCategoryGrid } from './components/AmazonCategoryGrid';
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

  const [categoriesList, setCategoriesList] = useState<CategoryConfig[]>(() => {
    const saved = localStorage.getItem('carehub_categories');
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
    return DEFAULT_CATEGORIES;
  });

  const [prescriptions, setPrescriptions] = useState<PrescriptionRequest[]>(() => {
    const saved = localStorage.getItem('carehub_prescriptions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
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
      announcementText:
        'توصيل سريع خلال ٢٤ ساعة في ٦ أكتوبر والشيخ زايد وحدائق أكتوبر 🚚 | شحن مجاني للطلبات فوق 1000 جنيه',
      contactPhone: '01093629587',
      contactWhatsApp: '201093629587',
      defaultDeliveryFee: 30,
      freeShippingThreshold: 1000,
      activeCoupons: [
        { code: 'OCTOBER10', discountPercent: 10, description: 'خصم 10% لجميع سكان 6 أكتوبر وزايد' },
        { code: 'ZAYEDFREE', discountPercent: 100, description: 'شحن مجاني لكافة أحياء الشيخ زايد' },
        { code: 'MOM2026', discountPercent: 15, description: 'خصم 15% على قسم العناية بالأم والطفل' },
      ],
    };
  });

  // Filter & Search States
  const [activeCategory, setActiveCategory] = useState<string>('all');
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
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
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

  // Real-time synchronization with Firestore
  useEffect(() => {
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

  // Sync to Local Storage
  useEffect(() => {
    localStorage.setItem('carehub_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('carehub_categories', JSON.stringify(categoriesList));
  }, [categoriesList]);

  useEffect(() => {
    localStorage.setItem('carehub_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

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
        console.error('Failed to update order status in Firestore:', e);
      }
    }
    showToast(`تم تحديث حالة الطلب #${orderId}`);
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
        console.error('Failed to update courier in Firestore:', e);
      }
    }
    showToast(`تم تحديث بيانات المندوب للطلب #${orderId}`);
  };

  const handleDeleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (e) {
      console.error('Failed to delete order from Firestore:', e);
    }
    showToast(`تم حذف الطلب #${orderId}`);
  };

  // Product Admin Operations
  const handleAddNewProduct = async (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    try {
      await setDoc(doc(db, 'products', newProduct.id), newProduct);
    } catch (e) {
      console.error('Failed to add product to Firestore:', e);
    }
    showToast(`✓ تم إضافة المنتج "${newProduct.nameAr}" للمتجر بنجاح`);
  };

  const handleUpdateProduct = async (productId: string, updates: Partial<Product>) => {
    let updatedFullProd: Product | undefined;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updated = { ...p, ...updates };
          updatedFullProd = updated;
          return updated;
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
    showToast('تم تعديل بيانات المنتج وحفظه بنجاح');
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

  // Categories Operations
  const handleUpdateCategoriesList = (newCategories: CategoryConfig[]) => {
    setCategoriesList(newCategories);
    localStorage.setItem('carehub_categories', JSON.stringify(newCategories));
    showToast('✓ تم تحديث الأقسام والتصنيفات بنجاح');
  };

  // Prescription Operations
  const handleAddNewPrescription = (req: PrescriptionRequest) => {
    setPrescriptions((prev) => [req, ...prev]);
    showToast('✓ تم استلام الروشتة وإرسالها للصيدلي بنجاح');
  };

  const handleUpdatePrescriptionStatus = (
    id: string,
    status: PrescriptionRequest['status']
  ) => {
    setPrescriptions((prev) =>
      prev.map((rx) => (rx.id === id ? { ...rx, status } : rx))
    );
    showToast('✓ تم تحديث حالة الروشتة بنجاح');
  };

  const handleDeletePrescription = (id: string) => {
    setPrescriptions((prev) => prev.filter((rx) => rx.id !== id));
    showToast('✓ تم حذف الطلب');
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

  const handleAddProductReview = async (
    productId: string,
    newRevData: Omit<ProductReview, 'id' | 'createdAt'>
  ) => {
    const newRev: ProductReview = {
      ...newRevData,
      id: 'rev_' + Date.now(),
      createdAt: new Date().toISOString(),
    };

    let updatedProd: Product | null = null;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const currentReviews = p.reviewsList || [];
          const updatedReviews = [newRev, ...currentReviews];
          const newTotalRatings = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAvgRating = Number((newTotalRatings / updatedReviews.length).toFixed(1));

          const up = {
            ...p,
            reviewsList: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: newAvgRating,
          };
          updatedProd = up;
          return up;
        }
        return p;
      })
    );

    if (detailProduct && detailProduct.id === productId && updatedProd) {
      setDetailProduct(updatedProd);
    }

    if (updatedProd) {
      try {
        await setDoc(doc(db, 'products', productId), updatedProd);
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

  // Active Category Object
  const currentCategoryConfig = useMemo(() => {
    return categoriesList.find((c) => c.id === activeCategory);
  }, [categoriesList, activeCategory]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
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
          const matchesName =
            p.nameAr?.toLowerCase().includes(q) || p.name?.toLowerCase().includes(q);
          const matchesBrand = p.brand?.toLowerCase().includes(q);
          const matchesTags = p.tags?.some((t) => t.toLowerCase().includes(q));
          const matchesDesc = p.description?.toLowerCase().includes(q);
          if (!matchesName && !matchesBrand && !matchesTags && !matchesDesc) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
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
        onOpenPrescription={() => setIsPrescriptionModalOpen(true)}
        categoriesList={categoriesList}
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

        {/* Hyperlocal Zone Delivery Bar for October & Zayed + Pharmacist Guarantee */}
        <div className="mx-3 sm:mx-6 lg:mx-8 mb-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-pink-100 shadow-2xs flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-right">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center shrink-0 font-bold">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs text-stone-500 font-medium">
                توصيل مخزن ٦ أكتوبر والشيخ زايد • إشراف صيدلي معتمد
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-stone-900">
                الحي: {selectedZone.name}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-xs font-semibold text-stone-700">
            <button
              onClick={() => setIsPrescriptionModalOpen(true)}
              className="bg-emerald-50 text-emerald-800 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-emerald-200 flex items-center gap-1 hover:bg-emerald-100 font-extrabold cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
              <span>طلب روشتة خاصة 📄</span>
            </button>

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
              تغيير المنطقة
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

        {/* Amazon-Style Department Grid (تسوقي حسب الأقسام) */}
        <AmazonCategoryGrid
          products={products}
          categoriesList={categoriesList}
          onSelectCategory={(cat, sub) => {
            setActiveCategory(cat);
            setActiveSubCategory(sub || 'all');
          }}
          onOpenCategoriesModal={() => setIsCategoriesModalOpen(true)}
        />

        {/* Products Catalog Section */}
        <div id="products-section" className="mx-3 sm:mx-6 lg:mx-8 space-y-4 sm:space-y-6 pb-16 scroll-mt-20">
          {/* Section Header with Category Title & Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
            <div>
              <h2 className="text-base sm:text-xl md:text-2xl font-black text-stone-900">
                {activeCategory === 'all'
                  ? 'جميع منتجات العناية والطفل 🛍️'
                  : currentCategoryConfig
                  ? `${currentCategoryConfig.title} ✨`
                  : 'منتجات القسم المحدد'}
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
                عرض {filteredProducts.length} منتج أصلي متوفر للشحن الفوري بإشراف صيدلي
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
                  {brandsList
                    .filter((b) => b !== 'all')
                    .map((b) => (
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

          {/* Dynamic Subcategory Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
            {currentCategoryConfig?.subcategories && currentCategoryConfig.subcategories.length > 0 ? (
              currentCategoryConfig.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubCategory(sub.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                    activeSubCategory === sub.id
                      ? 'bg-stone-900 text-white shadow-2xs font-extrabold'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100 font-bold'
                  }`}
                >
                  {sub.label}
                </button>
              ))
            ) : (
              <button
                onClick={() => setActiveSubCategory('all')}
                className="px-3 py-1.5 rounded-xl whitespace-nowrap bg-stone-900 text-white font-extrabold"
              >
                الكل
              </button>
            )}
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-pink-100 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-stone-900">
                لا توجد منتجات مطابقة في هذا القسم حالياً
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                يمكنك إعادة ضبط الفلاتر أو تصفح باقي الأقسام. كما يمكنك إرسال طلب خاص للصيدلي مباشرة.
              </p>
              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setActiveSubCategory('all');
                    setSelectedBrand('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-pink-600 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  عرض جميع المنتجات
                </button>
                <button
                  onClick={() => setIsPrescriptionModalOpen(true)}
                  className="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl"
                >
                  طلب خاص أو روشتة 📄
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onAddToCart={handleAddToCart}
                  onQuickView={(p) => setDetailProduct(p)}
                  isWishlisted={wishlist.some((w) => w.id === prod.id)}
                  onToggleWishlist={handleToggleWishlist}
                  cartQuantity={cart.find((c) => c.product.id === prod.id)?.quantity || 0}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-stone-900 text-stone-300 text-xs py-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-['Playfair_Display',Georgia,serif] text-lg font-black text-pink-500">
              m<span className="text-white">&</span>l
            </span>
            <span>• متجر العناية ومستلزمات الطفل - إشراف صيدلي معتمد 🥼</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-bold">
            <button
              onClick={() => setIsPrescriptionModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              📄 طلب روشتة صيدلية
            </button>
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
        onReorder={(reorderItems) => {
          reorderItems.forEach((item) => {
            handleAddToCart(item.product, item.quantity);
          });
          setIsOrderTrackingOpen(false);
          setIsCartOpen(true);
          showToast('🛒 تمت إضافة المنتجات لسلة التسوق');
        }}
        onCancelOrder={(orderId) => handleUpdateOrderStatus(orderId, 'cancelled')}
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
        categoriesList={categoriesList}
        onUpdateCategoriesList={handleUpdateCategoriesList}
        prescriptions={prescriptions}
        onUpdatePrescriptionStatus={handleUpdatePrescriptionStatus}
        onDeletePrescription={handleDeletePrescription}
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
        categoriesList={categoriesList}
        activeCategory={activeCategory}
        activeSubCategory={activeSubCategory}
        onSelectCategory={(cat, sub) => {
          setActiveCategory(cat);
          setActiveSubCategory(sub || 'all');
        }}
        products={products}
      />

      {/* Prescription / Medical Accessory Modal with Direct WhatsApp */}
      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        onSubmitPrescription={handleAddNewPrescription}
      />

      {/* Progressive Web App Install Modal */}
      <InstallAppModal
        isOpen={isInstallAppOpen}
        onClose={() => setIsInstallAppOpen(false)}
      />
    </div>
  );
}
