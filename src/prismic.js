import * as prismic from '@prismicio/client';
import config from "../slicemachine.config.json";

const repositoryName = process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || config.repositoryName;

const routes = [
  {
    type: 'noticias',
    path: '/noticias/:uid',
  },
];

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (config = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        cache: 'no-store',
      });
    },
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    ...config,
  });

  return client;
};

export const client = createClient();