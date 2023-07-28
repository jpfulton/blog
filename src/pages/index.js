import { graphql } from "gatsby";
import React from "react";

import Bio from "../components/bio";
import GoogleStructuredOrgData from "../components/googleStructuredOrgData";
import Layout from "../components/layout";
import { MsPubCenterHeaderScripts } from "../components/msPubCenter";
import RssLink from "../components/rssLink";
import SearchPosts from "../components/searchPosts";
import Seo from "../components/seo";

class Blog extends React.Component {
  render() {
    const { data, location } = this.props;
    const siteTitle = data.site.siteMetadata.title;
    const posts = data.allMdx.edges;
    const localSearchBlog = data.localSearchBlog;
    const openGraphDefaultImage = data.openGraphDefaultImage;

    return (
      <Layout location={location} title={siteTitle}>
        <Seo title={siteTitle} />
        <Bio />
        <SearchPosts
          posts={posts}
          localSearchBlog={localSearchBlog}
          location={location}
          openGraphDefaultImage={openGraphDefaultImage}
        />
      </Layout>
    );
  }
}

export default Blog;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    openGraphDefaultImage: file(relativePath: { eq: "open-graph/code.png" }) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 150)
      }
    }
    localSearchBlog {
      index
      store
    }
    allMdx(sort: { frontmatter: { date: DESC } }) {
      edges {
        node {
          excerpt
          fields {
            slug
            timeToRead {
              minutes
              text
              time
              words
            }
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            keywords
            openGraphImage {
              childImageSharp {
                gatsbyImageData(layout: FIXED, width: 150)
              }
            }
            primaryImage {
              childImageSharp {
                gatsbyImageData(layout: FIXED, width: 150)
              }
            }
          }
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
