import { graphql } from "gatsby";

export const siteMetadataFragment = graphql`
  fragment SiteMetadataFragment on SiteMetadata {
    title
    author
    description
    image
    siteUrl
    social {
      twitter
      github
      linkedin
    }
    ads {
      msPubCenter {
        siteId
        publisherId
      }
    }
  }
`;

export const ogDefaultImageFragment = graphql`
  fragment OgDefaultImageFragment on Query {
    openGraphDefaultImage: file(relativePath: { eq: "open-graph/code.png" }) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, height: 580, width: 1200)
      }
    }
  }
`;
