export type Language = "en" | "es" | "fr" | "de" | "zh" | "ja" | "pt" | "ar";

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  flag: string;
}

export const languages: Record<Language, LanguageConfig> = {
  en: { code: "en", name: "English", nativeName: "English", direction: "ltr", flag: "us" },
  es: { code: "es", name: "Spanish", nativeName: "Español", direction: "ltr", flag: "es" },
  fr: { code: "fr", name: "French", nativeName: "Français", direction: "ltr", flag: "fr" },
  de: { code: "de", name: "German", nativeName: "Deutsch", direction: "ltr", flag: "de" },
  zh: { code: "zh", name: "Chinese", nativeName: "中文", direction: "ltr", flag: "cn" },
  ja: { code: "ja", name: "Japanese", nativeName: "日本語", direction: "ltr", flag: "jp" },
  pt: { code: "pt", name: "Portuguese", nativeName: "Português", direction: "ltr", flag: "br" },
  ar: { code: "ar", name: "Arabic", nativeName: "العربية", direction: "rtl", flag: "sa" },
};

type TranslationKey = 
  | "common.calculate"
  | "common.result"
  | "common.clear"
  | "common.copy"
  | "common.share"
  | "common.print"
  | "common.history"
  | "common.embed"
  | "common.formula"
  | "common.steps"
  | "common.howToUse"
  | "common.tips"
  | "common.relatedCalculators"
  | "common.faq"
  | "nav.home"
  | "nav.categories"
  | "nav.about"
  | "nav.contact"
  | "nav.topics"
  | "categories.math"
  | "categories.health"
  | "categories.finance"
  | "categories.conversion"
  | "categories.time"
  | "categories.education"
  | "error.invalidInput"
  | "error.required";

type Translations = Record<TranslationKey, string>;

const translations: Record<Language, Translations> = {
  en: {
    "common.calculate": "Calculate",
    "common.result": "Result",
    "common.clear": "Clear",
    "common.copy": "Copy",
    "common.share": "Share",
    "common.print": "Print",
    "common.history": "History",
    "common.embed": "Embed",
    "common.formula": "Formula",
    "common.steps": "Step-by-Step Solution",
    "common.howToUse": "How to Use",
    "common.tips": "Tips & Examples",
    "common.relatedCalculators": "Related Calculators",
    "common.faq": "Frequently Asked Questions",
    "nav.home": "Home",
    "nav.categories": "Categories",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.topics": "Topics",
    "categories.math": "Math",
    "categories.health": "Health",
    "categories.finance": "Finance",
    "categories.conversion": "Conversion",
    "categories.time": "Time",
    "categories.education": "Education",
    "error.invalidInput": "Please enter a valid value",
    "error.required": "This field is required",
  },
  es: {
    "common.calculate": "Calcular",
    "common.result": "Resultado",
    "common.clear": "Limpiar",
    "common.copy": "Copiar",
    "common.share": "Compartir",
    "common.print": "Imprimir",
    "common.history": "Historial",
    "common.embed": "Insertar",
    "common.formula": "Fórmula",
    "common.steps": "Solución Paso a Paso",
    "common.howToUse": "Cómo Usar",
    "common.tips": "Consejos y Ejemplos",
    "common.relatedCalculators": "Calculadoras Relacionadas",
    "common.faq": "Preguntas Frecuentes",
    "nav.home": "Inicio",
    "nav.categories": "Categorías",
    "nav.about": "Acerca de",
    "nav.contact": "Contacto",
    "nav.topics": "Temas",
    "categories.math": "Matemáticas",
    "categories.health": "Salud",
    "categories.finance": "Finanzas",
    "categories.conversion": "Conversión",
    "categories.time": "Tiempo",
    "categories.education": "Educación",
    "error.invalidInput": "Por favor ingrese un valor válido",
    "error.required": "Este campo es obligatorio",
  },
  fr: {
    "common.calculate": "Calculer",
    "common.result": "Résultat",
    "common.clear": "Effacer",
    "common.copy": "Copier",
    "common.share": "Partager",
    "common.print": "Imprimer",
    "common.history": "Historique",
    "common.embed": "Intégrer",
    "common.formula": "Formule",
    "common.steps": "Solution Étape par Étape",
    "common.howToUse": "Comment Utiliser",
    "common.tips": "Conseils et Exemples",
    "common.relatedCalculators": "Calculatrices Associées",
    "common.faq": "Foire Aux Questions",
    "nav.home": "Accueil",
    "nav.categories": "Catégories",
    "nav.about": "À Propos",
    "nav.contact": "Contact",
    "nav.topics": "Sujets",
    "categories.math": "Mathématiques",
    "categories.health": "Santé",
    "categories.finance": "Finance",
    "categories.conversion": "Conversion",
    "categories.time": "Temps",
    "categories.education": "Éducation",
    "error.invalidInput": "Veuillez entrer une valeur valide",
    "error.required": "Ce champ est obligatoire",
  },
  de: {
    "common.calculate": "Berechnen",
    "common.result": "Ergebnis",
    "common.clear": "Löschen",
    "common.copy": "Kopieren",
    "common.share": "Teilen",
    "common.print": "Drucken",
    "common.history": "Verlauf",
    "common.embed": "Einbetten",
    "common.formula": "Formel",
    "common.steps": "Schritt-für-Schritt-Lösung",
    "common.howToUse": "Anleitung",
    "common.tips": "Tipps und Beispiele",
    "common.relatedCalculators": "Verwandte Rechner",
    "common.faq": "Häufig Gestellte Fragen",
    "nav.home": "Startseite",
    "nav.categories": "Kategorien",
    "nav.about": "Über Uns",
    "nav.contact": "Kontakt",
    "nav.topics": "Themen",
    "categories.math": "Mathematik",
    "categories.health": "Gesundheit",
    "categories.finance": "Finanzen",
    "categories.conversion": "Umrechnung",
    "categories.time": "Zeit",
    "categories.education": "Bildung",
    "error.invalidInput": "Bitte geben Sie einen gültigen Wert ein",
    "error.required": "Dieses Feld ist erforderlich",
  },
  zh: {
    "common.calculate": "计算",
    "common.result": "结果",
    "common.clear": "清除",
    "common.copy": "复制",
    "common.share": "分享",
    "common.print": "打印",
    "common.history": "历史记录",
    "common.embed": "嵌入",
    "common.formula": "公式",
    "common.steps": "分步解答",
    "common.howToUse": "使用说明",
    "common.tips": "提示与示例",
    "common.relatedCalculators": "相关计算器",
    "common.faq": "常见问题",
    "nav.home": "首页",
    "nav.categories": "分类",
    "nav.about": "关于",
    "nav.contact": "联系我们",
    "nav.topics": "主题",
    "categories.math": "数学",
    "categories.health": "健康",
    "categories.finance": "金融",
    "categories.conversion": "转换",
    "categories.time": "时间",
    "categories.education": "教育",
    "error.invalidInput": "请输入有效值",
    "error.required": "此字段为必填项",
  },
  ja: {
    "common.calculate": "計算",
    "common.result": "結果",
    "common.clear": "クリア",
    "common.copy": "コピー",
    "common.share": "共有",
    "common.print": "印刷",
    "common.history": "履歴",
    "common.embed": "埋め込み",
    "common.formula": "公式",
    "common.steps": "ステップバイステップ解答",
    "common.howToUse": "使い方",
    "common.tips": "ヒントと例",
    "common.relatedCalculators": "関連する計算機",
    "common.faq": "よくある質問",
    "nav.home": "ホーム",
    "nav.categories": "カテゴリ",
    "nav.about": "概要",
    "nav.contact": "お問い合わせ",
    "nav.topics": "トピック",
    "categories.math": "数学",
    "categories.health": "健康",
    "categories.finance": "金融",
    "categories.conversion": "変換",
    "categories.time": "時間",
    "categories.education": "教育",
    "error.invalidInput": "有効な値を入力してください",
    "error.required": "この項目は必須です",
  },
  pt: {
    "common.calculate": "Calcular",
    "common.result": "Resultado",
    "common.clear": "Limpar",
    "common.copy": "Copiar",
    "common.share": "Compartilhar",
    "common.print": "Imprimir",
    "common.history": "Histórico",
    "common.embed": "Incorporar",
    "common.formula": "Fórmula",
    "common.steps": "Solução Passo a Passo",
    "common.howToUse": "Como Usar",
    "common.tips": "Dicas e Exemplos",
    "common.relatedCalculators": "Calculadoras Relacionadas",
    "common.faq": "Perguntas Frequentes",
    "nav.home": "Início",
    "nav.categories": "Categorias",
    "nav.about": "Sobre",
    "nav.contact": "Contato",
    "nav.topics": "Tópicos",
    "categories.math": "Matemática",
    "categories.health": "Saúde",
    "categories.finance": "Finanças",
    "categories.conversion": "Conversão",
    "categories.time": "Tempo",
    "categories.education": "Educação",
    "error.invalidInput": "Por favor, insira um valor válido",
    "error.required": "Este campo é obrigatório",
  },
  ar: {
    "common.calculate": "حساب",
    "common.result": "النتيجة",
    "common.clear": "مسح",
    "common.copy": "نسخ",
    "common.share": "مشاركة",
    "common.print": "طباعة",
    "common.history": "السجل",
    "common.embed": "تضمين",
    "common.formula": "الصيغة",
    "common.steps": "الحل خطوة بخطوة",
    "common.howToUse": "كيفية الاستخدام",
    "common.tips": "نصائح وأمثلة",
    "common.relatedCalculators": "آلات حاسبة ذات صلة",
    "common.faq": "الأسئلة الشائعة",
    "nav.home": "الرئيسية",
    "nav.categories": "الفئات",
    "nav.about": "حول",
    "nav.contact": "اتصل بنا",
    "nav.topics": "المواضيع",
    "categories.math": "الرياضيات",
    "categories.health": "الصحة",
    "categories.finance": "المالية",
    "categories.conversion": "التحويل",
    "categories.time": "الوقت",
    "categories.education": "التعليم",
    "error.invalidInput": "الرجاء إدخال قيمة صالحة",
    "error.required": "هذا الحقل مطلوب",
  },
};

const DEFAULT_LANGUAGE: Language = "en";

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = localStorage.getItem("calc-universe-language");
  if (stored && stored in languages) {
    return stored as Language;
  }
  const browserLang = navigator.language.split("-")[0] as Language;
  if (browserLang in languages) {
    return browserLang;
  }
  return DEFAULT_LANGUAGE;
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("calc-universe-language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = languages[lang].direction;
  }
}

export function t(key: TranslationKey, lang?: Language): string {
  const currentLang = lang || getStoredLanguage();
  return translations[currentLang]?.[key] || translations[DEFAULT_LANGUAGE][key] || key;
}

export function formatNumber(num: number, lang?: Language): string {
  const currentLang = lang || getStoredLanguage();
  const locale = currentLang === "zh" ? "zh-CN" : currentLang === "ja" ? "ja-JP" : currentLang;
  return new Intl.NumberFormat(locale).format(num);
}

export function formatCurrency(amount: number, currency = "USD", lang?: Language): string {
  const currentLang = lang || getStoredLanguage();
  const locale = currentLang === "zh" ? "zh-CN" : currentLang === "ja" ? "ja-JP" : currentLang;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: Date, lang?: Language): string {
  const currentLang = lang || getStoredLanguage();
  const locale = currentLang === "zh" ? "zh-CN" : currentLang === "ja" ? "ja-JP" : currentLang;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function getSupportedLanguages(): LanguageConfig[] {
  return Object.values(languages);
}
