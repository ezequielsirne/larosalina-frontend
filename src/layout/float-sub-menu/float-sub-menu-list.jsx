import React from "react";
import { Route, Link } from "react-router-dom";
import { AppSettings } from "../../config/app-settings.js";

class FloatSubMenuList extends React.Component {
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

    this.setState((state) => ({
      active: this.state.active === i ? -1 : i,
      clicked: 1,
    }));
    setTimeout(() => {
      this.context.handleAppSidebarFloatSubMenuClick();
    }, 0);
  }

  render() {
    var icon = this.props.data.icon && (
      <div className="menu-icon">
        <i className={this.props.data.icon}></i>
      </div>
    );
    var img = this.props.data.img && (
      <div className="menu-icon-img">
        <img src={this.props.data.img} alt="" />
      </div>
    );
    var caret = this.props.data.children && !this.props.data.badge && (
      <div className="menu-caret"></div>
    );
    var label = this.props.data.label && (
      <span className="menu-label">{this.props.data.label}</span>
    );
    var badge = this.props.data.badge && (
      <div className="menu-badge">{this.props.data.badge}</div>
    );
    var highlight = this.props.data.highlight && (
      <i className="fa fa-paper-plane text-theme"></i>
    );
    var title = this.props.data.title && (
      <div className="menu-text">
        {this.props.data.title} {label} {highlight}
      </div>
    );

    return (
      <AppSettings.Consumer>
        {({ appSidebarMinified }) => (
          <Route
            path={this.props.data.path}
            exact={this.props.data.exact}
            children={({ match }) => (
              <div
                className={
                  "menu-item " +
                  (match ? "active " : "") +
                  (this.props.active || (this.props.clicked === -1 && match)
                    ? "expand "
                    : "closed ") +
                  (this.props.data.children ? "has-sub " : "")
                }
              >
                {this.props.data.children ? (
                  <Link
                    className="menu-link"
                    to={this.props.data.path}
                    onClick={this.props.expand}
                  >
                    {img} {icon} {title} {badge} {caret}
                  </Link>
                ) : (
                  <Link className="menu-link" to={this.props.data.path}>
                    {img} {icon} {title} {badge} {caret}
                  </Link>
                )}
                {this.props.data.children && (
                  <div
                    className={
                      "menu-submenu " +
                      ((this.props.active ||
                        (this.props.clicked === -1 && match)) &&
                      !appSidebarMinified
                        ? "d-block "
                        : "d-none")
                    }
                  >
                    {this.props.data.children &&
                      this.props.data.children.map((submenu, i) => (
                        <FloatSubMenuList
                          data={submenu}
                          key={i}
                          expand={(e) => this.handleExpand(e, i, match)}
                          active={i === this.state.active}
                          clicked={this.state.clicked}
                        />
                      ))}
                  </div>
                )}
              </div>
            )}
          />
        )}
      </AppSettings.Consumer>
    );
  }
}

export default FloatSubMenuList;
