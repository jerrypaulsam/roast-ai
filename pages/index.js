import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import html2canvas from "html2canvas";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import Head from "next/head";
import Link from "next/link";

export default function Home() {

  const [name, setName] = useState("");
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);  // To track if we're in the client-side

  useEffect(() => {
    setIsClient(true);  // Set to true once the component is rendered on the client-side
  }, []);

  const generateRoast = async () => {
    if (!name) {
      alert("Please enter a name to generate a roast.");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/generateRoast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: `Roast ${name}!` }),
    });

    const data = await response.json();
    setRoast(data.roast);
    setLoading(false);
  };

  const shareAsImage = async () => {
    const node = document.getElementById("roastDisplay");
    if (node) {
      // Create a canvas for the entire image
      const canvas = await html2canvas(node);

      // Get the image data URL from the canvas
      const dataURL = canvas.toDataURL();

      // Create an image object to edit
      const img = new Image();
      img.src = dataURL;

      // Once the image has loaded, we can draw it on a new canvas
      img.onload = () => {
        const width = img.width;
        const height = img.height;

        // Create a new canvas to draw the updated image
        const newCanvas = document.createElement("canvas");
        newCanvas.width = width;
        newCanvas.height = height + 120; // Added more space for spacing under the headline

        const ctx = newCanvas.getContext("2d");

        // Draw the original image
        ctx.drawImage(img, 0, 0);

        // Add the headline text ("AI Roast Me")
        ctx.font = "bold 30px Arial";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.fillText("AI Roast Me", width / 2, 40); // Positioning at the top

        // Add a small spacing below the headline
        ctx.font = "normal 20px Arial";
        ctx.fillText("", width / 2, 60); // Empty space below the headline

        // Add the website URL at the bottom with smaller font and white color
        ctx.font = "italic 18px Arial";
        ctx.fillStyle = "#fff";  // Set text color to white for the link
        ctx.fillText("Visit us at roast-ai-8f772.web.app", width / 2, height + 80); // Positioning at the bottom

        // Create a link for downloading the image
        const link = document.createElement("a");
        link.download = `${name}_roast.png`;
        link.href = newCanvas.toDataURL(); // Get the updated image with headline and URL
        link.click();
      };
    }
  };

  return (
    <>
      <Head>
        {/* Open Graph meta tags for Facebook */}
        <meta property="og:title" content={`Roast ${name}`} />
        <meta property="og:description" content={roast} />
        <meta property="og:image" content={`/api/roast-image?name=${name}`} /> {/* Replace with your image endpoint */}
        <meta property="og:url" content={isClient ? window.location.href : ""} />
        <meta property="og:type" content="website" />

        {/* Twitter Card meta tags */}
        <meta name="twitter:title" content={`Roast ${name}`} />
        <meta name="twitter:description" content={roast} />
        <meta name="twitter:image" content={`/api/roast-image?name=${name}`} /> {/* Replace with your image endpoint */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className={styles.container}>
        <div className={styles.form}>
          <input
            type="text"
            placeholder="Enter a name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
          <button onClick={generateRoast} className={styles.button}>
            {loading ? "Generating..." : "Generate Roast"}
          </button>
        </div>

        {/* Google Video Ad */}
        <div className={styles.ad}>
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-2145921063892640"
            data-ad-slot="7178330673"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>

        {roast && (
          <div className={styles.result}>
            <div id="roastDisplay" className={styles.roast}>
              <p>{roast}</p>
            </div>

            <button onClick={shareAsImage} className={styles.button}>
              Share as Image
            </button>

            <div className={styles.shareButtons}>
              <FacebookShareButton url={window.location.href} quote={roast}>
                <FacebookIcon size={32} round={true} />
              </FacebookShareButton>

              <TwitterShareButton url={window.location.href} title={roast}>
                <TwitterIcon size={32} round={true} />
              </TwitterShareButton>

              <LinkedinShareButton url={window.location.href}>
                <LinkedinIcon size={32} round={true} />
              </LinkedinShareButton>

              <RedditShareButton url={window.location.href} title={roast}>
                <RedditIcon size={32} round={true} />
              </RedditShareButton>

              <TelegramShareButton url={window.location.href}>
                <TelegramIcon size={32} round={true} />
              </TelegramShareButton>

              <WhatsappShareButton url={window.location.href} title={roast}>
                <WhatsappIcon size={32} round={true} />
              </WhatsappShareButton>
            </div>
          </div>
        )}

        {/* Bottom Google Ad */}
        <div className={styles.bottomAd}>
          <ins
            className="adsbygoogle"
            style={{ display:"block" }}
            data-ad-client="ca-pub-2145921063892640"
            data-ad-slot="8982366938"
            data-ad-format="autorelaxed"
            data-full-width-responsive="true"
          ></ins>
        </div>

        {/* <Link href="https://www.scrapitt.xyz" target="_blank">
          <img
            className={`${styles.fullWidthImage} border-radius-10`}
            src="assets/scrapitt.jpg"
            alt="Scrapitt Social Media"
          />
        </Link> */}

      </div>
    </>

  );
}