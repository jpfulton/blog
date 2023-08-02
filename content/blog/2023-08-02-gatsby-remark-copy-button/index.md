---
title: Add a Code Copy Button to a Gatsby MDX Site
date: 2023-08-02
description: "Many documentation sites and technical blogs feature a copy to clipboard button attached to their syntax highlighted code snippets and commands. After a great deal of searching, I was unable to find a Gatsby plugin to create one that was compatible with both modern Gatsby versions and the use of MDX. As a result, I built one."
keywords:
  [
    "gatsbyjs",
    "remark",
    "mdx",
    "plugin",
    "copy button",
    "gatsby-remark-copy-button",
    "gatsby-plugin-mdx",
  ]
openGraphImage: ../../../src/images/open-graph/gatsby.png
---

Many documentation sites and technical blogs feature a copy to clipboard
button attached to their syntax highlighted code snippets and commands.
After a great deal of searching, I was unable to find a
[Gatsby](https://www.gatsbyjs.com/) plugin to create one that was compatible
with both modern Gatsby versions **and** the use of MDX. As a result, I built one.

This post covers that plugin implementation and use in a Gatsby site.

The plugin package may be used with both of the following packages. However,
it was tested primarily with the MDX plugin.

- [gatsby-transformer-remark](https://www.gatsbyjs.com/plugins/gatsby-transformer-remark/)
- [gatsby-plugin-mdx](https://www.gatsbyjs.com/plugins/gatsby-plugin-mdx/)

The **GitHub repository** storing the plugin discussed in this post can be
found [here](https://github.com/jpfulton/gatsby-remark-copy-button). Its
corresponding NPM package can be found
[here](https://www.npmjs.com/package/@jpfulton/gatsby-remark-copy-button).

The evolving **GitHub repository** storing this blog and its implementation can be
found [here](https://github.com/jpfulton/blog).

## Table of Contents

## The Plugin Implementation

[plugin tutorial](https://www.gatsbyjs.com/tutorial/remark-plugin-tutorial/)

### Core Implementation Files

Stored in the `/src/` folder of the plugin repository, the plugin implementation
logic is composed of four main files:

- `gatsby-browser.mjs`: Gatsby browser file with hooks for adding JS functions
  within the browser
- `index.mjs`: Primary plugin logic module
- `parse-options.mjs`: Internal utilities for parsing option stings
- `styles.scss`: A SASS file storing default component styles

The JavaScript files are parsed and transformed during the build using
[Babel](https://babeljs.io). The SCSS file is converted to CSS using
[node-sass](https://www.npmjs.com/package/node-sass).

### Dependencies

The only direct runtime dependency for the plugin is on
[unist-util-visit](https://github.com/syntax-tree/unist-util-visit) which
allows the plugin to walk and modify the Markdown AST.

### The Remark Plugin Method

A Gatsby Remark plugin module is expected to export a default function
with the following signature and return value. An abstract syntax tree
representing the markdown file is passed with a plugin options object.
The body of the function applies logic to modify the AST and then returns
the modified tree. The file storing the module is identified in the
`package.json` file using the `main` property.

```javascript
export default ({ markdownAST }, pluginOptions) => {
  // plugin logic

  // return modified markdown abstract syntax tree
  return markdownAST;
};
```

### Browser JavaScript

Using the [Gatsby Browser API](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/)
`onClientEntry` hook, the plugin attaches a function to the `window` object to
implement copying text to the user's clipboard using the browser
[Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API).
Additionally, to prevent "rage clicking", a data attribute is added to the button
while the operation is running to introduce a lock around the clipboard and animation
operations.

The default CSS styling is also imported into the browser in the `gatbsy-browser.js`
file.

## Using the Plugin

### Install the Plugin

```bash {clipboardButton: true}
yarn add @jpfulton/gatsby-remark-copy-button
```

### Configure Gatsby

Add the configuration entry to your `gatsby-config.js` file. This plugin
**must** be added before other plugins that operate on `code` nodes and
markdown code snippets to operate correctly.

The following listing assumes you are using the `gatsby-plugin-mdx` plugin.
However, this plugin may also be used with the `gatsby-transformer-remark` plugin.

```js
plugins: [
  {
    resolve: `gatsby-plugin-mdx`,
    options: {
      extensions: [`.mdx`, `.md`],
      gatsbyRemarkPlugins: [
        {
          resolve: `@jpfulton/gatsby-remark-copy-button`,
        },
        {
          resolve: `gatsby-remark-code-titles`,
        },
        {
          resolve: `gatsby-remark-prismjs`,
        },
      ],
    },
  },
],
```

### Configure Plugin Options

All plugin options are optional. However, it is strongly suggested that
you customize them to override styling to fit your site's look, feel and layout.

```js {clipboardButton: true}
{
  resolve: `@jpfulton/gatsby-remark-copy-button`,
  options: {
    // Provide a text label for the copy button.
    // Default: null
    buttonText: null,
    // Provide a complete SVG tag string to replace the default
    // copy icon. Be sure to include a class of "copy-icon" on your custom
    // SVG tag when using this option.
    copySvg: null,
    // Provide a complete SVG tag string to replace the default
    // success icon.  Be sure to include a class of "success-icon" on your custom
    // SVG tag when using this option.
    successSvg: null,
    // Provide a custom container class for the <div> tag that contains
    // the copy button to apply custom styling.
    // Default: "gatsby-remark-copy-button-container"
    customButtonContainerClass: null,
    // Provide a custom button class for the copy button to apply
    // custom styling.
    // Default: "gatsby-remark-copy-button"
    customButtonClass: null,
  },
},
```

### Custom Styling

Custom styling may be applied to the default classes or using the options
above custom classes may be applied to the injected markup.

```css
.gatsby-remark-copy-button-container {
}
.gatsby-remark-copy-button {
}
```

Apply custom styles by adding a style sheet to your `gatsby-browser.js` file.

```js
// gatsby-browser.js
import "./src/styles/copy-button.scss";
```

### Structure of the Injected Markup

When enabled on code snippet, the following `HTML` will be injected into
the output of the page after parsing the Markdown AST using the default
plugin options. It will be injected **above** the code snippet in the
generated `HTML`.

```html
<div class="gatsby-remark-copy-button-container">
  <button
    class="gatsby-remark-copy-button"
    onclick="copyToClipboard(`CLEANED CODE CONTENT TO COPY HERE`, this)"
  >
    <svg
      class="copy-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      ...
    </svg>
    <svg
      class="success-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      ...
    </svg>
  </button>
</div>
```

### Usage in Markdown and MDX Files

Once installed, the copy button may _optionally_ be enabled by adding
to the code snippet declaration within markdown files. When this plugin
is used in conjunction with the `gatsby-remark-prismjs` plugin, the
`{clipboardButton: true}` option may be provided in any order with other
prismjs options.

````markdown
```js {clipboardButton: true}
const example = "This content will end up on the user's clipboard";
```
````
