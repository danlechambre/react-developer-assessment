import styles from '../styles/AppLayout.module.css';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className={styles.appContainer}>
      <main className={styles.wrapper}>
        <h1 className={styles.heading}>Awesome Posts</h1>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
