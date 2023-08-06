import React from "react";
import { Route, Link } from "react-router-dom";

class TopMenuNavList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: -1,
    };
    this.handleExpand = this.handleExpand.bind(this);
  }

  handleExpand(e, i, match) {
    e.preventDefault();

    this.setState((state) => ({
      active: this.state.active === i ? -1 : i,
    }));
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
      <span className="menu-label ms-5px">{this.props.data.label}</span>
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
      <Route
        path={this.props.data.path}
        exact={this.props.data.exact}
        children={({ match }) => (
          <div
            className={
              "menu-item " +
              (match ? "active " : "") +
              (this.props.data.children ? "has-sub " : "")
            }
          >
            {this.props.data.children ? (
              <Link
                className="menu-link"
                to={this.props.data.path}
                onClick={this.props.expand}
              >
                {img} {icon} {title} {caret} {badge}
              </Link>
            ) : (
              <Link className="menu-link" to={this.props.data.path}>
                {img} {icon} {title} {caret} {badge}
              </Link>
            )}
            {this.props.data.children && (
              <div
                className={
                  "menu-submenu " + (this.props.active ? "d-block" : "")
                }
              >
                {this.props.data.children &&
                  this.props.data.children.map((submenu, i) => (
                    <TopMenuNavList
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
    );
  }
}

export default TopMenuNavList;
