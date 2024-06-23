import React, { useContext } from "react";
import LinkCard from "./LinkCard";
import appContext from "../context";

const DesktopPerformance = () => {
  const { value } = useContext(appContext);
  const { desktopPerformance } = value.scrapedData || {};
  

  if (!desktopPerformance) {
    return <div>No data found</div>; 
  }
  console.log(desktopPerformance);

  return (
    <div className="desktop-performance">
      <div className="cardSection2">
        <LinkCard
          title="Performance Score"
          content={desktopPerformance.performanceScore}
        />
        <LinkCard
          title="First Contentful Paint"
          content={desktopPerformance.firstContentfulPaint}
        />
        <LinkCard
          title="Largest Contentful Paint"
          content={desktopPerformance.largestContentfulPaint}
        />
        <LinkCard title="Speed Index" content={desktopPerformance.speedIndex} />
        <LinkCard
          title="Time To Interactive"
          content={desktopPerformance.timeToInteractive}
        />
        <LinkCard
          title="Total Blocking Time"
          content={desktopPerformance.totalBlockingTime}
        />
      </div>
    </div>
  );
};

export default DesktopPerformance;