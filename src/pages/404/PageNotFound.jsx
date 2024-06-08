import React from "react";

import "./style.scss";

import ContentWrapper from "../../components/contentWrapper/ContentWrapper";

const PageNotFound = () => {
  return (
    <div className="pageNotFound">
      <ContentWrapper>
        <span className="bigText">404</span>
        <span className="smallText">یه جای راهو اشتباه رفتی 🤔</span>
      </ContentWrapper>
    </div>
  );
};

export default PageNotFound;
