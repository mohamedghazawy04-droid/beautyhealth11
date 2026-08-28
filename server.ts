import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Enable CORS for PWA Analyzers and manifest validators
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Explicitly serve public assets with correct MIME types and cache headers
const publicDir = path.join(process.cwd(), 'public');
app.use(express.static(publicDir, {
  setHeaders: (res, filePath) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (filePath.endsWith('manifest.json')) {
      res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    }
  }
}));

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString(), city: '6th of October & Sheikh Zayed' });
});

// Gemini AI Beauty & Baby Care Advisor Chat Endpoint
app.post('/api/advisor/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userProfile } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        reply: 'أهلاً بك في خدمة مستشار العناية لأكتوبر وزايد! نعتذر، خدمة الاستشارة الذكية مؤقتاً في وضع المعاينة. يمكنك تصفح المنتجات وطلب استشارة الصيدلي المباشرة عبر واتساب فوراً.',
      });
    }

    const systemInstruction = `
أنت "د. سارة - مستشارة العناية والطفل الذكية" لمتجر وتطبيق "M&l" المتخصص في توصيل منتجات العناية بالبشرة والشعر ومستلزمات الأطفال والرضع في مدينتي ٦ أكتوبر والشيخ زايد بمصر.
أسلوبك: ودود، احترافي، علمي ومبسط، باللهجة المصرية الراقية والواضحة مع مصطلحات طبية وتجميلية مفهومة.

مهمتك:
1. الإجابة عن استفسارات العناية بالبشرة (جافة، دهنية، مختلطة، حب شباب، تصبغات، واقي شمس، ترطيب الجسم).
2. الإجابة عن مشاكل الشعر (تساقط، هيشان، كيرلي، تلف، قشرة، ترطيب).
3. تقديم نصائح فائقة الدقة والأمان للأمهات حول العناية بالرضع والأطفال (التهاب الحفاضات، قبعة المهد، ترطيب جلد الطفل الحساس، شامبو لا دموع بعد اليوم).
4. ترشيح مكونات وروتينات متوفرة في السوق المصري والصيدليات الأصلية.
5. التذكير دائماً بميزة التوصيل السريع خلال ساعات لنفس اليوم في مناطق وأحياء ٦ أكتوبر (الحصري، المتميز، غرب سوميد، حدائق أكتوبر، التوسعات) والشيخ زايد (بيفرلي هيلز، الخمائل، الكرمة، الربوة، سوديك، المحاور المركزية).
6. إن كان هناك حالة مرضية جلدية حادة، انصح بلطف بزيارة طبيب الجلدية أو الأطفال مع تقديم الإسعافات الروتينية الآمنة.

اجعل إجاباتك منظمة بنقاط واضحة وخطوات روتين صباحي/مسائي عند الحاجة.
    `;

    const formattedHistory = Array.isArray(messages)
      ? messages.map((m: { role: string; content: string }) => `${m.role === 'user' ? 'العميل' : 'المستشارة'}: ${m.content}`).join('\n')
      : '';

    const contextAddition = userProfile
      ? `\nبيانات العميل: نوع البشرة/الشعر: ${userProfile.type || 'غير محدد'}، المنطقة: ${userProfile.area || '٦ أكتوبر / الشيخ زايد'}.`
      : '';

    const prompt = `${formattedHistory}\n${contextAddition}\nيرجى الرد على استفسار العميل بوضوح وعملية:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'يسعدني تقديم المساعدة دائماً. تفضل بأي استفسار حول روتينك أو طفلك.';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Advisor Chat Error:', error);
    return res.status(500).json({
      error: 'حدث خطأ أثناء معالجة الطلب، يرجى المحاولة لاحقاً أو التواصل عبر واتساب.',
      details: error?.message,
    });
  }
});

// Automated Routine Builder Endpoint with Gemini
app.post('/api/advisor/routine', async (req: Request, res: Response) => {
  try {
    const { category, concerns, ageOrType, targetBudget } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        routine: [
          { step: 'الخطوة ١', title: 'تنظيف لطيف', description: 'استخدام غسول مناسب لنوع البشرة أو شامبو أطفال خالي من السلفات' },
          { step: 'الخطوة ٢', title: 'الترطيب العميق', description: 'سيروم أو لوشن مرطب يحافظ على حاجز الجلد' },
          { step: 'الخطوة ٣', title: 'الحماية اليومية', description: 'واقي شمس واسع المدى أو كريم حماية من التسلخات للأطفال' },
        ],
        tips: 'اشرب كمية كافية من الماء وتجنب الماء الساخن المفرط لحماية حاجز البشرة.',
      });
    }

    const prompt = `
قم بإنشاء روتين عناية مخصص باللغة العربية لشخص يبحث عن:
- القسم: ${category} (بشرة / شعر / عناية بالطفل)
- المشكلة أو الاحتياج: ${concerns}
- النوع أو الفئة العمرية: ${ageOrType}
- الميزانية المفضلة: ${targetBudget || 'متوسطة / اقتصادية'}

قم بالرد بصيغة JSON حصراً على النحو التالي:
{
  "title": "عنوان الروتين المقترح",
  "summary": "ملخص الفوائد والنصائح",
  "steps": [
    { "stepNumber": 1, "name": "اسم الخطوة", "description": "الشرح والمكونات الفعالة المناسبة", "recommendedTime": "صباحاً / مساءً" }
  ],
  "octoberZayedDeliveryTip": "نصيحة سريعة مع التذكير بالتوصيل السريع اليومي في أكتوبر وزايد"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Routine Builder Error:', error);
    return res.status(500).json({ error: 'تعذر توليد الروتين حالياً' });
  }
});

// Gemini AI Smart Store Manager Analysis Endpoint
app.post('/api/admin/smart-analysis', async (req: Request, res: Response) => {
  try {
    const { metrics, topProducts, recentOrdersSummary, lowStockProducts } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        executiveSummary: `أداء المتجر ممتاز مع تسجيل ${metrics?.totalOrders || 0} طلب بإجمالي إيرادات ${metrics?.totalRevenue || 0} جنيه. تغطية متوازنة بين أحياء ٦ أكتوبر والشيخ زايد.`,
        topSellingInsight: `الطلب مرتفع على منتجات العناية بالبشرة والطفل، خاصة في مجمعات الشيخ زايد السكنية وحدائق أكتوبر.`,
        inventoryAdvice: `يُنصح بإعادة تزويد الأصناف منخفضة المخزون (${lowStockProducts?.length || 0} أصناف) لضمان التوصيل السريع دون انقطاع.`,
        marketingRecommendations: [
          'إطلاق عرض بكج نهاية الأسبوع لشامبو وغسول الأطفال مع شحن مجاني لأحياء زايد وأكتوبر.',
          'تفعيل كود الخصم (OCTOBER15) لزيادة متوسط سلة المشتريات فوق 500 جنيه.',
          'تقديم عينات مجانية لمنتجات العناية بالشعر مع طلبات المجمعات السكنية الجديدة.'
        ],
        operationalEfficiencyTip: 'تجميع طلبات غرب سوميد والحي المتميز في مسار توصيل صباحي، وطلبات بيفرلي هيلز وسوديك في مسار مسائي لتوفير 35% من وقت المناديب.',
        generatedAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      });
    }

    const prompt = `
أنت مستشار استراتيجي وخبير إدارة متاجر إلكترونية وصيدليات لمتجر "عناية أكتوبر وزايد" في مصر.
إليك بيانات المتجر المباشرة:
- إجمالي الطلبات: ${metrics?.totalOrders || 0}
- إجمالي المبيعات: ${metrics?.totalRevenue || 0} جنيه
- طلبات الشيخ زايد: ${metrics?.zayedOrders || 0}
- طلبات ٦ أكتوبر: ${metrics?.octoberOrders || 0}
- الأصناف التي قارب مخزونها على النفاد: ${JSON.stringify(lowStockProducts || [])}
- ملخص المنتجات الأكثر طلباً: ${JSON.stringify(topProducts || [])}
- ملخص أحدث الطلبات: ${JSON.stringify(recentOrdersSummary || [])}

قم بتحليل هذه الأرقام واكتب تقريراً ذكياً وعملياً وموجزاً لمدير المتجر باللغة العربية.
أجب بصيغة JSON حصراً بهذا الهيكل:
{
  "executiveSummary": "ملخص تنفيذي ذكي ومباشر لأداء المتجر وحجم المبيعات",
  "topSellingInsight": "تحليل للأصناف الأكثر رواجاً واهتمامات عملاء أكتوبر وزايد",
  "inventoryAdvice": "توجيهات محددة لإعادة ملء المخزون ومنع نفاد الأصناف الحيوية",
  "marketingRecommendations": [
    "توصية تسويقية 1 لزيادة المبيعات وكوبونات مقترحة",
    "توصية تسويقية 2",
    "توصية تسويقية 3"
  ],
  "operationalEfficiencyTip": "نصيحة تشغيلية للمناديب ومسارات التوصيل في مدينتي أكتوبر والشيخ زايد",
  "generatedAt": "${new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Admin Smart Analysis Error:', error);
    return res.status(500).json({ error: 'تعذر إجراء التحليل الذكي حالياً' });
  }
});

// Helper: Format Order for Telegram
function formatTelegramOrderHTML(order: any): string {
  const itemsText = Array.isArray(order.items)
    ? order.items
        .map(
          (it: any, idx: number) =>
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

// Automated Multi-Channel Order Notification Dispatch Endpoint
app.post('/api/notify/order', async (req: Request, res: Response) => {
  try {
    const { order, storeSettings } = req.body;
    if (!order) {
      return res.status(400).json({ error: 'Order data is required' });
    }

    const results: { telegram?: { success: boolean; message?: string }; webhook?: { success: boolean; message?: string } } = {};

    // 1. Telegram Dispatch
    const telegramToken = storeSettings?.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = storeSettings?.telegramChatId || process.env.TELEGRAM_CHAT_ID;
    const isTelegramEnabled = storeSettings?.telegramEnabled !== false && telegramToken && telegramChatId;

    if (isTelegramEnabled) {
      try {
        const messageHtml = formatTelegramOrderHTML(order);
        const cleanPhone = (order.phone || '').replace(/\D/g, '');
        const internationalPhone = cleanPhone.startsWith('0') ? `2${cleanPhone}` : cleanPhone;

        const inlineKeyboard = {
          inline_keyboard: [
            [
              { text: '📞 اتصال بالعميل', url: `tel:${order.phone}` },
              { text: '💬 فتح واتساب العميل', url: `https://wa.me/${internationalPhone}` }
            ]
          ]
        };

        const tgRes = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: messageHtml,
            parse_mode: 'HTML',
            reply_markup: inlineKeyboard,
            disable_web_page_preview: true
          }),
        });

        const tgData = (await tgRes.json()) as { ok: boolean; description?: string };
        if (tgData.ok) {
          results.telegram = { success: true, message: 'Telegram notification sent successfully' };
        } else {
          results.telegram = { success: false, message: tgData.description || 'Telegram API returned error' };
        }
      } catch (err: any) {
        console.error('Telegram notification error:', err);
        results.telegram = { success: false, message: err?.message || 'Network error' };
      }
    }

    // 2. Custom Webhook / Zapier / Make / Wasapi Dispatch
    const webhookUrl = storeSettings?.webhookUrl || process.env.ORDER_WEBHOOK_URL;
    const isWebhookEnabled = storeSettings?.webhookEnabled !== false && webhookUrl;

    if (isWebhookEnabled) {
      try {
        const hookRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'order_created',
            timestamp: new Date().toISOString(),
            order,
          }),
        });
        results.webhook = { success: hookRes.ok, message: `Webhook responded with status ${hookRes.status}` };
      } catch (err: any) {
        console.error('Webhook notification error:', err);
        results.webhook = { success: false, message: err?.message || 'Webhook failed' };
      }
    }

    return res.json({
      success: true,
      notifiedChannels: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Order notification controller error:', error);
    return res.status(500).json({ error: 'Failed to process notifications', details: error?.message });
  }
});

// Test Telegram Bot Endpoint
app.post('/api/notify/test-telegram', async (req: Request, res: Response) => {
  try {
    const { botToken, chatId } = req.body;
    if (!botToken || !chatId) {
      return res.status(400).json({ error: 'Bot Token and Chat ID are required' });
    }

    const testMsg = `
🔔 <b>تجربة إشعارات متجر M&L بنجاح!</b>
━━━━━━━━━━━━━━━━━
✓ تم ربط بوت تيليجرام بنجاح مع المتجر.
ستصلك الآن جميع الطلبات الجديدة لحظياً وتلقائياً دون أي تدخل من العميل.
⏰ <i>${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })}</i>
    `.trim();

    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: testMsg,
        parse_mode: 'HTML',
      }),
    });

    const data = (await tgRes.json()) as { ok: boolean; description?: string };
    if (data.ok) {
      return res.json({ success: true, message: 'تم إرسال الرسالة التجريبية بنجاح إلى حسابك على تيليجرام!' });
    } else {
      return res.status(400).json({ success: false, error: data.description || 'فشل إرسال الرسالة، تأكد من التوكن و Chat ID وبدء محادثة مع البوت أولاً' });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'خطأ في الاتصال بسيرفر تيليجرام' });
  }
});

// Test Custom Webhook Endpoint
app.post('/api/notify/test-webhook', async (req: Request, res: Response) => {
  try {
    const { webhookUrl } = req.body;
    if (!webhookUrl) {
      return res.status(400).json({ error: 'Webhook URL is required' });
    }

    const hookRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'test_ping',
        message: 'This is a test notification from M&L Store',
        timestamp: new Date().toISOString(),
      }),
    });

    if (hookRes.ok) {
      return res.json({ success: true, message: `تم الاتصال بنجاح بالـ Webhook (كود الحالة ${hookRes.status})` });
    } else {
      return res.status(400).json({ success: false, error: `الويب هوك استجاب بكود خطأ ${hookRes.status}` });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'تعذر الوصول إلى رابط Webhook' });
  }
});

// Vite middleware & Static Serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
  });
}

start();
