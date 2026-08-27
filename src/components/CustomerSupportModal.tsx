import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  MessageCircle,
  Send,
  Sparkles,
  Clock,
  CheckCircle2,
  Package,
  ShieldCheck,
  HelpCircle,
  Truck,
  FileQuestion,
  RefreshCw,
  UserCheck,
  ChevronRight,
  Headphones
} from 'lucide-react';
import { SupportTicket, SupportMessage, Order } from '../types';

interface CustomerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: SupportTicket[];
  onSendMessage: (ticketId: string, text: string, orderId?: string) => void;
  onCreateTicket: (
    topic: SupportTicket['topic'],
    initialMessage: string,
    customerName: string,
    orderId?: string
  ) => void;
  onMarkTicketReadByCustomer: (ticketId: string) => void;
  myOrders: Order[];
  prefilledOrderId?: string;
  prefilledTopic?: SupportTicket['topic'];
}

export const CustomerSupportModal: React.FC<CustomerSupportModalProps> = ({
  isOpen,
  onClose,
  tickets,
  onSendMessage,
  onCreateTicket,
  onMarkTicketReadByCustomer,
  myOrders,
  prefilledOrderId,
  prefilledTopic,
}) => {
  // Session ID to isolate customer tickets
  const [customerSessionId] = useState<string>(() => {
    let sess = localStorage.getItem('carehub_customer_session_id');
    if (!sess) {
      sess = 'SESS-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      localStorage.setItem('carehub_customer_session_id', sess);
    }
    return sess;
  });

  const [customerDisplayName, setCustomerDisplayName] = useState<string>(() => {
    return localStorage.getItem('carehub_customer_display_name') || 'عميل المتجر';
  });

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState<SupportTicket['topic']>(prefilledTopic || 'general');
  const [newOrderId, setNewOrderId] = useState<string>(prefilledOrderId || '');
  const [newMessageText, setNewMessageText] = useState('');
  const [isCreatingNewTicket, setIsCreatingNewTicket] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter tickets for this customer session or saved IDs
  const myTickets = tickets.filter(
    (t) => t.customerSessionId === customerSessionId || !t.customerSessionId
  );

  // Auto-select latest active ticket or prefilled
  useEffect(() => {
    if (isOpen) {
      if (prefilledOrderId) {
        setNewOrderId(prefilledOrderId);
        setNewTopic('order_inquiry');
      }
      if (myTickets.length > 0 && !selectedTicketId && !isCreatingNewTicket) {
        setSelectedTicketId(myTickets[0].id);
        onMarkTicketReadByCustomer(myTickets[0].id);
      } else if (myTickets.length === 0) {
        setIsCreatingNewTicket(true);
      }
    }
  }, [isOpen, myTickets.length, prefilledOrderId]);

  // Mark active ticket as read by customer
  useEffect(() => {
    if (selectedTicketId && isOpen) {
      onMarkTicketReadByCustomer(selectedTicketId);
    }
  }, [selectedTicketId, isOpen]);

  // Scroll to bottom of message list
  useEffect(() => {
    if (selectedTicketId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTicketId, tickets]);

  if (!isOpen) return null;

  const currentTicket = myTickets.find((t) => t.id === selectedTicketId);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessageText.trim()) return;

    if (isCreatingNewTicket || !currentTicket) {
      onCreateTicket(
        newTopic,
        newMessageText.trim(),
        customerDisplayName.trim() || 'عميل المتجر',
        newOrderId || undefined
      );
      localStorage.setItem('carehub_customer_display_name', customerDisplayName);
      setNewMessageText('');
      setIsCreatingNewTicket(false);
    } else {
      onSendMessage(currentTicket.id, newMessageText.trim(), currentTicket.relatedOrderId);
      setNewMessageText('');
    }
  };

  const getTopicLabel = (topic: SupportTicket['topic']) => {
    switch (topic) {
      case 'order_inquiry':
        return '📦 استفسار عن طلب / أوردر';
      case 'product_question':
        return '💄 استشارة وسؤال عن منتج';
      case 'delivery_time':
        return '🚚 موعد أو عنوان التوصيل';
      case 'prescription_help':
        return '📋 مساعدة في روشتة / وصفة';
      case 'general':
      default:
        return '💬 استفسار عام مع الإدارة';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[90vh] max-h-[700px] flex flex-col shadow-2xl border border-pink-100 overflow-hidden text-right animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-pink-700 via-rose-700 to-pink-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-inner">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>مركز الاستفسارات والدعم المباشر</span>
                <span className="text-[10px] bg-emerald-500/90 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  إدارة المتجر متصلة
                </span>
              </h2>
              <p className="text-xs text-pink-100/90 mt-0.5">
                تواصل داخلي آمن ومباشر مع إدارة المتجر بدون الحاجة لمشاركة أرقام شخصية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white/90 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security & Privacy Banner */}
        <div className="bg-stone-50 px-4 py-2 border-b border-stone-200/80 flex items-center justify-between text-xs text-stone-600 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-pink-600" />
            <span className="font-semibold">محادثة مشفرة وداخلية بينك وبين إدارة متجر m&l</span>
          </div>
          {myTickets.length > 0 && !isCreatingNewTicket && (
            <button
              onClick={() => {
                setIsCreatingNewTicket(true);
                setSelectedTicketId(null);
              }}
              className="text-pink-600 hover:text-pink-800 font-bold flex items-center gap-1 hover:underline text-[11px]"
            >
              <span>+ بدء استفسار جديد</span>
            </button>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left / Secondary: Previous Tickets List (if multiple exist) */}
          {myTickets.length > 1 && !isCreatingNewTicket && (
            <div className="w-full md:w-56 border-b md:border-b-0 md:border-l border-stone-200 bg-stone-50/70 p-2 overflow-y-auto shrink-0 max-h-36 md:max-h-full">
              <div className="text-[11px] font-bold text-stone-500 mb-1.5 px-2">محادثاتك السابقة:</div>
              <div className="space-y-1">
                {myTickets.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTicketId(t.id);
                      setIsCreatingNewTicket(false);
                    }}
                    className={`w-full text-right p-2 rounded-xl text-xs transition-all flex flex-col gap-0.5 ${
                      selectedTicketId === t.id
                        ? 'bg-white shadow-xs border border-pink-200 font-bold text-pink-700 ring-1 ring-pink-500/20'
                        : 'hover:bg-white/80 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{getTopicLabel(t.topic)}</span>
                      {t.unreadByCustomer && (
                        <span className="w-2 h-2 rounded-full bg-pink-600 shrink-0" />
                      )}
                    </div>
                    <div className="text-[10px] text-stone-400 font-normal">
                      {new Date(t.lastUpdatedAt).toLocaleDateString('ar-EG', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages or New Ticket Form */}
          <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
            {isCreatingNewTicket || !currentTicket ? (
              /* Create New Inquiry Screen */
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
                <div className="bg-pink-50/70 border border-pink-200/70 p-4 rounded-2xl">
                  <h3 className="text-sm font-bold text-pink-900 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-4 h-4 text-pink-600" />
                    <span>ابدأ محادثة أو استفسار جديد مع إدارة المتجر</span>
                  </h3>
                  <p className="text-xs text-stone-600">
                    اكتب سؤالك وسيقوم فريق خدمة عملاء m&l بالرد عليك مباشرة داخل هذا القسم.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      اسمك المستعار أو المفضل للرد:
                    </label>
                    <input
                      type="text"
                      value={customerDisplayName}
                      onChange={(e) => setCustomerDisplayName(e.target.value)}
                      placeholder="مثال: سارة، أحمد..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-pink-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      نوع وموضوع الاستفسار:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { id: 'order_inquiry', label: '📦 استفسار عن طلب / أوردر', icon: Package },
                        { id: 'delivery_time', label: '🚚 موعد أو عنوان التوصيل', icon: Truck },
                        { id: 'product_question', label: '💄 استشارة عن منتج أو روتين', icon: Sparkles },
                        { id: 'prescription_help', label: '📋 استفسار عن روشتة', icon: HelpCircle },
                        { id: 'general', label: '💬 استفسار عام آخر', icon: MessageCircle },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setNewTopic(item.id as any)}
                          className={`p-2.5 rounded-xl border text-xs text-right flex items-center gap-2 transition-all ${
                            newTopic === item.id
                              ? 'border-pink-600 bg-pink-50/50 text-pink-950 font-bold ring-2 ring-pink-500/20 shadow-xs'
                              : 'border-stone-200 bg-stone-50/50 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          <item.icon className={`w-4 h-4 ${newTopic === item.id ? 'text-pink-600' : 'text-stone-400'}`} />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {(newTopic === 'order_inquiry' || newTopic === 'delivery_time') && (
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        رقم الطلب (اختياري للربط السريع):
                      </label>
                      {myOrders.length > 0 ? (
                        <select
                          value={newOrderId}
                          onChange={(e) => setNewOrderId(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-pink-500 focus:outline-none"
                        >
                          <option value="">بدون رقم طلب محدد</option>
                          {myOrders.map((ord) => (
                            <option key={ord.id} value={ord.id}>
                              #{ord.id} - {ord.zoneName} ({ord.total} ج)
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={newOrderId}
                          onChange={(e) => setNewOrderId(e.target.value)}
                          placeholder="مثال: ORD-123456"
                          className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-pink-500 focus:outline-none font-mono"
                        />
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      اكتب استفسارك بالتفصيل:
                    </label>
                    <textarea
                      rows={3}
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      placeholder="اكتب رسالتك وسؤالك هنا لإدارة المتجر..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-pink-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      disabled={!newMessageText.trim()}
                      onClick={() => handleSend()}
                      className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>إرسال الاستفسار لإدارة المتجر</span>
                    </button>
                    {myTickets.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingNewTicket(false);
                          setSelectedTicketId(myTickets[0].id);
                        }}
                        className="px-3 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-bold"
                      >
                        إلغاء
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Active Chat Messages Screen */
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Active Ticket Subheader */}
                <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-stone-800">{getTopicLabel(currentTicket.topic)}</span>
                    {currentTicket.relatedOrderId && (
                      <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold">
                        أوردر #{currentTicket.relatedOrderId}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      currentTicket.status === 'answered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : currentTicket.status === 'closed'
                        ? 'bg-stone-200 text-stone-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {currentTicket.status === 'answered'
                      ? 'تم الرد من الإدارة ✅'
                      : currentTicket.status === 'closed'
                      ? 'مغلق'
                      : 'قيد المتابعة من الإدارة ⏳'}
                  </span>
                </div>

                {/* Messages Bubble List */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/30">
                  {/* System Welcome Message */}
                  <div className="flex justify-center">
                    <div className="bg-pink-50 border border-pink-200/80 rounded-2xl p-3 max-w-md text-center text-xs text-pink-900 space-y-1">
                      <div className="font-bold flex items-center justify-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-pink-600" />
                        <span>مرحباً بك! فريق إدارة m&l يتلقى استفساراتك مباشرة</span>
                      </div>
                      <p className="text-[11px] text-pink-800/80">
                        لا داعي لفتح تطبيقات خارجية. سيظهر رد الإدارة هنا فور إرساله.
                      </p>
                    </div>
                  </div>

                  {/* Message Bubbles */}
                  {currentTicket.messages.map((msg) => {
                    const isCustomer = msg.sender === 'customer';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-stone-400">
                          <span>{isCustomer ? customerDisplayName : 'إدارة متجر m&l (الدعم)'}</span>
                          <span>•</span>
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString('ar-EG', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                            isCustomer
                              ? 'bg-pink-600 text-white rounded-br-none shadow-xs'
                              : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none shadow-xs'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Inquiries Suggestions */}
                <div className="px-3 py-1.5 bg-stone-50 border-t border-stone-200/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px] text-stone-600 shrink-0">
                  <span className="text-stone-400 shrink-0 font-bold">اقتراحات سريعة:</span>
                  {[
                    'ما هي حالة تجهيز طلبي؟',
                    'هل المنتج أصلي ومضمون؟',
                    'أرغب في تعديل موعد التوصيل',
                    'شكراً جزيلاً لكم',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewMessageText(preset)}
                      className="px-2.5 py-1 rounded-full bg-white border border-stone-200 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 whitespace-nowrap transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Send Message Input Box */}
                <form
                  onSubmit={handleSend}
                  className="p-3 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0"
                >
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="اكتب رسالتك لإدارة المتجر..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-pink-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!newMessageText.trim()}
                    className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white p-2 sm:px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">إرسال</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
