import { GatsbyImage, getImage } from "gatsby-plugin-image";
import React from "react";

export const EmbeddedImage = ({ altText, image, maxWidth }) => {
  console.log(image);

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
          image={getImage(image)}
          style={{
            display: "block",
          }}
          formats={["auto", "webp", "avif"]}
        />
      </a>
    </span>
  );
};

export default EmbeddedImage;
