import Image from 'next/image';
import Slider from 'rc-slider';
import { useEffect, useRef, useState } from 'react';

import { usePlayerContext } from '../../contexts/PlayerContext';
import { convertDurationToTimeString } from '../../utils/converDurationToTimeString';

import styles from './styles.module.scss';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const { 
    clearPlayerState,
    episodeList, 
    currentEpisodeIndex, 
    isPlaying,
    hasNext,
    hasPrevious,
    resume,
    pause,
    playNext,
    playPrevious,
    isLooping,
    toggleLoop,
    isShuffling,
    toggleShuffle,
  } = usePlayerContext();

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;

    setProgress(amount);
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }
  
  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.container}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image 
            width={592} 
            height={592} 
            src={episode.thumbnail} 
            objectFit="cover" 
          />
          <strong>{episode.title}</strong>          
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      ) }

      <footer className={!episode && styles.empty}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            { episode ? (
              <Slider 
                value={progress}
                max={episode.file.duration}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361'}}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            ) }
          </div>
          <span>{convertDurationToTimeString(episode?.file.duration ?? 0)}</span>
        </div>

        { episode && (
          <audio
            ref={audioRef}
            src={episode.file.url}
            autoPlay
            loop={isLooping}
            onPlay={() => resume()}
            onPause={() => pause()}
            onEnded={handleEpisodeEnded}
            onLoadedMetadata={setupProgressListener}
          />
        ) }

        <div className={styles.buttons}>
          <button 
            type="button" 
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button 
            type="button" 
            disabled={!hasPrevious}
            onClick={() => playPrevious()}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          <button 
            type="button" 
            disabled={!episode}
            className={styles.playButton}
            onClick={() => isPlaying ? pause() : resume()}
          >
            { isPlaying
              ? <img src="/pause.svg" alt="Pausar" />
              : <img src="/play.svg" alt="Tocar" />
            }            
          </button>

          <button 
            type="button" 
            disabled={!hasNext}
            onClick={() => playNext()}
          >
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>

          <button 
            type="button" 
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}