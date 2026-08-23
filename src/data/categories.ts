import { CategoryConfig } from '../types';

export const DEFAULT_CATEGORIES: CategoryConfig[] = [
  {
    id: 'baby',
    title: 'العناية بالطفل والرضيع',
    englishTitle: 'Baby Care & Nursery',
    badge: 'الأكثر أماناً 👶',
    iconName: 'Baby',
    subcategories: [
      { id: 'all', label: 'جميع منتجات الطفل', desc: 'تصفح كل منتجات الرضع ومستلزمات الحمام' },
      { id: 'baby_wash_shampoo', label: 'شامبو وغسول الأطفال', desc: 'خالٍ من الدموع والسلفات' },
      { id: 'diaper_cream', label: 'كريمات الحفاض والالتهابات', desc: 'حماية وعلاج بـ زنك أوكسايد' },
      { id: 'baby_oil_lotion', label: 'لوشن وزيوت ترطيب الرضع', desc: 'نعومة فائقة تدوم 24 ساعة' },
      { id: 'baby_wipes_care', label: 'مناديل مبللة وعناية يومية', desc: 'ماء نقي 99% بدون كحول' },
    ],
  },
  {
    id: 'hair',
    title: 'العناية بالشعر والتساقط',
    englishTitle: 'Hair Care & Loss Solutions',
    badge: 'علاجي وطبيعي 💇‍♀️',
    iconName: 'Scissors',
    subcategories: [
      { id: 'all', label: 'جميع منتجات الشعر', desc: 'شامبوهات، حمامات كريم، وسيرومات مركزة' },
      { id: 'shampoo', label: 'شامبو طبي وخالي من السلفات', desc: 'للشعر المعالج والضعيف' },
      { id: 'conditioner', label: 'بلسم وحمامات كريم مغذية', desc: 'ترطيب عميق وإصلاح التقصف' },
      { id: 'hair_oil_serum', label: 'سيروم وزيوت تقوية وتغذية', desc: 'أرجان، جوجوبا، وإكليل الجبل' },
      { id: 'curly_care', label: 'منتجات الشعر الكيرلي (Curly)', desc: 'تحديد التموجات وترطيب خالي من السيليكون' },
      { id: 'anti_hair_loss', label: 'علاج التساقط وإنبات الفراغات', desc: 'كافيين ومغذيات بصيلات الشعر' },
    ],
  },
  {
    id: 'body',
    title: 'العناية بالجسم والبشرة',
    englishTitle: 'Skincare & Body Radiance',
    badge: 'إشراقة وترطيب ✨',
    iconName: 'Smile',
    subcategories: [
      { id: 'all', label: 'جميع منتجات البشرة والجسم', desc: 'ترطيب، تفتيح، وحماية يومية' },
      { id: 'sunscreen', label: 'واقي شمس وحماية فائقة SPF50+', desc: 'حماية كاملة من أشعة UVA/UVB' },
      { id: 'face_serum_cream', label: 'سيروم وكريمات نضارة الوجه', desc: 'هيالورونيك، فيتامين C ونياسيناميد' },
      { id: 'body_lotion', label: 'لوشن وزبدة ترطيب الجسم', desc: 'ترطيب ونعومة حريرية' },
      { id: 'body_wash_scrub', label: 'غسول ومقشرات الجسم', desc: 'تنظيف عميق وإزالة الجلد الميت' },
      { id: 'body_mist', label: 'معطرات وميست الجسم الفواحة', desc: 'ثبات يدوم طويلاً بروائح طبيعية' },
    ],
  },
  {
    id: 'bundles',
    title: 'بكجات التوفير والهدايا',
    englishTitle: 'Value Bundles & Gift Sets',
    badge: 'خصم حتى 30% 🎁',
    iconName: 'Gift',
    subcategories: [
      { id: 'all', label: 'جميع البكجات التوفيرية', desc: 'مجموعات مجهزة بأفضل قيمة مقابل سعر' },
      { id: 'mom_baby_bundle', label: 'بكجات الأم والمولود', desc: 'حقيبة استقبال المولود والعناية بالأم' },
      { id: 'hair_routine_bundle', label: 'روتين الشعر المتكامل', desc: 'شامبو + بلسم + سيروم بخصم خاص' },
      { id: 'glow_routine_bundle', label: 'مجموعة النضارة والتفتيح', desc: 'روتين إشراقة البشرة والجسم' },
    ],
  },
];
