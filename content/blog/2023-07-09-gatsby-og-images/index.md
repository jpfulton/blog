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

My objective was to ensure that _all pages_ in the site have an open graph image
associated with them which may be overriden at the page level. To accomplish this,
the first step was to modify the `seo.js` component.

### Modify the SEO.js Component's GraphQL Static Query

This component already used a static query to pull elements of data needed for
the other SEO header tags from GraphQL. I modified the static query to include
a new node: `openGraphDefaultImage` that leveraged the
[gatsby-plugin-image](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-image#readme)
and [gatsby-plugin-sharp](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-sharp)
plugins.

The new node is based on a `file` query for an image (`code.png`) which was placed
in the `/src/images/open-graph/` folder of the site. My intention is to store images
in this folder that might be reused as open graph images accross multiple pages.
In this case, the `code.png` image is intended to be the default fallback image
for pages that have not declared an override image. The `height` and `width` parameters
here are of special importance. The specified height and width are the target dimensions
of the image that will be transformed by the sharp plugin and match the recommended
size of images used for these SEO tags.

The existence of the node will cause the plugins to process the image and then add
data to the GraphQL site metadata that may be used in the component JavaScript as
seen in the next section.

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

### Implement the Open Graph Image Tags within SEO.js

Once the static GraphQL queries has been modified, the rest of the component
can be altered to support the use case.

On line 1, a new parameter to the component has been added to supply an
optional override image to replace the default image. Lines 5-6 show the
override logic. Two new meta tags are then added to the `meta` array in the
embedded `Helmet` component.

**Note:** The URLs pointing to images in the Open Graph tags must be _fully qualified_
to be used my most previewers (e.g. iMessage) and _cannot_ be relative links. The
`constructUrl` function concatenates the base site url to the paths queried from
GraphQL to create the fully qualified URL and handles several error conditions that
might arise from missing data.

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

With these steps complete, the component is prepared to accept override images
and a default image is in place.

## Allow Page-level Overrides to the Default Image

Each post in this blog implementation is generated from an MDX (markdown including
React components) file, the objective is to allow each file to optionally
provide a element in its frontmatter to specify a custom open graph image
for the post.

### Example MDX Frontmatter Configuration

Line 6 shows this example markdown frontmatter section setting a open graph image
for this post. Omission of the `openGraphImage` declaration would cause the
default image to be included in the post's meta tags.

```markdown {6}{numberLines: true}
---
title: "Fixing C# Debugging in Visual Studio Code on macOS"
date: 2023-07-08
description: "Quite painfully, the VS Code ms-dotnettools.csharp extension debugger binaries do not work out-of-the-box on modern macOS versions (v12+). This article outlines the steps that are necessary to get those debugger binaries working macOS Monterey and beyond."
keywords: ["Visual Studio Code", "csharp", "macOS", "debugging"]
openGraphImage: ../../../src/images/open-graph/vscode.png
---
```

### Extending the GraphQL Frontmatter Definition

The [Gatsby Node API](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/#createSchemaCustomization)
provides a hook for customizing the GraphQL schema. In this step, it is used to
customize the frontmatter type definitions. This schema customization is **required**
to support the GraphQL query expansions made in later steps.

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

### Modifying the blog-post.js Template

The `src/templates/blog-post.js` file is the template used by the
Gatsby Node API [createPages hook](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/#createPages)
to render each MDX file into a blog page. It is composed of a number of components.
Among them is the `seo.js` component modified in previous steps. Additionally,
the template hosts a dynamic `pageQuery` to pull data from GraphQL to render
the post.

#### Alter the Dynamic GraphQL Page Query

With the GraphQL schema customizations made above in place, the `pageQuery`
can be altered to use the new frontmatter field: `openGraphImage`. Again,
the
[gatsby-plugin-image](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-image#readme)
and [gatsby-plugin-sharp](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-sharp)
plugins are used to process the image and add new data to the query result
about the processed image for use in the template.

```javascript:title=blog-post.js {17-21}{numberLines:true}
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!, $keywords: [String]!) {
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
        openGraphImage {
          childImageSharp {
            gatsbyImageData(layout: FIXED, height: 580, width: 1200)
          }
        }
      }
      ...
    }
    ...
  }
`;
```

#### Alter the Template to Support Overrides

In a final step, we utilize the new data available from the GraphQL
dynamic page query to access the relative link to the processed
open graph image and pass it to the `seo.js` component.

```jsx:title=blog-post.js {10-12,21}{numberLines: true}
function BlogPostTemplate({
  location,
  pageContext,
  data: { mdx, site, allMdx },
  children,
}) {
  const post = mdx;
  ...

  const openGraphImageSrc =
    post.frontmatter.openGraphImage?.childImageSharp.gatsbyImageData.images
      .fallback.src;
  ...

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
        keywords={post.frontmatter.keywords}
        openGraphImageSrc={openGraphImageSrc}
      />
      ...
    </Layout>
  );
}
```

At this point in the implementation, each MDX file may optionally specify
an override to the default open graph image for the site by modifying its
frontmatter configuration.

## Appendix: Key Commits

- [92132ab](https://github.com/jpfulton/blog/commit/92132abaebc6b27e2ae1f5ff339c59e6a46953e2)
- [b57fcaa](https://github.com/jpfulton/blog/commit/b57fcaa246375feb4167c57d6094a54292e9ab71)
- [bb13f79](https://github.com/jpfulton/blog/commit/bb13f798740d6f46430d97f0e5a4cafcee52d20d)
- [48c080d](https://github.com/jpfulton/blog/commit/48c080dc66db86b277bf72231da90ff0bf01c5a3)
- [04da7d5](https://github.com/jpfulton/blog/commit/04da7d59b384781a1b2f3390d8bb50e2778e5fe7)
- [d49ebfb](https://github.com/jpfulton/blog/commit/d49ebfb4a591cad2b02d091cccb6706643dd312d)
