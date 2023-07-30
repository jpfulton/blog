import { graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import React from "react";

import GoogleStructuredOrgData from "../components/googleStructuredOrgData";
import Layout from "../components/layout";
import { MsPubCenterHeaderScripts } from "../components/msPubCenter";
import { OutboundLink } from "../components/outboundLink";
import RssLink from "../components/rssLink";
import Seo from "../components/seo";

class AuthorProfile extends React.Component {
  render() {
    const { data, location } = this.props;

    const siteTitle = data.site.siteMetadata.title;
    const author = data.site.siteMetadata.author;
    const linkedinUserName = data.site.siteMetadata.social.linkedin;
    const githubUserName = data.site.siteMetadata.social.github;

    const operatingSystems = ["macOS", "Linux", "Windows Server"];
    const frontendFrameworks = ["Angular", "ASP.NET", "React", "Gatsby"];
    const languages = ["JavaScript", "TypeScript", "C#", "Java", "Bash"];

    const tagGroups = [
      {
        title: "Operating Systems",
        tags: operatingSystems,
        backgroundColor: "green",
      },
      {
        title: "Frontend Frameworks",
        tags: frontendFrameworks,
        backgroundColor: "blue",
      },
      {
        title: "Languages",
        tags: languages,
        backgroundColor: "lightBlue",
      },
    ];

    return (
      <Layout location={location} title={siteTitle}>
        <Seo title={"Author Profile - " + siteTitle} />

        <section>
          <ImageAndSocials
            author={author}
            githubUserName={githubUserName}
            linkedinUserName={linkedinUserName}
          />
          {tagGroups.map((group) => (
            <TagGroup
              title={group.title}
              tags={group.tags}
              tagColor={group.backgroundColor}
            />
          ))}
        </section>
      </Layout>
    );
  }
}

export default AuthorProfile;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        author
        social {
          github
          linkedin
        }
      }
    }
  }
`;

export const Head = () => {
  return (
    <>
      <GoogleStructuredOrgData />
      <RssLink />
      <MsPubCenterHeaderScripts />
    </>
  );
};

const ImageAndSocials = ({ author, githubUserName, linkedinUserName }) => {
  const githubUrl = "https://github.com/" + githubUserName;
  const linkedinUrl = "https://www.linkedin.com/in/" + linkedinUserName;

  return (
    <div class="row">
      <div>
        <StaticImage
          className="profile-pic center"
          layout="fixed"
          formats={["auto", "webp", "avif"]}
          src="../images/profile-pic.png"
          width={250}
          height={250}
          quality={95}
          alt="Profile picture"
        />
      </div>
      <div class="column">
        <h1>{author}</h1>
        <div>
          <OutboundLink
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn Profile"
          >
            {linkedinUrl}
          </OutboundLink>
        </div>
        <div>
          <OutboundLink
            href={githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub Profile"
          >
            {githubUrl}
          </OutboundLink>
        </div>
      </div>
    </div>
  );
};

const TagGroup = ({ title, tags, tagColor }) => {
  return (
    <div>
      <h2>{title}</h2>
      <div class="profile-tags-container">
        {tags.sort(sortFunction).map((tag) => (
          <>
            <span class="profile-tag" style={{ "background-color": tagColor }}>
              {tag}
            </span>
            &nbsp;
          </>
        ))}
      </div>
    </div>
  );
};

const sortFunction = (a, b) => {
  const upperA = a.toUpperCase(); // ignore upper and lowercase
  const upperB = b.toUpperCase(); // ignore upper and lowercase
  if (upperA < upperB) {
    return -1;
  }
  if (upperA > upperB) {
    return 1;
  }

  // names must be equal
  return 0;
};
