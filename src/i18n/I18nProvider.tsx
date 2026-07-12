import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { I18nContext } from './I18nContext';
import {
    translations,
    type Language,
    type TranslationKey,
} from './translations';

const storageKey = 'app_language';

export function I18nProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        if (typeof window === 'undefined') {
            return 'en';
        }

        const storedLanguage = localStorage.getItem(storageKey);
        if (storedLanguage === 'en' || storedLanguage === 'ru' || storedLanguage === 'hy') {
            return storedLanguage;
        }

        const browserLanguage = navigator.language.toLowerCase();
        if (browserLanguage.startsWith('hy')) {
            return 'hy';
        }

        if (browserLanguage.startsWith('ru')) {
            return 'ru';
        }

        return 'en';
    });

    useEffect(() => {
        localStorage.setItem(storageKey, language);
    }, [language]);

    function setLanguage(nextLanguage: Language) {
        localStorage.setItem(storageKey, nextLanguage);
        setLanguageState(nextLanguage);
    }

    const value = useMemo(
        () => ({
            language,
            setLanguage,
            t: (key: TranslationKey) => {
                const currentTranslations = translations[language] as Record<TranslationKey, string>;
                const fallbackTranslations = translations.en as Record<TranslationKey, string>;

                return currentTranslations[key] ?? fallbackTranslations[key];
            },
        }),
        [language]
    );

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
}
