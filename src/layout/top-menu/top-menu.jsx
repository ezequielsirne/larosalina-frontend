import React from "react";
import TopMenuNav from "./top-menu-nav.jsx";
import { AppSettings } from "../../config/app-settings.js";

class TopMenu extends React.Component {
  render() {
    return (
      <AppSettings.Consumer>
        {({ appTopMenuMobileToggled }) => (
          <div
            id="top-menu"
            className={
              "app-top-menu " + (appTopMenuMobileToggled ? "d-block " : "")
            }
          >
            <TopMenuNav />
          </div>
        )}
      </AppSettings.Consumer>
    );
  }
}

export default TopMenu;
