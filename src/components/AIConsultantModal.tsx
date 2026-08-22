import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Clock,
  Wand2,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { AIChatMessage, CustomRoutine, DeliveryZone, Product } from '../types';
import { PRODUCTS_DATA } from '../data/products';

interface AIConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedZone: DeliveryZone;
  onAddToCart: (product: Product) => void;
}

export const AIConsultantModal: React.FC<AIConsultantModalProps> = ({
  isOpen,
  onClose,
  selectedZone,
  onAddToCart,
}) => {
  const [activeMode, setActiveMode] = useState<'chat' | 'routineQuiz'>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `أهلاً بكِ في متجر m&l! أنا د. سارة، مستشارتكِ الذكية للعناية بالبشرة والشعر والطفل في ٦ أكتوبر والشيخ زايد. 🌸\n\nكيف يمكنني مساعدتك اليوم؟ يمكنكِ سؤالي عن:
• علاج تساقط الشعر وإنبات الفراغات
• روتين العناية بتموجات الشعر الكيرلي
• ترطيب الجسم وعلاج جلد الإوزة وحماية الشمس
• علاج تسلخات الحفاضات والعناية بحديثي الولادة بأمان تام`,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Routine Quiz State
  const [quizCategory, setQuizCategory] = useState<'baby' | 'hair' | 'body'>('hair');
  const [quizConcern, setQuizConcern] = useState('');
  const [quizAgeOrType, setQuizAgeOrType] = useState('');
  const [generatedRoutine, setGeneratedRoutine] = useState<CustomRoutine | null>(null);
  const [routineLoading, setRoutineLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeMode === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeMode]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text || loading) return;

    const userMsg: AIChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          userProfile: {
            area: selectedZone.name,
          },
        }),
      });

      const data = await res.json();
      const botReply = data.reply || 'يسعدني تقديم الإرشادات لكِ دائماً في متجر m&l. يمكنك تصفح المنتجات وطلب التوصيل السريع لأكتوبر وزايد.';

      const assistantMsg: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: botReply,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'نحن هنا لمساعدتك دائماً في متجر m&l! تفضلي بتصفح منتجاتنا المميزة.',
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoutine = async () => {
    if (!quizConcern) return;
    setRoutineLoading(true);

    try {
      const res = await fetch('/api/advisor/routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: quizCategory,
          concern: quizConcern,
          ageOrType: quizAgeOrType,
          userArea: selectedZone.name,
        }),
      });

      const data = await res.json();
      if (data.routine) {
        setGeneratedRoutine(data.routine);
      } else {
        setGeneratedRoutine({
          title: `روتين مخصص للعناية بـ ${quizCategory === 'baby' ? 'الطفل' : quizCategory === 'hair' ? 'الشعر' : 'البشرة'}`,
          summary: `روتين طبي متكامل لعلاج ${quizConcern} مصمم خصيصاً لكِ.`,
          steps: [
            { stepNumber: 1, name: 'الخطوة الأولى: التنظيف والتجهيز', description: 'استخدام غسول أو شامبو خالي من المواد القاسية.', recommendedTime: 'صباحاً أو عند الاستحمام' },
            { stepNumber: 2, name: 'الخطوة الثانية: العلاج والترطيب العميق', description: 'تطبيق السيروم أو الزيت أو كريم الترطيب المركز.', recommendedTime: 'مساءً قبل النوم' },
            { stepNumber: 3, name: 'الخطوة الثالثة: الحماية اليومية', description: 'حاجز حماية للبشرة أو واقي شمس مناسب لطقس أكتوبر وزايد.', recommendedTime: 'صباحاً' },
          ],
          octoberZayedDeliveryTip: `متوفر توصيل سريع خلال ${selectedZone.estimatedDeliveryTime} إلى ${selectedZone.name}.`,
        });
      }
    } catch (error) {
      console.error('Routine builder error:', error);
    } finally {
      setRoutineLoading(false);
    }
  };

  const quickPrompts = [
    'عايزة علاج سريع لتسلخات الحفاض الشديدة عند البيبي',
    'شعري بيتساقط وخفيف من قدام، أبدأ بإيه؟',
    'أفضل روتين للشعر الكيرلي بدون هيشان',
    'عايزة كريم مرطب وصن بلوك للبشرة الجافة في شمس زايد',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs text-right">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-pink-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-pink-700 via-rose-700 to-pink-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-pink-200 shadow-md">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg">مستشارة العناية والطفل (AI)</h2>
                <span className="bg-pink-400/20 text-pink-200 border border-pink-300/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  د. سارة • متجر m&l
                </span>
              </div>
              <p className="text-xs text-pink-100">
                استشارات فورية وتصميم روتين عناية متكامل ومخصص لاحتياجك
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

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-pink-100 bg-pink-50/40 p-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveMode('chat')}
            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeMode === 'chat'
                ? 'bg-white text-pink-700 shadow-sm border border-pink-200 font-extrabold'
                : 'text-stone-600 hover:text-pink-700 hover:bg-pink-100/50'
            }`}
          >
            <Bot className="w-4 h-4 text-pink-600" />
            <span>محادثة واستشارة مباشرة</span>
          </button>

          <button
            onClick={() => setActiveMode('routineQuiz')}
            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeMode === 'routineQuiz'
                ? 'bg-white text-pink-700 shadow-sm border border-pink-200 font-extrabold'
                : 'text-stone-600 hover:text-pink-700 hover:bg-pink-100/50'
            }`}
          >
            <Wand2 className="w-4 h-4 text-rose-500" />
            <span>صانع الروتين المخصص الذكي</span>
          </button>
        </div>

        {/* MODE 1: CHAT */}
        {activeMode === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0 bg-stone-50/40">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAssistant && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs whitespace-pre-line ${
                        isAssistant
                          ? 'bg-white text-stone-800 border border-pink-100 rounded-tr-none'
                          : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-tl-none font-medium'
                      }`}
                    >
                      {msg.content}
                      <div
                        className={`text-[10px] mt-1.5 font-sans ${
                          isAssistant ? 'text-stone-400 text-left' : 'text-pink-100 text-right'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                    {!isAssistant && (
                      <div className="w-8 h-8 rounded-xl bg-stone-800 text-white flex items-center justify-center text-xs shrink-0 shadow-xs mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-stone-500 bg-white p-3 rounded-2xl border border-pink-100 w-fit">
                  <RefreshCw className="w-4 h-4 text-pink-600 animate-spin" />
                  <span>د. سارة تقوم بتحليل استفسارك وصياغة الروتين الطبي المناسب...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts Bar */}
            <div className="px-4 py-2 bg-pink-50/50 border-t border-pink-100 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
              <span className="text-[11px] font-bold text-pink-800 whitespace-nowrap">
                مقترحات سريعة:
              </span>
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 bg-white hover:bg-pink-100 hover:text-pink-900 border border-pink-200 rounded-lg text-stone-700 whitespace-nowrap text-[11px] transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 bg-white border-t border-pink-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="اكتبي استفسارك عن بشرتك، شعرك، أو طفلك..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-pink-50/30 border border-pink-200 text-xs sm:text-sm focus:ring-2 focus:ring-pink-500 focus:bg-white focus:outline-none text-stone-900"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || loading}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <span>إرسال</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODE 2: ROUTINE QUIZ */}
        {activeMode === 'routineQuiz' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-stone-50/40">
            <div className="space-y-4 bg-white p-5 rounded-2xl border border-pink-100">
              <h3 className="font-extrabold text-sm text-stone-900 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-pink-600" />
                اختاري تخصص الروتين واحتياجك الشخصي:
              </h3>

              {/* Category Picker */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  ١. قسم العناية المستهدف:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'baby', label: 'عناية الطفل والرضيع 👶' },
                    { id: 'hair', label: 'عناية الشعر والتساقط 💇‍♀️' },
                    { id: 'body', label: 'العناية بالجسم والبشرة ✨' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setQuizCategory(c.id as any);
                        setQuizConcern('');
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        quizCategory === c.id
                          ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-600 shadow-xs'
                          : 'bg-pink-50/30 border-stone-200 text-stone-700 hover:bg-pink-50'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Concern Quick Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  ٢. المشكلة أو الهدف الرئيسي:
                </label>
                <div className="flex flex-wrap gap-2">
                  {(quizCategory === 'baby'
                    ? [
                        'التهاب وتسلخات الحفاض',
                        'استحمام بدون دموع وقبعة المهد',
                        'ترطيب بشرة الرضيع الحساسة',
                        'بكج هدية متكامل للمولود الجديد',
                      ]
                    : quizCategory === 'hair'
                    ? [
                        'تساقط شديد وفراغات في مقدمة الرأس',
                        'شعر كيرلي جاف وبه هيشان',
                        'تلف الشعر من الصبغة والمكواة',
                        'إنبات وتكثيف وتطويل الشعر',
                      ]
                    : [
                        'ترطيب عميق وحماية حاجز الجلد',
                        'واقي شمس بدون لمعان دهني',
                        'تفتيح البقع والمسام الواسعة',
                        'تقشير ونعومة الجسم وعلاج جلد الإوزة',
                      ]
                  ).map((concern, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setQuizConcern(concern)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        quizConcern === concern
                          ? 'bg-pink-100 text-pink-900 border-pink-500 font-bold ring-1 ring-pink-500'
                          : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-pink-50 hover:text-pink-900'
                      }`}
                    >
                      {concern}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age / Hair or Skin Type */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ٣. تفاصيل إضافية (نوع البشرة / العمر / الفروة):
                </label>
                <input
                  type="text"
                  value={quizAgeOrType}
                  onChange={(e) => setQuizAgeOrType(e.target.value)}
                  placeholder="مثال: بشرة مختلطة حساسة، أو رضيع عمر 4 أشهر، أو شعر كيرلي..."
                  className="w-full px-3.5 py-2 rounded-xl bg-pink-50/30 border border-pink-200 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateRoutine}
                disabled={!quizConcern || routineLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 transition-all cursor-pointer"
              >
                {routineLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري توليد الروتين الطبي...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-pink-200" />
                    <span>إنشاء الروتين المخصص وترشيح المنتجات</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Routine Results */}
            {generatedRoutine && (
              <div className="bg-white p-5 rounded-2xl border border-pink-200 shadow-md space-y-4 animate-in fade-in">
                <div className="border-b border-pink-100 pb-3">
                  <div className="inline-block bg-pink-100 text-pink-900 text-xs font-bold px-2.5 py-0.5 rounded-md mb-1">
                    روتينك المعتمد من د. سارة ✨
                  </div>
                  <h4 className="font-black text-base text-stone-900">{generatedRoutine.title}</h4>
                  <p className="text-xs text-stone-600 mt-1">{generatedRoutine.summary}</p>
                </div>

                {/* Routine Steps */}
                <div className="space-y-2.5">
                  {generatedRoutine.steps.map((st, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-pink-50/30 border border-pink-100 flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-lg bg-pink-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {st.stepNumber || i + 1}
                      </div>
                      <div className="space-y-0.5 text-xs flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-stone-900">{st.name}</span>
                          <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded font-bold">
                            {st.recommendedTime}
                          </span>
                        </div>
                        <p className="text-stone-600 leading-relaxed">{st.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hyperlocal Delivery Tip */}
                {generatedRoutine.octoberZayedDeliveryTip && (
                  <div className="p-3 rounded-xl bg-pink-50 text-pink-900 text-xs font-semibold flex items-center gap-2 border border-pink-200">
                    <Clock className="w-4 h-4 text-pink-600 shrink-0" />
                    <span>{generatedRoutine.octoberZayedDeliveryTip}</span>
                  </div>
                )}

                {/* Matching Suggested Catalog Products */}
                <div className="pt-2">
                  <h5 className="font-bold text-xs text-stone-900 mb-2">
                    منتجات مطابقة مقترحة متوفرة بالمخزن:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {PRODUCTS_DATA.filter((p) =>
                      quizCategory === 'baby'
                        ? p.category === 'baby' || p.category === 'bundles'
                        : quizCategory === 'hair'
                        ? p.category === 'hair' || p.category === 'bundles'
                        : p.category === 'body' || p.category === 'bundles'
                    )
                      .slice(0, 2)
                      .map((prod) => (
                        <div
                          key={prod.id}
                          className="p-3 rounded-xl border border-pink-100 flex items-center justify-between gap-2 bg-pink-50/20"
                        >
                          <div className="flex items-center gap-2 text-xs">
                            <img
                              src={prod.image}
                              alt={prod.nameAr}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                            <div>
                              <div className="font-bold text-stone-900 line-clamp-1">{prod.nameAr}</div>
                              <div className="text-pink-700 font-extrabold">{prod.price} جنيه</div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              onAddToCart(prod);
                              onClose();
                            }}
                            className="p-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>شراء</span>
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
