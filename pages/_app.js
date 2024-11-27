import "@/styles/globals.css";
import Link from "next/link";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <header className="header">
        <title>AI Roast Me..</title>
        <h1>AI Roast Me..</h1>
      </header>
      <Component {...pageProps} />
      <footer className="footer">
        <p>Created by <Link href="https://www.shopdibz.com">Shopdibz</Link> Developers for FUN!!!</p>
        <p>© 2024 AI Roast me. All rights reserved.</p>
      </footer>
    </>
  );
}