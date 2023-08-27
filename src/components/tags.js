import PropTypes from "prop-types";
import React from "react";

function Tags({ tags }) {
  return (
    <div className="tags-container">
      {tags.map((tag, index) => {
        const keyValue = "tag" + index;

        return (
          <>
            <span key={keyValue} className="tag">
              {tag}
            </span>
            &nbsp;
          </>
        );
      })}
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
