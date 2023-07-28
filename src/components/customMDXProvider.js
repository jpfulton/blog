import { MDXProvider } from "@mdx-js/react";
import { Link } from "gatsby";
import React from "react";

import { InArticleAdBlock } from "../components/adBlocks";
import { OutboundLink } from "../components/outboundLink";
import { InArticleAdUnit } from "./msPubCenter";

const shortcodes = { InArticleAdBlock, InArticleAdUnit, Link }; // short cuts to components to be used in mdx templates
const overrides = { a: OutboundLink }; // overrides of tags to replacement components to be used in mdx templates
const components = { ...overrides, ...shortcodes }; // components passed to the MDXProvider

export const CustomMDXProvider = ({ children }) => (
  <MDXProvider components={components}>{children}</MDXProvider>
);

export default CustomMDXProvider;
