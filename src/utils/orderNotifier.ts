import { Order, StoreSettings } from '../types';
import { playOrderAlarmSound, sendBrowserNotification } from './notificationSound';

export interface DispatchResults {
  telegram?: { success: boolean; message?: string };
  webhook?: { success: boolean; message?: string };
  soundPlayed?: boolean;
}

/**
 * Format Order details into an HTML formatted message for Telegram Bot
 */
export function formatOrderTelegramHTML(order: Order): string {
  const itemsText = Array.isArray(order.items) && order.items.length > 0
    ? order.items
        .map(
          (it, idx) =>
            `  ${idx + 1}. <b>${it.product?.nameAr || it.product?.name || 'صنف'}</b> × ${it.quantity} = ${
              (it.product?.price || 0) * (it.quantity || 1)
            } ج`
        )
        .join('\n')
    : '  (لا توجد أصناف)';

  const paymentText =
    order.paymentMethod === 'cod'
      ? '💵 كاش عند الاستلام'
      : order.paymentMethod === 'instapay'
      ? '📱 إنستاباي InstaPay'
      : order.paymentMethod === 'vodafone_cash'
      ? '💳 فودافون كاش'
      : '💳 بطاقة بنكية';

  return `
🚨 <b>طلب جديد في المتجر! #${order.id}</b>
━━━━━━━━━━━━━━━━━
👤 <b>العميل:</b> ${order.customerName || 'غير محدد'}
📱 <b>الهاتف:</b> <a href="tel:${order.phone}">${order.phone}</a>
${order.alternatePhone ? `📱 <b>هاتف بديل:</b> ${order.alternatePhone}\n` : ''}📍 <b>المنطقة:</b> ${order.city || ''} - ${order.zoneName || ''}
🏢 <b>العنوان:</b> ${order.detailedAddress || ''}
${
  order.buildingNumber || order.floorNumber || order.apartmentNumber
    ? `🚪 <b>المبنى:</b> عمارة ${order.buildingNumber || '-'} / دور ${order.floorNumber || '-'} / شقة ${order.apartmentNumber || '-'}\n`
    : ''
}${order.landmark ? `🏷️ <b>علامة مميزة:</b> ${order.landmark}\n` : ''}🚚 <b>موعد التوصيل:</b> ${order.estimatedDelivery || 'خلال ٢٤ ساعة'}
💳 <b>طريقة الدفع:</b> ${paymentText}
━━━━━━━━━━━━━━━━━
🛒 <b>الأصناف المطلوبة:</b>
${itemsText}
━━━━━━━━━━━━━━━━━
💵 <b>المجموع الفرعي:</b> ${order.subtotal || 0} ج
${order.discount ? `🎟️ <b>الخصم (${order.appliedCoupon || ''}):</b> -${order.discount} ج\n` : ''}🚚 <b>الشحن:</b> ${order.deliveryFee === 0 ? 'مجاني 🎉' : `${order.deliveryFee} ج`}
💰 <b>الإجمالي النهائي: <u>${order.total || 0} جنيه</u></b>
${order.notes ? `📝 <b>ملاحظات العميل:</b> ${order.notes}\n` : ''}━━━━━━━━━━━━━━━━━
⏰ <i>${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })}</i>
`.trim();
}

/**
 * Send order notification directly to Telegram Bot using Bot Token & Chat ID / Username
 */
export async function sendOrderToTelegram(
  order: Order,
  botToken?: string,
  chatId?: string
): Promise<{ success: boolean; message?: string }> {
  // If credentials are provided explicitly or fallback
  const token = botToken?.trim();
  const targetChat = chatId?.trim();

  if (!token || !targetChat) {
    return {
      success: false,
      message: 'لم يتم توفير رمز البوت (Bot Token) أو معرف المحادثة (Chat ID)',
    };
  }

  const messageText = formatOrderTelegramHTML(order);
  const cleanPhone = (order.phone || '').replace(/\D/g, '');
  const internationalPhone = cleanPhone.startsWith('0') ? `2${cleanPhone}` : cleanPhone;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: '📞 اتصال بالعميل', url: `tel:${order.phone}` },
        { text: '💬 فتح واتساب العميل', url: `https://wa.me/${internationalPhone}` },
      ],
    ],
  };

  // Try direct Telegram API
  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChat,
        text: messageText,
        parse_mode: 'HTML',
        reply_markup: inlineKeyboard,
        disable_web_page_preview: true,
      }),
    });

    const tgData = (await tgRes.json()) as { ok: boolean; description?: string };
    if (tgData.ok) {
      return { success: true, message: 'تم إرسال إشعار الأوردر إلى تيليجرام بنجاح' };
    } else {
      return { success: false, message: tgData.description || 'Telegram API returned an error' };
    }
  } catch (err: any) {
    console.error('Direct Telegram send error:', err);
    return { success: false, message: err?.message || 'Network error while calling Telegram API' };
  }
}

/**
 * Dispatches automated notifications for newly placed orders across enabled channels:
 * 1. Server & Direct Telegram Bot Notification
 * 2. Custom Webhook / Make / Zapier payload
 * 3. Audio Alert sound & Browser Push Notification
 */
export async function dispatchAutomatedOrder(
  order: Order,
  settings?: StoreSettings
): Promise<DispatchResults> {
  const results: DispatchResults = {};

  // 1. Play audio alarm & Browser Push Notification immediately on the device
  try {
    playOrderAlarmSound();
    results.soundPlayed = true;

    sendBrowserNotification(`🚨 طلب جديد #${order.id} من ${order.customerName}`, {
      body: `الإجمالي: ${order.total} ج • ${order.city || ''} (${order.zoneName || ''}) • ${order.items.length} أصناف`,
      tag: `order-${order.id}`,
    });
  } catch (e) {
    console.error('Local notification trigger failed:', e);
  }

  // 2. Dispatch via Server Endpoint
  try {
    const res = await fetch('/api/notify/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order,
        storeSettings: settings,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.notifiedChannels) {
        if (data.notifiedChannels.telegram) {
          results.telegram = data.notifiedChannels.telegram;
        }
        if (data.notifiedChannels.webhook) {
          results.webhook = data.notifiedChannels.webhook;
        }
      }
    }
  } catch (err) {
    console.warn('Server notify endpoint error:', err);
  }

  // 3. Fallback direct client Telegram dispatch if server did not confirm success
  if (!results.telegram?.success && settings?.telegramBotToken && settings?.telegramChatId) {
    const directRes = await sendOrderToTelegram(
      order,
      settings.telegramBotToken,
      settings.telegramChatId
    );
    results.telegram = directRes;
  }

  return results;
}

/**
 * Formats a Prescription request into clean Telegram HTML
 */
export function formatPrescriptionTelegramHTML(rx: PrescriptionRequest): string {
  const cityArabic = rx.city === 'zayed' ? 'الشيخ زايد' : '٦ أكتوبر';
  return `
🩺 <b>طلب روشتة / استشارة صيدلية جديدة! #${rx.id}</b>
━━━━━━━━━━━━━━━━━
👤 <b>العميل:</b> ${rx.patientName || 'غير محدد'}
📱 <b>الهاتف:</b> <a href="tel:${rx.phone}">${rx.phone}</a>
📍 <b>المنطقة:</b> ${cityArabic} - ${rx.areaName || 'أكتوبر وزايد'}
🖼️ <b>صورة الروشتة/المستحضر:</b> ${rx.image ? '✅ مرفقة مع الطلب' : '❌ لم يتم إرفاق صورة'}
${rx.notes ? `📝 <b>استفسار وملاحظات العميل:</b> ${rx.notes}\n` : ''}━━━━━━━━━━━━━━━━━
✨ <i>تنبيه: تم إرسال رسالة تأكيد للعميل بأن الصيدلي المناوب سيقوم بمتابعة استفساره فوراً.</i>
⏰ <i>${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })}</i>
`.trim();
}

/**
 * Sends a prescription request directly to Telegram Bot
 */
export async function sendPrescriptionToTelegram(
  rx: PrescriptionRequest,
  botToken: string,
  chatId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const text = formatPrescriptionTelegramHTML(rx);
    const cleanPhone = (rx.phone || '').replace(/\D/g, '');
    const internationalPhone = cleanPhone.startsWith('0') ? `2${cleanPhone}` : cleanPhone;

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: '📞 اتصال بالعميل', url: `tel:${rx.phone}` },
          { text: '💬 فتح واتساب العميل', url: `https://wa.me/${internationalPhone}` },
        ],
      ],
    };

    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        reply_markup: inlineKeyboard,
        disable_web_page_preview: true,
      }),
    });

    const tgData = (await tgRes.json()) as { ok: boolean; description?: string };
    if (tgData.ok) {
      return { success: true, message: 'تم إرسال إشعار الروشتة إلى تيليجرام بنجاح' };
    } else {
      return { success: false, message: tgData.description || 'Telegram API returned an error' };
    }
  } catch (err: any) {
    console.error('Direct Telegram prescription send error:', err);
    return { success: false, message: err?.message || 'Network error while calling Telegram API' };
  }
}

/**
 * Dispatches automated notifications for prescription requests
 */
export async function dispatchAutomatedPrescription(
  rx: PrescriptionRequest,
  settings?: StoreSettings
): Promise<DispatchResults> {
  const results: DispatchResults = {};

  try {
    playOrderAlarmSound();
    results.soundPlayed = true;

    sendBrowserNotification(`🩺 طلب روشتة جديد #${rx.id} من ${rx.patientName}`, {
      body: `المنطقة: ${rx.areaName || ''} • الهاتف: ${rx.phone}`,
      tag: `rx-${rx.id}`,
    });
  } catch (e) {
    console.error('Prescription local notification failed:', e);
  }

  // Server dispatch
  try {
    const res = await fetch('/api/notify/prescription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prescription: rx,
        storeSettings: settings,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.notifiedChannels?.telegram) {
        results.telegram = data.notifiedChannels.telegram;
      }
    }
  } catch (err) {
    console.warn('Server prescription notify error:', err);
  }

  // Direct Telegram Fallback
  if (!results.telegram?.success && settings?.telegramBotToken && settings?.telegramChatId) {
    const directRes = await sendPrescriptionToTelegram(
      rx,
      settings.telegramBotToken,
      settings.telegramChatId
    );
    results.telegram = directRes;
  }

  return results;
}

/**
 * Test Telegram Connection
 */
export async function sendTestTelegramMessage(
  botToken: string,
  chatId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/notify/test-telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ botToken, chatId }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, message: data.message };
    }

    // Direct Telegram Client Fallback for test
    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🔔 <b>تجربة إشعارات متجر M&L بنجاح!</b>\n━━━━━━━━━━━━━━━━━\n✓ تم ربط بوت تيليجرام بنجاح مع المتجر.\nستصلك الآن جميع الطلبات الجديدة لحظياً وتلقائياً دون أي تدخل من العميل.`,
        parse_mode: 'HTML',
      }),
    });
    const tgData = await tgRes.json();
    if (tgData.ok) {
      return { success: true, message: '✓ تم إرسال الرسالة التجريبية بنجاح إلى حسابك على تيليجرام!' };
    }
    return { success: false, message: tgData.description || 'فشل إرسال الرسالة عبر تيليجرام' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'تعذر الاتصال بخادم تيليجرام' };
  }
}

/**
 * Test Custom Webhook Connection
 */
export async function sendTestWebhookPing(
  webhookUrl: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/notify/test-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhookUrl }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, message: data.message };
    }
    return { success: false, message: data.error || 'تعذر الوصول إلى رابط Webhook' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'خطأ في الاتصال بالـ Webhook' };
  }
}
