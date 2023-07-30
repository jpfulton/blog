import { graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import React from "react";

import GoogleStructuredOrgData from "../components/googleStructuredOrgData";
import Layout from "../components/layout";
import { MsPubCenterHeaderScripts } from "../components/msPubCenter";
import { OutboundLink } from "../components/outboundLink";
import RssLink from "../components/rssLink";
import Seo from "../components/seo";

class AuthorProfile extends React.Component {
  render() {
    const { data, location } = this.props;
    const siteTitle = data.site.siteMetadata.title;
    const author = data.site.siteMetadata.author;
    const linkedinUserName = data.site.siteMetadata.social.linkedin;
    const githubUserName = data.site.siteMetadata.social.github;

    return (
      <Layout location={location} title={siteTitle}>
        <Seo title={"Author Profile - " + siteTitle} />

        <section>
          <div class="row">
            <div>
              <StaticImage
                className="profile-pic center"
                layout="fixed"
                formats={["auto", "webp", "avif"]}
                src="../images/profile-pic.png"
                width={250}
                height={250}
                quality={95}
                alt="Profile picture"
              />
            </div>
            <div class="column">
              <h1>{author}</h1>
              <div>
                <OutboundLink
                  href={"https://www.linkedin.com/in/" + linkedinUserName}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="LinkedIn Profile"
                >
                  https://www.linkedin.com/in/{linkedinUserName}
                </OutboundLink>
              </div>
              <div>
                <OutboundLink
                  href={"https://github.com/" + githubUserName}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="GitHub Profile"
                >
                  https://github.com/{githubUserName}
                </OutboundLink>
              </div>
            </div>
          </div>
        </section>
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
        author
        social {
          github
          linkedin
        }
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
