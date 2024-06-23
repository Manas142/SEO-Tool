
import React, { useState } from "react";
import "../LinkCard.css"; // Ensure this CSS file is correctly linked
import { tooltipMap } from "../constants";

const LinkCard = ({ title, content, cardContent }) => {
  const [contentListVisible, setContentListVisible] = useState(false);
  const [tooltip, setToolTip] = useState();

  const [tabIndex, setTabIndex] = useState(0);

  const handleContentListToggle = () => {
    setContentListVisible(!contentListVisible);
  };
  // Determine if there is content to display and thus if the toggle arrow should be shown
  const hasContent = Array.isArray(cardContent)
    ? cardContent.length > 0
    : cardContent === "Absent"
      ? false
      : !!cardContent;

  const isTagData = title === "Tag Data";

  return (
    <div className="card-container">
      <div className="card">
        <div className="cardHeader">
          <div className="card-titleGroup">
            <h5 className="card-title">
              {title}
            </h5>
            {hasContent && (
              <i onClick={handleContentListToggle}
                style={{ cursor: "pointer" }}
                className={`px-3 chevron pointer bi bi-caret-down-fill ${contentListVisible ? "active" : ""}`}></i>
            )}
          </div>
          {tooltipMap[title] && (
            <span
              className="info-button"
              onMouseLeave={() => setToolTip(false)}
              onMouseEnter={() => setToolTip(true)}
            >
              <i data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tooltip on top" className="bi bi-info-circle-fill"></i>
              {tooltip && (
                <span className="infoTooltip">{tooltipMap[title]}</span>
              )}
            </span>
          )}
        </div>
        <div className={
          contentListVisible
            ? "cardBody expanded"
            : "cardBody"
        }>

          {isTagData ? (
            <div className="tag-tabs">
              <div className="tabHeader">
                {Object.keys(cardContent).map((element, index) => (
                  <div
                    key={element + index}
                    className={`tab ${index === tabIndex ? "active" : ""}`}
                    onClick={() => setTabIndex(index)}
                  >
                    <span>{element}</span>
                    <span>{cardContent[element].length}</span>
                  </div>
                ))}
              </div>
              {contentListVisible && (
                <div className="tabPanel">
                  {Object.keys(cardContent).map((element, index) => {
                    return (
                      <div
                        key={element}
                        className={`tabContent ${index === tabIndex ? "show" : "hide"
                          }`}
                      >
                        <ul>
                          {cardContent[element].map((item, idx) => {
                            return (
                              <li key={item + idx} className="tagItem">
                                {item}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="card-text">
              {contentListVisible ? (
                <div>
                  {Array.isArray(cardContent) ? (
                    cardContent.map((item, index) => (
                      <li className="tagItem" key={index}>{item}</li>
                    ))
                  ) : (
                    <div className="desc">{cardContent}</div>
                  )}
                </div>
              ) : (
                <div>{content}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkCard;
