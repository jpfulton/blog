---
title: Visual Studio Code Support for a Gatsby Project
date: 2023-07-03
description: ""
keywords: ["gatsbyjs", "Visual Studio Code", "debugging", "blog"]
featuredImage: ./vscode-screenshot.png
---

Despite being a long-term and professional user of the full version of
[Visual Studio](https://visualstudio.microsoft.com/),
[Visual Studio Code](https://code.visualstudio.com/) quickly became my IDE
of choice. It is light weight, cross platform and has an exceptional
[extension ecosystem](https://marketplace.visualstudio.com/VSCode).

> Visual Studio Code, also commonly referred to as VS Code, is a source-code
> editor made by Microsoft with the Electron Framework, for Windows, Linux and macOS.
> Features include support for debugging, syntax highlighting, intelligent code
> completion, snippets, code refactoring, and embedded Git.
> _([Wikipedia](https://en.wikipedia.org/wiki/Visual_Studio_Code))_

When I started working on this blog and implemented it in [Gatsby](https://www.gatsbyjs.com/),
it was important to develop good support in the project for VS Code and to
be able to effectively debug issues as they arose using that tool.

![Visual Studio Code Screenshot](./vscode-screenshot.png)

The evolving **GitHub repository** storing this blog and its implementation can be
found [here](https://github.com/jpfulton/blog).

## Table of Contents

## The .vscode Folder

The `.vscode` directory is generally found at the root of a
[mulit-repo pattern](https://kinsta.com/blog/monorepo-vs-multi-repo/). In a
[mono-repo pattern](https://en.wikipedia.org/wiki/Monorepo), it can be found
or extended in the root folder for each subproject. Details on the files
commonly found there are documented in this
[article](https://code.visualstudio.com/docs/getstarted/settings).

In the **GitHub repository** storing this blog implementation, the directory can
be found [here](https://github.com/jpfulton/blog/tree/main/.vscode).

### The launch.json File

The `launch.json` file controls the Run and
[Debug](https://code.visualstudio.com/docs/editor/debugging) functions in VS Code.

Gatsby offers a [guide](https://www.gatsbyjs.com/docs/debugging-the-build-process/)
to debugging in VS Code. I adapted its suggestions with some modification here.
For example, I utilize a pre-launch task to ensure a clean prior to running either
a build or develop command.

There are some notable elements in this file. Firstly, through environment
variables, the normal multithreading of Gatsby is limited to make debugging
easier.

```json:title=launch.json {16,30}{numberLines: true}
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Gatsby develop",
      "type": "node",
      "request": "launch",
      "program": "${workspaceRoot}/node_modules/.bin/gatsby",
      "args": ["develop"],
      "env": {
        "PARCEL_WORKERS": "0",
        "GATSBY_CPU_COUNT": "1"
      },
      "runtimeArgs": ["--nolazy"],
      "console": "integratedTerminal",
      "preLaunchTask": "npm: clean",
    },
    {
      "name": "Gatsby build",
      "type": "node",
      "request": "launch",
      "program": "${workspaceRoot}/node_modules/.bin/gatsby",
      "args": ["build", "--verbose"],
      "env": {
        "PARCEL_WORKERS": "0",
        "GATSBY_CPU_COUNT": "1"
      },
      "runtimeArgs": ["--nolazy"],
      "console": "integratedTerminal",
      "preLaunchTask": "npm: clean",
    }
  ]
}
```

### The tasks.json File

```json:title=tasks.json {numberLines: true}
{
    "version": "2.0.0",
    "tasks": [
      {
        "type": "npm",
        "script": "clean",
        "isBackground": true,
        "problemMatcher": {
          "owner": "typescript",
          "pattern": "$tsc",
          "background": {
            "activeOnStart": true,
            "beginsPattern": {
              "regexp": "(.*?)"
            },
            "endsPattern": {
              "regexp": "Successfully deleted directories"
            }
          }
        }
      },
    ],
}
```

### The settings.json File

```json:title=settings.json {numberLines: true}
{
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": [
    "source.fixAll",
    "source.organizeImports",
    "source.sortMembers"
  ],
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## Recommended Extensions in Use

The `extensions.json` file includes a series of recommended VS Code extensions
for the project.

- [Markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
- [Prettier - Code Formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [GitHub Actions](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-github-actions)
- [GitHub Pull Requests and Issues](https://marketplace.visualstudio.com/items?itemName=github.vscode-pull-request-github)
- [JSON](https://marketplace.visualstudio.com/items?itemName=ZainChen.json)

### The extensions.json File

To make things super easy, the `extensions.json` file in the `.vscode` directory
includes the keys for each extension and integrates with the IDE to make the suggestions
upon opening the repository.

```json:title=extensions.json {numberLines: true}
{
    "recommendations": [
        "davidanson.vscode-markdownlint",
        "esbenp.prettier-vscode",
        "github.vscode-github-actions",
        "github.vscode-pull-request-github",
        "zainchen.json",
    ]
}
```

![Visual Studio Code Extensions Screenshot](./vscode-extensions-screenshot.png)

### Using the VS Code Markdownlint Extension

When building this implementation, I went to a great deal of trouble to use the
[gatsby-plugin-mdx plugin](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-mdx)
to make authoring content in markdown with extensions for
[React](https://react.dev/) components
a first class citizen in the project. My extension of choice for markdown editing
and linting in VS Code is `davidanson.vscode-markdownlint`. However, I was unnable
to find settings for it that would extend its use to `.mdx` files. Technically, the
markdown that powers this blog is MDX though leaving the files with a `.md` file
extension allows that VS Code plugin to do its magic. As a result, I simply modified
the options of the `gatsby-plugin-mdx` plugin to look for `.md` files as well.

```javascript:title=gatsby-config.js {4}{numberLines: true}
{
  resolve: `gatsby-plugin-mdx`,
  options: {
    extensions: [`.mdx`, `.md`],
    ...
  },
},
```

Traditional markdown files disallow inline HTML tags and the linter has a rule
to enforce this: `MD033`. MDX file, on the other hand, needs what looks like
inline HTML tags to allow React components to be included. As a result, I
created a `.markdownlint.json` file at the root of the project to configure
the linter extension to ignore that rule.

```json:title=.markdownlint.json {numberLines: true}
{
  "MD033": false
}
```

## Debugging Gatsby
