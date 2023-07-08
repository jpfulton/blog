import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";

function RelatedPosts({ relatedPosts }) {
  if (relatedPosts.length === 0) return <div class="related-posts"></div>;

  return (
    <div class="related-posts">
      <h6>Related Posts</h6>
      <ol>
        {relatedPosts.map((post) => (
          <li>
            <Link to={`/blog${post.node.fields.slug}`}>
              {post.node.frontmatter.title}
            </Link>
            <span>&nbsp;- [{post.node.frontmatter.date}]</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

RelatedPosts.defaultProps = {
  relatedPosts: [],
};

RelatedPosts.propTypes = {
  relatedPosts: PropTypes.arrayOf(PropTypes.object),
};

export default RelatedPosts;
