import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { v4 as uuidv4 } from "uuid";

export const InArticleAdUnit = () => {
  const randomId = uuidv4();
  const divId = `ms-ad-${randomId}`;
  const scriptContents = `window.msAdsQueue.push(() => { 
        window.pubCenterSdk.render({ 
          adUnitId: "552417268", 
          elementId: "${divId}" 
        }); 
      }); 
    `;

  return (
    <>
      <div id={divId}></div>
      <script dangerouslySetInnerHTML={{ __html: scriptContents }}></script>
    </>
  );
};

export const InFeedAdUnit = () => {
  const randomId = uuidv4();
  const divId = `ms-ad-${randomId}`;
  const scriptContents = `window.msAdsQueue.push(() => { 
        window.pubCenterSdk.render({ 
          adUnitId: "1854037636", 
          elementId: "${divId}" 
        }); 
      }); 
    `;

  return (
    <>
      <div className="feed-ad-divider-top">
        <hr />
      </div>
      <div id={divId}></div>
      <script dangerouslySetInnerHTML={{ __html: scriptContents }}></script>
      <div className="feed-ad-divider-bottom">
        <hr />
      </div>
    </>
  );
};

export const MsPubCenterHeaderScripts = () => {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          ads {
            msPubCenter {
              siteId
              publisherId
            }
          }
        }
      }
    }
  `);

  const siteId = site.siteMetadata.ads.msPubCenter.siteId;
  const publisherId = site.siteMetadata.ads.msPubCenter.publisherId;
  const msPubCenterScriptSrc = `https://adsdk.microsoft.com/pubcenter/sdk.js?siteId=${siteId}&publisherId=${publisherId}`;

  return (
    <>
      <script>window.msAdsQueue = window.msAdsQueue || [];</script>
      <script async src={msPubCenterScriptSrc} crossOrigin="anonymous"></script>
    </>
  );
};
