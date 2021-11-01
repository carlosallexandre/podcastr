import { AppProps } from 'next/app'

import { Header } from '../components/Header';
import { Player } from '../components/Player';
import { PlayerContextProvider } from '../contexts/PlayerContext';

import '../styles/global.scss'
import 'rc-slider/assets/index.css';
import styles from '../styles/app.module.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlayerContextProvider>
      <div className={styles.container}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>

        <Player />
      </div>
    </PlayerContextProvider>
  );
}

export default MyApp
