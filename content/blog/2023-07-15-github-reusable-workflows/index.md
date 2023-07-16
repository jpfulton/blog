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

## Workflow Configuration Patterns

### Configuration through Environment Variables

```yaml
env:
  APP_WORKING_DIR: "ng-resume-app"
  APP_LOCATION: "/ng-resume-app/dist/ng-resume/browser" # location of the client application build artifacts
  API_LOCATION: ""
  OUTPUT_LOCATION: "" # an empty value here causes the APP_LOCATION location to be pushed to Azure
  AZURE_FUNCTIONAPP_NAME: personal-site-api
  PREVIEW_AZURE_FUNCTIONAPP_NAME: personal-site-api-preview
  AZURE_FUNCTIONAPP_PACKAGE_PATH: "ng-resume-api"
  DOTNET_VERSION: "7.0.x"
  RESOURCE_GROUP: personal-site
  SLOT_NAME: staging
  BASE_URL: "https://www.jpatrickfulton.com"
  PREVIEW_BASE_URL: "https://preview.jpatrickfulton.com"
```

`${{ env.APP_WORKING_DIR }}`

### Configuration through Job Output Variables

```yaml
jobs:
  export_vars:
    name: Export Variables to Output
    runs-on: ubuntu-latest
    outputs:
      app-working-dir: "ng-resume-app"
      app-location: "/ng-resume-app/dist/ng-resume/browser" # location of the client application build artifacts
      api-location: ""
      output-location: "" # an empty value here causes the app-location location to be pushed to Azure
      azure-functionapp-name: "personal-site-api"
      preview-azure-functionapp-name: "personal-site-api-preview"
      azure-functionapp-package-path: "ng-resume-api"
      dotnet-version: "7.0.x"
      resource-group: "personal-site"
      slot-name: "staging"
      base-url: "https://www.jpatrickfulton.com"
      preview-base-url: "https://preview.jpatrickfulton.com"
    steps:
      - run: echo "Exporting variables to outputs."
```

`needs: [export_vars]`

`${{ needs.export_vars.outputs.app-working-dir }}`
