import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import routes from "../../config/app-route.jsx";
import { useAppSettings } from "../../config/app-settings.js";

function Content() {
  const { appContentClass, appTitleConfig } = useAppSettings();

  function setTitle(path, routeArray) {
    var appTitle;
    for (var i = 0; i < routeArray.length; i++) {
      if (routeArray[i].path === path) {
        appTitle = `${appTitleConfig} | ${routeArray[i].title}`;
      }
    }
    document.title = appTitle ? appTitle : `${appTitleConfig} | React App`;
  }

  const location = useLocation();

  useEffect(() => {
    setTitle(location.pathname, routes);
  }, [location.pathname]);

  return (
    <div className={"app-content " + appContentClass}>
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            element={<route.component />}
          >
            {route.children &&
              route.children.map((childRoute, childIndex) => (
                <Route
                  key={childIndex}
                  path={childRoute.path}
                  exact={childRoute.exact}
                  element={<childRoute.component />}
                />
              ))}
          </Route>
        ))}
      </Routes>
    </div>
  );
}

export default Content;
