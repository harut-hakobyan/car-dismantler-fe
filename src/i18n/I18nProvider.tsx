import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { I18nContext } from './I18nContext';
import {
    translations,
    type Language,
    type TranslationKey,
} from './translations';

const storageKey = 'app_language';

export function I18nProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        localStorage.setItem(storageKey, 'en');
    }, []);

    function setLanguage(nextLanguage: Language) {
        localStorage.setItem(storageKey, nextLanguage);
        setLanguageState(nextLanguage);
    }

    const value = useMemo(
        () => ({
            language,
            setLanguage,
            t: (key: TranslationKey) => translations[language][key] ?? translations.en[key],
        }),
        [language]
    );

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
}
