import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../components/panel/panel.jsx";
import CustomSelect from "../../components/forms/Select.jsx";
import { PROTECTED } from "../../config/app-route.jsx";

//Bootstrap
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import swal from "sweetalert";

//Datatables
import DataTable from "../../components/dataTable/DataTable.jsx";

//Servicios
import { getHuesped, addHuesped } from "../../services/huespedesServices.js";

//Contexts
import { useAuthContext } from "../../contexts/AuthContext.jsx";

function HuespedesDetalle() {
  const { token } = useAuthContext();
  const { idReserva } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [huesped, setHuesped] = useState({
    nombre_apellido: "",
    dni: null,
    domicilio: "",
    patente: "",
    id_reserva: idReserva,
  });

  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setValidated(true);
      addHuesped(token, huesped)
        .then(() => {
          swal(
            "Confirmación!",
            "Los datos se guardaron correctamente!",
            "success"
          ).then(() => {
            handleBack();
          });
        })
        .catch((error) => {
          swal("Error", "Hubo un problema al guardaron los datos.", "error");
        });
    }
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`${PROTECTED}/reservas/${idReserva}`);
  };

  return (
    <div>
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <Link to="/app">Admin</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to={PROTECTED + "/huespedes"}>Huespedes</Link>
        </li>
        <li className="breadcrumb-item active">Nuevo</li>
      </ol>
      <h1 className="page-header">
        Huesped <small>nuevo</small>
      </h1>
      <Panel>
        <PanelHeader>Datos del Huesped</PanelHeader>
        <PanelBody>
          {!isLoading ? (
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Form.Group as={Col} md="3">
                  <Form.Label>Nombre y Apellido:</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    value={huesped.nombre_apellido}
                    onChange={(e) =>
                      setHuesped({
                        ...huesped,
                        nombre_apellido: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label>DNI:</Form.Label>
                  <Form.Control
                    type="text"
                    value={huesped.dni}
                    onChange={(e) =>
                      setHuesped({ ...huesped, dni: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label>Domicilio:</Form.Label>
                  <Form.Control
                    type="text"
                    value={huesped.domicilio}
                    onChange={(e) =>
                      setHuesped({ ...huesped, domicilio: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label>Patente:</Form.Label>
                  <Form.Control
                    type="text"
                    value={huesped.patente}
                    onChange={(e) =>
                      setHuesped({ ...huesped, patente: e.target.value })
                    }
                  />
                </Form.Group>
              </Row>
              <Row>&nbsp;</Row>
              <Button type="submit" variant="success" size="lg">
                Guardar
              </Button>
              &nbsp;
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleBack}
              >
                Volver
              </Button>
            </Form>
          ) : (
            <Spinner animation="grow" variant="secondary" />
          )}
        </PanelBody>
      </Panel>
    </div>
  );
}

export default HuespedesDetalle;
