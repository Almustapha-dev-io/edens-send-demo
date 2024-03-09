type FormatPriceOptions = {
  locale?: string;
  currency?: string;
  fractionDigits?: number;
};

export function formatPrice(value: number, opts: FormatPriceOptions = {}) {
  const { locale = 'en-US', currency = 'USD', fractionDigits = 0 } = opts;
  const formatter = new Intl.NumberFormat(locale, {
    currency,
    style: 'currency',
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  });
  return formatter.format(value);
}

type FormatNumberOptions = {
  locale?: string;
  fractionDigits?: number;
};

export function formatNumber(number: number, opts: FormatNumberOptions = {}) {
  const { locale = 'en-US', fractionDigits = 0 } = opts;

  return Intl.NumberFormat(locale, {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(number);
}
