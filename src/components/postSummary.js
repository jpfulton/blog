import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
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
}) {
  return (
    <div key={slug} class="post-summary">
      <h3
        style={{
          marginBottom: rhythm(1 / 4),
        }}
      >
        <Link style={{ boxShadow: `none` }} to={`/blog${slug}`}>
          {title}
        </Link>
      </h3>
      <small>
        {date} - {timeToReadText} ({timeToReadWords} words)
      </small>
      <p
        dangerouslySetInnerHTML={{
          __html: description || excerpt,
        }}
      />
      <Tags tags={keywords} />
    </div>
  );
}

PostSummary.defaultProps = {
  slug: "",
  title: "",
  date: "",
  timeToReadText: "",
  timeToReadWords: "",
  description: "",
  excerpt: "",
  keywords: [],
};

PostSummary.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  timeToReadText: PropTypes.string.isRequired,
  timeToReadWords: PropTypes.string.isRequired,
  description: PropTypes.string,
  excerpt: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
};

export default PostSummary;
