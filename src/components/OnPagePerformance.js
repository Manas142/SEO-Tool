import React, { useContext } from "react";
import LinkCard from "./LinkCard";
import appContext from "../context";

const OnPagePerformance = () => {
  const { value } = useContext(appContext);

  if (!value.scrapedData) {
    return <div>No data found</div>;
  }
  const { onPagePerformance } = value.scrapedData || {};

  const renderContent = (content) => {
    if (!content || content === "Absent") {
      return "Absent";
    }
    return "Present";
  }

  return (
    <div className="on-page-performance">
      <div className="cardSection1">
        <LinkCard
          title="SEO Friendly"
          content={onPagePerformance.seoFriendlyStatus ? "Yes" : "No"}
        />
        <LinkCard
          title="SSL Certificate"
          content={onPagePerformance.SSL ? "Valid" : "Invalid"}
        />
        <LinkCard
          title="Local SEO Schema"
          content={renderContent(onPagePerformance.localSEOSchemaStatus)}
        />
        <LinkCard
          title="Google Tag Manager"
          content={renderContent(onPagePerformance.googleTagManagerStatus)}
        />
        <LinkCard
          title="Text HTML Ratio"
          content={
            onPagePerformance.textHtmlRatio
              ? onPagePerformance.textHtmlRatio
              : "Absent"
          }
        />
        <LinkCard
          title="Flash Data"
          content={
            onPagePerformance.flashData ? onPagePerformance.flashData : "Absent"
          }
        />
      </div>
      <div className="cardSection2">
        <LinkCard
          title="Meta Description"
          content={onPagePerformance.metaDescription ? "Present" : "Absent"}
          cardContent={onPagePerformance.metaDescription}
        />

        <LinkCard
          title="Favicon URL"
          content={onPagePerformance.faviconUrl ? "Present" : "Absent"}
          cardContent={
            onPagePerformance.faviconUrl ? onPagePerformance.faviconUrl : null
          }
        />
        <LinkCard
          title="XML Site Map URL"
          content={renderContent(onPagePerformance.xmlSitemapUrl)}
          cardContent={onPagePerformance.xmlSitemapUrl}
        />

        <LinkCard
          title="Meta Title"
          content={onPagePerformance.metatitle ? "Present" : "Absent"}
          cardContent={onPagePerformance.metatitle}
        />

        <LinkCard
          title="Images with no Alt tags"
          content={
            Array.isArray(onPagePerformance.imagesWithNoAltTags)
              ? `${onPagePerformance.imagesWithNoAltTags.length} images`
              : onPagePerformance.imagesWithNoAltTags === "Absent"
                ? "Absent"
                : "0 links"
          }
          cardContent={onPagePerformance.imagesWithNoAltTags}
        />
        <LinkCard
          title="Internal Links"
          content={
            Array.isArray(onPagePerformance.internalLinks)
              ? `${onPagePerformance.internalLinks.length} links`
              : onPagePerformance.internalLinks === "Absent"
                ? "Absent"
                : "0 links"
          }
          cardContent={onPagePerformance.internalLinks}
        />
        <LinkCard
          title="External Links"
          content={
            Array.isArray(onPagePerformance.externalLinks)
              ? `${onPagePerformance.externalLinks.length} links`
              : onPagePerformance.externalLinks === "Absent"
                ? "Absent"
                : "0 links"
          }
          cardContent={onPagePerformance.externalLinks}
        />
        <LinkCard
          title="Broken Page Links"
          content={
            Array.isArray(onPagePerformance.brokenLinks)
              ? `${onPagePerformance.brokenLinks.length} links`
              : onPagePerformance.brokenLinks === "Absent"
                ? "Absent"
                : "0 links"
          }
          cardContent={onPagePerformance.brokenLinks}
        />
        <LinkCard
          title="Tag Data"
          content={
            Array.isArray(onPagePerformance.tagData)
              ? `${onPagePerformance.tagData.length} images`
              : onPagePerformance.tagData === "Absent"
                ? "Absent"
                : "0 links"
          }
          cardContent={onPagePerformance.tagData}
        />
      </div>
    </div>
  );
};

export default OnPagePerformance;
