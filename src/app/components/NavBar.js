'use client'
import React from 'react'
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext'
import styles from '../styles/navbar.module.css'
import LogoutButton from './LogoutButton';
import Image from 'next/image';

export const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { totalQuantity } = useCart();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

  return (
    <div className={`${styles.nav_container}`}>
        <nav>
            <div className={`${styles.block}`}>
                <div className={`${styles.menu_icon}`} onClick={toggleMenu}>
                    <span className={`${styles.menu_bar} ${menuOpen ? styles.bar_top : ''}`}></span>
                    <span className={`${styles.menu_bar} ${menuOpen ? styles.bar_mid : ''}`}></span>
                    <span className={`${styles.menu_bar} ${menuOpen ? styles.bar_bot : ''}`}></span>
                </div>
                <div className={`${styles.logo_container}`}>
                    <Link href="/">
                        <h1>
                            Crooked Clothing
                        </h1>
                    </Link>
                </div>
                <div className={`${styles.desktop_menu}`}>
                    <ul>
                        <div className={styles.gen_links_container}>
                            <li className={styles.gen_link}>
                                <Link href="/mens">Men&#39;s</Link>
                            </li>
                            <li className={styles.gen_link}>
                                <Link href="/womens">Women&#39;s</Link>
                            </li>
                        </div>
                        <li>
                            <Link href="/login">Login</Link>
                        </li>
                        <li>
                            <Link href="/signup">SignUp</Link>
                        </li>
                        <li>
                            <LogoutButton/>
                        </li>
                    </ul>
                </div>
                <div className={`${styles.quick_links}`}>
                    <div className={`${styles.quick_link}`}>
                        <Link href='/profile'><Image src='/Profile.png' alt='Profile link' width={50} height={50} layout='intrinsic' className={styles.quick_icon} /></Link>
                    </div>
                    <div className={`${styles.quick_link}`}>
                        <Link href='/cart'><Image src='/Cart.png' alt='Cart' width={50} height={50} layout='intrinsic' className={styles.quick_icon} /></Link>
                        {totalQuantity > 0 && (
                          <div className={`${styles.cart_count}`}>
                            {totalQuantity}
                          </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={`${styles.mobile_menu} ${menuOpen ? styles.open : ''}`}>
                <h2>Menu</h2>
                <ul>
                    <li>
                        <Link href="/mens" onClick={toggleMenu}>Men&#39;s</Link>
                    </li>
                    <li>
                        <Link href="/womens" onClick={toggleMenu}>Women&#39;s</Link>
                    </li>
                    <li>
                        <Link href="/login" onClick={toggleMenu}>Login</Link>
                    </li>
                    <li>
                        <Link href="/signup" onClick={toggleMenu}>SignUp</Link>
                    </li>
                    <li onClick={toggleMenu}>
                        <LogoutButton/>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
  )
}
