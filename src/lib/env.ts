const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
const edensClientId = import.meta.env.VITE_EDENS_CLIENT_ID ?? '';
const paymentsBaseUrl = import.meta.env.VITE_EDENS_PAYMENTS_BASE ?? '';
const apiLayerKey = import.meta.env.VITE_API_LAYER_KEY ?? '';

export { apiBaseUrl, apiLayerKey, edensClientId, paymentsBaseUrl };
