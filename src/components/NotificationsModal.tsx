import React from 'react';
import {
  X,
  Bell,
  BellRing,
  Sparkles,
  Package,
  Trash2,
  CheckCheck,
  ExternalLink,
  ShoppingBag,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { AppNotification, Product } from '../types';
import { requestBrowserNotificationPermission } from '../utils/notificationSound';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectProduct?: (productId: string) => void;
  onOpenOrderTracking?: () => void;
  browserNotificationsEnabled: boolean;
  onToggleBrowserNotifications: (enabled: boolean) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onSelectProduct,
  onOpenOrderTracking,
  browserNotificationsEnabled,
  onToggleBrowserNotifications,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleEnablePush = async () => {
    const granted = await requestBrowserNotificationPermission();
    if (granted) {
      onToggleBrowserNotifications(true);
    } else {
      onToggleBrowserNotifications(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs text-right animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border-2 border-pink-200/90 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2a0818] via-[#48102b] to-[#1a0510] text-white p-4 sm:p-5 flex items-center justify-between border-b border-pink-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-pink-950/40">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg">مركز الإشعارات والتنبيهات</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-black shadow-sm">
                    {unreadCount} جديد
                  </span>
                )}
              </div>
              <p className="text-xs text-pink-200/90 font-medium">
                تنبيهات المنتجات الجديدة، العروض وتحديثات الطلبات
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-pink-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Permission Prompt Banner */}
        <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border-b border-pink-200/80 p-3 sm:px-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-pink-600 shrink-0" />
            <div className="text-xs">
              <span className="font-black text-slate-900 block">
                {browserNotificationsEnabled ? 'إشعارات المتصفح مفعلة ✓' : 'إشعارات المتصفح اللحظية'}
              </span>
              <span className="text-[11px] text-slate-600">
                {browserNotificationsEnabled
                  ? 'ستصلك رسائل فورية عند إضافة أي منتج جديد للمتجر'
                  : 'فعّلي التنبيهات لتصلك رسائل فورية بالمنتجات الحصرية فور إضافتها'}
              </span>
            </div>
          </div>

          {!browserNotificationsEnabled ? (
            <button
              onClick={handleEnablePush}
              className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-black text-xs shrink-0 shadow-sm shadow-pink-600/30 transition-all cursor-pointer"
            >
              تفعيل الإشعارات 🔔
            </button>
          ) : (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-[11px] border border-emerald-300 shrink-0">
              مفعّلة ⚡
            </span>
          )}
        </div>

        {/* Actions Bar */}
        {notifications.length > 0 && (
          <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs">
            <button
              onClick={onMarkAllAsRead}
              className="font-bold text-pink-700 hover:text-pink-900 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>تحديد الكل كمقروء</span>
            </button>

            <button
              onClick={onClearAll}
              className="font-bold text-stone-500 hover:text-rose-600 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح كل الإشعارات</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto border-2 border-pink-200 shadow-inner">
                <Bell className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">لا توجد إشعارات حالياً</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                سيظهر هنا أي إشعار فوري عند قيام الإدارة بإضافة منتجات جديدة أو عند تحديث مسار طلباتك.
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isNewProduct = notif.type === 'new_product';
              const isOrder = notif.type === 'order_status';

              return (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    notif.read
                      ? 'bg-stone-50/70 border-stone-200'
                      : 'bg-white border-pink-300 shadow-sm ring-1 ring-pink-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon or Image */}
                    {notif.image ? (
                      <img
                        src={notif.image}
                        alt={notif.title}
                        className="w-12 h-12 rounded-xl object-cover border border-pink-200 bg-white shrink-0 shadow-2xs"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isNewProduct
                            ? 'bg-pink-100 text-pink-700'
                            : isOrder
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {isNewProduct ? (
                          <Sparkles className="w-5 h-5" />
                        ) : isOrder ? (
                          <Package className="w-5 h-5" />
                        ) : (
                          <Bell className="w-5 h-5" />
                        )}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h4 className="font-black text-xs sm:text-sm text-slate-900 truncate">
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-pink-600 shrink-0" />
                        )}
                      </div>

                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {notif.body}
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-stone-100">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {new Date(notif.timestamp).toLocaleTimeString('ar-EG', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>

                        {isNewProduct && notif.productId && onSelectProduct && (
                          <button
                            onClick={() => {
                              onSelectProduct(notif.productId!);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          >
                            <span>معاينة المنتج</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}

                        {isOrder && onOpenOrderTracking && (
                          <button
                            onClick={() => {
                              onOpenOrderTracking();
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>تتبع الشحنة</span>
                            <Package className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            إشعارات فورية متزامنة عبر السيرفر
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
