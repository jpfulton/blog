import { Link } from "gatsby";
import React from "react";

const SeriesLinks = () => (
  <>
    <div class="series-links-header">Posts from this Series:</div>
    <div class="series-links">
      <ol>
        <li>
          <Link to="/blog/2023-07-18-azure-personal-network/">Overview</Link>
        </li>
        <li>
          <Link to="/blog/2023-07-19-azure-personal-network-vnet/">
            Virtual Network
          </Link>
        </li>
        <li>
          <Link to="/blog/2023-07-19-azure-personal-network-vpn-gateway/">
            Azure VPN Gateway
          </Link>
        </li>
        <li>
          <Link to="/blog/2023-07-20-azure-personal-network-vm-smbd/">
            Samba Server
          </Link>
        </li>
        <li>
          <Link to="/blog/2023-07-21-azure-personal-network-replace-vpn/">
            Replace the Azure VPN Gateway with an OpenVPN Server
          </Link>
        </li>
        <li>
          <Link to="/blog/2023-07-21-azure-personal-network-vpn-firewalla/">
            Setup a Firewalla OpenVPN Client Connection
          </Link>
        </li>
        <li>
          <Link to="/blog/2023-07-23-azure-personal-network-resize-disk/">
            Resize the Managed Backup Data Disk
          </Link>
        </li>
        <li>
          <Link to="/blog/2023-07-24-azure-personal-network-spot-instance/">
            Convert the Backup Server to a Spot Instance
          </Link>
        </li>
        <li>
          <Link to="/blog/2023-07-25-azure-personal-network-spot-orchestration/">
            Spot Instance Restart Orchestration
          </Link>
        </li>
      </ol>
    </div>
  </>
);

export default SeriesLinks;
