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

export const frontmatterFragment = graphql`
  fragment MdxFrontmatterFragment on MdxFrontmatter {
    date(formatString: "MMMM DD, YYYY")
    description
    keywords
    title
  }
`;

export const frontmatterWithThumbnailsFragment = graphql`
  fragment MdxFrontmatterWithThumbnailsFragment on MdxFrontmatter {
    ...MdxFrontmatterFragment
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
`;
