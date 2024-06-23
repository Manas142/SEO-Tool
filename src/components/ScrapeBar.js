import React, { useContext, useState } from "react";
import "../ScrapeBar.css";
import { useNavigate } from "react-router-dom";
import appContext from "../context";

export default function ScrapeBar() {
  const { setValue } = useContext(appContext);

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // New state for error handling
  const navigate = useNavigate();

  const handleOnChange = (event) => {
    setUrl(event.target.value);
  };


  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', // fragment locator
    'i'
  );

  function isValidURL(url) {
    // 1. Basic checks for emptiness and presence of leading protocol
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      return false;
    }
    if (!pattern.test(url)) {
      return false;
    }
    // 3. Use URL constructor for comprehensive validation and edge case handling:
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  }


  const handleScrapeClick = async () => {
    try {
      setLoading(true);
      setError(null);
      const isValid = isValidURL(url);

      if (!isValid) {
        setError("Invalid URL");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:4000/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const data = await response.json();
        setLoading(false);
        setError(null);
        setValue({ scrapedData: data });

        // Navigate based on the data received
        if (data.onPagePerformance) {
          navigate("/onpage");
        } else if (data.offPagePerformance) {
          navigate("/offpage");
        } else if (data.mobilePerformance) {
          navigate("/mobile");
        } else if (data.desktopPerformance) {
          navigate("/desktop");
        } else {
          console.error("Unknown data format:", data);
        }
      } else {
        // Handle server error by setting the error state
        setError("Data Not Found");
        setLoading(false);
      }
    } catch (error) {
      // Handle other errors and set the error state
      setError("Data Not Found");
      setLoading(false);
    }
  };

  return (
    <div className="scrape-bar">
      <div className="scrape-subtitle">
        <p>
          <img src="./chimlogo.png" alt="" />
          Chimpzlab Website Audit
        </p>
      </div>
      <div>
        <div className="scrape-header">
          <img
            style={{
              position: "absolute",
              bottom: "0",
              right: "10%",
              zIndex: "-1",
              height: "100%",
            }}
            src="./chimp.png" alt="" />
          <div>Let's Deep Dive</div>
          <div>into your website!</div>
        </div>
        <div className="scrape-input-group">
          <input
            className="scrape-input"
            type="url"
            placeholder="https://chimpzlab.com"
            aria-label="URL"
            value={url}
            name="scrape-url"
            onChange={handleOnChange}
          />
          <button
            className={`btn-Generate ${loading ? "loading" : ""}`}
            onClick={handleScrapeClick}
            disabled={loading}
          >
            <span className="arrow">
              <i className="bi bi-arrow-right"></i>
            </span>
            <span>
              {loading ? "Generating Report..." : "Generate Free Report"}
            </span>
          </button>
        </div>
        {error && (
          <div className="errorText">
            <i className="bi bi-exclamation-circle"></i>
            <span>{error}</span>
          </div>)}

      </div>
    </div>
  );
}