'use client';
import AnimatedLogo from './AnimatedLogo';
import styles from './LoadingScreen.module.css';

const LoadingScreen = () => {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.logoContainer}>
        <AnimatedLogo color="#9ac940" autoplay />
      </div>
    </div>
  );
};

export default LoadingScreen;
