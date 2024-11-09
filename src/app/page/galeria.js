import { client } from '../../prismic';

export async function getStaticProps() {
  const galeria = await client.getAllByType('galeria');

  return {
    props: {
      galeria,
    },
    revalidate: 60,
  };
}

// Supondo que 'galeria' seja o documento obtido do Prismic

export default function Galeria({ galeria }) {
    const imagens = galeria.data.imagens; // 'imagens' é o nome do grupo
  
    return (
      <div>
        <h1>{galeria.data.titulo}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {imagens.map((item, index) => (
            <div key={index}>
              <img src={item.imagem.url} alt={item.imagem.alt} />
              {item.legenda && <p>{item.legenda}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }
  