
import React, { useContext } from "react";
import LinkCard from "./LinkCard";
import appContext from "../context";

const MobilePerformance = () => {
  const { value } = useContext(appContext);
  const { mobilePerformance } = value.scrapedData || {};


  if (!mobilePerformance) {
    return <div>No data found</div>; 
  }
  console.log(mobilePerformance);

  return (
    <div className="mobile-performance">
      <div className="cardSection2">
        <LinkCard
          title="Performance Score"
          content={mobilePerformance.performanceScore}
        />
        <LinkCard
          title="First Contentful Paint"
          content={mobilePerformance.firstContentfulPaint}
        />
        <LinkCard
          title="Largest Contentful Paint"
          content={mobilePerformance.largestContentfulPaint}
        />
        <LinkCard title="Speed Index" content={mobilePerformance.speedIndex} />
        <LinkCard
          title="Time To Interactive"
          content={mobilePerformance.timeToInteractive}
        />
        <LinkCard
          title="Total Blocking Time"
          content={mobilePerformance.totalBlockingTime}
        />
      </div>
    </div>
  );
};

export default MobilePerformance;
