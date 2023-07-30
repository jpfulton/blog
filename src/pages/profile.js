import { graphql } from "gatsby";
import React from "react";

import GoogleStructuredOrgData from "../components/googleStructuredOrgData";
import Layout from "../components/layout";
import { MsPubCenterHeaderScripts } from "../components/msPubCenter";
import RssLink from "../components/rssLink";
import Seo from "../components/seo";

class AuthorProfile extends React.Component {
  render() {
    const { data, location } = this.props;
    const siteTitle = data.site.siteMetadata.title;

    return (
      <Layout location={location} title={siteTitle}>
        <Seo title={"Author Profile - " + siteTitle} />
      </Layout>
    );
  }
}

export default AuthorProfile;

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
