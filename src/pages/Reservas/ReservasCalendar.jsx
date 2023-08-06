import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import swal from "sweetalert";
import { PROTECTED } from "../../config/app-route.jsx";

//Servicios
import { getDepartamentos } from "../../services/recursosServices.js";
import { getReservas } from "../../services/reservasServices.js";

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
} from "../../components/panel/panel.jsx";

//Contexts
import { useAuthContext } from "../../contexts/AuthContext.jsx";

function ReservasCalendar() {
  const { token } = useAuthContext();
  const navigate = useNavigate();

  //Calendar
  const [departamentos, setDepartamentos] = useState();
  const [events, setEvents] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const [data, data2] = await Promise.all([
            getDepartamentos(token),
            getReservas(token),
          ]);
          setDepartamentos(data);
          const formattedEvents = data2.map((r) => ({
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
          swal("Error", "Hubo un problema al obtener los datos.", "error");
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
        <li className="breadcrumb-item active">Calendario de Reservas</li>
      </ol>
      <h1 className="page-header">
        Reservas <small>calendario</small>
      </h1>
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

export default ReservasCalendar;
