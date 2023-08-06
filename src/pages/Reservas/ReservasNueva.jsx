import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../components/panel/panel.jsx";
import HuespedForm from "../../components/forms/HuespedForm.jsx";
import { PROTECTED } from "../../config/app-route.jsx";

//Bootstrap
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import swal from "sweetalert";
import { useDropzone } from "react-dropzone";

//Servicios
import { getCuentas } from "../../services/cuentasServices.js";
import { getDepartamentos } from "../../services/recursosServices.js";
import { addReserva } from "../../services/reservasServices.js";
import { addComprobantes } from "../../services/comprobantesServices.js";

//Contexts
import { useAuthContext } from "../../contexts/AuthContext.jsx";

function ReservasDetalle() {
  const { token } = useAuthContext();

  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Cargando formulario");
  const [cuentas, setCuentas] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [reserva, setReserva] = useState({
    checkin: new Date(),
    checkout: new Date(new Date().setHours(11, 0, 0, 0)),
    departamento: 0,
    late_checkout: 0,
    noches: 0,
    nombre_apellido: "",
    telefono: "",
    mail: "",
    localidad: "",
    adultos: 1,
    menores: 0,
    mascotas: 0,
    observaciones: "",
    total: 0,
    huespedes: [
      { nombre_apellido: "", dni: null, domicilio: "", patente: "" },
      { nombre_apellido: "", dni: null, domicilio: "", patente: "" },
      { nombre_apellido: "", dni: null, domicilio: "", patente: "" },
      { nombre_apellido: "", dni: null, domicilio: "", patente: "" },
      { nombre_apellido: "", dni: null, domicilio: "", patente: "" },
    ],
    movimientos: [{ fecha: new Date(), movimiento1: 0, cuenta: 1 }],
  });

  // DropZone
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
  });

  const removeFile = (index) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const fileItems = files.map((file, index) => (
    <li key={index} className="file-item" style={{ listStyleType: "none" }}>
      <div className="file-info">
        <div
          className="file-content"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="file-icon">
            <i className="fa fa-file fa-4x"></i>
          </div>
          <button
            className="btn btn-danger btn-sm m-2"
            onClick={() => removeFile(index)}
          >
            Eliminar
          </button>
        </div>
        <div>
          <span className="file-name">{file.path}</span>
        </div>
        <div>
          <span className="file-size">{file.size} bytes</span>
        </div>
      </div>
    </li>
  ));

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const [data, data2] = await Promise.all([
            getCuentas(token),
            getDepartamentos(token),
          ]);
          setCuentas(data);
          setDepartamentos(data2);
          setIsLoading(false);
        } catch (error) {
          // Manejar el error aquí (mostrar una alerta, etc.)
          console.error(error);
          swal("Error", "Hubo un problema al obtener los datos.", "error");
        }
      }
    };

    fetchData();
  }, [token]);

  const handleCheckinChange = (e) => {
    const checkinDate = new Date(e.target.value);
    const noches = calcularNoches(checkinDate, reserva.checkout);
    setReserva({ ...reserva, checkin: checkinDate, noches: noches });
  };

  const handleCheckoutChange = (e) => {
    const selectedDate = e.target.value;
    const checkoutDate = new Date(reserva.checkout);
    const [year, month, day] = selectedDate.split("-");
    checkoutDate.setFullYear(year, month - 1, day);
    const noches = calcularNoches(reserva.checkin, checkoutDate);
    setReserva({ ...reserva, checkout: checkoutDate, noches: noches });
  };

  const calcularNoches = (checkin, checkout) => {
    if (checkin && checkout) {
      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);
      const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
      const nocheInMillis = 1000 * 60 * 60 * 24;
      let noches = Math.ceil(timeDiff / nocheInMillis);
      noches = noches >= 0 ? noches : 0;
      return noches;
    }
    return 0;
  };

  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);

    if (form.checkValidity() === true) {
      event.preventDefault();
      setIsLoading(true);
      setLoadingMessage(" Guardando datos");
      addReserva(token, reserva)
        .then((data) => {
          setLoadingMessage(" Cargando comprobantes");
          if (files.length > 0) {
            addComprobantes(token, files, data.idMovimiento)
              .then(() => {
                setLoadingMessage("");
                setIsLoading(false);
                swal(
                  "Confirmación!",
                  "Los datos se guardaron correctamente!",
                  "success"
                ).then(() => handleBack());
              })
              .catch((error) => {
                swal(
                  "Error",
                  "Hubo un problema al guardar los datos.",
                  "error"
                );
              });
          } else {
            setLoadingMessage("");
            setIsLoading(false);
            swal(
              "Confirmación!",
              "Los datos se guardaron correctamente!",
              "success"
            ).then(() => handleBack());
          }
        })
        .catch((error) => {
          swal("Error", "Hubo un problema al guardar los datos.", "error");
        });
    }
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(PROTECTED + "/reservas");
  };

  return (
    <div>
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <Link to="/app">Admin</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/reservas">Reservas</Link>
        </li>
        <li className="breadcrumb-item active">Nueva</li>
      </ol>
      <h1 className="page-header">
        Reserva <small>nueva</small>
      </h1>
      <Panel>
        <PanelHeader>Datos de la Reserva</PanelHeader>
        <PanelBody>
          {!isLoading ? (
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Form.Group as={Col} md="2">
                  <Form.Label>Check In:</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    value={
                      reserva
                        ? new Date(reserva.checkin).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={handleCheckinChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="2">
                  <Form.Label>Check Out:</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    value={
                      reserva
                        ? new Date(reserva.checkout).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={handleCheckoutChange}
                  />
                </Form.Group>
                <Form.Group as={Col} md="2">
                  <Form.Label>Noches:</Form.Label>
                  <Form.Control
                    type="text"
                    value={reserva.noches}
                    onChange={(e) =>
                      setReserva({ ...reserva, noches: e.target.value })
                    }
                    readOnly
                  />
                </Form.Group>
                <Form.Group as={Col} md="2">
                  <Form.Label>Horario de Check Out:</Form.Label>
                  <Form.Control
                    required
                    type="time"
                    value={
                      reserva
                        ? `${String(
                            new Date(reserva.checkout).getHours()
                          ).padStart(2, "0")}:${String(
                            new Date(reserva.checkout).getMinutes()
                          ).padStart(2, "0")}`
                        : ""
                    }
                    onChange={(e) => {
                      const selectedTime = e.target.value;
                      const [hours, minutes] = selectedTime.split(":");
                      const updatedDate = new Date(reserva.checkout);
                      updatedDate.setHours(
                        hours.padStart(2, "0"),
                        minutes.padStart(2, "0")
                      );
                      console.log(updatedDate);
                      setReserva({ ...reserva, checkout: updatedDate });
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Departamento:</Form.Label>
                  <Form.Select
                    required
                    value={reserva.departamento}
                    onChange={(e) => {
                      setReserva({
                        ...reserva,
                        departamento: parseInt(e.target.value, 10),
                      });
                    }}
                  >
                    <option value="">Seleccioná una opción...</option>
                    {departamentos.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.descripcion}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row>&nbsp;</Row>
              <Row>
                <Form.Group as={Col} md="3">
                  <Form.Label>Nombre y Apellido:</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Nombre y Apellido"
                    value={reserva.nombre_apellido}
                    onChange={(e) =>
                      setReserva({
                        ...reserva,
                        nombre_apellido: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label>Teléfono:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Teléfono"
                    value={reserva.telefono}
                    onChange={(e) =>
                      setReserva({ ...reserva, telefono: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label>e-mail:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e-mail"
                    value={reserva.mail}
                    onChange={(e) =>
                      setReserva({ ...reserva, mail: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label>Localidad:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Localidad"
                    value={reserva.localidad}
                    onChange={(e) =>
                      setReserva({ ...reserva, localidad: e.target.value })
                    }
                  />
                </Form.Group>
              </Row>
              <Row>&nbsp;</Row>
              <Row>
                <Form.Group as={Col} md="4">
                  <Form.Label>Adultos:</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    step="1"
                    value={reserva.adultos}
                    onChange={(e) =>
                      setReserva({ ...reserva, adultos: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Menores:</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="1"
                    value={reserva.menores}
                    onChange={(e) =>
                      setReserva({ ...reserva, menores: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Mascotas:</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="1"
                    value={reserva.mascotas}
                    onChange={(e) =>
                      setReserva({ ...reserva, mascotas: e.target.value })
                    }
                  />
                </Form.Group>
              </Row>
              <Row>&nbsp;</Row>
              <Row>
                <Form.Group as={Col} md="12">
                  <Form.Label>Observaciones:</Form.Label>
                  <Form.Control as="textarea" rows={4} />
                </Form.Group>
              </Row>
              <Row>&nbsp;</Row>
              <hr />
              <Row>
                <h3>Huespedes</h3>
              </Row>
              <HuespedForm
                huesped={0}
                reserva={reserva}
                setReserva={setReserva}
                required={true}
                title={"Primer Huesped"}
              />
              <HuespedForm
                huesped={1}
                reserva={reserva}
                setReserva={setReserva}
                required={false}
                title={"Segundo Huesped"}
              />
              <HuespedForm
                huesped={2}
                reserva={reserva}
                setReserva={setReserva}
                required={false}
                title={"Tercer Huesped"}
              />
              <HuespedForm
                huesped={3}
                reserva={reserva}
                setReserva={setReserva}
                required={false}
                title={"Cuarto Huesped"}
              />
              <HuespedForm
                huesped={4}
                reserva={reserva}
                setReserva={setReserva}
                required={false}
                title={"Quinto Huesped"}
              />
              <Row>&nbsp;</Row>
              <hr />
              <Row>
                <h3>Importes y Reserva</h3>
              </Row>
              <Row>
                <Form.Group as={Col} md="3">
                  <Form.Label>Importe Total ($):</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    step="0.01"
                    value={reserva.total}
                    onChange={(e) =>
                      setReserva({ ...reserva, total: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label>Reserva ($):</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    step="0.01"
                    value={reserva.movimientos[0].movimiento1}
                    onChange={(e) =>
                      setReserva({
                        ...reserva,
                        movimientos: [
                          {
                            ...reserva.movimientos[0],
                            movimiento1: e.target.value,
                          },
                        ],
                      })
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label>Fecha:</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    value={
                      reserva
                        ? new Date(reserva.movimientos[0].fecha)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      setReserva({
                        ...reserva,
                        movimientos: [
                          {
                            ...reserva.movimientos[0],
                            fecha: new Date(e.target.value),
                          },
                        ],
                      });
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label>Forma de Pago:</Form.Label>
                  <Form.Select
                    required
                    value={reserva.movimientos[0].cuenta}
                    onChange={(e) => {
                      setReserva({
                        ...reserva,
                        movimientos: [
                          {
                            ...reserva.movimientos[0],
                            cuenta: e.target.value,
                          },
                        ],
                      });
                    }}
                  >
                    {cuentas.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.descripcion}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row>&nbsp;</Row>
              <div
                {...getRootProps({
                  className: "dropzone p-3",
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  },
                })}
              >
                <input {...getInputProps()} />
                <h5>Comprobantes</h5>
                <i className="ion ion-md-cloud-upload fa-4x"></i>
                <p>Arrastrá los archivos o hacé click acá</p>
              </div>
              {files.length > 0 ? (
                <div className="file-list">
                  <h5>Archivos seleccionados</h5>
                  <ul>{fileItems}</ul>
                </div>
              ) : (
                ""
              )}
              <Row>&nbsp;</Row>
              <hr />
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
                Volver a Listado de Reservas
              </Button>
            </Form>
          ) : (
            <Row className="align-items-center">
              <Spinner animation="grow" variant="secondary" />
              &nbsp;
              {loadingMessage}
            </Row>
          )}
        </PanelBody>
      </Panel>
    </div>
  );
}

export default ReservasDetalle;
