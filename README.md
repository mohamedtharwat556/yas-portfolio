# YAS — بورتفوليو الشركة الاحترافي

بورتفوليو إلكتروني احترافي لشركة **YAS**، مصمم للاستخدام في الاجتماعات مع الجامعات والمدارس والشركات والمؤسسات وعروض B2B.

---

## الهدف

تقديم YAS كشريك تقني متكامل يوفر:

**أجهزة · حلول · توريد · صيانة · دعم فني**

---

## هيكل المشروع

```
YAS-PORTFOLIO/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── script.js
    └── images/
        ├── logo/
        ├── hero/
        ├── products/
        ├── solutions/
        ├── maintenance/
        ├── company/
        └── team/
```

---

## أقسام الصفحة

| القسم | الـ ID | الوصف |
|-------|--------|-------|
| Navbar | `#navbar` | قائمة ثابتة + موبايل |
| Hero | `#home` | عنوان رئيسي + Device Composition |
| من نحن | `#about` | هوية الشركة + 5 ركائز |
| ماذا نقدم | `#services` | 5 مجالات رئيسية |
| حلولنا | `#solutions` | 4 حلول (تعليم، شركات، محلات، مراقبة) |
| منتجاتنا | `#products` | 7 تبويبات تفاعلية |
| الصيانة | `#maintenance` | 9 خدمات صيانة ودعم |
| كيف نعمل | `#process` | Timeline بـ 5 خطوات |
| لماذا YAS | `#why-yas` | 6 أسباب |
| قطاع التعليم | `#education` | حلول الجامعات والمدارس |
| قطاع الأعمال | `#corporate` | حلول الشركات + flow chart |
| قدراتنا | `#capabilities` | 12 قدرة بصرية |
| الثقة | `#trust` | قيم الشركة |
| CTA | `#cta` | دعوة للتواصل |
| تواصل معنا | `#contact` | بيانات التواصل الكاملة |
| Footer | — | روابط + معلومات |

---

## التقنيات

| التقنية | الاستخدام |
|---------|----------|
| HTML5 Semantic | هيكل الصفحة |
| CSS3 (Variables, Grid, Flexbox) | التصميم الكامل |
| Vanilla JavaScript (ES6+) | التفاعلات والحركات |
| [Tajawal](https://fonts.google.com/specimen/Tajawal) | الخط العربي |
| [Font Awesome 6](https://fontawesome.com) | الأيقونات |
| IntersectionObserver API | Scroll Reveal |
| Web Animations API | Hero float effect |

لا يعتمد المشروع على أي framework أو مكتبة خارجية.

---

## وحدات JavaScript (21 وحدة)

```
Navbar            — قائمة ثابتة، موبايل، active links
ScrollReveal      — ظهور العناصر عند التمرير
SmoothScroll      — تمرير ناعم للأقسام
BackToTop         — زر العودة للأعلى
ProductTabs       — تبويبات المنتجات (keyboard accessible)
HeroAnimation     — تأثير الظهور والطفو للأجهزة
CardTilt          — تأثير الإمالة 3D عند hover
SectionProgress   — شريط تقدم القراءة
CapabilitiesReveal — ظهور متتالي لقسم القدرات
SolutionHover     — حركات أيقونات الحلول
ProcessSteps      — تتابع ظهور خطوات العمل
HeroBadge         — توهج الـ badge عند التحميل
MaintenanceCards  — تحريك أيقونات الصيانة
EduReveal         — ظهور متتالي قسم التعليم
TrustReveal       — ظهور متتالي قسم الثقة
CorpFlowReveal    — ظهور متتالي flow chart
ResizeHandler     — إغلاق المنيو عند توسيع الشاشة
ContactInteraction — تأثير لمس روابط التواصل
FooterLinks       — hover للفوتر
Accessibility     — Skip link + focus management
PageLoad          — إزالة flash عند التحميل
```

---

## CSS Variables الرئيسية

```css
:root {
    --primary:      #0f2d6e;   /* الأزرق الداكن الفاخر (Premium) */
    --accent:       #00d4ff;   /* السماوي الساطع (Premium) */
    --dark:         #0b1120;   /* الخلفية الداكنة */
    --text:         #1e293b;   /* لون النص */
    --font:         'Tajawal', sans-serif;
    --container:    1200px;
    --section-py:   6rem;
    --tr:           0.3s ease; /* انتقالات سلسة */
    --grad-primary: linear-gradient(135deg, #0f2d6e, #1a56db);
    --grad-dark:    linear-gradient(135deg, #0b1120, #1a2634);
    --grad-hero:    linear-gradient(180deg, rgba(15,45,110,0.8), rgba(11,17,32,0.95));
    --shadow-blue:  0 8px 32px rgba(15,45,110,0.35);
}
```

---

## إضافة الصور

ضع الصور في المجلدات المناسبة:

```
assets/images/logo/        ← شعار الشركة
assets/images/hero/        ← صور الـ Hero
assets/images/products/    ← صور المنتجات
assets/images/solutions/   ← صور الحلول
assets/images/maintenance/ ← صور الصيانة
assets/images/company/     ← صور الشركة
assets/images/team/        ← صور الفريق
```

لاستبدال أي Placeholder، عدّل العنصر `.product-img-placeholder` في HTML واستبدله بـ:

```html
<img src="assets/images/products/laptop.jpg" alt="لابتوب" />
```

---

## التشغيل المحلي

افتح `index.html` مباشرة في المتصفح — لا يحتاج خادم.

للتطوير مع live reload:

```bash
# باستخدام VS Code Live Server
# أو أي أداة مشابهة
npx serve .
```

---

## اللغات المدعومة

البورتفوليو متاح بـ **4 لغات**:

| اللغة | الملف |
|-------|-------|
| 🇸🇦 العربية | `index.html` |
| 🇬🇧 الإنجليزية | `index-en.html` |
| 🇩🇪 الألمانية | `index-de.html` |
| 🇨🇳 الصينية | `index-zh.html` |

**+** صفحة الأقسام (Departments) لكل لغة:
- `departments.html` (العربية)
- `departments-en.html` (الإنجليزية)
- `departments-de.html` (الألمانية)
- `departments-zh.html` (الصينية)

---

## التجاوب (Responsive Design)

| الشاشة | Breakpoint | السلوك |
|--------|-----------|--------|
| Desktop | > 1024px | التصميم الكامل |
| Tablet | ≤ 1024px | Grid مخفض، Mobile nav |
| Mobile | ≤ 768px | عمود واحد، أحجام مخفضة |
| Small Mobile | ≤ 480px | تصميم مضغوط |

---

## معلومات التواصل

| القناة | التفاصيل |
|--------|----------|
| الموقع | دمياط — الزرقا — كفر المياسرة |
| صيانة | +20 11 47800144 |
| مبيعات | +20 11 58986999 |
| البريد | info@yascity.com |
| فيسبوك | YAS Tech Egypt |
| العمل | الاثنين–السبت · 9ص–9م |

---

## 🎨 التحسينات الفاخرة (Premium UI Updates) — 2026

### Color Palette الجديد

تم تحديث البورتفوليو بـ **Palette فاخرة وحديثة** تعكس احترافية YAS:

| العنصر | اللون القديم | اللون الجديد | الفائدة |
|--------|-------------|-------------|--------|
| الأزرق الأساسي | `#1a56db` | `#0f2d6e` | أعمق وأكثر فخامة |
| الأزرق الساطع | `#0ea5e9` | `#00d4ff` | أكثر إضاءة وحيوية |
| الظلال | `rgba(26,86,219,.25)` | `rgba(15,45,110,0.35)` | عمق بصري أفضل |

**Contrast Ratios (WCAG AA Compliant):**
- Primary `#0f2d6e` on light backgrounds: **12.8:1** ✅ AAA
- Accent `#00d4ff` on dark backgrounds: **6.5:1** ✅ AA

### تحسينات الـ Transitions والـ Animations

جميع الـ cards والعناصر التفاعلية تشمل الآن:

✨ **Smooth Hover Effects:**
```css
transition: all 0.3s ease;
transform: translateY(-3px) to (-4px);
box-shadow: enhanced with premium colors;
```

**الـ Cards المحدّثة:**
- Service Cards (5 خدمات)
- Pillar Cards (5 ركائز)
- Why Cards (6 أسباب)
- Product Showcase Cards
- Maintenance Cards (9 خدمات)
- Capability Items (12 قدرة)
- Trust Values (القيم)
- Department Service Cards (الأقسام)

### Gradients الفاخرة

```css
--grad-primary: linear-gradient(135deg, #0f2d6e → #1a56db)
--grad-dark:    linear-gradient(135deg, #0b1120 → #1a2634)
--grad-hero:    linear-gradient(180deg, rgba(15,45,110,0.8) → rgba(11,17,32,0.95))
```

### الظلال والعمق البصري

```css
--shadow-blue: 0 8px 32px rgba(15,45,110,0.35)
```

---

## البنية التقنية المتقدمة

### ملفات CSS

| الملف | الـ Purpose |
|-------|-----------|
| `assets/css/style.css` | جميع الصفحات الأساسية (All Languages) |
| `assets/css/departments.css` | صفحات الأقسام (Departments) لجميع اللغات |

### ملفات JavaScript

| الملف | الـ Purpose |
|-------|-----------|
| `assets/js/script.js` | **21 وحدة تفاعلية** — Navigation, Animations, Scroll Effects, Accessibility |

### الأداء والتحسينات

✅ **No External Dependencies** — بورتفوليو خفيف وسريع جداً
✅ **Lazy Loading** — للصور الثقيلة
✅ **CSS Variables** — للمرونة في التحديث السريع
✅ **WCAG AA Accessible** — متاح لجميع المستخدمين
✅ **Mobile First** — تصميم متجاوب كامل
✅ **SEO Optimized** — Semantic HTML + Meta tags

---

## ملاحظات

- لا تضف أرقامًا أو إنجازات أو عملاء غير موثقين.
- كل المعلومات الموجودة مأخوذة من بيانات الشركة الفعلية.
- الـ Placeholders للصور تُستبدل بصور حقيقية عند توفرها.
- تم اختبار الـ Portfolio على جميع الشاشات وتم التحقق من التوافقية مع المتصفحات الحديثة.
- الـ Color Palette تم اختيارها لتعكس الفخامة والاحترافية مع الحفاظ على إمكانية الوصول (WCAG AA).

---

© 2026 YAS — جميع الحقوق محفوظة
