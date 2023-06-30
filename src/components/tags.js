import React from "react";
import PropTypes from "prop-types";

function Tags({ tags }) {
  return (
    <div class="tags-container">
          {tags.map((tag) => <span class="tag">{tag}</span> )}
    </div>
  );
}

Tags.defaultProps = {
  tags: [],
};

Tags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
};

export default Tags;
