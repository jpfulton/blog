import { MDXProvider } from "@mdx-js/react";
import { Link } from "gatsby";
import type { FunctionComponent, MDXComponents } from "mdx/types";
import React, { PropsWithChildren } from "react";

import { EmbeddedImage } from "../components/embeddedImage";
import { OutboundLink } from "../components/outboundLink";
import { InArticleAdUnit } from "./msPubCenter";

const shortcodes: MDXComponents = {
  EmbeddedImage,
  InArticleAdUnit,
  Link,
}; // short cuts to components to be used in mdx templates

const overrides: MDXComponents = {
  a: OutboundLink as FunctionComponent<React.JSX.IntrinsicElements["a"]>,
}; // overrides of tags to replacement components to be used in mdx templates

const components = { ...overrides, ...shortcodes }; // components passed to the MDXProvider

export const CustomMDXProvider = ({ children }: PropsWithChildren) => {
  return <MDXProvider components={components}>{children}</MDXProvider>;
};

export default CustomMDXProvider;
