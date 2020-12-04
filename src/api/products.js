/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import {
  withToken, groupFetchJson, makeConfig, toUrl, baseUrl,
} from './api';
import config from '../../sunrise.config';
import productTypes from './productTypes';

const asAttribute = (name, type, locale) => {
  if (type === 'lnum') {
    return `variants.attributes.${name}.label.${locale}`;
  }
  if (type === 'enum') {
    return `variants.attributes.${name}.key`;
  }
  return `variants.attributes.${name}`;
};

// The array of attributes is in config, there are many searchable
//  attributes but only a couple of them will display in UI
//  this will turn { designer: ['rebel', 'havaianas'] }; into
//  {"filter.query":["variants.attributes.designer.key:\"rebel\",\"havaianas\""]}
//  when 'designer' is the value of the name property of one of the items in
//  vueConfig.facetSearches
const facets = (query = {}, locale) => config.facetSearches
  .reduce(
    (result, { name, type }) => {
    // eslint-disable-next-line no-prototype-builtins
      if (query.hasOwnProperty(name)) {
        result['filter.query'] = result['filter.query'] || [];
        result['filter.query'].push(
          `${asAttribute(name, type, locale)}:${
            Array.isArray(query[name])
              ? query[name].map(
                value => `"${value}"`,
              ).join(',')
              : `"${query[name]}"`
          }`,
        );
      }
      return result;
    }, {},
  );
const setCategory = ({ category, ...query }) => (category
  ? {
    ...query,
    'filter.query': `categories.id:subtree("${category}")`,
  }
  : query);


const products = {
  get: withToken(
    (
      [query, routeQ, locale, totalFacets = []],
      { access_token: accessToken },
    ) => {
      query = setCategory(query);
      const { min, max, ...routeQuery } = routeQ;
      const priceFilter = {};
      if (min || max) {
        const minQ = min ? min * 100 : '*';
        const maxQ = max ? max * 100 : '*';
        priceFilter['filter.query'] = `variants.scopedPrice.value.centAmount: range (${minQ} to ${maxQ})`;
        // priceFilter['filter.query'] = `variants.price.centAmount: range (${minQ} to ${maxQ})`;
      }
      return Promise.all([
        groupFetchJson(
          toUrl(
            `${baseUrl}/product-projections/search`,
            [
              ...Object.entries(priceFilter),
              ...Object.entries(query)
                .filter(
                  ([, val]) => !(val === null || val === undefined),
                ),
              ...Object.entries(facets(routeQuery, locale)),
              ...totalFacets.map(
                ({ name, type }) => [
                  'facet',
                  `${asAttribute(name, type, locale)} counting products`,
                ],
              ),
            ],
          ),
          makeConfig(accessToken),
        ),
        productTypes.translations(),
      ]).then(
        ([{ facets, ...result }, translation]) => ({
          ...result,
          facets: config.facetSearches.map(
            ({ name, type }) => {
              const facet = facets[asAttribute(name, type, locale)];
              return ({
                ...facet,
                name,
                label: translation[name]?.[locale] || name,
                type,
                terms: [...(facet?.terms || [])].sort(
                  (a, b) => a.term.localeCompare(b.term),
                ),
              });
            },
          ),
        }),
      );
    },
  ),
  facets: (query, routeQuery, locale) => {
    query = {
      ...setCategory(query),
      page: 1,
      pageSize: 0,
    };
    return Promise.all(
      config.facetSearches.map(
        ({ name, component }) => {
          const newRouteQuery = { ...routeQuery };
          delete newRouteQuery[name];
          return products.get([
            query,
            newRouteQuery,
            locale,
            config.facetSearches.filter(
              f => f.name === name,
            ),
          ])
            .then(
              ({ facets }) => ({
                ...facets
                  .find(f => f.name === name),
                component,
              }),
            );
        },
      ),
    );
  },
};

export default products;
