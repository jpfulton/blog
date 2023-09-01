import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { DeepNonNullable } from "utility-types";

export const GoogleStructuredOrgData = () => {
  const data = useStaticQuery<
    DeepNonNullable<Queries.GoogleStructuredOrgDataQuery>
  >(graphql`
    query GoogleStructuredOrgData {
      site {
        siteMetadata {
          image
          siteUrl
        }
      }
    }
  `);

  const { image, siteUrl } = data.site.siteMetadata;

  const logoUrl = `${siteUrl}${image}`;
  const orgData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    url: siteUrl,
    logo: logoUrl,
  };

  return <script type="application/ld+json">{JSON.stringify(orgData)}</script>;
};

export default GoogleStructuredOrgData;
