import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { FileNode } from "gatsby-plugin-image/dist/src/components/hooks";
import React from "react";
import { DeepNonNullable } from "utility-types";

export interface Props {
  altText: string;
  image: DeepNonNullable<FileNode>;
  maxWidth: number;
}

export const EmbeddedImage = ({ altText, image, maxWidth }: Props) => {
  const fallbackSrc = image.childImageSharp.gatsbyImageData.images.fallback.src;

  return (
    <span>
      <a
        href={fallbackSrc}
        style={{
          display: "block",
          boxShadow: "none",
          position: "relative",
          margin: "0px auto",
          maxWidth: maxWidth,
        }}
        target="_blank"
        rel="noreferrer"
      >
        <GatsbyImage
          alt={altText}
          image={getImage(image)!}
          style={{
            display: "block",
          }}
        />
      </a>
    </span>
  );
};

export default EmbeddedImage;
