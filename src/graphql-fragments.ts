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
