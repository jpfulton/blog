import { Link } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";

export interface Props {
  title: string;
  slug: string;
  date: string;
  image: IGatsbyImageData;
}

export const PostCard = ({ title, slug, date, image }: Props) => {
  return (
    <article className="post-card">
      <div className="post-image-container">
        <GatsbyImage alt="Article Image" image={image}></GatsbyImage>
      </div>
      <div className="post-date">{date}</div>
      <div className="post-title">
        <Link to={`/blog${slug}`}>{title}</Link>
      </div>
    </article>
  );
};

export default PostCard;
