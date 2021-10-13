import Image from 'next/image';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { Episode } from '../../types';
import { convertDurationToTimeString } from '../../utils/converDurationToTimeString';

import styles from './episode.module.scss';

type EpisodeProps = {
  episode: Episode;
}

export default function EpisodeComponent({ episode }: EpisodeProps) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className={styles.container}>
        <strong>Carregando...</strong>
      </div>
    )
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>

        <Image 
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        
        <button type="button">
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div 
        className={styles.description} 
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await fetch(`http://localhost:3333/episodes/${params.slug}`);
  const episode: Episode = await response.json();
  
  episode.durationAsString = convertDurationToTimeString(Number(episode.file.duration));
  episode.publishedAt = format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR });

  return {
    props: { episode },
    // revalidate: 60 * 60 * 24 * 30, // 30 days
    revalidate: 1, 
  }
}