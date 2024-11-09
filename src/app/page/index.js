import { client } from '../../prismic';

export async function getStaticProps() {
  const noticias = await client.get({
    predicates: prismic.predicate.at('document.type', 'noticia'),
    orderings: '[document.first_publication_date desc]',
    pageSize: 5,
  });

  const resultados = await client.get({
    predicates: prismic.predicate.at('document.type', 'resultado'),
    orderings: '[my.resultado.data_do_jogo desc]',
    pageSize: 3,
  });

  return {
    props: {
      noticias: noticias.results,
      resultados: resultados.results,
    },
    revalidate: 60, // Revalida a cada minuto
  };
}

export default function Home({ noticias, resultados }) {
  return (
    <div>
      <h1 className="text-3xl font-bold">Últimas Notícias do Flamengo</h1>
      {noticias.map((noticia) => (
        <div key={noticia.id}>
          <h2 className="text-2xl">{noticia.data.titulo}</h2>
          <p>{noticia.data.conteudo}</p>
        </div>
      ))}
      <h1 className="text-3xl font-bold mt-8">Últimos Resultados</h1>
      {resultados.map((resultado) => (
        <div key={resultado.id}>
          <p>
            {resultado.data.adversario} - {resultado.data.placar}
          </p>
        </div>
      ))}
    </div>
  );
}
