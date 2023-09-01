/// <reference path="../gatsby-types.d.ts" />
import { graphql, useStaticQuery } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import { Helmet } from "react-helmet";

export interface Props {
  description: string;
  lang: string;
  keywords: string[];
  title: string;
  openGraphImageSrc: string;
}

const Seo = ({
  description,
  lang,
  keywords,
  title,
  openGraphImageSrc,
}: Props) => {
  const { site, openGraphDefaultImage } = useStaticQuery<Queries.SeoQuery>(
    graphql`
      query Seo {
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
        openGraphDefaultImage: file(
          relativePath: { eq: "open-graph/code.png" }
        ) {
          childImageSharp {
            gatsbyImageData(layout: FIXED, height: 580, width: 1200)
          }
        }
      }
    `
  );

  const metaDescription: string =
    description || site?.siteMetadata?.description!;

  const imagePath = constructUrl(
    site?.siteMetadata?.siteUrl as string,
    openGraphImageSrc ??
      openGraphDefaultImage?.childImageSharp?.gatsbyImageData?.images?.fallback
        ?.src
  );

  const twitterCreator: string = site!.siteMetadata!.social!.twitter!;
  const twitterSite: string = site!.siteMetadata!.social!.twitter!;
  const joinedKeywords: string = keywords.length > 0 ? keywords.join(", ") : "";

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
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
          content: twitterCreator,
        },
        {
          name: `twitter:site`,
          content: twitterSite,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(
        keywords.length > 0
          ? {
              name: `keywords`,
              content: joinedKeywords,
            }
          : []
      )}
    />
  );
};

Seo.defaultProps = {
  lang: `en`,
  keywords: [],
  description: ``,
};

Seo.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  featuredImgSrc: PropTypes.string,
};

function constructUrl(baseUrl: string, path: string): string {
  if (baseUrl === "" || path === "") return "";
  return `${baseUrl}${path}`;
}

export default Seo;
