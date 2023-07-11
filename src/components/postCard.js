import { Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import PropTypes from "prop-types";
import React from "react";

function PostCard({ title, slug, date, image }) {
  return (
    <div class="post-card">
      <div class="post-image-container">
        <GatsbyImage image={image}></GatsbyImage>
      </div>
      <div class="post-date">{date}</div>
      <div class="post-title">
        <Link to={`/blog${slug}`}>{title}</Link>
      </div>
    </div>
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
