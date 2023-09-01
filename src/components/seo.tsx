/// <reference path="../gatsby-types.d.ts" />
import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Helmet } from "react-helmet";

export interface Props {
  description: string | undefined;
  lang: string | undefined;
  keywords: string[] | undefined;
  title: string;
  openGraphImageSrc: string | undefined;
}

const Seo = ({
  description,
  lang,
  keywords,
  title,
  openGraphImageSrc,
}: Partial<Props>) => {
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
        ?.src!
  );

  const twitterCreator: string = site!.siteMetadata!.social!.twitter!;
  const twitterSite: string = site!.siteMetadata!.social!.twitter!;
  const joinedKeywords: string =
    keywords && keywords.length > 0 ? keywords.join(", ") : "";

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
        keywords && keywords.length > 0
          ? {
              name: `keywords`,
              content: joinedKeywords,
            }
          : []
      )}
    />
  );
};

function constructUrl(baseUrl: string, path: string): string {
  if (baseUrl === "" || path === "") return "";
  return `${baseUrl}${path}`;
}

export default Seo;