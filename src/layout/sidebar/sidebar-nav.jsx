import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppSettings } from "../../config/app-settings.js";
import SidebarNavList from "./sidebar-nav-list.jsx";
import Menu from "../menu/menu.jsx";

function SidebarNav() {
  const { appSidebarSearch } = useAppSettings();

  const [active, setActive] = useState(-1);
  const [clicked, setClicked] = useState(-1);
  const [filteredMenus, setFilteredMenus] = useState(Menu);

  const location = useLocation();

  const handleExpand = (e, i, match) => {
    e.preventDefault();

    if (clicked === -1 && match) {
      setActive(-1);
      setClicked(1);
    } else {
      setActive(active === i ? -1 : i);
      setClicked(1);
    }
  };

  const handleSidebarSearch = (e) => {
    let searchValue = e.target.value;
    searchValue = searchValue.toLowerCase();

    let newMenus = [];

    if (searchValue !== "") {
      newMenus = Menu.filter((item) => {
        let title = item.title;
        title = title.toLowerCase();
        if (title.search(searchValue) > -1) {
          item.search = true;
          return true;
        } else {
          if (item.children) {
            for (var i = 0; i < item.children.length; i++) {
              let title2 = item.children[i]["title"];
              title2 = title2.toLowerCase();

              if (title2.search(searchValue) > -1) {
                item.search = true;
                return true;
              }
            }
          }
          return false;
        }
      });
    } else {
      newMenus = Menu.filter((item) => {
        item.search = false;
        return true;
      });
    }

    setFilteredMenus(newMenus);
  };

  return (
    <div className="menu">
      {appSidebarSearch && (
        <div className="menu-search mb-n3">
          <input
            type="text"
            className="form-control"
            placeholder="Sidebar menu filter..."
            onKeyUp={handleSidebarSearch}
          />
        </div>
      )}
      <div className="menu-header">Navigation</div>
      {filteredMenus.map((menu, i) => (
        <SidebarNavList
          data={menu}
          key={i}
          expand={(e) => handleExpand(e, i, location.pathname === menu.path)}
          active={i === active}
          clicked={clicked}
        />
      ))}
    </div>
  );
}

export default SidebarNav;
