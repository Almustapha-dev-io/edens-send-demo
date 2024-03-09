import codes from 'country-calling-code';

export function getCountryTelCode(countryISO: string) {
  if (!countryISO) return '';
  const country = codes.find(({ isoCode2 }) => isoCode2 === countryISO);
  if (!country) return '';
  return country.countryCodes[0];
}
