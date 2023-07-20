import { Link } from "gatsby";
import React from "react";

const SeriesLinks = () => (
  <ol class="series-links">
    <li>
      <Link to="/blog/2023-07-18-azure-personal-network/">
        Overview and Objectives
      </Link>
    </li>
    <li>
      <Link to="/blog/2023-07-19-azure-personal-network-vnet/">
        Virtual Networking and VPN Gateway
      </Link>
    </li>
    <li>
      <Link to="/blog/2023-07-20-azure-personal-network-vm-smbd/">
        Virtual Machine for Samba
      </Link>
    </li>
    <li>
      <Link to="/blog/2023-07-21-azure-personal-network-replace-vpn/">
        Replace Azure VPN Gateway with an OpenVPN Server
      </Link>
    </li>
    <li>Setup Firewalla OpenVPN Server Connection</li>
    <li>Right-size the Virtual Machines</li>
    <li>Resize the Managed Backup Data Disk</li>
  </ol>
);

export default SeriesLinks;
