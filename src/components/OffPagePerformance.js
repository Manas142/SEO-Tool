import React, { useContext } from "react";
import LinkCard from "./LinkCard";
import appContext from "../context";
import SpamScore from "./SpamScore";

const OffPagePerformance = () => {
  const { value } = useContext(appContext);
  const { offPagePerformance } = value.scrapedData || {};

  if (!offPagePerformance) {
    return <div>No data found</div>;
  }

  return (
    <div className="off-page-performance">
      <div className="cardSection1">
      </div>

      <div className="cardSection2">
        <LinkCard
          title="Web Page"
          content={
            offPagePerformance.WebPage ? offPagePerformance.WebPage : "Absent"
          }
        />
        <LinkCard
          title="Domain Authority"
          content={
            offPagePerformance.DomainAuthority
            ? offPagePerformance.DomainAuthority
            : "Absent"
          }
        />
        <LinkCard
          title="Page Authority"
          content={
            offPagePerformance.PageAuthority
              ? offPagePerformance.PageAuthority
              : "Absent"
          }
        />
        <LinkCard
          title="Link Propensity"
          content={
            offPagePerformance.LinkPropensity
              ? offPagePerformance.LinkPropensity
              : "Absent"
          }
        />
        {/* <LinkCard
          title="Spam Score"
          content={
            offPagePerformance.SpamScore ? offPagePerformance.SpamScore : "Absent"
          }
        /> */}
        <LinkCard
          title="Http Code"
          content={
            offPagePerformance.HttpCode ? offPagePerformance.HttpCode : "Absent"
          }
        />
        <LinkCard
          title="Pages to Page"
          content={
            offPagePerformance.PagesToPage
            ? offPagePerformance.PagesToPage
            : "Absent"
          }
        />
          <LinkCard
            title="Spam Score"
            content={
              offPagePerformance.SpamScore ? (
                <SpamScore score={offPagePerformance.SpamScore} />
              ) : (
                "Absent"
              )
            }
          />
      </div>
    </div>
  );
};

export default OffPagePerformance;
