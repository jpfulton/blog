---
title: Adding Open Graph Images to a Gatsby Site
date: 2023-07-09
description: ""
keywords: ["gatsbyjs", "open graph", "markdown", "blog", "seo"]
openGraphImage: ../../../src/images/open-graph/gatsby.png
---

![iMessage Link Preview Screenshot](./imessage-link-preview.png)

The evolving **GitHub repository** storing this blog and its implementation can be
found [here](https://github.com/jpfulton/blog).

## Table of Contents

## The Desired HEAD Tag Contents

<Link to="/blog/2023-07-08-fix-csharp-macos-debugging/">a previous post</Link>

```html {22-29}{numberLines: true}
<head>
  ...
  <meta
    name="description"
    content="Quite painfully, the VS Code ms-dotnettools.csharp extension debugger
    binaries do not work out-of-the-box on modern macOS versions (v12+). This article
    outlines the steps that are necessary to get those debugger binaries working
    macOS Monterey and beyond."
  />
  <meta
    property="og:title"
    content="Fixing C# Debugging in Visual Studio Code on macOS"
  />
  <meta
    property="og:description"
    content="Quite painfully, the VS Code ms-dotnettools.csharp extension debugger
    binaries do not work out-of-the-box on modern macOS versions (v12+). This
    article outlines the steps that are necessary to get those debugger binaries
    working macOS Monterey and beyond."
  />
  <meta property="og:type" content="website" />
  <meta
    property="og:image"
    content="https://www.jpatrickfulton.dev/static/066d0dbddfa7c84427d75eda7696a50e/c0a1b/vscode.png"
  />
  <meta
    property="twitter:image"
    content="https://www.jpatrickfulton.dev/static/066d0dbddfa7c84427d75eda7696a50e/c0a1b/vscode.png"
  />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:creator" content="jpatrickfulton" />
  <meta name="twitter:site" content="jpatrickfulton" />
  <meta
    name="twitter:title"
    content="Fixing C# Debugging in Visual Studio Code on macOS"
  />
  <meta
    name="twitter:description"
    content="Quite painfully, the VS Code ms-dotnettools.csharp extension debugger
    binaries do not work out-of-the-box on modern macOS versions (v12+). This
    article outlines the steps that are necessary to get those debugger binaries
    working macOS Monterey and beyond."
  />
  <meta
    name="keywords"
    content="Visual Studio Code, csharp, macOS, debugging"
  />
  ...
</head>
```

## Extending the GraphQL Frontmatter Definition

**Note:** This `gatsby-node.js` file was converted in an earlier series of commits
to [ES module syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
for better compatability with the
[MDX plugin](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-mdx)
in Gatsby v5+. The extension of the file was changed to `.mjs` as a result.

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
