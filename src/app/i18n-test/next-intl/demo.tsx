"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export function NextIntlDemo({
  currentLocale,
  availableLocales,
}: {
  currentLocale: string;
  availableLocales: string[];
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const switchLocale = (newLocale: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("locale", newLocale);
    router.push(`/i18n-test/next-intl?${params.toString()}`);
  };

  const isRTL = locale === "ar";

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Test 1a: next-intl</h1>
        <Link href="/i18n-test/react-i18next" className="text-blue-600 hover:underline text-sm">
          Switch to react-i18next →
        </Link>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded p-3 text-sm">
        <strong>Implementation:</strong> next-intl (~4KB with precompile)
        <br />
        <strong>Current locale:</strong> {currentLocale}
        <br />
        <strong>Direction:</strong> {isRTL ? "RTL" : "LTR"}
        <br />
        <strong>Setup:</strong> NextIntlClientProvider wraps the page, messages loaded server-side
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
          <li><strong>Type safety:</strong> Translation keys are typed via the Messages interface</li>
          <li><strong>RSC support:</strong> useTranslations works in Server Components (not shown here — this is client for comparison parity)</li>
          <li><strong>ICU plurals:</strong> Full support including Arabic 6-form plurals</li>
          <li><strong>Setup cost:</strong> NextIntlClientProvider + messages loading + middleware (in production)</li>
          <li><strong>RTL:</strong> Switch to &quot;ar&quot; locale to see RTL layout</li>
        </ul>
      </section>
    </main>
  );
}
