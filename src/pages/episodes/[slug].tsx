import Image from 'next/image';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { Episode } from '../../types';
import { convertDurationToTimeString } from '../../utils/converDurationToTimeString';

import styles from './episode.module.scss';

type EpisodeProps = {
  episode: Episode;
}

export default function EpisodeComponent({ episode }: EpisodeProps) {
  return (
    <section className={styles.wrapper}>
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
    </section>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`${process.env.API_URL}/episodes?_limit=2&_sort=published_at&_order=desc`)
  const episodes = await response.json();

  const paths = episodes.map(episode => ({
    params: { 
      slug: episode.id,
    }
  }));

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await fetch(`${process.env.API_URL}/episodes/${params.slug}`);
  const episode: Episode = await response.json();
  
  episode.durationAsString = convertDurationToTimeString(Number(episode.file.duration));
  episode.publishedAt = format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR });

  return {
    props: { episode },
    // revalidate: 60 * 60 * 24 * 30, // 30 days
    revalidate: 1, 
  }
}