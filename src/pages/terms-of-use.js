import { graphql } from "gatsby";
import React from "react";

import GoogleStructuredOrgData from "../components/googleStructuredOrgData";
import Layout from "../components/layout";
import { MsPubCenterHeaderScripts } from "../components/msPubCenter";
import RssLink from "../components/rssLink";
import Seo from "../components/seo";

class TermsOfUse extends React.Component {
  render() {
    const { data, location } = this.props;
    const siteTitle = data.site.siteMetadata.title;

    return (
      <Layout location={location} title={siteTitle}>
        <Seo title={"Terms of Use - " + siteTitle} />
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
      }
    }
  }
`;

export const Head = () => {
  return (
    <>
      <GoogleStructuredOrgData />
      <RssLink />
      <MsPubCenterHeaderScripts />
    </>
  );
};

const Content = () => <></>;
