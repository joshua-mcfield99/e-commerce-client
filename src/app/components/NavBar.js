'use client'
import React from 'react'
import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/navbar.module.css'

export const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

  return (
    <div className={`${styles.nav_container}`}>
        <nav>
            <div className={`${styles.block}`}>
                <div className={`${styles.logo_container}`}>
                    <h1>
                        Crooked Clothing
                    </h1>
                </div>
                <div className={`${styles.mobile_nav}`}>
                    <div className={`${styles.menu_icon}`} onClick={toggleMenu}>
                        <span className={`${styles.menu_bar} ${menuOpen ? styles.bar_top : ''}`}></span>
                        <span className={`${styles.menu_bar} ${menuOpen ? styles.bar_mid : ''}`}></span>
                        <span className={`${styles.menu_bar} ${menuOpen ? styles.bar_bot : ''}`}></span>
                    </div>
                </div>
            </div>
            <div className={`${styles.mobile_menu} ${menuOpen ? styles.open : ''}`}>
                  <h2>Menu</h2>
                    <Link href="/mens" onClick={toggleMenu}>Men&#39;s</Link>
                    <Link href="/womens" onClick={toggleMenu}>Women&#39;s</Link>
                    <Link href="/login" onClick={toggleMenu}>Login</Link>
            </div>
        </nav>
    </div>
  )
}
