import Image from "next/image";
import styles from "./page.module.css";
import ClubesPage from "./Clubes/page";
import FechasPage from "./Fechas/page";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.clubes}>
          <ClubesPage />
        </div>
        <div className={styles.fechas}>
          <FechasPage />
        </div>
      </div>
    </main>
  );
}
