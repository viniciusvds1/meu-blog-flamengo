import * as prismic from '@prismicio/client';
import config from "../slicemachine.config.json";

/**
 * Nome do repositório Prismic.
 * 
 * É definido como uma variável de ambiente NEXT_PUBLIC_PRISMIC_ENVIRONMENT ou 
 * como o valor de repositoryName no arquivo slicemachine.config.json.
 */
const repositoryName = process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || config.repositoryName;

if (!repositoryName) {
  /**
   * Lança um erro se o nome do repositório Prismic não estiver definido.
   */
  throw new Error('O nome do repositório Prismic não está definido.');
}

/**
 * Rotas para o cliente Prismic.
 * 
 * É um array de objetos que define as rotas para o cliente Prismic.
 */
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
 * @param {Object} config - Configuration for the Prismic client.
 * @returns {Object} The Prismic client instance.
 * @throws {Error} If an error occurs while creating the client.
 */
export const createClient = (config = {}) => {
  try {
    /**
     * Cria um novo cliente Prismic com as configurações fornecidas.
     */
    const client = prismic.createClient(repositoryName, {
      routes,
      fetch: (url, options) => {
        /**
         * Faz uma requisição para a URL fornecida com as opções fornecidas.
         * 
         * Adiciona a opção cache: 'no-store' para evitar que o navegador 
         * armazene a resposta em cache.
         */
        return fetch(url, {
          ...options,
          cache: 'no-store',
        });
      },
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
      ...config,
    });

    return client;
  } catch (error) {
    /**
     * Lança um erro se ocorrer um problema ao criar o cliente Prismic.
     */
    console.error('Erro ao criar o cliente Prismic:', error);
    throw error;
  }
};

/**
 * Instância do cliente Prismic criada com as configurações padrão.
 */
export const client = createClient();