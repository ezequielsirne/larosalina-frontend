import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

function DropdownNotification() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={() => setDropdownOpen(!dropdownOpen)}
      className="navbar-item dropdown"
      tag="div"
    >
      <DropdownToggle className="navbar-link dropdown-toggle icon" tag="a">
        <i className="fa fa-bell"></i>
        <span className="badge">0</span>
      </DropdownToggle>
      <DropdownMenu
        className="dropdown-menu media-list dropdown-menu-end"
        end
        tag="div"
      >
        <DropdownItem className="dropdown-header" tag="div" header>
          NOTIFICACIONES (0)
        </DropdownItem>
        <div className="text-center w-300px py-3">
          No tenés notificaciones nuevas
        </div>
      </DropdownMenu>
    </Dropdown>
  );
}

export default DropdownNotification;
