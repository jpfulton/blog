import { graphql } from "gatsby";
import React from "react";

import GoogleStructuredOrgData from "../components/googleStructuredOrgData";
import Layout from "../components/layout";
import Seo from "../components/seo";

class TermsOfUse extends React.Component {
  render() {
    const { data, location } = this.props;
    const siteTitle = data.site.siteMetadata.title;

    return (
      <Layout location={location} title={siteTitle}>
        <Seo title={siteTitle} />
        <Content />
      </Layout>
    );
  }
}

export default TermsOfUse;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        ads {
          msPubCenter {
            siteId
            publisherId
          }
        }
      }
    }
  }
`;

export const Head = ({ data: { site } }) => {
  const siteId = site.siteMetadata.ads.msPubCenter.siteId;
  const publisherId = site.siteMetadata.ads.msPubCenter.publisherId;
  const msPubCenterScriptSrc = `https://adsdk.microsoft.com/pubcenter/sdk.js?siteId=${siteId}&publisherId=${publisherId}`;

  return (
    <>
      <GoogleStructuredOrgData />
      <link
        rel="alternate"
        title="jpatrickfulton.dev"
        type="application/rss+xml"
        href="/rss.xml"
      />
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

const Content = () => <></>;
