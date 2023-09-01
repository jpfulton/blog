import { FileNode } from "gatsby-plugin-image/dist/src/components/hooks";
import React from "react";
import { DeepNonNullable } from "utility-types";
import PostCard from "./postCard";

export interface Props {
  openGraphDefaultImage: DeepNonNullable<FileNode>;
  rootSlug: string;
  relatedPosts: DeepNonNullable<Queries.BlogPostBySlugQuery["allMdx"]["edges"]>;
}

export const RelatedPosts = ({
  openGraphDefaultImage,
  rootSlug,
  relatedPosts,
}: Props) => {
  if (relatedPosts.length === 0 || relatedPosts.length === 1)
    return <div className="related-posts"></div>;

  const scrollRight = () => {
    const container = document.querySelector(".related-posts-flex")!;

    container.scrollBy({
      left: 200,
      behavior: "smooth",
    });
  };

  const scrollLeft = () => {
    const container = document.querySelector(".related-posts-flex")!;

    container.scrollBy({
      left: -200,
      behavior: "smooth",
    });
  };

  return (
    <nav>
      <div className="related-posts-title">Related Posts</div>
      <div className="related-posts">
        <button className="prev-button" onClick={scrollLeft}>
          &lt;
        </button>
        <div className="related-posts-flex">
          {relatedPosts.map((post) => {
            const node = post.node;

            if (node.fields.slug === rootSlug) return null;

            const title = node.frontmatter.title;
            const date = node.frontmatter.date;
            const slug = node.fields.slug;

            const image =
              node.frontmatter.primaryImage.childImageSharp.gatsbyImageData ||
              node.frontmatter.openGraphImage.childImageSharp.gatsbyImageData ||
              openGraphDefaultImage.childImageSharp.gatsbyImageData;

            return (
              <PostCard
                key={slug}
                title={title}
                date={date}
                slug={slug}
                image={image}
              ></PostCard>
            );
          })}
        </div>
        <button className="next-button" onClick={scrollRight}>
          &gt;
        </button>
      </div>
    </nav>
  );
};

export default RelatedPosts;
