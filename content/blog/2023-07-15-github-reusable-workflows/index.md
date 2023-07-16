---
title: Taming Complex GitHub Actions Workflows with Reusable Workflows
date: 2023-07-15
description: ""
keywords: ["github actions", "reusable workflows", "yaml", "devops"]
openGraphImage: ../../../src/images/open-graph/github.png
---

![GitHub Actions Workflow Screenshot](./github-workflow.png)

For reference, the
[original workflow file](https://github.com/jpfulton/ng-resume/blob/f914a2063b1146d44cf6f3654d327ae9ca3c186e/.github/workflows/ci-and-cd.yml)
can be found in its state prior to refactoring at the previous link. The resulting
series of files that were the output of the refactoring can be found in this
[commit](https://github.com/jpfulton/ng-resume/commit/897c77ecb25fe313b35d4f5a3d8b9da60c276d9b).

## Table of Contents

## The GitHub Actions VS Code Extension

The
[GitHub Actions Extension](https://marketplace.visualstudio.com/items?itemName=github.vscode-github-actions)
for [Visual Studio Code](https://code.visualstudio.com) is an incredible time saver
when working on workflows. It offers a number of features that come in handy:

- Syntax highlighting
- Integrated documentation
- Validation and code completion
- Parsing parameters, inputs, and outputs for referenced actions and reusable workflows

## YAML
