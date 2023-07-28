import { graphql, useStaticQuery } from "gatsby";
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

export const MsPubCenterHeaderScripts = () => {
  const { site } = useStaticQuery(
    graphql`
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
    `
  );

  const siteId = site.siteMetadata.ads.msPubCenter.siteId;
  const publisherId = site.siteMetadata.ads.msPubCenter.publisherId;
  const msPubCenterScriptSrc = `https://adsdk.microsoft.com/pubcenter/sdk.js?siteId=${siteId}&publisherId=${publisherId}`;

  return (
    <>
      <script id="msAdsQueue">
        window.msAdsQueue = window.msAdsQueue || [];
      </script>
      <script
        id="msAdsSdk"
        async
        src={msPubCenterScriptSrc}
        crossorigin="anonymous"
      ></script>
    </>
  );
};
