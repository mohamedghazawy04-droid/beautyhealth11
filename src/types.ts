export type MainCategory = 'all' | 'hair' | 'body' | 'baby' | 'bundles';

export type SubCategory =
  | 'all'
  | 'shampoo'
  | 'conditioner'
  | 'hair_oil_serum'
  | 'curly_care'
  | 'anti_hair_loss'
  | 'sunscreen'
  | 'body_lotion'
  | 'body_wash_scrub'
  | 'body_mist'
  | 'face_serum_cream'
  | 'baby_wash_shampoo'
  | 'diaper_cream'
  | 'baby_oil_lotion'
  | 'baby_wipes_care'
  | 'mom_baby_bundle'
  | 'hair_routine_bundle'
  | 'glow_routine_bundle';

export interface ProductReview {
  id: string;
  userName: string;
  userArea: string; // e.g. "الشيخ زايد - بيفرلي هيلز"
  rating: number;
  date: string;
  comment: string;
  images?: string[];
  image?: string;
  createdAt?: string;
  orderId?: string;
  verifiedPurchase?: boolean;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  brand: string;
  category: MainCategory;
  subCategory: SubCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  volume: string; // e.g. "250 مل", "50 جم"
  image: string;
  description: string;
  benefits: string[];
  ingredients: string[];
  howToUse: string;
  tags: string[];
  badges: string[]; // e.g. ["الأكثر مبيعاً", "توصيل فوري", "خالي من السلفات"]
  isOctoberZayedFastDelivery: boolean;
  safetyNote?: string; // e.g. "آمن للأطفال حديثي الولادة", "مختبر جلدياً"
  reviews?: ProductReview[];
}

export interface DeliveryZone {
  id?: string;
  name?: string;
  city?: 'october' | 'zayed' | string;
  districtNameAr?: string;
  deliveryFee?: number;
  fee?: number;
  estimatedDeliveryTime?: string;
  freeDeliveryThreshold?: number;
  popularLandmarks?: string[];
  distanceKm?: number;
  distanceTier?: 'قريبة (1-5 كم)' | 'متوسطة (5-12 كم)' | 'أبعد (12-25 كم)' | string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export type PaymentMethod = 'cod' | 'instapay' | 'vodafone_cash' | 'card';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  alternatePhone?: string;
  city?: string;
  zoneId?: string;
  zoneName?: string;
  detailedAddress: string;
  buildingNumber?: string;
  floorNumber?: string;
  apartmentNumber?: string;
  landmark?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  appliedCoupon?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  status: 'new' | 'preparing' | 'with_courier' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDelivery?: string;
  deliveryTimingType?: 'standard_24h' | 'scheduled';
  scheduledDate?: string;
  scheduledTimeSlot?: string;
  instaPayReceipt?: string;
  courierName?: string;
  courierPhone?: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  recommendedProductIds?: string[];
}

export interface RoutineStep {
  stepNumber: number;
  name: string;
  description: string;
  recommendedTime: string;
  productName?: string;
}

export interface CustomRoutine {
  title: string;
  summary: string;
  steps: RoutineStep[];
  octoberZayedDeliveryTip?: string;
}

export interface StoreSettings {
  announcementText: string;
  freeShippingThreshold: number;
  activeCouponCode: string;
  activeCouponDiscount: number;
  fastDeliveryEnabled: boolean;
  storeName: string;
  contactWhatsApp: string;
  // Automated Order Notification & Dispatch Settings
  autoDispatchEnabled?: boolean;
  telegramEnabled?: boolean;
  telegramBotToken?: string;
  telegramChatId?: string;
  webhookEnabled?: boolean;
  webhookUrl?: string;
  emailNotificationEnabled?: boolean;
  managerEmail?: string;
  audioAlertEnabled?: boolean;
}

export interface SubCategoryItem {
  id: string;
  label: string;
  desc?: string;
}

export interface CategoryConfig {
  id: string;
  title: string;
  englishTitle?: string;
  badge?: string;
  iconName?: string;
  subcategories: SubCategoryItem[];
}

export interface PrescriptionRequest {
  id: string;
  patientName: string;
  phone: string;
  city: 'october' | 'zayed';
  areaName?: string;
  notes?: string;
  image?: string;
  status: 'new' | 'reviewed' | 'dispatched';
  createdAt: string;
}

export interface SmartBusinessReport {
  executiveSummary: string;
  topSellingInsight: string;
  inventoryAdvice: string;
  marketingRecommendations: string[];
  operationalEfficiencyTip: string;
  generatedAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  type: 'new_product' | 'order_status' | 'promotion' | 'system' | 'support_message';
  read: boolean;
  productId?: string;
  orderId?: string;
  image?: string;
  productPrice?: number;
}

export interface SupportMessage {
  id: string;
  sender: 'customer' | 'admin';
  text: string;
  timestamp: string;
  orderId?: string;
  read?: boolean;
}

export interface SupportTicket {
  id: string;
  customerSessionId: string;
  customerName: string;
  customerPhone?: string;
  topic: 'order_inquiry' | 'product_question' | 'delivery_time' | 'prescription_help' | 'general';
  relatedOrderId?: string;
  status: 'open' | 'answered' | 'closed';
  messages: SupportMessage[];
  createdAt: string;
  lastUpdatedAt: string;
  unreadByAdmin: boolean;
  unreadByCustomer: boolean;
}

