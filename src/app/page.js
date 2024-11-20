// Import necessary modules and components
import Link from 'next/link';
import styles from "./page.module.css";
import Image from 'next/image';

// Home component serves as the landing page for Crooked Clothing
export default function Home() {
    
    // List of popular items with their image source and description
    const items = [
        { id: 1, src: '/Hoodie_Black.png', alt: 'This is our Hoodie in black' },
        { id: 2, src: '/T-shirt_black.png', alt: 'This is our T-shirt in black' },
        { id: 3, src: '/Jumper_Black.png', alt: 'This is our Jumper in black' },
    ];
    
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div>

                    <section className={styles.hero}>
                        <h1>This is Crooked Clothing.</h1>
                        <p>Find your style with our latest collections.</p>
                    </section>

                    <section className={styles.popular_items}>
                        <h2>Popular Items</h2>
                        <div className={styles.track}>
                            <div className={styles.track_inner}>
                                {/* Map through items twice to create a looping effect */}
                                {items.concat(items).map((item, index) => (
                                    <div className={styles.track_item} key={index}>
                                        <Image
                                            alt={item.alt}
                                            src={item.src}
                                            width={250}
                                            height={250}
                                            style={{ objectFit: 'contain', objectPosition: 'center center', margin: 'auto' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className={styles.links}>
                        <Link href="/mens">Shop Men&#39;s</Link>
                        <Link href="/womens">Shop Women&#39;s</Link>
                    </section>
                </div>
            </main>
        </div>
    );
}
