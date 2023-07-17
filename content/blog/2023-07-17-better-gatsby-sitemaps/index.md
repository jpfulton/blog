---
title: Building Better Sitemaps for a Gatsby Site
date: 2023-07-17
description: ""
keywords: ["gatsbyjs", "blog", "seo", "sitemap", "git"]
openGraphImage: ../../../src/images/open-graph/gatsby.png
---

The evolving **GitHub repository** storing this blog and its implementation can be
found [here](https://github.com/jpfulton/blog).

## Table of Contents

## The Desired Sitemap Output

```xml:title=sitemap-index.xml {3}{numberLines:true}
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.jpatrickfulton.dev/sitemap-0.xml</loc>
  </sitemap>
</sitemapindex>
```

```xml:title=sitemap-0.xml {4,8}{numberLines:true}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ...
  <loc>https://www.jpatrickfulton.dev/blog/2023-06-23-samba-and-timemachine/</loc>
    <lastmod>2023-07-10T02:48:04.000Z</lastmod>
  </url>
  <url>
  <loc>https://www.jpatrickfulton.dev/</loc>
    <lastmod>2023-07-17T01:25:59.000Z</lastmod>
  </url>
</urlset>
```

## The Plugins

- [gatsby-plugin-sitemap](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-sitemap)
- [gatsby-plugin-git-lastmod](https://github.com/vondenstein/gatsby-plugin-git-lastmod/tree/main)

## Configuring the Plugins

```javascript:title=gatsby-config.mjs {numberLines: true}
plugins: [
  {
    resolve: `gatsby-plugin-sitemap`,
    options: {
      query: `
      {
        site {
          siteMetadata {
            siteUrl
          }
        }
        allSitePage {
          nodes {
            path
            pageContext
          }
        }
      }
      `,
      serialize: ({ path, pageContext }) => {
        return {
          url: path,
          lastmod: pageContext?.lastMod,
        };
      },
    },
  },
  `gatsby-plugin-git-lastmod`,
  ...
]
```

## Handling the Case of the Index Page

```javascript:title=gatsby-node.mjs {numberLines: true}
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
```

## Updating Robots.txt

```txt:title=robots.txt {5}{numberLines: true}
User-agent: *
Disallow: /8846484b349642449a66629f496422f8.txt
Disallow: /rss.xml

Sitemap: https://www.jpatrickfulton.dev/sitemap-index.xml
```

## Submitting Sitemaps

### Submitting a Sitemap to Google

![Google Search Console Screenshot](./google-sitemap-submission.png)

### Submitting a Sitemap to Bing

![Bing Webmaster Tools Screenshot](./bing-sitemap-submission.png)
