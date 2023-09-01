import React from "react";
import { v4 as uuidv4 } from "uuid";

export interface Props {
  tags: string[];
}

export const Tags = ({ tags }: Props) => {
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
};

export default Tags;
