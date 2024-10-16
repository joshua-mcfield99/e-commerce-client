import "./globals.css";
import Providers from './provider';
import { NavBar } from "./components/NavBar";
import { CartProvider } from "./components/CartContext";


export const metadata = {
    title: "Crooked Clothing",
    description: "Generated by create next app",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                {/* Adobe Fonts Embed Link*/}
                <link rel="stylesheet" href="https://use.typekit.net/xwa5mii.css"></link>
            </head>
            <body className={``}>
                <Providers>
                    <CartProvider>
                        <NavBar/>
                        {children}
                    </CartProvider>
                </Providers>
            </body>
        </html>
    );
}
