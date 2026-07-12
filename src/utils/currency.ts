const amdFormatter = new Intl.NumberFormat('hy-AM', {
    style: 'currency',
    currency: 'AMD',
    maximumFractionDigits: 0,
});

export function formatAmdCurrency(value: number): string {
    return amdFormatter.format(value);
}

export const AMD_CURRENCY_SYMBOL = '\u058F';
