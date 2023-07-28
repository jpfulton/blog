import React from "react";

export const InArticleAdUnit = () => {
  const randomId = Math.floor(Math.random() * 10000);
  const divId = `ms-ad-${randomId}`;
  const scriptContents = `window.msAdsQueue.push(() => { 
        window.pubCenterSdk.render({ 
          adUnitId: "591354238", 
          elementId: "${divId}" 
        }); 
      }); 
    `;

  return (
    <>
      <div id={divId}></div>
      <script>${scriptContents}</script>
    </>
  );
};
