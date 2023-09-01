import type { GatsbyNode } from "gatsby";

import { createFilePath } from "gatsby-source-filesystem";
import path from "path";
import readingTime from "reading-time";
import { simpleGit } from "simple-git";

let latestBlogModification = new Date(1900, 1, 1);

export const onCreatePage: GatsbyNode["onCreatePage"] = async ({
  page,
  actions,
}) => {
  if (page.component.includes("blog-post.tsx")) {
    // looking for mdx blog posts
    const filePath = page.component.split("?__contentFilePath=").pop();
    const fileLog = await simpleGit().log({
      file: filePath,
      maxCount: 1,
      strictDate: true,
    });

    // update latestBlogModification date
    const gitLogDate = new Date(fileLog.latest?.date as string);
    if (latestBlogModification < gitLogDate) {
      latestBlogModification = gitLogDate;
    }

    return;
  }

  // blogs are processed first, elements under src/pages/ second
  // allows the accurate setting of the lastBlogModification module
  // variable
  if (page.path === "/") {
    // looking only for the root index page
    const { createPage } = actions;
    return createPage({
      ...page,
      context: {
        ...page.context,

        // set the lastMod key to override the value that would
        // have been set in the gatsby-plugin-git-lastmod plugin
        // for use in sitemap generation
        lastMod: latestBlogModification.toISOString(),
      },
    });
  }
};

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
  reporter,
}) => {
  const { createPage } = actions;

  const blogPost = path.resolve(`./src/templates/blog-post.tsx`);

  const result = await graphql<Queries.AllMdxNodesQuery>(`
    query AllMdxNodes {
      allMdx(sort: { frontmatter: { date: DESC } }, limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              title
              keywords
            }
            internal {
              contentFilePath
            }
          }
        }
      }
    }
  `);

  if (result.errors || !result.data) {
    reporter.panicOnBuild("Error loading mdx result.", result.errors);
  }

  // Create blog posts pages.
  const posts = result.data?.allMdx?.edges ?? [];

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;

    createPage({
      path: `blog${post.node?.fields?.slug}`,
      component: `${blogPost}?__contentFilePath=${post.node.internal.contentFilePath}`,
      context: {
        id: post.node.id,
        slug: post.node?.fields?.slug,
        keywords: post.node?.frontmatter?.keywords,
        previous: previous,
        next: next,
      },
    });
  });
};

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
  node,
  actions,
  getNode,
}) => {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });

    createNodeField({
      name: "timeToRead",
      node,
      value: readingTime(node.body as string),
    });
  }
};

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    const { createTypes } = actions;

    createTypes(`
    type Site {
      siteMetadata: SiteMetadata!
    }

    type SiteMetadata {
      title: String!
      author: String!
      description: String!
      siteUrl: String!
      social: Social!
    }

    type Social {
      twitter: String!
      github: String!
      linkedin: String!
    }

    type Mdx implements Node {
      frontmatter: MdxFrontmatter!
    }

    type MdxFrontmatter @infer {
      openGraphImage: File @fileByRelativePath
      primaryImage: File @fileByRelativePath
      embeddedImages: [File] @fileByRelativePath
    }

  `);
  };
