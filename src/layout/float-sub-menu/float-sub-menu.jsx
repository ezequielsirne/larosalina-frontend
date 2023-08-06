import React from "react";
import { Route } from "react-router-dom";
import { AppSettings } from "../../config/app-settings.js";
import FloatSubMenuList from "./float-sub-menu-list.jsx";

class FloatSubMenu extends React.Component {
  static contextType = AppSettings;

  constructor(props) {
    super(props);
    this.state = {
      active: -1,
      clicked: -1,
    };
  }

  handleExpand(e, i, match) {
    e.preventDefault();

    if (this.state.clicked === -1 && match) {
      this.setState((state) => ({
        active: -1,
        clicked: 1,
      }));
    } else {
      this.setState((state) => ({
        active: this.state.active === i ? -1 : i,
        clicked: 1,
      }));
    }
    setTimeout(() => {
      this.context.handleAppSidebarFloatSubMenuClick();
    }, 0);
  }

  render() {
    return (
      <AppSettings.Consumer>
        {({
          appSidebarFloatSubMenu,
          appSidebarFloatSubMenuActive,
          appSidebarFloatSubMenuTop,
          appSidebarFloatSubMenuLeft,
          appSidebarFloatSubMenuBottom,
          appSidebarFloatSubMenuLineTop,
          appSidebarFloatSubMenuLineBottom,
          appSidebarFloatSubMenuArrowTop,
          appSidebarFloatSubMenuArrowBottom,
          handleAppSidebarFloatSubMenuOnMouseOver,
          handleAppSidebarFloatSubMenuOnMouseOut,
        }) => (
          <div
            id="app-sidebar-float-submenu"
            onMouseOver={handleAppSidebarFloatSubMenuOnMouseOver}
            onMouseOut={handleAppSidebarFloatSubMenuOnMouseOut}
            className={
              "app-sidebar-float-submenu-container " +
              (appSidebarFloatSubMenuActive ? "d-block" : "d-none")
            }
            style={{
              left: appSidebarFloatSubMenuLeft,
              top: appSidebarFloatSubMenuTop,
              bottom: appSidebarFloatSubMenuBottom,
            }}
          >
            <div
              className="app-sidebar-float-submenu-arrow"
              style={{
                top: appSidebarFloatSubMenuArrowTop,
                bottom: appSidebarFloatSubMenuArrowBottom,
              }}
            ></div>
            <div
              className="app-sidebar-float-submenu-line"
              style={{
                top: appSidebarFloatSubMenuLineTop,
                bottom: appSidebarFloatSubMenuLineBottom,
              }}
            ></div>
            <div className="app-sidebar-float-submenu">
              {appSidebarFloatSubMenu.children &&
                appSidebarFloatSubMenu.children.map((menu, i) => (
                  <Route
                    path={menu.path}
                    exact={menu.exact}
                    key={i}
                    children={({ match }) => (
                      <FloatSubMenuList
                        data={menu}
                        key={i}
                        expand={(e) => this.handleExpand(e, i, match)}
                        active={i === this.state.active}
                        clicked={this.state.clicked}
                      />
                    )}
                  />
                ))}
            </div>
          </div>
        )}
      </AppSettings.Consumer>
    );
  }
}

export default FloatSubMenu;
