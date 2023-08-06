import React from "react";
import { Col, Spinner } from "react-bootstrap";

const CardWidget = ({
  title,
  number,
  progress,
  description,
  iconClassName,
  widgetColor,
  isLoading,
}) => {
  return (
    <Col xl={3} md={6}>
      <div className={`widget widget-stats bg-${widgetColor}`}>
        <div className="stats-icon stats-icon-lg">
          <i className={iconClassName}></i>
        </div>
        <div className="stats-content">
          <div className="stats-title">{title}</div>
          {!isLoading ? (
            <div className="stats-number">{number}</div>
          ) : (
            <Spinner
              animation="grow"
              variant="light"
              style={{ marginBottom: "5px" }}
            />
          )}
          <div className="stats-progress progress">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {!isLoading ? (
            <div className="stats-desc">{description}</div>
          ) : (
            <Spinner animation="grow" variant="light" size="sm" />
          )}
        </div>
      </div>
    </Col>
  );
};

export default CardWidget;
