import { Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import PropTypes from "prop-types";
import React from "react";
import Tags from "../components/tags";
import { rhythm } from "../utils/typography";

function PostSummary({
  slug,
  title,
  date,
  timeToReadText,
  timeToReadWords,
  description,
  excerpt,
  keywords,
  primaryImage,
}) {
  return (
    <article key={slug} className="post-summary">
      <h2
        style={{
          marginBottom: rhythm(1 / 4),
        }}
      >
        <Link style={{ boxShadow: `none` }} to={`/blog${slug}`}>
          {title}
        </Link>
      </h2>
      <small>
        {date} - {timeToReadText} ({timeToReadWords} words)
      </small>
      <div className="flex">
        <div>
          <p
            dangerouslySetInnerHTML={{
              __html: description || excerpt,
            }}
          />
        </div>
        <div className="image-container">
          <GatsbyImage image={primaryImage} alt="Post Image" />
        </div>
      </div>
      <Tags tags={keywords} />
    </article>
  );
}

PostSummary.defaultProps = {
  slug: "",
  title: "",
  date: "",
  timeToReadText: "",
  timeToReadWords: 0,
  description: "",
  excerpt: "",
  keywords: [],
};

PostSummary.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  timeToReadText: PropTypes.string.isRequired,
  timeToReadWords: PropTypes.number.isRequired,
  description: PropTypes.string,
  excerpt: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  primaryImageSrc: PropTypes.object,
};

export default PostSummary;
