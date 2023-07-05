import readingTime from "reading-time";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

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
      featuredImage: File @fileByRelativePath
    }

  `);
};
