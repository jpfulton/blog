import React from "react"
import { Link, graphql } from "gatsby"
// import { MDXRenderer } from "gatsby-plugin-mdx"
// import { MDXProvider } from "@mdx-js/react"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { rhythm, scale } from "../utils/typography"

function BlogPostTemplate({ pageContext, data: { mdx, site }, children }) {
  const post = mdx
  const siteTitle = site.siteMetadata.title
  // const { previous, next } = pageContext

  return (
    <Layout location={pageContext.location} title={siteTitle}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
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
        {post.frontmatter.date}
      </p>

        {children}
      
      <hr
        style={{
          marginBottom: rhythm(1),
        }}
      />
      <Bio />

      
    </Layout>
  )
}

export default BlogPostTemplate

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
      body
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`
