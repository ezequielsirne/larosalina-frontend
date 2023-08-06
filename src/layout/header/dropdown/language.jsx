import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

function DropdownLanguage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={() => setDropdownOpen(!dropdownOpen)}
      className="navbar-item navbar-language dropdown"
      tag="div"
    >
      <DropdownToggle className="navbar-link dropdown-toggle" tag="a">
        <span className="flag-icon flag-icon-us me-5px" title="us"></span>
        <span className="name d-none d-sm-inline">EN</span>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu dropdown-menu-end" tag="div">
        <DropdownItem>
          <span className="flag-icon flag-icon-us me-5px" title="us"></span>{" "}
          English
        </DropdownItem>
        <DropdownItem>
          <span className="flag-icon flag-icon-cn me-5px" title="cn"></span>{" "}
          Chinese
        </DropdownItem>
        <DropdownItem>
          <span className="flag-icon flag-icon-jp me-5px" title="jp"></span>{" "}
          Japanese
        </DropdownItem>
        <DropdownItem>
          <span className="flag-icon flag-icon-be me-5px" title="be"></span>{" "}
          Belgium
        </DropdownItem>
        <DropdownItem divider></DropdownItem>
        <DropdownItem className="text-center">more options</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default DropdownLanguage;
