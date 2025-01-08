import * as prismic from '@prismicio/client';
import * as prismicNext from '@prismicio/next';
import config from "../slicemachine.config.json";


export const repositoryName = process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || config.repositoryName;
/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (config = {}) => {
  const client = prismic.createClient(repositoryName, {
    fetchOptions: 
      process.env.NODE_ENV === 'production'
        ? { next: { revalidate: 60 }, cache: 'force-cache' }
        : { next: { revalidate: 5 } },
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    ...config,
  });

  prismicNext.enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  });

  return client;
};
l
export const client = createClient();