"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const FaceDetect = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [name, setName] = useState(""); // For storing the user's name
    const [roast, setRoast] = useState(""); // For storing the generated roast
    const [loading, setLoading] = useState(false); // For loading state

    useEffect(() => {
        if (loading) {
            // Load GPT script dynamically for video ads
            const script = document.createElement("script");
            script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                window.googletag = window.googletag || { cmd: [] };
                window.googletag.cmd.push(function () {
                    window.googletag
                        .defineSlot(
                            "/YOUR_AD_CLIENT/video-ad-slot",
                            [640, 360],
                            "video-ad-container"
                        )
                        .addService(window.googletag.pubads());
                    window.googletag.enableServices();
                    window.googletag.display("video-ad-container");
                });
            };

            // Clean up the script after loading
            return () => {
                document.body.removeChild(script);
            };
        }
    }, [loading]);

    const handleImageUpload = async (e) => {
        try {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setImageSrc(imageUrl);
        } catch (error) {
            console.error("Error in image upload:", error);
            alert("An error occurred while uploading the image. Please try again.");
        }
    };

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
            body: JSON.stringify({ prompt: `Roast ${name}!` }), // Pass the name in the prompt
        });

        console.log(response.status)
        const data = await response.json();
        setRoast(data.roast);
        setLoading(false);
    };

    return (
        <div className="face-detect-container">
            <h1>Upload your image for a roast!</h1>

            {/* Image Upload Section */}
            <div className="image-upload-container">
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {imageSrc && <Image src={imageSrc} width={300} height={300} alt="Uploaded image" />}
            </div>

            {/* Name Input Field */}
            <div className="name-input-container">
                <label htmlFor="name">Enter your name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="name-input"
                />
            </div>

            {/* Button to trigger the roast generation */}
            <div className="button-container">
                <button onClick={generateRoast} disabled={loading} className="generate-button">
                    {loading ? "Generating Roast..." : "Generate Roast"}
                </button>
            </div>

            {/* Video Ad while loading */}
            {loading && (
                <div className="video-ad">
                    <div id="video-ad-container" style={{ width: "100%", height: "auto" }}></div>
                </div>
            )}

            {/* Display the generated roast */}
            {roast && (
                <div className="roast">
                    <h2>Your Roast:</h2>
                    <p>{roast}</p>
                </div>
            )}

            {roast && (
                <div id="roast-container" style={{ padding: "20px", backgroundColor: "#f0f0f0", marginTop: "20px", borderRadius: "10px" }}>
                    <p>{roast}</p>

                    {/* Share buttons */}
                    <button onClick={shareOnTwitter}>Share on Twitter</button>
                    <button onClick={shareOnFacebook}>Share on Facebook</button>

                    {/* Generate Image Button */}
                    <button onClick={generateImage}>Generate Image</button>
                </div>
            )}

            {imageSrc && (
                <div>
                    <h3>Your Roast as an Image</h3>
                    <img src={imageSrc} alt="Roast Image" style={{ maxWidth: "100%" }} />
                    {/* Provide a link to download or share the image */}
                    <a href={imageSrc} download="roast.png">Download Image</a>
                </div>
            )}

            {/* Google Ads Banner */}
            <div className="google-ads">
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
                ></script>
                <ins
                    className="adsbygoogle"
                    style={{ display: "block" }}
                    data-ad-client="YOUR_AD_CLIENT"
                    data-ad-slot="YOUR_AD_SLOT"
                    data-ad-format="auto"
                ></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({ });
                </script>
            </div>
        </div>
    );
};

export default FaceDetect;
