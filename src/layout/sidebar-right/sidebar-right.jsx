import React from "react";
import { Link } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Collapse, CardHeader, CardBody, Card } from "reactstrap";
import { AppSettings } from "../../config/app-settings.js";

class SidebarRight extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: [
        { id: 1, collapse: true },
        { id: 2, collapse: false },
        { id: 3, collapse: false },
        { id: 4, collapse: false },
        { id: 5, collapse: false },
        { id: 6, collapse: false },
        { id: 7, collapse: false },
      ],
    };
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  toggleCollapse(index) {
    var newArray = [];
    for (let collapseObj of this.state.collapse) {
      if (collapseObj.id === index) {
        collapseObj.collapse = !collapseObj.collapse;
      } else {
        collapseObj.collapse = false;
      }
      newArray.push(collapseObj);
    }

    this.setState({
      collapse: newArray,
    });
  }

  render() {
    return (
      <AppSettings.Consumer>
        {({ appSidebarTwo, toggleAppSidebarEndMobile }) => (
          <React.Fragment>
            {appSidebarTwo && (
              <React.Fragment>
                <div id="sidebar-right" className="app-sidebar app-sidebar-end">
                  <PerfectScrollbar
                    className="app-sidebar-content h-100"
                    options={{ suppressScrollX: true }}
                  >
                    <div className="p-20px text-white">
                      <p className="fw-bold mb-2">Accordion</p>
                      <div
                        id="accordion"
                        className="accordion rounded overflow-hidden"
                      >
                        {this.state.collapse.map((value, i) => (
                          <Card
                            className="bg-gray-700 text-white border-0 rounded-0"
                            key={i}
                          >
                            <CardHeader
                              className={
                                "card-header bg-gray-900 text-white pointer-cursor border-0 d-flex align-items-center rounded-0 " +
                                (!value.collapse ? "collapsed " : "")
                              }
                              onClick={() => this.toggleCollapse(value.id)}
                            >
                              <i className="fa fa-circle text-teal fs-6px me-2"></i>{" "}
                              Accordion Item #{value.id}
                            </CardHeader>
                            <Collapse isOpen={value.collapse}>
                              <CardBody className="p-3">
                                Anim pariatur cliche reprehenderit, enim eiusmod
                                high life accusamus.
                              </CardBody>
                            </Collapse>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </PerfectScrollbar>
                </div>
                <div className="app-sidebar-bg app-sidebar-end"></div>
                <div className="app-sidebar-mobile-backdrop app-sidebar-end">
                  <Link
                    to="/"
                    onClick={toggleAppSidebarEndMobile}
                    className="stretched-link"
                  ></Link>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </AppSettings.Consumer>
    );
  }
}

export default SidebarRight;
