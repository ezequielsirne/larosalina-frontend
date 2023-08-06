import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { PROTECTED } from "../config/app-route";

//Components
import { Form } from "react-bootstrap";
import swal from "sweetalert";

//Contexts
import { useAppSettings } from "../config/app-settings.js";
import { useAuthContext } from "../contexts/AuthContext.jsx";

//Services
import login from "../services/usersServices.js";

function Login() {
  const {
    handleSetAppSidebarNone,
    handleSetAppHeaderNone,
    handleSetAppContentClass,
  } = useAppSettings();

  useEffect(() => {
    handleSetAppSidebarNone(true);
    handleSetAppHeaderNone(true);
    handleSetAppContentClass("p-0");

    return () => {
      handleSetAppSidebarNone(false);
      handleSetAppHeaderNone(false);
      handleSetAppContentClass("");
    };
  }, [
    handleSetAppSidebarNone,
    handleSetAppHeaderNone,
    handleSetAppContentClass,
  ]);

  const { isAuthenticated, handleLoginSession, handleLoginLocal } =
    useAuthContext();

  const navigate = useNavigate();

  const [nick, setNick] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={PROTECTED} />;
  }

  const onSubmit = (e) => {
    e.preventDefault();
    login(nick, password)
      .then((responseUser) => {
        if (responseUser.isSuccess) {
          console.log(checked);
          if (checked) {
            handleLoginLocal(
              responseUser.result.user,
              responseUser.result.token
            );
            navigate("/app");
          } else {
            handleLoginSession(
              responseUser.result.user,
              responseUser.result.token
            );
            navigate("/app");
          }
        }
      })
      .catch();
  };

  return (
    <div className="login login-with-news-feed">
      <div className="news-feed">
        <div
          className="news-image"
          style={{ backgroundImage: "url(/assets/img/login-bg/login-bg.jpg)" }}
        ></div>
        <div className="news-caption">
          <h4 className="caption-title">
            <b>La Rosalina</b> Resort
          </h4>
          <p>Vení al campo, sentite en casa</p>
        </div>
      </div>
      <div className="login-container text-light bg-dark">
        <img
          src="/assets/img/logo/logo_larosalina.png"
          className="rounded mx-auto d-block"
          alt="Logo"
          style={{ maxHeight: "350px", maxWidth: "350px" }}
        />

        <div className="login-header mb-30px mt-30px">
          <div className="brand">
            <div className="d-flex align-items-center text-light bg-dark">
              <b>La Rosalina</b>&nbsp;Resort
            </div>
            <small>Ingresá tus datos para iniciar sesión</small>
          </div>
          <div className="icon">
            <i className="fa fa-sign-in-alt"></i>
          </div>
        </div>
        <div className="login-content">
          <Form onSubmit={onSubmit} className="fs-13px">
            <div className="form-floating mb-15px">
              <input
                type="text"
                className="form-control h-45px fs-13px text-light bg-dark"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                placeholder="Usuario"
                id="nick"
              />
              <label
                htmlFor="emailAddress"
                className="d-flex align-items-center fs-13px text-gray-600"
              >
                Usuario
              </label>
            </div>
            <div className="form-floating mb-15px">
              <input
                type="password"
                className="form-control h-45px fs-13px text-light bg-dark"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                id="password"
              />
              <label
                htmlFor="password"
                className="d-flex align-items-center fs-13px text-gray-600"
              >
                Contraseña
              </label>
            </div>
            <div className="form-check mb-30px">
              <input
                className="form-check-input text-light bg-dark"
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                id="rememberMe"
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Mantener la sesión iniciada
              </label>
            </div>
            <div className="mb-15px">
              <button
                type="submit"
                className="btn btn-success d-block h-45px w-100 btn-lg fs-14px"
              >
                Iniciar sesión
              </button>
            </div>
            {/* <div className="mb-40px pb-40px text-inverse">
							Not a member yet? Click <Link to="/user/register-v3" className="text-primary">here</Link> to register.
						</div> */}
            <hr className="bg-gray-600 opacity-2" />
            <div className="text-gray-600 text-center text-gray-500-darker mb-0">
              &copy; La Rosalina Resort 2023
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
