import React from "react";
import { Link, useMatch } from "react-router-dom";
import { AppSettings } from "../../config/app-settings.js";

function SidebarNavList(props) {
  const [active, setActive] = React.useState(-1);
  const [clicked, setClicked] = React.useState(-1);
  const match = useMatch(props.data.path);

  const handleExpand = (e, i, match) => {
    e.preventDefault();
    setActive(active === i ? -1 : i);
    setClicked(1);
  };

  const icon = props.data.icon && (
    <div className="menu-icon">
      <i className={props.data.icon}></i>
    </div>
  );
  const img = props.data.img && (
    <div className="menu-icon-img">
      <img src={props.data.img} alt="" />
    </div>
  );
  const caret = props.data.children && !props.data.badge && (
    <div className="menu-caret"></div>
  );
  const label = props.data.label && (
    <span className="menu-label ms-5px">{props.data.label}</span>
  );
  const badge = props.data.badge && (
    <div className="menu-badge">{props.data.badge}</div>
  );
  const highlight = props.data.highlight && (
    <i className="fa fa-paper-plane text-theme"></i>
  );
  const title = props.data.title && (
    <div className="menu-text">
      {props.data.title} {label} {highlight}
    </div>
  );

  const {
    handleAppSidebarOnMouseOver,
    handleAppSidebarOnMouseOut,
    appSidebarMinified,
  } = React.useContext(AppSettings);

  return (
    <div
      className={
        "menu-item " +
        (match ? "active " : "") +
        (props.active || (clicked === -1 && match) || props.data.search
          ? "expand "
          : "closed ") +
        (props.data.children ? "has-sub " : "")
      }
    >
      {props.data.children ? (
        <Link
          to={props.data.path}
          className="menu-link"
          onMouseOver={(e) => handleAppSidebarOnMouseOver(e, props.data)}
          onMouseOut={(e) => handleAppSidebarOnMouseOut(e, props.data)}
          onClick={props.expand}
        >
          {img}
          {icon}
          {title}
          {caret}
          {badge}
        </Link>
      ) : (
        <Link to={props.data.path} className="menu-link">
          {img}
          {icon}
          {badge}
          {title}
          {caret}
        </Link>
      )}
      {props.data.children && (
        <div
          className={
            "menu-submenu " +
            ((props.active || (clicked === -1 && match) || props.data.search) &&
            !appSidebarMinified
              ? "d-block "
              : "d-none")
          }
        >
          {props.data.children.map((submenu, i) => (
            <SidebarNavList
              data={submenu}
              key={i}
              expand={(e) => handleExpand(e, i, match)}
              active={i === active}
              clicked={clicked}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SidebarNavList;
