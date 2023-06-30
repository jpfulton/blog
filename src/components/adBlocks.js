import React from "react";
import AdSense from "react-adsense";

export const InArticleAdBlock = () => (
  <AdSense.Google
    client="ca-pub-2306983857488873"
    slot="4601936166"
    style={{ display: "block" }}
    layout="in-article"
    format="fluid"
  />
);
