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
import { getDepartamentos } from "../../services/recursosServices.js";
import { getEstados } from "../../services/estadosServices.js";
import {
  getHuespedesByReserva,
  deleteHuesped,
} from "../../services/huespedesServices.js";
import { getComprobantesByReserva } from "../../services/comprobantesServices.js";
import { deleteMovimiento } from "../../services/movimientosServices.js";
import { getPagos } from "../../services/pagosServices.js";
import { getReserva, updateReserva } from "../../services/reservasServices.js";

//Contexts
import { useAuthContext } from "../../contexts/AuthContext.jsx";

function ReservasDetalle() {
  const { token } = useAuthContext();
  const { idReserva } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [estadosOptions, setEstadosOptions] = useState([]);
  const [comprobantes, setComprobantes] = useState([]);
  const [departamentosOptions, setDepartamentosOptions] = useState([]);
  const [reserva, setReserva] = useState();
  const [huespedes, setHuespedes] = useState();
  const [pagos, setPagos] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const [data, data2, data3, data4, data5, data6] = await Promise.all([
            getComprobantesByReserva(idReserva, token),
            getDepartamentos(token),
            getEstados(token),
            getReserva(idReserva, token),
            getHuespedesByReserva(idReserva, token),
            getPagos(idReserva, token),
          ]);
          setComprobantes(data);
          setDepartamentosOptions(data2);
          setEstadosOptions(data3);
          setReserva(data4);
          setHuespedes(data5);
          setPagos(data6);
          setIsLoading(false);
        } catch (error) {
          // Manejar el error aquí (mostrar una alerta, etc.)
          console.error(error);
          swal("Error", "Hubo un problema al obtener los datos.", "error");
        }
      }
    };

    fetchData();
  }, [token, idReserva]);

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
      updateReserva(token, reserva)
        .then(() => {
          swal(
            "Confirmación!",
            "Los datos se actualizaron correctamente!",
            "success",
            {
              buttons: {
                back: {
                  text: "Volver",
                  value: true,
                },
                okay: {
                  text: "Ok",
                  value: false,
                },
              },
            }
          ).then((volver) => {
            if (volver) {
              handleBack();
            }
          });
        })
        .catch((error) => {
          swal("Error", "Hubo un problema al actualizar los datos.", "error");
        });
    }
  };

  const navigate = useNavigate();

  const currentPath = window.location.pathname;

  const handleBack = () => {
    if (currentPath.includes("calendario")) {
      navigate(`${PROTECTED}/calendario`);
    } else {
      if (currentPath.includes("enconflicto/")) {
        navigate(`${PROTECTED}/reservas/enconflicto`);
      } else {
        navigate(`${PROTECTED}/reservas`);
      }
    }
  };

  //Huespedes
  const huespedesColumns = [
    {
      name: "Nombre",
      sortable: true,
      selector: (row) => row.nombre_apellido,
    },
    {
      name: "DNI",
      sortable: true,
      selector: (row) => row.dni,
    },
    {
      name: "Domicilio",
      sortable: true,
      selector: (row) => row.domicilio,
    },
    {
      name: "Patente",
      sortable: true,
      selector: (row) => row.patente,
    },
    {
      name: "Eliminar",
      cell: (row) => (
        <>
          <Button
            variant="danger"
            onClick={() => huespedesHandleButtonDelete(row)}
          >
            <i className="fa fa-trash-alt fa-lg"></i>
          </Button>
        </>
      ),
      button: true, // Importante: Configurar la columna como botón
    },
  ];

  const huespedesHandleRowClick = (row) => {
    navigate(`${PROTECTED}/reservas/${reserva.id}/huespedes/${row.id}`);
  };

  const huespedesHandleButtonDelete = (row) => {
    swal({
      title: `Queres eliminar a ${row.nombre_apellido}?`,
      text: "No vas a poder recuperar su información!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteHuesped(token, row)
          .then(() => {
            // Eliminar "row" de "formatedList"
            const updatedList = huespedes.filter((item) => item !== row);
            setHuespedes(updatedList);

            swal(`${row.nombre_apellido} se eliminó correctamente!`, {
              icon: "success",
            });
          })
          .catch((error) => {
            console.error(error);
            swal("Error", "Hubo un problema al eliminar los datos.", "error");
          });
      } else {
        swal(
          `Tranqui, la información de ${row.nombre_apellido} no se eliminó!`
        );
      }
    });
  };

  //Pagos
  const pagosColumns = [
    {
      name: "Movimiento",
      sortable: true,
      selector: (row) =>
        row.movimiento1.toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        }),
    },
    {
      name: "Fecha",
      sortable: true,
      selector: (row) => new Date(row.fecha).toLocaleDateString(),
    },
    {
      name: "Forma de Pago",
      sortable: true,
      selector: (row) => row.cuentaDto.descripcion,
    },
    {
      name: "Eliminar",
      cell: (row) => (
        <>
          <Button variant="danger" onClick={() => pagosHandleButtonDelete(row)}>
            <i className="fa fa-trash-alt fa-lg"></i>
          </Button>
        </>
      ),
      button: true, // Importante: Configurar la columna como botón
    },
  ];

  const pagosHandleRowClick = (row) => {
    navigate(`${PROTECTED}/reservas/${reserva.id}/pagos/${row.id}`);
  };

  const pagosHandleButtonDelete = (row) => {
    swal({
      title: `Queres eliminar el movimiento: ${row.descripcion}?`,
      text: "No vas a poder recuperar su información!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteMovimiento(token, row)
          .then(() => {
            // Eliminar "row" de "formatedList"
            const updatedList = pagos.filter((item) => item !== row);
            setPagos(updatedList);

            swal(
              `El movimiento: ${row.descripcion} se eliminó correctamente!`,
              {
                icon: "success",
              }
            );
          })
          .catch((error) => {
            console.error(error);
            swal("Error", "Hubo un problema al eliminar los datos.", "error");
          });
      } else {
        swal(
          `Tranqui, la información del movimiento: ${row.descripcion} no se eliminó!`
        );
      }
    });
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
        <li className="breadcrumb-item active">Detalles de la Reservas</li>
      </ol>
      <h1 className="page-header">
        Reserva <small>detalles de la reserva</small>
      </h1>
      <Panel>
        <PanelHeader>Detalles de la Reserva</PanelHeader>
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
                  <CustomSelect
                    options={departamentosOptions}
                    defaultOption={reserva.departamento}
                    onOptionChange={(value) => {
                      setReserva({
                        ...reserva,
                        departamento: parseInt(value, 10),
                      });
                    }}
                    unselected={false}
                  />
                </Form.Group>
              </Row>
              <Row>&nbsp;</Row>
              <Row>
                <Form.Group as={Col} md="6">
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
                <Form.Group as={Col} md="6">
                  <Form.Label>Estado:</Form.Label>
                  <CustomSelect
                    options={estadosOptions}
                    defaultOption={reserva.estado}
                    onOptionChange={(value) => {
                      setReserva({ ...reserva, estado: parseInt(value, 10) });
                    }}
                    unselected={false}
                  />
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
              <DataTable
                columns={huespedesColumns}
                data={huespedes}
                header={true}
                pagination={false}
                subHeader={false}
                title="Huespedes"
                handleRowClick={huespedesHandleRowClick}
              />
              <Row>&nbsp;</Row>
              <Button
                type="button"
                variant="warning"
                onClick={() => {
                  const currentPath = window.location.pathname;
                  navigate(`${currentPath}/huesped/${reserva.id}`);
                }}
              >
                Agregar Huesped
              </Button>
              <hr />
              <Row>&nbsp;</Row>
              <DataTable
                columns={pagosColumns}
                data={pagos}
                header={true}
                pagination={false}
                subHeader={false}
                title="Pagos"
                handleRowClick={pagosHandleRowClick}
              />
              <Row>&nbsp;</Row>
              <Alert variant="info">
                Saldo:{" "}
                <b>
                  {reserva.saldo.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </b>
              </Alert>
              <Button
                type="button"
                variant="warning"
                onClick={() => {
                  const currentPath = window.location.pathname;
                  navigate(`${currentPath}/pago/${reserva.id}`);
                }}
              >
                Nuevo Pago
              </Button>
              <Row>&nbsp;</Row>
              <Row>
                <h5>
                  <i className="fa fa-file fa-2x pull-left fa-fw"></i>
                  {comprobantes.length > 0 ? (
                    <>
                      Comprobantes asociados ({comprobantes.length}): &nbsp;
                      <b>
                        <Link
                          to={`${PROTECTED}/reservas/comprobantes/${reserva.id}`}
                        >
                          Ver archivos
                        </Link>
                      </b>
                    </>
                  ) : (
                    <>No existen comprobantes asociados</>
                  )}
                </h5>
              </Row>
              <hr />
              <Row>&nbsp;</Row>
              <Button type="submit" variant="success" size="lg">
                Guardar Cambios
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
            <Spinner animation="grow" variant="secondary" />
          )}
        </PanelBody>
      </Panel>
    </div>
  );
}

export default ReservasDetalle;
