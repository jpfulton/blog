---
title: Taming Complex GitHub Actions Workflows with Reusable Workflows
date: 2023-07-15
description: "This article covers the refactoring of a complex workflow implemented in
GitHub Actions from a single YAML file with many repeated similar blocks of code
into a modular design using multiple reusable workflows and a top-level caller."
keywords: ["github actions", "reusable workflows", "yaml", "devops"]
openGraphImage: ../../../src/images/open-graph/github.png
---

GitHub Actions workflows are implemented in YAML which is format absent of
functions making it hard to utilize the DRY principle when creating
complex workflow configurations. Even in small enterpise examples it is easy
for a workflow to get out of hand with repeated similar blocks of code, a lack of
modularity and lengthy workflow definition files. While YAML itself does not
provide an easy solution to this problem, GitHub Actions includes a feature
that allows complex workflows to be decomposed into reusable and parameterized
modules: resuable workflows.

This article covers the refactoring of a complex workflow implemented in
GitHub Actions from a single YAML file with many repeated similar blocks of code
into a modular design using multiple reusable workflows and a top-level caller.

[syntax reference](https://learnxinyminutes.com/docs/yaml/)

[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)

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

## YAML Limitations

[YAML](https://yaml.org) is a superset of [JSON](https://www.json.org/json-en.html)
that uses indentation for scope.

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

## Applying Reusable Workflows

[GitHub documentation](https://docs.github.com/en/actions/using-workflows/reusing-workflows)

### Example Resuable Workflow

```yaml {3,4,9,13}{numberLines: true}
name: Reusable API CD Workflow
on:
  workflow_call:
    inputs:
      dotnet-version:
        required: true
        type: string
      ...
    secrets:
      azure-sp-credentials:
        required: true

jobs:
  api_cd_job:
    name: API CD Job
    permissions:
      contents: read
      pull-requests: write
    runs-on: windows-latest
    steps:
      - name: "Checkout GitHub Action"
        uses: actions/checkout@v3
      ...
```

A complete version of this reusable workflow is available
[here](https://github.com/jpfulton/ng-resume/blob/main/.github/workflows/api-cd-job.yml).

### Example Caller Workflow

```yaml {3,8,9,15}{numberLines: true}
preview_api_cd_job:
  name: (Preview)
  needs: [export_vars, analyze, frontend_ci_job]
  if: (github.event_name == 'pull_request' && github.event.action != 'closed')
  permissions:
    contents: read
    pull-requests: write
  uses: ./.github/workflows/api-cd-job.yml
  with:
    dotnet-version: ${{ needs.export_vars.outputs.dotnet-version }}
    function-app-name: ${{ needs.export_vars.outputs.preview-azure-functionapp-name }}
    function-app-package-path: ${{ needs.export_vars.outputs.azure-functionapp-package-path }}
    resource-group: ${{ needs.export_vars.outputs.resource-group }}
    slot-name: ${{ needs.export_vars.outputs.slot-name }}
  secrets:
    azure-sp-credentials: ${{ secrets.PREVIEW_AZURE_SP_CREDENTIALS }}
```

A complete version of this caller workflow is available
[here](https://github.com/jpfulton/ng-resume/blob/main/.github/workflows/ci-and-cd-workflow.yml).

### A Complete View of the Refactor

`.github/workflows/`

[folder](https://github.com/jpfulton/ng-resume/tree/main/.github/workflows)

| File                                                                                                               | Description                                                                   |
| ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| [analyze-job.yml](https://github.com/jpfulton/ng-resume/blob/main/.github/workflows/analyze-job.yml)               | A resuable workflow containing a CodeQL analysis job.                         |
| [api-cd-job.yml](https://github.com/jpfulton/ng-resume/blob/main/.github/workflows/api-cd-job.yml)                 | A resuable workflow containing a CD job for function APIs.                    |
| [ci-and-cd-workflow.yml](https://github.com/jpfulton/ng-resume/blob/main/.github/workflows/ci-and-cd-workflow.yml) | The top-level caller workflow for the complete CI/CD process for the project. |
| [e2e-job.yml](https://github.com/jpfulton/ng-resume/blob/main/.github/workflows/e2e-job.yml)                       | A reusable wokflow containing an E2E testing job.                             |
| [frontend-cd-job.yml](https://github.com/jpfulton/ng-resume/blob/main/.github/workflows/frontend-cd-job.yml)       | A reusable workflow containing a CD job for the frontend application.         |
| [frontend-ci-job.yml](https://github.com/jpfulton/ng-resume/blob/main/.github/workflows/frontend-ci-job.yml)       | A resuable workflow containing a CI job for the frontend application.         |
