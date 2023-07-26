import { Link } from "gatsby";
import React from "react";

const SeriesLinks = () => (
  <>
    <div class="series-links-header">Posts from this Series:</div>
    <div class="series-links">
      <ol>
        <li>
          <Link to="/blog/2023-07-18-azure-personal-network/">
            Overview and Objectives
          </Link>
        </li>
        <li>
          <Link to="/blog/2023-07-19-azure-personal-network-vnet/">
            Virtual Network
          </Link>
        </li>
        <li>
          <Link to="/blog/2023-07-19-azure-personal-network-vpn-gateway/">
            Virtual Network Gateway
          </Link>
        </li>
        <li>
          <Link to="/blog/2023-07-20-azure-personal-network-vm-smbd/">
            Virtual Machine for Samba
          </Link>
        </li>
        <li>
          <Link to="/blog/2023-07-21-azure-personal-network-replace-vpn/">
            Replace Azure Network Gateway with an OpenVPN Server
          </Link>
        </li>
        <li>
          <Link to="/blog/2023-07-21-azure-personal-network-vpn-firewalla/">
            Setup Firewalla OpenVPN Server Connection
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
            Orchestrate Spot Instance Reallocation
          </Link>
        </li>
      </ol>
    </div>
  </>
);

export default SeriesLinks;
