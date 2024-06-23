import React from 'react';
import '../SpamScore.css'; // Adjust the path if necessary

const SpamScore = ({ score }) => {
  let scoreColor = 'green'; // default to green
  if (score >= 4 && score <= 5) {
    scoreColor = 'orange';
  } else if (score >= 6 && score <= 10) {
    scoreColor = 'red';
  }

  // Calculate width as a percentage of the score out of 10
  const scoreWidth = `${(score / 10) * 100}%`;

  return (
    <div className="spam-score">
      <div className="score-indicator" style={{ color: scoreColor }}>
        {score}
      </div>
      <div className="score-bar">
        <div className="score-fill" style={{ width: scoreWidth, backgroundColor: scoreColor }}></div>
      </div>
      <div className="score-labels">
        <span className="low">Low</span>
        <span className="medium">Medium</span>
        <span className="high">High</span>
      </div>
    </div>
  );
};

export default SpamScore;
