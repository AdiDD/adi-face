import React from "react";

const Rank = ({ isSignedIn, name, entries }) => {
  return isSignedIn ? (
    <div>
      <div className="white f3">{name}, your entry count is...</div>
      <div className="white f1">{entries}</div>
    </div>
  ) : null;
};

export default Rank;
