import { Link, PageProps, graphql } from "gatsby";
import React from "react";

import { DeepNonNullable } from "utility-types";
import GoogleStructuredOrgData from "../components/googleStructuredOrgData";
import Layout from "../components/layout";
import { MsPubCenterHeaderScripts } from "../components/msPubCenter";
import { OutboundLink } from "../components/outboundLink";
import Seo from "../components/seo";

export const PrivacyPolicy = (
  props: PageProps<DeepNonNullable<Queries.PrivacyPolicyQuery>>
) => {
  const { data, location } = props;
  const siteTitle = data.site.siteMetadata.title;

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title={"Privacy Policy - " + siteTitle} />
      <Content />
    </Layout>
  );
};

export default PrivacyPolicy;

export const pageQuery = graphql`
  query PrivacyPolicy {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export const Head = () => {
  return (
    <>
      <GoogleStructuredOrgData />
      <MsPubCenterHeaderScripts />
    </>
  );
};

const Content = () => (
  <>
    <section>
      <h1>Privacy Policy</h1>

      <p>Last Updated: 7/28/2023.</p>

      <p>
        This Privacy Policy (“Policy”) explains the information collection, use,
        and sharing practices of jpatrickfulton.dev (“we,” “us,” and “our”).
      </p>

      <p>
        Unless otherwise stated, this Policy describes and governs the
        information collection, use, and sharing practices of jpatrickfulton.dev
        with respect to your use of our website (https://www.jpatrickfulton.dev)
        and the services (“Services”) we provide and/or host on our servers.
      </p>

      <p>
        Before you use or submit any information through or in connection with
        the Services, please carefully review this Privacy Policy. By using any
        part of the Services, you understand that your information will be
        collected, used, and disclosed as outlined in this Privacy Policy.
      </p>

      <p>
        If you do not agree to this privacy policy, please do not use our
        Services.
      </p>

      <h2>Our Principles</h2>

      <p>
        jpatrickfulton.dev has designed this policy to be consistent with the
        following principles:
      </p>

      <ul>
        <li>Privacy policies should be human readable and easy to find.</li>
        <li>
          Data collection, storage, and processing should be simplified as much
          as possible to enhance security, ensure consistency, and make the
          practices easy for users to understand.
        </li>
        <li>
          Data practices should meet the reasonable expectations of users.
        </li>
      </ul>

      <h2>Information We Collect</h2>

      <p>
        We collect information in multiple ways, including when you provide
        information directly to us; when we passively collect information from
        you, such as from your browser or device; and from third parties.
      </p>

      <h3>Information You Provide Directly to Us</h3>

      <p>
        We will collect any information you provide to us. We may collect
        information from you in a variety of ways, such as when you: (a) create
        an online account, (b) make a donation or purchase, (c) contact us or
        provide feedback, (d) subscribe to our newsletter, or (e) subscribe to
        our newsletter. This information may include but is not limited to your
        name, email address, phone number, mailing address, payment information
        and your geographic location.
      </p>

      <h3>Information that Is Automatically Collected</h3>

      <h4>Device/Usage Information</h4>

      <p>
        We may automatically collect certain information about the computer or
        devices (including mobile devices or tablets) you use to access the
        Services. As described further below, we may collect and analyze (a)
        device information such as IP addresses, location information (by
        country and city), unique device identifiers, IMEI and TCP/IP address,
        browser types, browser language, operating system, mobile device carrier
        information, and (b) information related to the ways in which you
        interact with the Services, such as referring and exit web pages and
        URLs, platform type, the number of clicks, domain names, landing pages,
        pages and content viewed and the order of those pages, statistical
        information about the use of the Services, the amount of time spent on
        particular pages, the date and time you used the Services, the frequency
        of your use of the Services, error logs, and other similar information.
        As described further below, we may use third-party analytics providers
        and technologies, including cookies and similar tools, to assist in
        collecting this information.
      </p>

      <h4>Cookies and Other Tracking Technologies</h4>

      <p>
        We also collect data about your use of the Services through the use of
        Internet server logs and online tracking technologies, like cookies
        and/or tracking pixels. A web server log is a file where website
        activity is stored. A cookie is a small text file that is placed on your
        computer when you visit a website, that enables us to: (a) recognize
        your computer; (b) store your preferences and settings; (c) understand
        the web pages of the Services you have visited and the referral sites
        that have led you to our Services; (d) enhance your user experience by
        delivering content specific to your inferred interests; (e) perform
        searches and analytics; and (f) assist with security administrative
        functions. Tracking pixels (sometimes referred to as web beacons or
        clear GIFs) are tiny electronic tags with a unique identifier embedded
        in websites, online ads and/or email, and that are designed to provide
        usage information like ad impressions or clicks, measure popularity of
        the Services and associated advertising, and to access user cookies. We
        may also use tracking technologies in our license buttons and/or icons
        that you can embed on other sites/services to track the website
        addresses where they are embedded, gauge user interaction with them, and
        determine the number of unique viewers of them. If you receive email
        from us (such as the CC newsletter, campaign updates, or other ongoing
        email communications from CC), we may use certain analytics tools, such
        as clear GIFs, to capture data such as whether you open our message,
        click on any links or banners our email contains, or otherwise interact
        with what we send. This data allows us to gauge the effectiveness of our
        communications and marketing campaigns. As we adopt additional
        technologies, we may also gather additional information through other
        methods.
      </p>

      <p>
        Please note that you can change your settings to notify you when a
        cookie is being set or updated, or to block cookies altogether. Please
        consult the “Help” section of your browser for more information. Please
        note that by blocking any or all cookies, you may not have access to
        certain features or offerings of the Services.
      </p>

      <p>
        For more information about how we use cookies, please read our{" "}
        <Link to="/cookie-policy/">Cookie Policy</Link>.
      </p>

      <h3>Information from Third Parties</h3>

      <p>
        To the extent permitted by law, we may also collect information from
        third parties, including public sources, social media platforms, and
        marketing and market research firms. Depending on the source, this
        information collected from third parties could include name, contact
        information, demographic information, information about an individual’s
        employer, information to verify identity or trustworthiness, and
        information for other fraud or safety protection purposes.
      </p>

      <h2>How We Use Your Information</h2>

      <p>We may use the information we collect from and about you to:</p>

      <ul>
        <li>Fulfill the purposes for which you provided it.</li>
        <li>
          Provide and improve the Services, including to develop new features or
          services, take steps to secure the Services, and for technical and
          customer support.
        </li>
        <li>Fund raise, accept donations, or process transactions.</li>
        <li>
          Send you information about your interaction or transactions with us,
          account alerts, or other communications, such as newsletters to which
          you have subscribed.
        </li>
        <li>
          Process and respond to your inquiries or to request your feedback.
        </li>
        <li>
          Conduct analytics, research, and reporting, including to synthesize
          and derive insights from your use of our Services.
        </li>
        <li>
          Comply with the law and protect the safety, rights, property, or
          security of jpatrickfulton.dev, the Services, our users, and the
          general public; and enforce our Terms of Use, including to investigate
          potential violations thereof.
        </li>
        <li>
          Please note that we may combine information that we collect from you
          and about you (including automatically collected information) with
          information we obtain about you from our affiliates and/or
          non-affiliated third parties, and use such combined information in
          accordance with this Privacy Policy.
        </li>
      </ul>

      <p>
        We may aggregate and/or de-identify information collected through the
        Services. We may use de-identified and/or aggregated data for any
        purpose, including without limitation for research and marketing
        purposes.
      </p>

      <h2>When We Disclose Your Information</h2>

      <p>
        We may disclose and/or share your information under the following
        circumstances:
      </p>

      <h3>Service Providers.</h3>

      <p>
        We may disclose your information with third parties who perform services
        on our behalf, including without limitation, event management,
        marketing, customer support, data storage, data analysis and processing,
        and legal services.
      </p>

      <h3>Legal Compliance and Protection of Creative Commons and Others.</h3>

      <p>
        We may disclose your information if required to do so by law or on a
        good faith belief that such disclosure is permitted by this Privacy
        Policy or reasonably necessary or appropriate for any of the following
        reasons: (a) to comply with legal process; (b) to enforce or apply our
        Terms of Use and this Privacy Policy, or other contracts with you,
        including investigation of potential violations thereof; (c) enforce our
        Charter including the Code of Conduct and policies contained and
        incorporated therein, (d) to respond to your requests for customer
        service; and/or (e) to protect the rights, property, or personal safety
        of jpatrickfulton.dev, our agents and affiliates, our users, and the
        public. This includes exchanging information with other companies and
        organizations for fraud protection, and spam/malware prevention, and
        similar purposes.
      </p>

      <h3>Business Transfers.</h3>

      <p>
        As we continue to develop our business, we may engage in certain
        business transactions, such as the transfer or sale of our assets. In
        such transactions, (including in contemplation of such transactions,
        e.g., due diligence) your information may be disclosed. If any of our
        assets are sold or transferred to a third party, customer information
        (including your email address) would likely be one of the transferred
        business assets.
      </p>

      <h3>Affiliated Companies.</h3>

      <p>
        We may disclose your information with current or future affiliated
        companies.
      </p>

      <h3>Consent.</h3>

      <p>
        We may disclose your information to any third parties based on your
        consent to do so.
      </p>

      <h3>Aggregate/De-identified Information.</h3>

      <p>
        We may disclose de-identified and/or aggregated data for any purpose to
        third parties, including advertisers, promotional partners, and/or
        others.
      </p>

      <h2>Legal Basis for Processing Personal Data</h2>

      <p>
        The laws in some jurisdictions require companies to tell you about the
        legal ground they rely on to use or disclose information that can be
        directly linked to or used to identify you. To the extent those laws
        apply, our legal grounds for processing such information are as follows:
      </p>

      <h3>To Honor Our Contractual Commitments to You.</h3>

      <p>
        Much of our processing of information is to meet our contractual
        obligations to provide services to our users.
      </p>

      <h3>Legitimate Interests.</h3>

      <p>
        In many cases, we handle information on the ground that it furthers our
        legitimate interests in ways that are not overridden by the interests or
        fundamental rights and freedoms of the affected individuals, these
        include:
      </p>

      <ul>
        <li>Customer service</li>
        <li>Marketing, advertising, and fundraising</li>
        <li>Protecting our users, personnel, and property</li>
        <li>Managing user accounts</li>
        <li>Organizing and running events and programs</li>
        <li>Analyzing and improving our business</li>
        <li>Managing legal issues</li>
        <li>
          We may also process information for the same legitimate interests of
          our users and business partners.
        </li>
      </ul>

      <h3>Legal Compliance.</h3>

      <p>
        We may need to use and disclose information in certain ways to comply
        with our legal obligations.
      </p>

      <h3>Consent.</h3>

      <p>
        Where required by law, and in some other cases where legally
        permissible, we handle information on the basis of consent. Where we
        handle your information on the basis of consent, you have the right to
        withdraw your consent; in accordance with applicable law.
      </p>

      <h2>Online Analytics</h2>

      <h3>Third Party Analytics</h3>

      <p>
        We may use third-party web analytics services (such as Google Analytics)
        on our Services to collect and analyze the information discussed above,
        and to engage in auditing, research, or reporting. The information
        (including your IP address) collected by various analytics technologies
        described in the “Cookies and Other Tracking Technologies” section above
        will be disclosed to or collected directly by these service providers,
        who use the information to evaluate your use of the Services, including
        by noting the third-party website from which you arrive to our Site,
        analyzing usage trends, assisting with fraud prevention, and providing
        certain features to you. To prevent Google Analytics from using your
        information for analytics, you may install the official Google Analytics
        Opt-out Browser Add-on.
      </p>

      <h3>Microsoft Clarity and Microsoft Advertising</h3>

      <p>
        We partner with Microsoft Clarity and Microsoft Advertising to capture
        how you use and interact with our website through behavioral metrics,
        heat maps, and session replay to improve and market our
        products/services. Website usage data is captured using first and
        third-party cookies and other tracking technologies to determine the
        popularity of products/services and online activity. Additionally, we
        use this information for site optimization, fraud/security purposes, and
        advertising. For more information about how Microsoft collects and uses
        your data, visit the{" "}
        <OutboundLink
          href="https://privacy.microsoft.com/en-US/privacystatement"
          rel="noreferrer"
          target="_blank"
        >
          Microsoft Privacy Statement
        </OutboundLink>
        .
      </p>

      <h2>Your Choices and Data Subject Rights</h2>

      <p>
        You have various rights with respect to the collection and use of your
        information through the Services. Those choices are as follows:
      </p>

      <h3>Email Unsubscribe</h3>

      <p>
        You may unsubscribe from our marketing emails at any time by clicking on
        the “unsubscribe” link at the bottom of each newsletter.
      </p>

      <h3>Account Preferences</h3>

      <p>
        If you have registered for an account with us through our Services, you
        can update your account information or adjust your email communications
        preferences by logging into your account and updating your settings.
      </p>

      <h2>EU Data Subject Rights</h2>

      <p>
        Individuals in the European Economic Area (“EEA”) and other
        jurisdictions have certain legal rights (subject to applicable
        exceptions and limitations) to obtain confirmation of whether we hold
        certain information about them, to access such information, and to
        obtain its correction or deletion in appropriate circumstances. You may
        have the right to object to our handling of your information, restrict
        our processing of your information, and to withdraw any consent you have
        provided. You also have the right to go directly to the relevant
        supervisory or legal authority, but we encourage you to contact us so
        that we may resolve your concerns directly as best and as promptly as we
        can.
      </p>

      <h2>International Transfers</h2>

      <p>
        As described above in the “When We Disclose Your Information” section,
        we may share your information with trusted service providers or business
        partners in countries other than your country of residence in accordance
        with applicable law. This means that some of your information may be
        processed in countries that may not offer the same level of protection
        as the privacy laws of your jurisdiction. By providing us with your
        information, you acknowledge any such transfer, storage or use.
      </p>

      <p>
        If we provide any information about you to any third parties information
        processors located outside of the EEA, we will take appropriate measures
        to ensure such companies protect your information adequately in
        accordance with this Privacy Policy and other data protection laws to
        govern the transfers of such data.
      </p>

      <h2>Security Measures</h2>

      <p>
        We have implemented technical, physical, and organizational security
        measures to protect against the loss, misuse, and/or alteration of your
        information. These safeguards vary based on the sensitivity of the
        information that we collect and store. However, we cannot and do not
        guarantee that these measures will prevent every unauthorized attempt to
        access, use, or disclose your information since despite our efforts, no
        Internet and/or other electronic transmissions can be completely secure.
      </p>

      <h2>Children</h2>

      <p>
        The Services are intended for users over the age of 18 and are not
        directed at children under the age of 13. If we become aware that we
        have collected personal information (as defined by the Children’s Online
        Privacy Protection Act) from children under the age of 13, or personal
        data (as defined by the EU GDPR) from children under the age of 16, we
        will take reasonable steps to delete it as soon as practicable.
      </p>

      <h2>Data Retention</h2>

      <p>
        We retain the information we collect for as long as necessary to fulfill
        the purposes set forth in this Privacy Policy or as long as we are
        legally required or permitted to do so. Information may persist in
        copies made for backup and business continuity purposes for additional
        time.
      </p>

      <h2>Third-Party Links and Services</h2>

      <p>
        The Services may contain links to third-party websites (e.g., social
        media sites like Facebook and Twitter), third-party plug-ins (e.g., the
        Facebook “like” button and Twitter “follow” button), and other services.
        If you choose to use these sites or features, you may disclose your
        information not just to those third-parties, but also to their users and
        the public more generally depending on how their services function.
        Creative Commons is not responsible for the content or privacy practices
        of such third party websites or services. The collection, use and
        disclosure of your information will be subject to the privacy policies
        of the third party websites or services, and not this Privacy Policy. We
        encourage you to read the privacy statements of each and every site you
        visit.
      </p>

      <h2>Changes to this Privacy Policy</h2>

      <p>
        We will continue to evaluate this Privacy Policy as we update and expand
        our Services, and we may make changes to the Privacy Policy accordingly.
        We will post any changes here and revise the date last updated above. We
        encourage you to check this page periodically for updates to stay
        informed on how we collect, use and share your information. If we make
        material changes to this Privacy Policy, we will provide you with notice
        as required by law.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, You can contact us:
      </p>
      <ul>
        <li>
          By email:{" "}
          <a href="mailto:patrick@jpatrickfulton.com">
            patrick@jpatrickfulton.com
          </a>
        </li>
      </ul>
    </section>
  </>
);
