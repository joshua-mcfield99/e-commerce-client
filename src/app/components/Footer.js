import React from 'react'
import styles from '../styles/footer.module.css'
import Link from 'next/link'
import LogoutButton from './LogoutButton'
import Image from 'next/image'

export const Footer = () => {
  return (
    <footer className={`${styles.footer}`}>
        <div className={`${styles.footer_banner}`}>
            <h1>Crooked Clothing</h1>
        </div>
        <div className={`${styles.quick_links}`}>
            <h2>Quick links:</h2>
            <ul>
                <li><Link href='/'>Home</Link></li>
                <li><Link href='/profile'>Profile</Link></li>
                <li><Link href='/mens'>Mens</Link></li>
                <li><Link href='/womens'>Womens</Link></li>
                <li><LogoutButton/></li>
            </ul>
        </div>
        <div className={`${styles.copyright}`}><p>Crooked Clothing</p><Image alt='Copyright' src='/Copyright.png' width={35} height={35}/></div>
    </footer>
  )
}
