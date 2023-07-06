import { MDXProvider } from "@mdx-js/react";
import { Link, graphql } from "gatsby";
import React from "react";

import Bio from "../components/bio";
import Layout from "../components/layout";
import Seo from "../components/seo";
import Tags from "../components/tags";

import { rhythm, scale } from "../utils/typography";

import { InArticleAdBlock } from "../components/adBlocks";
import { OutboundLink } from "../components/outboundLink";

const shortcodes = { InArticleAdBlock, Link }; // short cuts to components to be used in mdx templates
const overrides = { a: OutboundLink }; // overrides of tags to replacement components to be used in mdx templates

const components = { ...overrides, ...shortcodes }; // components passed to the MDXRenderer

function BlogPostTemplate({
  location,
  pageContext,
  data: { mdx, site },
  children,
}) {
  const post = mdx;
  const siteTitle = site.siteMetadata.title;
  const featuredImageSrc =
    post.frontmatter.featuredImage?.childImageSharp.gatsbyImageData.images
      .fallback.src;
  const { previous, next } = pageContext;

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        keywords={post.frontmatter.keywords}
        featuredImageSrc={featuredImageSrc}
      />
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

      <MDXProvider components={components}>{children}</MDXProvider>

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
    </Layout>
  );
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
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
        featuredImage {
          childImageSharp {
            gatsbyImageData(layout: FIXED, height: 580, width: 1200)
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
  }
`;
