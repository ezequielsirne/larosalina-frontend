import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";
import Spinner from "react-bootstrap/Spinner";
import swal from "sweetalert";
import { PROTECTED } from "../config/app-route.jsx";

//Servicios
import { getDepartamentos } from "../services/recursosServices.js";
import {
  getReservas,
  getIndicadores,
  getEnConflicto,
} from "../services/reservasServices.js";

//Calendar
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import esLocale from "@fullcalendar/core/locales/es"; //Español

//Components
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../components/panel/panel.jsx";

//Contexts
import { useAuthContext } from "../contexts/AuthContext.jsx";

function Home() {
  const { token } = useAuthContext();
  const navigate = useNavigate();

  //Solo para la demo
  const initialDate = new Date(2023, 0, 15);

  const [indicadores, setIndicadores] = useState([]);

  const [enCoflictoMessage, setEnCoflictoMessage] = useState();
  const [enCoflictoColor, setEnCoflictoColor] = useState();
  const [enCoflictoIcon, setEnCoflictoIcon] = useState();

  //Calendar
  const [departamentos, setDepartamentos] = useState();
  const [events, setEvents] = useState();

  const enConflicto = (count) => {
    if (count > 0) {
      setEnCoflictoMessage(`Tenés ${count} reservas en conflicto!`);
      setEnCoflictoColor("danger");
      setEnCoflictoIcon("fa-exclamation-triangle");
    } else {
      setEnCoflictoMessage(`No tenés reservas en conflicto!`);
      setEnCoflictoColor("success");
      setEnCoflictoIcon("fa-thumbs-up");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const [data, data2, data3, data4] = await Promise.all([
            getIndicadores(token),
            getEnConflicto(token),
            getDepartamentos(token),
            getReservas(token),
          ]);
          setIndicadores(data);
          enConflicto(data2.length);
          setDepartamentos(data3);
          const formattedEvents = data4.map((r) => ({
            id: r.id,
            resourceId: r.departamento,
            start: r.checkin,
            end: r.checkout,
            title: r.nombre_apellido,
          }));
          setEvents(formattedEvents);
        } catch (error) {
          // Manejar el error aquí (mostrar una alerta, etc.)
          console.error(error);
          swal(
            "Error",
            "Hubo un problema al obtener los datos.",
            "error"
          );
        }
      }
    };

    fetchData();
  }, [token]);

  //Calendar
  const headerToolbar = {
    left: "today prev,next",
    center: "title",
    right: "resourceTimelineFifteenDays,dayGridMonth",
  };

  const views = {
    resourceTimelineFifteenDays: {
      type: "resourceTimeline",
      duration: { days: 8 },
      buttonText: "Semana",
    },
  };

  const handleEventClick = (eventInfo) => {
    const reservaId = eventInfo.event.id;
    navigate(`${PROTECTED}/calendario/${reservaId}`);
  };

  const handleSelect = (arg) => {
    const { start, end, resource } = arg;
    const { id: departamento } = resource;
    const checkin = start.toISOString();
    const checkout = end.toISOString();

    navigate(`${PROTECTED}/calendario/nueva`, {
      state: { checkin, checkout, departamento },
    });
  };

  return (
    <div>
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <Link to="/app">Admin</Link>
        </li>
        <li className="breadcrumb-item active">Dashboard</li>
      </ol>
      <h1 className="page-header">
        Admin <small>inicio</small>
      </h1>
      <div className="row">
        <div className="col-xl-6">
          <div className="card border-0 mb-3 overflow-hidden bg-gray-800 text-white">
            <div className="card-body">
              <div className="row">
                <div className="col-xl-7 col-lg-8">
                  <div className="mb-3 text-gray-500">
                    <b>RESERVAS DE ESTE MES</b>
                    <span className="ms-2">
                      <i
                        className="fa fa-info-circle"
                        id="popover1"
                      ></i>
                      <UncontrolledPopover
                        trigger="hover"
                        placement="top"
                        target="popover1"
                      >
                        <PopoverHeader>
                          Ingresos del mes
                        </PopoverHeader>
                        <PopoverBody>
                          Ingresos totales hasta el momento por las
                          reservas de este mes.
                        </PopoverBody>
                      </UncontrolledPopover>
                    </span>
                  </div>
                  <div className="d-flex mb-1">
                    <h2 className="mb-0">
                      {indicadores &&
                      indicadores.ingresos !== undefined ? (
                        indicadores.ingresos.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })
                      ) : (
                        <Spinner
                          animation="grow"
                          variant="secondary"
                        />
                      )}
                    </h2>
                  </div>
                  <div className="mb-3 text-gray-500">
                    <i className="fa fa-caret-up"></i> Reservas del
                    mes de
                  </div>
                  <hr className="bg-white-transparent-2" />
                  <div className="row text-truncate">
                    <div className="col-6">
                      <div className="fs-12px text-gray-500">
                        Saldo pendiente
                      </div>
                      <div className="fs-18px mb-5px fw-bold">
                        {indicadores &&
                        indicadores.saldo !== undefined ? (
                          indicadores.saldo.toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })
                        ) : (
                          <Spinner
                            animation="grow"
                            variant="secondary"
                            size="sm"
                          />
                        )}
                      </div>
                      <div className="progress h-5px rounded-3 bg-gray-900 mb-5px">
                        <div
                          className="progress-bar progress-bar-striped rounded-right bg-teal"
                          data-animation="width"
                          style={{
                            width:
                              indicadores &&
                              indicadores.ingresos !== undefined
                                ? `${(
                                    (indicadores.saldo /
                                      indicadores.ingresos) *
                                    100
                                  ).toFixed(0)}%`
                                : "0%",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="fs-12px text-gray-500">
                        Efectivo en caja
                      </div>
                      <div className="fs-18px mb-5px fw-bold">
                        {indicadores &&
                        indicadores.efectivo !== undefined ? (
                          indicadores.efectivo.toLocaleString(
                            "es-AR",
                            {
                              style: "currency",
                              currency: "ARS",
                            }
                          )
                        ) : (
                          <Spinner
                            animation="grow"
                            variant="secondary"
                            size="sm"
                          />
                        )}
                      </div>
                      <div className="progress h-5px rounded-3 bg-gray-900 mb-5px">
                        <div
                          className="progress-bar progress-bar-striped rounded-right"
                          data-animation="width"
                          style={{
                            width:
                              indicadores &&
                              indicadores.ingresos !== undefined
                                ? `${(
                                    (indicadores.efectivo /
                                      indicadores.ingresos) *
                                    100
                                  ).toFixed(0)}%`
                                : "0%",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-5 col-lg-4 align-items-center d-flex justify-content-center">
                  <img
                    src="assets/img/logo/logo_larosalina.png"
                    height="100px"
                    className="d-none d-lg-block"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div
            className="widget widget-stats bg-blue"
            style={{ height: "205px" }}
          >
            <div className="stats-icon stats-icon-lg">
              <i className="fa fa-dollar-sign fa-fw"></i>
            </div>
            <div className="stats-content">
              <div className="stats-title">
                PORCENTAJE DE OCUPACIÓN
              </div>
              <div className="stats-number">
                {indicadores &&
                indicadores.ocupacion !== undefined ? (
                  indicadores.ocupacion.toLocaleString("es-AR", {
                    style: "percent",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                ) : (
                  <Spinner animation="grow" variant="info" />
                )}
                &nbsp;de las noches ocupadas
              </div>
              <div className="stats-progress progress">
                <div
                  className="progress-bar"
                  style={{ width: "100%" }}
                ></div>
              </div>
              Precio promedio por noche:&nbsp;
              {indicadores && indicadores.ppn !== undefined ? (
                indicadores.ppn.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })
              ) : (
                <Spinner animation="grow" variant="info" size="sm" />
              )}
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div
            className={`widget widget-stats bg-${enCoflictoColor}`}
            style={{ height: "205px" }}
          >
            <div className="stats-icon stats-icon-lg">
              <i className={`fa ${enCoflictoIcon} fa-fw`}></i>
            </div>
            <div className="stats-content">
              <div className="stats-title">RESERVAS EN CONFLICTO</div>
              <div className="stats-number">
                {enCoflictoMessage &&
                enCoflictoMessage !== undefined ? (
                  enCoflictoMessage
                ) : (
                  <Spinner animation="grow" variant="secondary" />
                )}
              </div>
              <div className="stats-progress progress">
                <div
                  className="progress-bar"
                  style={{ width: "100%" }}
                ></div>
              </div>
              <div className="stats-link">
                <Link
                  to="reservas/
                enconflicto"
                >
                  Ver reservas en conflicto{" "}
                  <i className="fa fa-arrow-alt-circle-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Panel>
        <PanelHeader>Calendario de Reservas</PanelHeader>
        <PanelBody>
          {departamentos && departamentos.length > 0 ? (
            <FullCalendar
              plugins={[
                resourceTimelinePlugin,
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                bootstrapPlugin,
              ]}
              schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
              locale={esLocale}
              selectable={true}
              select={handleSelect}
              editable={false}
              aspectRatio="5"
              scrollTime="00:00"
              slotDuration="03:00"
              slotMinTime="11:00"
              slotMaxTime="15:00"
              initialView="resourceTimelineFifteenDays"
              initialDate={initialDate}
              resourceAreaHeaderContent="Departamentos"
              headerToolbar={headerToolbar}
              events={events}
              views={views}
              resources={departamentos.map((d) => ({
                id: d.id,
                title: `${d.descripcion} - Planta: ${d.planta} (${d.vista})`,
                eventColor: "#55A38B",
              }))}
              eventClick={handleEventClick} // Agrega el manejador de eventos al hacer clic en un evento
            />
          ) : (
            <Spinner animation="grow" variant="secondary" />
          )}
        </PanelBody>
      </Panel>
    </div>
  );
}

export default Home;
