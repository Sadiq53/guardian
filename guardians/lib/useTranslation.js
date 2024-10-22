// lib/useTranslation.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IntlProvider, useIntl } from 'react-intl';

const loadLocaleData = (locale) => {
  switch (locale) {
    case 'pl':
      return import('../locales/pl.json');
    default:
      return import('../locales/en.json');
  }
};

export const useTranslation = () => {
  const { locale, defaultLocale, asPath } = useRouter();
  const [messages, setMessages] = useState();

  useEffect(() => {
    loadLocaleData(locale).then((msgs) => {
      setMessages(msgs.default);
    });
  }, [locale]);

  const intl = useIntl();

  return {
    messages,
    locale,
    defaultLocale,
    asPath,
    intl,
  };
};

export const TranslationProvider = ({ children }) => {
  const { locale, messages } = useTranslation();

  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
};
