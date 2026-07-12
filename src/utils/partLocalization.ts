import type { Language } from '../i18n/translations';

type LocalizedPartName = {
    name: string;
    name_ru?: string | null;
    name_hy?: string | null;
};

export function getLocalizedPartName(part: LocalizedPartName, language: Language): string {
    if (language === 'hy' && part.name_hy?.trim()) {
        return part.name_hy.trim();
    }

    if (language === 'ru' && part.name_ru?.trim()) {
        return part.name_ru.trim();
    }

    return part.name;
}

export function getLocalizedPartLabel(
    part: LocalizedPartName & { sku: string },
    language: Language
): string {
    return `${getLocalizedPartName(part, language)} - ${part.sku}`;
}
