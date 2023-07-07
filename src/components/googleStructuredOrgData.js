import { graphql, useStaticQuery } from "gatsby";
import React from "react";

const useSiteMetadata = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          author
          title
          description
          image
          siteUrl
        }
      }
    }
  `);

  return data.site.siteMetadata;
};

export const GoogleStructuredOrgData = ({ post }) => {
  const { image, siteUrl } = useSiteMetadata();

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
