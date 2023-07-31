import { graphql, useStaticQuery } from "gatsby";
import React from "react";

const useSiteMetadata = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          author
          image
          siteUrl
          social {
            github
          }
        }
      }
      openGraphDefaultImage: file(relativePath: { eq: "open-graph/code.png" }) {
        childImageSharp {
          gatsbyImageData(layout: FIXED, height: 580, width: 1200)
        }
      }
    }
  `);

  return data;
};

export const GoogleStructuredArticleData = ({ post, lastModified }) => {
  const { site, openGraphDefaultImage } = useSiteMetadata();

  const date = post.frontmatter.date;
  const headline = post.frontmatter.title;
  const description = post.frontmatter.description ?? post.excerpt;

  const fallbackImageUrl = `${site.siteMetadata.siteUrl}${openGraphDefaultImage.childImageSharp.gatsbyImageData.images.fallback.src}`;
  const imageUrl = `${site.siteMetadata.siteUrl}${post.frontmatter.openGraphImage?.childImageSharp.gatsbyImageData.images.fallback.src}`;

  const logoUrl = `${site.siteMetadata.siteUrl}${site.siteMetadata.image}`;
  const profileUrl = `${site.siteMetadata.siteUrl}/profile/`;

  const articleData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: headline,
    description: description,
    author: [
      {
        "@type": "Person",
        name: site.siteMetadata.author,
        url: `${profileUrl}`,
      },
    ],
    image: imageUrl ?? fallbackImageUrl,
    datePublished: new Date(date).toISOString(),
    dateModified: lastModified ?? new Date(date).toISOString(),
    publisher: {
      "@type": "Organization",
      url: site.siteMetadata.siteUrl,
      logo: logoUrl,
    },
  };

  return (
    <script type="application/ld+json">{JSON.stringify(articleData)}</script>
  );
};

export default GoogleStructuredArticleData;
