"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

import en from "../../../../messages/en.json";
import fr from "../../../../messages/fr.json";
import es from "../../../../messages/es.json";
import de from "../../../../messages/de.json";
import ja from "../../../../messages/ja.json";
import ptBR from "../../../../messages/pt-BR.json";
import ar from "../../../../messages/ar.json";

// Flatten nested JSON to dot-notation keys for i18next
function flattenMessages(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      Object.assign(result, flattenMessages(value as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

const resources = {
  en: { translation: flattenMessages(en) },
  fr: { translation: flattenMessages(fr) },
  es: { translation: flattenMessages(es) },
  de: { translation: flattenMessages(de) },
  ja: { translation: flattenMessages(ja) },
  "pt-BR": { translation: flattenMessages(ptBR) },
  ar: { translation: flattenMessages(ar) },
};

// Initialize i18next
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

const availableLocales = Object.keys(resources);

function ReactI18nextDemo() {
  const { t, i18n: i18nInstance } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentLocale = searchParams.get("locale") || "en";
  const isRTL = currentLocale === "ar";

  useEffect(() => {
    if (i18nInstance.language !== currentLocale) {
      i18nInstance.changeLanguage(currentLocale);
    }
  }, [currentLocale, i18nInstance]);

  const switchLocale = (newLocale: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("locale", newLocale);
    router.push(`/i18n-test/react-i18next?${params.toString()}`);
  };

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Test 1b: react-i18next</h1>
        <Link href="/i18n-test/next-intl" className="text-blue-600 hover:underline text-sm">
          ← Switch to next-intl
        </Link>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded p-3 text-sm">
        <strong>Implementation:</strong> react-i18next (~22KB: i18next 15KB + react-i18next 7KB)
        <br />
        <strong>Current locale:</strong> {currentLocale}
        <br />
        <strong>Direction:</strong> {isRTL ? "RTL" : "LTR"}
        <br />
        <strong>Setup:</strong> i18n.init() + I18nextProvider + resources object + flattenMessages helper
      </div>

      {/* Locale switcher */}
      <div>
        <label className="block text-sm font-medium mb-2">Switch Locale</label>
        <div className="flex flex-wrap gap-2">
          {availableLocales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`px-3 py-1 rounded text-sm border ${
                currentLocale === loc ? "bg-blue-600 text-white border-blue-600" : "border-gray-300"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <section className="border rounded p-4">
        <h2 className="font-semibold mb-2">Navigation (common keys)</h2>
        <div className="flex flex-wrap gap-3">
          {["home", "listings", "giftCards", "favorites", "account", "signIn"].map((key) => (
            <span key={key} className="px-3 py-1 bg-gray-100 rounded text-sm">
              {t(`nav.${key}`)}
            </span>
          ))}
        </div>
      </section>

      {/* Search */}
      <section className="border rounded p-4">
        <h2 className="font-semibold mb-2">Search Page</h2>
        <h3 className="text-lg">{t("search.title")}</h3>
        <p className="text-gray-600">{t("search.subtitle")}</p>
        <div className="mt-3 space-y-2">
          <p>
            <strong>Plural (0):</strong> {t("search.resultsCount", { count: 0 })}
          </p>
          <p>
            <strong>Plural (1):</strong> {t("search.resultsCount", { count: 1 })}
          </p>
          <p>
            <strong>Plural (42):</strong> {t("search.resultsCount", { count: 42 })}
          </p>
          <p>
            <strong>Interpolation:</strong> {t("search.priceRange", { min: "$50", max: "$300" })}
          </p>
        </div>
      </section>

      {/* Listing */}
      <section className="border rounded p-4">
        <h2 className="font-semibold mb-2">Listing Detail</h2>
        <div className="space-y-2">
          <p>{t("listing.from", { price: "$149" })}</p>
          <p>{t("listing.rating", { rating: 4.5 })}</p>
          <p>{t("listing.reviewCount", { count: 1 })}</p>
          <p>{t("listing.reviewCount", { count: 238 })}</p>
          <p>{t("listing.addToFavorites", { name: "Acme Widgets Co" })}</p>
          <p>{t("listing.checkIn", { time: "10:00 AM" })}</p>
        </div>
      </section>

      {/* Cart */}
      <section className="border rounded p-4">
        <h2 className="font-semibold mb-2">Cart & Checkout</h2>
        <div className="space-y-2">
          <p>{t("cart.title")}</p>
          <p>{t("cart.quantity", { count: 3 })}</p>
          <p>{t("checkout.confirmationMessage", { listing: "Acme Widgets", date: "March 15, 2026" })}</p>
          <p>{t("checkout.bookingReference", { ref: "BK-12345" })}</p>
        </div>
      </section>

      {/* DX Notes */}
      <section className="bg-gray-50 rounded p-4 text-sm">
        <h2 className="font-semibold mb-2">Developer Experience Notes</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li><strong>Type safety:</strong> Keys are plain strings — no autocomplete without extra setup (i18next-parser + custom types)</li>
          <li><strong>RSC support:</strong> Requires manual initTranslations() per Server Component — bolted on, not native</li>
          <li><strong>ICU plurals:</strong> Requires i18next-icu plugin (adds FormatJS). Default plural format is different: {`{{count}}`} not ICU</li>
          <li><strong>Setup cost:</strong> i18n.init + resources + I18nextProvider + flattenMessages helper (next-intl uses nested JSON natively)</li>
          <li><strong>Note:</strong> Plurals here use i18next format, NOT ICU format. For ICU, you need the i18next-icu plugin ($BUNDLE_INCREASE)</li>
          <li><strong>RTL:</strong> Same as next-intl — manual dir attribute. No library difference here.</li>
        </ul>
      </section>
    </main>
  );
}

export default function ReactI18nextPage() {
  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div>Loading...</div>}>
        <ReactI18nextDemo />
      </Suspense>
    </I18nextProvider>
  );
}
