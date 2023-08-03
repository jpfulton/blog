import { Link, graphql } from "gatsby";
import React from "react";

import Bio from "../components/bio";
import CustomMDXProvider from "../components/customMDXProvider";
import GoogleStructuredArticleData from "../components/googleStructureArticleData";
import Layout from "../components/layout";
import { MsPubCenterHeaderScripts } from "../components/msPubCenter";
import RelatedPosts from "../components/relatedPosts";
import RssLink from "../components/rssLink";
import Seo from "../components/seo";
import Tags from "../components/tags";

import { rhythm, scale } from "../utils/typography";

function BlogPostTemplate({
  location,
  pageContext,
  data: { openGraphDefaultImage, mdx, site, allMdx },
  children,
}) {
  const post = mdx;
  const relatedPosts = allMdx.edges;

  const siteTitle = site.siteMetadata.title;
  const openGraphImageSrc =
    post.frontmatter.openGraphImage?.childImageSharp.gatsbyImageData.images
      .fallback.src;

  const { previous, next } = pageContext;

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        keywords={post.frontmatter.keywords}
        openGraphImageSrc={openGraphImageSrc}
      />
      <article data-clarity-region="article">
        <h1>{post.frontmatter.title}</h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: `block`,
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          {post.frontmatter.date} - {post.fields.timeToRead.text} (
          {post.fields.timeToRead.words} words)
        </p>

        <CustomMDXProvider>{children}</CustomMDXProvider>

        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />

        <Bio />

        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />

        <Tags tags={post.frontmatter.keywords}></Tags>
      </article>

      <RelatedPosts
        openGraphDefaultImage={openGraphDefaultImage}
        rootSlug={pageContext.slug}
        relatedPosts={relatedPosts}
      ></RelatedPosts>

      <nav>
        <ul
          class="prev-and-next"
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={`/blog${previous.fields.slug}`} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={`/blog${next.fields.slug}`} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
        <Link className="footer-link-home" to="/">
          ← {siteTitle}
        </Link>
      </nav>
    </Layout>
  );
}

export default BlogPostTemplate;

export const Head = ({ pageContext, data: { mdx } }) => {
  const lastModified = pageContext?.lastMod;

  return (
    <>
      <GoogleStructuredArticleData post={mdx} lastModified={lastModified} />
      <RssLink />
      <MsPubCenterHeaderScripts />
    </>
  );
};

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!, $keywords: [String]!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    openGraphDefaultImage: file(relativePath: { eq: "open-graph/code.png" }) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 150)
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        keywords
        openGraphImage {
          childImageSharp {
            gatsbyImageData(layout: FIXED, height: 580, width: 1200)
          }
        }
        embeddedImages {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      fields {
        timeToRead {
          minutes
          text
          time
          words
        }
      }
    }
    allMdx(
      filter: { frontmatter: { keywords: { in: $keywords } } }
      sort: [{ frontmatter: { date: DESC } }, { frontmatter: { title: ASC } }]
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
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
          fields {
            slug
          }
        }
      }
    }
  }
`;
