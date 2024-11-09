import { client } from '../../../prismic';

export async function getStaticProps() {
  const noticias = await client.getAllByType('noticia');

  return {
    props: {
      noticias,
    },
    revalidate: 60,
  };
}

export default function Noticias({ noticias }) {
  return (
    <div>
      <h1>Notícias</h1>
      {noticias.map((noticia) => (
        <NoticiaCard key={noticia.id} noticia={noticia} />
      ))}
    </div>
  );
}
