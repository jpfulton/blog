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
        }
      }
      ogDefaultImage: file(relativePath: { eq: "open-graph/code.png" }) {
        childImageSharp {
          gatsbyImageData(layout: FIXED, height: 580, width: 1200)
        }
      }
    }
  `);

  return data;
};

export const GoogleStructuredArticleData = ({ post }) => {
  const { site, ogDefaultImage } = useSiteMetadata();

  const date = post.frontmatter.date;
  const headline = post.frontmatter.title;
  const description = post.frontmatter.description ?? post.excerpt;

  const fallbackImageUrl = `${site.siteMetadata.siteUrl}${ogDefaultImage.childImageSharp.gatsbyImageData.images.fallback.src}`;
  const imageUrl = `${site.siteMetadata.siteUrl}${post.frontmatter.featuredImage?.childImageSharp.gatsbyImageData.images.fallback.src}`;

  const logoUrl = `${site.siteMetadata.siteUrl}${site.siteMetadata.image}`;

  const articleData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: headline,
    description: description,
    author: [
      {
        "@type": "Person",
        name: site.siteMetadata.author,
      },
    ],
    image: imageUrl ?? fallbackImageUrl,
    datePublished: new Date(date).toISOString(),
    dateModified: new Date(date).toISOString(),
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
