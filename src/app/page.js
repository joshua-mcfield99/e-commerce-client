import Link from 'next/link';
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>
            <section className="hero">
              <h1>Welcome to Crooked Clothing</h1>
              <p>Find your style with our latest collections.</p>
            </section>

            <section className="popular-items">
              <h2>Popular Items</h2>
              {/* Map through popular items and show them */}
              {/* On click, you can open a modal with product details */}
            </section>

            <Link href="/mens">Shop Men&#39;s Clothing</Link>
            <Link href="/womens">Shop Women&#39;s Clothing</Link>
        </div>
      </main>
    </div>
  );
}
