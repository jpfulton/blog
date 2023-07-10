---
title: Adding Open Graph Images to a Gatsby Site
date: 2023-07-09
description: "The Open Graph Protocol specifies a series of tags that may be included in the header of an HTML document to describe its content. Among them are the og:image tag which is used to render images associated with a page in iMessage link previews, Twitter cards and previews on other platforms. Most Gatsby starters include several of these SEO tags but omit preview image support. This article describes an implementation to add them."
keywords: ["gatsbyjs", "open graph", "markdown", "blog", "seo"]
openGraphImage: ../../../src/images/open-graph/gatsby.png
---

The [Open Graph Protocol](https://ogp.me) specifies a series of tags that
may be included in the header of an `HTML` document to describe its content.
Among them are the `og:image` tag which is used to render images associated
with a page in
[iMessage link previews](https://developer.apple.com/library/archive/technotes/tn2444/_index.html),
[Twitter cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started)
and previews on other platforms. Most [Gatsby](https://www.gatsbyjs.com/) starters
include several of these SEO tags but omit preview image support. This article
describes an implementation to add them.

![iMessage Link Preview Screenshot](./imessage-link-preview.png)

The evolving **GitHub repository** storing this blog and its implementation can be
found [here](https://github.com/jpfulton/blog).

## Table of Contents

## The Desired HEAD Tag Contents

Taken from the generated output
of <Link to="/blog/2023-07-08-fix-csharp-macos-debugging/">a previous post</Link>,
the following `HTML` from the `HEAD` tag represents the desired content. The
highlighted lines are the target of this post's exercise. The majority of the
other open graph and general purpose `META` tags were already in place from the
starter version of the `seo.js` component.

The missing elements, not included in the starters, were the `og:image` and
`twitter:image` meta tags. These elements drive the preview image used on
link previews in iMessage, Twitter Cards and other platform representations
of link previews.

**Note:** The current implementation of this blog still uses the
`react-helmet` component. However,
the [Gatsby HEAD API](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/)
exists in modern Gatsby versions and replaces that functionality. It is likely
that in a future pull request, I will modernize the implementation to use that
API and eliminate another warning when running in `gatsby develop` mode.

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

## Add a Default Open Graph Image

### Modify the SEO.js Component's GraphQL Static Query

```javascript:title=seo.js {15-21}{numberLines: true}
const { site, openGraphDefaultImage } = useStaticQuery(
  graphql`
    query {
      site {
        siteMetadata {
          title
          description
          author
          siteUrl
          social {
            twitter
          }
        }
      }
      openGraphDefaultImage: file(
        relativePath: { eq: "open-graph/code.png" }
      ) {
        childImageSharp {
          gatsbyImageData(layout: FIXED, height: 580, width: 1200)
        }
      }
    }
  `
);
```

### Implement the Image Tags within SEO.js

```javascript:title=seo.js {3-7,18-25,33-36}{numberLines: true}
function Seo({ description, lang, meta, keywords, title, openGraphImageSrc }) {
  ...
  const imagePath = constructUrl(
    site.siteMetadata.siteUrl,
    openGraphImageSrc ??
      openGraphDefaultImage.childImageSharp.gatsbyImageData.images.fallback.src
  );
  ...
  return (
      <Helmet
        htmlAttributes={{
          lang,
        }}
        title={title}
        titleTemplate={`%s | ${site.siteMetadata.title}`}
        meta={[
          ...
          {
            property: `og:image`,
            content: imagePath,
          },
          {
            property: `twitter:image`,
            content: imagePath,
          },
          ...
        ]}
        ...
        />
    );
}

function constructUrl(baseUrl, path) {
  if (baseUrl === "" || path === "") return "";
  return `${baseUrl}${path}`;
}

export default Seo;
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
