import { Link } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";
import Tags from "../components/tags";
import { rhythm } from "../utils/typography";

export interface Props {
  slug: string;
  title: string;
  date: string;
  timeToReadText: string;
  timeToReadWords: number;
  description: string | undefined;
  excerpt: string;
  keywords: string[];
  primaryImage: IGatsbyImageData;
}

export const PostSummary = ({
  slug,
  title,
  date,
  timeToReadText,
  timeToReadWords,
  description,
  excerpt,
  keywords,
  primaryImage,
}: Props) => {
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
};

export default PostSummary;
