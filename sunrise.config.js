export default {
  ct: {
    auth: {
      host: process.env.VUE_APP_CT_AUTH_HOST || 'https://auth.europe-west1.gcp.commercetools.com',
      projectKey: process.env.VUE_APP_CT_PROJECT_KEY || 'poc-ahorramas',
      credentials: {
        clientId: process.env.VUE_APP_CT_CLIENT_ID || 'rlo2x-pHMKpiqlxgX-7UUVQy',
        clientSecret: process.env.VUE_APP_CT_CLIENT_SECRET || 'W3TBAsPlS7hoxJ4xXhDA_hI--dSQsFEp',
      },
      scopes: [process.env.VUE_APP_CT_SCOPE || 'manage_my_profile:poc-ahorramas create_anonymous_token:poc-ahorramas'
      + ' manage_my_payments:poc-ahorramas view_products:poc-ahorramas manage_my_orders:poc-ahorramas'
      + ' manage_my_shopping_lists:poc-ahorramas'],
    },
    api: process.env.VUE_APP_CT_API_HOST || 'https://api.europe-west1.gcp.commercetools.com',
  },
  languages: {
    'es-ES': 'Spanish',
    en: 'English',
    de: 'Deutsch',
  },
  countries: {
    ES: 'España',
    DE: 'Portugal',
    US: 'Otros',
  },
  formats: {
    number: {
      DE: {
        currency: {
          style: 'currency',
          currency: 'EUR',
          currencyDisplay: 'symbol',
        },
      },
      US: {
        currency: {
          style: 'currency',
          currency: 'USD',
        },
      },
      ES: {
        currency: {
          style: 'currency',
          currency: 'EUR',
          currencyDisplay: 'symbol',
        },
      },
    },
    datetime: {
      US: {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        },
      },
      DE: {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        },
      },
      ES: {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        },
      },
    },
  },
  categories: {
    salesExternalId: '6',
  },
  facetSearches: [
    { name: 'Marca', type: 'text', component: 'brand' },
    { name: 'Peso', type: 'number', component: 'weight' },
    { name: 'Tipo_de_corte', type: 'text', component: 'cutType' },
  ],
};
