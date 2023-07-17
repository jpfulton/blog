import readingTime from "reading-time";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

const simpleGit = require(`simple-git`);
let latestBlogModification = new Date(1900, 1, 1);

export const onCreatePage = async ({ page, actions }) => {
  if (page.component.includes("blog-post.js")) {
    // looking for mdx blog posts
    const filePath = page.component.split("?__contentFilePath=").pop();
    const fileLog = await simpleGit().log({
      file: filePath,
      maxCount: 1,
      strictDate: true,
    });

    // update latestBlogModification date
    const gitLogDate = new Date(fileLog?.latest?.date);
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

export const createPages = ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const blogPost = path.resolve(`./src/templates/blog-post.js`);

  return graphql(
    `
      {
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
    `
  ).then((result) => {
    if (result.errors) {
      reporter.panicOnBuild("Error loading mdx result.", result.errors);
    }

    // Create blog posts pages.
    const posts = result.data.allMdx.edges;

    posts.forEach((post, index) => {
      const previous =
        index === posts.length - 1 ? null : posts[index + 1].node;
      const next = index === 0 ? null : posts[index - 1].node;

      createPage({
        path: `blog${post.node.fields.slug}`,
        component: `${blogPost}?__contentFilePath=${post.node.internal.contentFilePath}`,
        context: {
          id: post.node.id,
          slug: post.node.fields.slug,
          keywords: post.node.frontmatter.keywords,
          previous: previous,
          next: next,
        },
      });
    });
  });
};

export const onCreateNode = ({ node, actions, getNode }) => {
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
      value: readingTime(node.body),
    });
  }
};

export const createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type Mdx implements Node {
      frontmatter: MdxFrontmatter
    }

    type MdxFrontmatter @infer {
      openGraphImage: File @fileByRelativePath
      primaryImage: File @fileByRelativePath
    }

  `);
};
