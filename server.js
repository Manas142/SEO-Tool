const express = require('express');
const validUrl = require('valid-url');
const { scrapeData } = require('./fetch'); 
const { fetchMozData } = require('./fetch'); 
const { getPageSpeedMetrics } = require('./fetch'); 
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

function isValidUrl(url) {
    return validUrl.isWebUri(url);
}

// app.get("/scrape", async (req, res) => {
//     const url = req.query.url;

app.post("/scrape", async (req, res) => {
    const url = req.body.url;
    console.log(url);

    if (!url || !isValidUrl(url)) {
        return res.status(400).json({ error: "Invalid URL provided" });
    }

    try {
        const [result, mozresult, mobileresult, desktopresult] = await Promise.all([
          scrapeData(url),
          fetchMozData(url),
          getPageSpeedMetrics(url, "mobile"),
          getPageSpeedMetrics(url, "desktop"),
        ]);

        const onPagePerformance = {
            metatitle: result.title,
            metaDescription: result.metaDescription,
            tagData: result.tagData,
            textHtmlRatio: result.textHtmlRatio,
            flashData: result.flashData,
            internalLinks: result.internalLinks,
            externalLinks: result.externalLinks,
            brokenLinks: result.brokenLinks,
            imagesWithNoAltTags: result.imagesWithNoAltTags,
            faviconUrl: result.faviconUrl,
            seoFriendlyStatus: result.seoFriendlyStatus,
            SSL: result.SSL,
            localSEOSchemaStatus: result.localSEOSchemaStatus,
            googleTagManagerStatus: result.googleTagManagerStatus,
            xmlSitemapUrl: result.xmlSitemapUrl,
        };

        const offPagePerformance = {
            WebPage: mozresult.results[0].page,
            DomainAuthority: mozresult.results[0].domain_authority,
            PageAuthority: mozresult.results[0].page_authority,
            LinkPropensity: mozresult.results[0].link_propensity.toFixed(2),
            SpamScore: Math.max(mozresult.results[0].spam_score, 0),
            HttpCode: mozresult.results[0].http_code,
            PagesToPage: mozresult.results[0].pages_to_page,
        };

        const mobilePerformance = {
            performanceScore: mobileresult.mobileMetrics.performanceScore.toFixed(2),
            firstContentfulPaint:  mobileresult.mobileMetrics.firstContentfulPaint,
            largestContentfulPaint:  mobileresult.mobileMetrics.largestContentfulPaint,
            speedIndex: mobileresult.mobileMetrics.speedIndex,
            timeToInteractive: mobileresult.mobileMetrics.timeToInteractive,
            totalBlockingTime: mobileresult.mobileMetrics.totalBlockingTime,
        };

        const desktopPerformance = {
            performanceScore: desktopresult.desktopMetrics.performanceScore.toFixed(2),
            firstContentfulPaint:  desktopresult.desktopMetrics.firstContentfulPaint,
            largestContentfulPaint:  desktopresult.desktopMetrics.largestContentfulPaint,
            speedIndex: desktopresult.desktopMetrics.speedIndex,
            timeToInteractive: desktopresult.desktopMetrics.timeToInteractive,
            totalBlockingTime: desktopresult.desktopMetrics.totalBlockingTime,
        }
        
        const data = {
            onPagePerformance,
            offPagePerformance,
            mobilePerformance,
            desktopPerformance,
        };

        res.json(data);
        
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



