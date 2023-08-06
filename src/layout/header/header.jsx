import React, { useState } from "react";
import { Link } from "react-router-dom";
import DropdownNotification from "./dropdown/notification.jsx";
import DropdownLanguage from "./dropdown/language.jsx";
import DropdownProfile from "./dropdown/profile.jsx";
import SearchForm from "./search/form.jsx";
import DropdownMegaMenu from "./dropdown/mega.jsx";

import { useAppSettings } from "../../config/app-settings.js";

function Header() {
  const {
    toggleAppSidebarMobile,
    toggleAppSidebarEnd,
    toggleAppSidebarEndMobile,
    toggleAppTopMenuMobile,
    appHeaderSearchBar,
    appHeaderNotificationBar,
    appHeaderLanguageBar,
    appHeaderMegaMenu,
    appHeaderInverse,
    appSidebarTwo,
    appTopMenu,
    appSidebarNone,
  } = useAppSettings();

  const [appHeaderMegaMenuMobile, setappHeaderMegaMenuMobile] = useState(false);

  return (
    <div
      id="header"
      className={"app-header " + (appHeaderInverse ? "app-header-inverse" : "")}
    >
      <div className="navbar-header">
        {appSidebarTwo && (
          <button
            type="button"
            className="navbar-mobile-toggler"
            onClick={toggleAppSidebarEndMobile}
          >
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        )}
        <Link to="/" className="navbar-brand">
          <img
            src="/assets/img/logo/logo_larosalina.png"
            className="rounded mx-auto d-block"
            alt="Logo"
            style={{
              maxHeight: "39px",
              maxWidth: "154px",
              marginRight: "12px",
            }}
          />
          &nbsp;<b>La Rosalina </b>&nbsp;Resort
        </Link>

        {appHeaderMegaMenu && (
          <button
            type="button"
            className="navbar-mobile-toggler"
            onClick={() => setappHeaderMegaMenuMobile(!appHeaderMegaMenuMobile)}
          >
            <span className="fa-stack fa-lg text-inverse">
              <i className="far fa-square fa-stack-2x"></i>
              <i className="fa fa-cog fa-stack-1x"></i>
            </span>
          </button>
        )}
        {appTopMenu && !appSidebarNone && (
          <button
            type="button"
            className="navbar-mobile-toggler"
            onClick={toggleAppTopMenuMobile}
          >
            <span className="fa-stack fa-lg text-inverse">
              <i className="far fa-square fa-stack-2x"></i>
              <i className="fa fa-cog fa-stack-1x"></i>
            </span>
          </button>
        )}
        {appSidebarNone && appTopMenu && (
          <button
            type="button"
            className="navbar-mobile-toggler"
            onClick={toggleAppTopMenuMobile}
          >
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        )}
        {!appSidebarNone && (
          <button
            type="button"
            className="navbar-mobile-toggler"
            onClick={toggleAppSidebarMobile}
          >
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        )}
      </div>

      {appHeaderMegaMenu && (
        <DropdownMegaMenu collapse={appHeaderMegaMenuMobile} />
      )}

      <div className="navbar-nav">
        {appHeaderSearchBar && <SearchForm />}
        {appHeaderNotificationBar && <DropdownNotification />}
        {appHeaderLanguageBar && <DropdownLanguage />}

        <DropdownProfile />

        {appSidebarTwo && (
          <div className="navbar-divider d-none d-md-block"></div>
        )}

        {appSidebarTwo && (
          <div className="navbar-item d-none d-md-block">
            <Link
              to="/"
              onClick={toggleAppSidebarEnd}
              className="navbar-link icon"
            >
              <i className="fa fa-th"></i>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
