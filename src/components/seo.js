import { graphql, useStaticQuery } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import { Helmet } from "react-helmet";

function Seo({ description, lang, meta, keywords, title, openGraphImageSrc }) {
  const { site, ogDefaultImage } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            siteUrl
            social {
              twitter
            }
          }
        }
        ogDefaultImage: file(relativePath: { eq: "open-graph/code.png" }) {
          childImageSharp {
            gatsbyImageData(layout: FIXED, height: 580, width: 1200)
          }
        }
      }
    `
  );

  const metaDescription = description || site.siteMetadata.description;

  const imagePath = constructUrl(
    site.siteMetadata.siteUrl,
    openGraphImageSrc ??
      ogDefaultImage.childImageSharp.gatsbyImageData.images.fallback.src
  );

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:image`,
          content: imagePath,
        },
        {
          property: `twitter:image`,
          content: imagePath,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.social.twitter,
        },
        {
          name: `twitter:site`,
          content: site.siteMetadata.social.twitter,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ]
        .concat(
          keywords.length > 0
            ? {
                name: `keywords`,
                content: keywords.join(`, `),
              }
            : []
        )
        .concat(meta)}
    />
  );
}

Seo.defaultProps = {
  lang: `en`,
  meta: [],
  keywords: [],
  description: ``,
};

Seo.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  featuredImgSrc: PropTypes.string,
};

function constructUrl(baseUrl, path) {
  if (baseUrl === "" || path === "") return "";
  return `${baseUrl}${path}`;
}

export default Seo;
