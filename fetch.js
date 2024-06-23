const axios = require("axios");
const cheerio = require("cheerio");
const validUrl = require("valid-url");
const tldjs = require("tldjs"); // Ensure this package is installed
const https = require('https');


const CA = "-----BEGIN CERTIFICATE-----$$$$$-----END CERTIFICATE-----"
const httpsAgent = new https.Agent({
  ca: CA,
  rejectUnauthorized: false,
});

async function scrapeData(url) {
  try {
    const response = await axios.get(url, { httpsAgent });
    const html = response.data;
    const $ = cheerio.load(html);

    let title = "";
    const metaDescription = $('meta[name="description"]').attr("content");
    const ogMetaProperties = [];
    const keywords = [];
    const tagData = {};
    let textHtmlRatio = 0;
    const flashData = [];
    let faviconUrl = "";
    let xmlSitemapUrl = "";

    const baseDomain = tldjs.getDomain(url);
    const internalLinks = new Set();
    const externalLinks = new Set();
    const images = [];
    const imageAltTags = [];
    let imagesWithNoAltTags = [];

    // title
    const titleElement = $("title");
    if (titleElement.length > 0) {
      title = titleElement.text().trim();
    }

    // meta keywords
    const keywordsElement = $('meta[name="keywords"]');
    if (keywordsElement.length > 0) {
      const keywordsContent = keywordsElement.attr("content");
      if (keywordsContent) {
        const extractedKeywords = keywordsContent
          .split(",")
          .map((keyword) => keyword.trim());
        keywords.push(...extractedKeywords);
      } else {
        const otherKeywordsElements = $(
          'meta[name="keyword"], meta[name="key"]'
        );
        if (otherKeywordsElements.length > 0) {
          const otherKeywordsContent = otherKeywordsElements.attr("content");
          if (otherKeywordsContent) {
            const extractedKeywords = otherKeywordsContent
              .split(",")
              .map((keyword) => keyword.trim());
            keywords.push(...extractedKeywords);
          }
        }
      }
    }

    // flash
    $("object, embed").each((index, element) => {
      const flashElement = $(element);
      const flashSrc = flashElement.attr("data") || flashElement.attr("src");
      const flashType = flashElement.attr("type");
      flashData.push({
        src: flashSrc,
        type: flashType,
      });
    });

    //favicon
    const faviconElement = $('link[rel="icon"], link[rel="shortcut icon"]');
    if (faviconElement.length > 0) {
      faviconUrl = faviconElement.attr("href");
    }
    console.log("84")
    // XML sitemap
    const sitemapElement = $('link[rel="sitemap"]');
    if (sitemapElement.length > 0) {
      xmlSitemapUrl = sitemapElement.attr("href");
    } else {
      const rootSitemapUrl = new URL("/sitemap.xml", url).href;
      try {
        const rootSitemapResponse = await axios.get(rootSitemapUrl, { httpsAgent });
        if (rootSitemapResponse.status === 200) {
          xmlSitemapUrl = rootSitemapUrl;
        }
      } catch (error) {
        xmlSitemapUrl = null
      }
      // else {
      //   const robotsUrl = new URL("/robots.txt", url).href;
      //   const robotsTxtResponse = await axios.get(robotsUrl);
      //   const robotsTxtContent = robotsTxtResponse.data;

      //   const robotsTxt = robotsTxtParser.parse(robotsTxtContent);
      //   if (robotsTxt.sitemaps.length > 0) {
      //     xmlSitemapUrl = robotsTxt.sitemaps[0];
      //   }
      // }
    }
    console.log("107")


    // ratio
    // output incorrect

    const totalTextLength = $("body").text().length;
    const totalHtmlLength = $("html")
      .html()
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]*>/g, "").length;

    textHtmlRatio = (totalTextLength / totalHtmlLength).toFixed(2);
    // textHtmlRatioPercentage = textHtmlRatio * 100;

    // meta properties
    $('meta[property^="og:"]').each((index, element) => {
      const propertyName = $(element).attr("property").replace("og:", "");
      const content = $(element).attr("content");
      ogMetaProperties[propertyName] = content;
    });

    $("a").each((index, element) => {
      let href = $(element).attr("href");
      if (href && isValidLink(href)) {
        if (!validUrl.isWebUri(href)) {
          href = new URL(href, url).href;
        }

        const linkDomain = tldjs.getDomain(href);

        if (linkDomain === baseDomain) {
          internalLinks.add(href);
        } else if (linkDomain && href.startsWith("http")) {
          externalLinks.add(href);
        }
      }
    });

    $("img").each((index, element) => {
      let src = $(element).attr("src") ?? $(element).attr("data-src");
      if (!src) {
        return
      }
      const alt = $(element).attr("alt");
      const absoluteUrl = new URL(src, url).href;
      console.log("153 - ", index, element.attributes)
      images.push({ src: absoluteUrl, alt: alt || "No Alt Tag" });

      // to show alt tags
      if (alt) {
        imageAltTags.push(alt);
      } else {
        imagesWithNoAltTags.push(absoluteUrl);
      }
    });

    $("h1, h2, h3, h4, h5, h6").each((index, element) => {
      const tagName = element.name;
      const tagText = $(element).text().trim();
      if (!tagData[tagName]) {
        tagData[tagName] = [];
      }
      if (tagText) {
        tagData[tagName].push(tagText);
      }
    });

    const internalLinksArray = [...internalLinks];
    const externalLinksArray = [...externalLinks];
    const imageUrls = images.map((img) => img.src);
    const allLinks = [...internalLinksArray, ...externalLinksArray, ...imageUrls,];
    // const allLinks = [...internalLinksArray, ...externalLinksArray];
    const brokenLinks = await checkBrokenLinks(allLinks);
    const isSEOFriendly = checkSEOFriendly(url);
    const SSL = await checkSSL(url);
    const localSEOSchema = fetchLocalSEOSchema($);
    const localSEOSchemaStatus = localSEOSchema ? "Present" : "Absent";
    const googleTagManagerStatus = checkGoogleTagManager($);

    let seoFriendlyStatus;
    if (isSEOFriendly) {
      seoFriendlyStatus = `SEO-Friendly: ${url}`;
    } else {
      seoFriendlyStatus = `Non-SEO-Friendly: ${url}`;
    }

    return {
      title: title.length > 0 ? title : "Absent",
      metaDescription: metaDescription.length > 0 ? metaDescription : "Absent",
      tagData: Object.keys(tagData).length > 0 ? tagData : "Absent",
      textHtmlRatio: textHtmlRatio,
      flashData: flashData.length > 0 ? flashData : "Absent",
      internalLinks: internalLinksArray.length > 0 ? internalLinksArray : "Absent",
      externalLinks: externalLinksArray.length > 0 ? externalLinksArray : "Absent",
      images: images.length > 0 ? [...images] : "Absent",
      imageAltTags: imageAltTags.length > 0 ? [...imageAltTags] : "Absent",
      imagesWithNoAltTags: imagesWithNoAltTags.length > 0 ? [...imagesWithNoAltTags] : "Absent",
      brokenLinks: brokenLinks.length > 0 ? brokenLinks : "Absent",
      faviconUrl: faviconUrl.length > 0 ? faviconUrl : "Absent",
      seoFriendlyStatus,
      SSL: SSL ? "Present" : "Absent",
      localSEOSchemaStatus,
      googleTagManagerStatus,
      xmlSitemapUrl: xmlSitemapUrl && xmlSitemapUrl.length > 0 ? xmlSitemapUrl : "Absent",
    };
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

async function fetchMozData(url) {
  const accessId = "mozscape-ff795e92f1"; // Replace with your Moz Access ID
  const secretKey = "c750aa30ac76be2a5cd90e6b58a0b0ae"; // Replace with your Moz Secret Key
  const authHeader =
    "Basic " + Buffer.from(`${accessId}:${secretKey}`).toString("base64");

  try {
    const response = await axios({
      method: "POST",
      url: "https://lsapi.seomoz.com/v2/url_metrics",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      data: {
        targets: [url],
        metrics: ["url", "page_authority", "domain_authority", "spam_score"],
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data from Moz:", error.message);
    throw error;
  }
}

function displayFormattedData(data) {
  const formattedDataArray = [];

  if (!data || !data.results || data.results.length === 0) {
    formattedDataArray.push("No Moz data available.");
    return formattedDataArray;
  }

  data.results.forEach((result) => {
    formattedDataArray.push('Page Information:');
    formattedDataArray.push(`URL: ${result.page}`);
    formattedDataArray.push(`Title: ${result.title}`);
    formattedDataArray.push(`Last Crawled: ${result.last_crawled}`);
    formattedDataArray.push(`HTTP Code: ${result.http_code}`);
    formattedDataArray.push(`Pages to Page: ${result.pages_to_page}`);
    formattedDataArray.push(`Nofollow Pages to Page: ${result.nofollow_pages_to_page}`);
    formattedDataArray.push(`Redirect Pages to Page: ${result.redirect_pages_to_page}`);
    formattedDataArray.push(`External Pages to Page: ${result.external_pages_to_page}`);
    formattedDataArray.push(`External Nofollow Pages to Page: ${result.external_nofollow_pages_to_page}`);
    formattedDataArray.push(`External Redirect Pages to Page: ${result.external_redirect_pages_to_page}`);
    formattedDataArray.push(`Deleted Pages to Page: ${result.deleted_pages_to_page}`);
    formattedDataArray.push(`Root Domains to Page: ${result.root_domains_to_page}`);
    formattedDataArray.push(`Indirect Root Domains to Page: ${result.indirect_root_domains_to_page}`);
    formattedDataArray.push(`Deleted Root Domains to Page: ${result.deleted_root_domains_to_page}`);
    formattedDataArray.push(`Nofollow Root Domains to Page: ${result.nofollow_root_domains_to_page}`);
    formattedDataArray.push(`Pages to Subdomain: ${result.pages_to_subdomain}`);
    formattedDataArray.push(`Nofollow Pages to Subdomain: ${result.nofollow_pages_to_subdomain}`);
    formattedDataArray.push(`Redirect Pages to Subdomain: ${result.redirect_pages_to_subdomain}`);
    formattedDataArray.push(`External Pages to Subdomain: ${result.external_pages_to_subdomain}`);
    formattedDataArray.push(`External Nofollow Pages to Subdomain: ${result.external_nofollow_pages_to_subdomain}`);
    formattedDataArray.push(`External Redirect Pages to Subdomain: ${result.external_redirect_pages_to_subdomain}`);
    formattedDataArray.push(`Deleted Pages to Subdomain: ${result.deleted_pages_to_subdomain}`);
    formattedDataArray.push(`Root Domains to Subdomain: ${result.root_domains_to_subdomain}`);
    formattedDataArray.push(`Deleted Root Domains to Subdomain: ${result.deleted_root_domains_to_subdomain}`);
    formattedDataArray.push(`Nofollow Root Domains to Subdomain: ${result.nofollow_root_domains_to_subdomain}`);
    formattedDataArray.push(`Pages to Root Domain: ${result.pages_to_root_domain}`);
    formattedDataArray.push(`Nofollow Pages to Root Domain: ${result.nofollow_pages_to_root_domain}`);
    formattedDataArray.push(`Redirect Pages to Root Domain: ${result.redirect_pages_to_root_domain}`);
    formattedDataArray.push(`External Pages to Root Domain: ${result.external_pages_to_root_domain}`);
    formattedDataArray.push(`External Indirect Pages to Root Domain: ${result.external_indirect_pages_to_root_domain}`);
    formattedDataArray.push(`External Nofollow Pages to Root Domain: ${result.external_nofollow_pages_to_root_domain}`);
    formattedDataArray.push(`External Redirect Pages to Root Domain: ${result.external_redirect_pages_to_root_domain}`);
    formattedDataArray.push(`Deleted Pages to Root Domain: ${result.deleted_pages_to_root_domain}`);
    formattedDataArray.push(`Root Domains to Root Domain: ${result.root_domains_to_root_domain}`);
    formattedDataArray.push(`Indirect Root Domains to Root Domain: ${result.indirect_root_domains_to_root_domain}`);
    formattedDataArray.push(`Deleted Root Domains to Root Domain: ${result.deleted_root_domains_to_root_domain}`);
    formattedDataArray.push(`Nofollow Root Domains to Root Domain: ${result.nofollow_root_domains_to_root_domain}`);
    formattedDataArray.push(`Page Authority: ${result.page_authority}`);
    formattedDataArray.push(`Domain Authority: ${result.domain_authority}`);
    formattedDataArray.push(`Link Propensity: ${result.link_propensity}`);
    formattedDataArray.push(`Spam Score: ${result.spam_score}`);
    formattedDataArray.push(`Root Domains from Page: ${result.root_domains_from_page}`);
    formattedDataArray.push(`Nofollow Root Domains from Page: ${result.nofollow_root_domains_from_page}`);
    formattedDataArray.push(`Pages from Page: ${result.pages_from_page}`);
    formattedDataArray.push(`Nofollow Pages from Page: ${result.nofollow_pages_from_page}`);
    formattedDataArray.push(`Root Domains from Root Domain: ${result.root_domains_from_root_domain}`);
    formattedDataArray.push(`Nofollow Root Domains from Root Domain: ${result.nofollow_root_domains_from_root_domain}`);
    formattedDataArray.push(`Pages from Root Domain: ${result.pages_from_root_domain}`);
    formattedDataArray.push(`Nofollow Pages from Root Domain: ${result.nofollow_pages_from_root_domain}`);
    formattedDataArray.push(`Pages Crawled from Root Domain: ${result.pages_crawled_from_root_domain}`);
  });
  return formattedDataArray;
}

async function getPageSpeedMetrics(url, strategy) {
  try {
    const apiKey = "AIzaSyAUOoXZkYKSB5PRRdfD4AqUUI4N8FDKWrA"; // Replace with your actual API key
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      url
    )}&key=${apiKey}&strategy=${strategy}`;
    const response = await axios.get(apiUrl);

    if (!response.data.lighthouseResult) {
      console.error(
        `Error fetching ${strategy} PageSpeed metrics:`,
        response.data.error
      );
      // throw error;
      throw new Error(response.data.error);
    }

    const { audits } = response.data.lighthouseResult;

    const pageSpeedMetrics = {
      performanceScore:
        response.data.lighthouseResult.categories.performance.score * 100,
      firstContentfulPaint: audits["first-contentful-paint"].displayValue,
      largestContentfulPaint: audits["largest-contentful-paint"].displayValue,
      speedIndex: audits["speed-index"].displayValue,
      timeToInteractive: audits.interactive.displayValue,
      totalBlockingTime: audits["total-blocking-time"].displayValue,
    };

    return { [`${strategy}Metrics`]: pageSpeedMetrics, strategy };
  } catch (error) {
    console.error(
      `Error fetching ${strategy} PageSpeed metrics:`,
      error.message
    );
    return null;
  }
}

function displayPageSpeedMetrics(mobileMetrics, desktopMetrics) {
  const result = {};

  if (mobileMetrics) {
    result.mobileMetrics = mobileMetrics;
  }

  if (desktopMetrics) {
    result.desktopMetrics = desktopMetrics;
  }

  return result;
}

function generateSpeedTips(mobileMetrics, desktopMetrics) {
  const speedTips = {};

  if (mobileMetrics && desktopMetrics) {
    speedTips.usesNestedTable =
      mobileMetrics.speedTips && !mobileMetrics.speedTips.usesNestedTable
        ? "Too bad, your website uses nested tables."
        : "Excellent, your website doesn't use nested tables.";

    speedTips.usesInlineStyles =
      mobileMetrics.speedTips && !mobileMetrics.speedTips.usesInlineStyles
        ? "Too bad, your website is using inline styles."
        : "Excellent, your website doesn't use inline styles.";

    speedTips.tooManyCssFiles =
      mobileMetrics.speedTips && mobileMetrics.speedTips.tooManyCssFiles
        ? "Too bad, your website has too many CSS files (more than 4)."
        : "Excellent, your website has an optimal number of CSS files.";

    speedTips.tooManyJsFiles =
      mobileMetrics.speedTips && mobileMetrics.speedTips.tooManyJsFiles
        ? "Too bad, your website has too many JS files (more than 6)."
        : "Excellent, your website has an optimal number of JS files.";

    speedTips.usesGzip =
      mobileMetrics.speedTips && mobileMetrics.speedTips.usesGzip
        ? "Perfect, your website takes advantage of gzip."
        : "Too bad, your website doesn't take advantage of gzip.";
  }

  return speedTips;
}

function isValidLink(url) {
  return (
    validUrl.isWebUri(url) &&
    !url.includes("#") &&
    !url.match(/\.(jpg|jpeg|png|pdf|gif|svg)$/i)
  );
}

async function checkBrokenLinks(links) {
  const brokenLinks = [];
  for (const link of links) {
    try {
      console.log("Checking link:", link);
      const response = await axios.get(link, { httpsAgent });
      if (response.status >= 400) {
        brokenLinks.push(link);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        brokenLinks.push(link);
      } else if (error.code === "ENOTFOUND") {
        brokenLinks.push(link);
      }
    }
  }
  return brokenLinks;
}

function checkSEOFriendly(url) {
  const simplifiedUrl = url.replace(/^https?:\/\//, "");

  const containsSpecialCharacters = /[#!%]/.test(simplifiedUrl);
  const isShortEnough = simplifiedUrl.length <= 15;

  return !containsSpecialCharacters && isShortEnough;
}

async function checkSSL(url) {
  return url.startsWith("https://");
}

function fetchLocalSEOSchema($) {
  const schemaScript = $('script[type="application/ld+json"]').html();
  if (schemaScript) {
    return JSON.parse(schemaScript);
  } else {
    return null;
  }
}

function checkGoogleTagManager($) {
  const scriptSrcGTM =
    $('script[src*="googletagmanager.com/gtm.js"]').length > 0;
  const inlineScriptGTM =
    $("script").filter(function () {
      return $(this).html().includes("googletagmanager.com/gtm.js?id=");
    }).length > 0;

  return scriptSrcGTM || inlineScriptGTM ? "Present" : "Absent";
}

module.exports = {
  scrapeData: scrapeData,
  fetchMozData: fetchMozData,
  getPageSpeedMetrics: getPageSpeedMetrics,
};
