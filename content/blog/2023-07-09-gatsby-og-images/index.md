---
title: Adding Open Graph Images to a Gatsby Site
date: 2023-07-09
description: ""
keywords: ["gatsbyjs", "open graph", "markdown", "blog"]
openGraphImage: ../../../src/images/open-graph/gatsby.png
---

The evolving **GitHub repository** storing this blog and its implementation can be
found [here](https://github.com/jpfulton/blog).

## Table of Contents

## Extending the GraphQL Frontmatter Definition

```javascript:title=gatsby-node.mjs {numberLines: true}
export const createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type Mdx implements Node {
      frontmatter: MdxFrontmatter
    }

    type MdxFrontmatter @infer {
      openGraphImage: File @fileByRelativePath
    }
  `);
};
```

## Key Commits

- [92132ab](https://github.com/jpfulton/blog/commit/92132abaebc6b27e2ae1f5ff339c59e6a46953e2)
- [b57fcaa](https://github.com/jpfulton/blog/commit/b57fcaa246375feb4167c57d6094a54292e9ab71)
- [bb13f79](https://github.com/jpfulton/blog/commit/bb13f798740d6f46430d97f0e5a4cafcee52d20d)
- [48c080d](https://github.com/jpfulton/blog/commit/48c080dc66db86b277bf72231da90ff0bf01c5a3)
- [04da7d5](https://github.com/jpfulton/blog/commit/04da7d59b384781a1b2f3390d8bb50e2778e5fe7)
- [d49ebfb](https://github.com/jpfulton/blog/commit/d49ebfb4a591cad2b02d091cccb6706643dd312d)
