import { NextIntlClientProvider } from "next-intl";
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

export default async function NextIntlPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const params = await searchParams;
  const locale = params.locale || "en";
  const messages = allMessages[locale] || en;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <NextIntlDemo currentLocale={locale} availableLocales={Object.keys(allMessages)} />
    </NextIntlClientProvider>
  );
}
