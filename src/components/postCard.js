import { Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import PropTypes from "prop-types";
import React from "react";

function PostCard({ title, slug, date, image }) {
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
}

PostCard.defaultProps = {};

PostCard.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
};

export default PostCard;
