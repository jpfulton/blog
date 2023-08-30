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

    const colors = [
      "#1A237E",
      "#283593",
      "#303F9F",
      "#3949AB",
      "#3F51B5",
      "#5C6BC0",
      "#7986CB",
      "#9FA8DA",
      "#C5CAE9",
      "#E8EAF6",
    ];

    const operatingSystems = ["macOS", "Linux", "Windows Server"];
    const frontendFrameworks = ["Angular", "ASP.NET", "React", "Gatsby"];
    const languages = [
      "JavaScript",
      "TypeScript",
      "C#",
      "Java",
      "Bash",
      "SQL",
      "HTML",
      "CSS",
      "SASS",
      "Bicep",
    ];
    const librariesAndApis = [
      "Twilio",
      "Google Indexing API",
      "Bing Submission API",
      "Fern",
      "Node",
      "SignalR",
      "WebAPI",
      ".NET",
      ".NET Core",
      "EF",
      "EF Core",
      "Linq",
    ];
    const azureTech = [
      "Functions",
      "Synapse Analytics",
      "App Services",
      "Service Bus",
      "Virtual Machines",
      "Virtual Networking",
      "VPN Gateway",
      "Storage",
      "Static Web Apps",
      "SQL",
      "Database Migration Service",
      "Active Directory",
      "Defender",
      "Monitor",
      "KeyVault",
      "Backup",
      "DNS",
    ];
    const methodologies = ["Agile", "SCRUM", "Waterfall"];

    const tagGroups = [
      {
        title: "Operating Systems",
        tags: operatingSystems,
        backgroundColor: colors[4],
      },
      {
        title: "Frontend Frameworks",
        tags: frontendFrameworks,
        backgroundColor: colors[5],
      },
      {
        title: "Languages",
        tags: languages,
        backgroundColor: colors[6],
      },
      {
        title: "Libraries and APIs",
        tags: librariesAndApis,
        backgroundColor: colors[4],
      },
      {
        title: "Azure",
        tags: azureTech,
        backgroundColor: colors[5],
      },
      {
        title: "Methodologies",
        tags: methodologies,
        backgroundColor: colors[6],
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
          {tagGroups.map((group, index) => {
            const key = group.title.replace(" ", "-").concat(`-${index}`);

            return (
              <TagGroup
                key={key}
                title={group.title}
                tags={group.tags}
                tagColor={group.backgroundColor}
              />
            );
          })}
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
    <div className="row">
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
      <div className="column">
        <h1>{author}</h1>
        <div>
          <span className="bolded">Location:</span> Chicago, IL
        </div>
        <div>
          <span className="bolded">Local Time:</span> {getChicagoTime()}
        </div>
        <div>&nbsp;</div>
        <div>
          <span className="bolded">Contact:</span>
        </div>
        <div>
          <a href="mailto:patrick@jpatrickfulton.com">
            patrick@jpatrickfulton.com
          </a>
        </div>
        <div>
          <a href="tel:+13129896512">1 (312) 989-6512</a>
        </div>
        <div>&nbsp;</div>
        <div>
          <span className="bolded">Socials:</span>
        </div>
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
      <h2 className="profile-h2">{title}</h2>
      <div className="profile-tags-container">
        {tags.sort(sortFunction).map((tag, index) => {
          const key = tag.replace(" ", "-").concat(`-${index}`);

          return (
            <React.Fragment key={key}>
              <span
                className="profile-tag"
                style={{ backgroundColor: tagColor }}
              >
                {tag}
              </span>
              <span>&nbsp;</span>
            </React.Fragment>
          );
        })}
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

const getChicagoTime = () => {
  function convertTZ(date, tzString) {
    return new Date(
      (typeof date === "string" ? new Date(date) : date).toLocaleString(
        "en-US",
        { timeZone: tzString }
      )
    );
  }

  const now = new Date();
  return convertTZ(now, "America/Chicago").toLocaleString();
};
