---
title: Live Update Google through the Indexing API in GitHub Actions
date: 2023-07-13
description: "In this article, I discuss making live updates to Google Search via the Indexing API through GitHub Actions using a shell script to update the search engine upon each deployment of the site."
keywords:
  [
    "gatsbyjs",
    "google search",
    "indexing api",
    "easyindex-cli",
    "github actions",
    "seo",
  ]
openGraphImage: ./google.png
---

In the <Link to="/blog/2023-07-12-bing-and-indexnow/">previous post</Link>,
I discussed the challenges and delays associated with waiting for crawlers to
discover updated content and how to solve that issue for
[Microsoft Bing](https://www.bing.com) using
[IndexNow](https://www.indexnow.org/).

In this article, I discuss making live updates to [Google Search](https://www.google.com/)
via the
[Indexing API](https://developers.google.com/search/apis/indexing-api/v3/quickstart)
through
[GitHub Actions](https://github.com/features/actions)
using a shell script to update the search engine upon each deployment of the site.

The evolving **GitHub repository** storing this blog and its implementation can be
found [here](https://github.com/jpfulton/blog).

## Table of Contents

## Prerequisites for the Indexing API

### Establishing Ownership in the Google Search Console

### Creating a Google Cloud Project

### Creating a Service Account with a JSON Key

### Adding the Service Account as a Site Owner

## The easyindex-cli Tool

## The GitHub Actions Workflow

### Saving the JSON Key as Repository Secret

### The easyindex.sh Shell Script

### Adding the Workflow Step
