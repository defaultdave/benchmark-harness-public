"use client";

import { NextIntlClientProvider } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import en from "../../../../messages/en.json";
import fr from "../../../../messages/fr.json";
import es from "../../../../messages/es.json";
import de from "../../../../messages/de.json";
import ja from "../../../../messages/ja.json";
import ptBR from "../../../../messages/pt-BR.json";
import ar from "../../../../messages/ar.json";
import { NextIntlDemo } from "./demo";

const allMessages: Record<string, Record<string, unknown>> = {
  en, fr, es, de, ja, "pt-BR": ptBR, ar,
};

function NextIntlPageInner() {
  const searchParams = useSearchParams();
  const locale = searchParams.get("locale") || "en";
  const messages = (allMessages[locale] || en) as Record<string, Record<string, string>>;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <NextIntlDemo currentLocale={locale} availableLocales={Object.keys(allMessages)} />
    </NextIntlClientProvider>
  );
}

export default function NextIntlPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto p-8">Loading...</div>}>
      <NextIntlPageInner />
    </Suspense>
  );
}
