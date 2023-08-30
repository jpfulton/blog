import PropTypes from "prop-types";
import React from "react";
import { v4 as uuidv4 } from "uuid";

function Tags({ tags }) {
  const groupId = uuidv4();

  return (
    <div key={`group-${groupId}`} className="tags-container">
      {tags.map((tag, index) => {
        const keyValue = `tag-${groupId}-${index}`;

        return (
          <React.Fragment key={keyValue}>
            <span className="tag">{tag}</span>
            <span>&nbsp;</span>
          </React.Fragment>
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
