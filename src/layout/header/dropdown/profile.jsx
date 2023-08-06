import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

//Context
import { useAuthContext } from "../../../contexts/AuthContext";

function DropdownProfile() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { handleLogout, user } = useAuthContext();

  return (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={() => setDropdownOpen(!dropdownOpen)}
      className="navbar-item navbar-user dropdown"
      tag="div"
    >
      <DropdownToggle
        tag="a"
        className="navbar-link dropdown-toggle d-flex align-items-center"
      >
        <div className="image image-icon bg-gray-800 text-gray-600">
          <i className="fa fa-user"></i>
        </div>
        <span>
          <span className="d-none d-md-inline">
            {user && user.nombre_apellido}
          </span>
          <b className="caret"></b>
        </span>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu dropdown-menu-end" end tag="div">
        {/* <DropdownItem>Edit Profile</DropdownItem>
        <DropdownItem>
          <span className="badge bg-danger float-end rounded-pill">2</span>{" "}
          Inbox
        </DropdownItem>
        <DropdownItem>Calendar</DropdownItem>
        <DropdownItem>Setting</DropdownItem>
        <div className="dropdown-divider"></div> */}
        <DropdownItem onClick={handleLogout}>Log Out</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default DropdownProfile;
