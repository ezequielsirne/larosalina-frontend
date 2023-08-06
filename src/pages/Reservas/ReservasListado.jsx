import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../components/panel/panel.jsx";
import swal from "sweetalert";
import { PROTECTED } from "../../config/app-route.jsx";
import PdfComponent from "../../components/pdf/comprobante.jsx";
import { PDFDownloadLink } from "@react-pdf/renderer";

//Bootstrap
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

//Datatables
import DataTable from "../../components/dataTable/DataTable.jsx";

//Servicios
import { getReservas, deleteReserva } from "../../services/reservasServices.js";

//Contexts
import { useAuthContext } from "../../contexts/AuthContext.jsx";

function ReservasListado() {
  const { token } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  const [formatedList, setFormatedList] = useState([]);
  const [FilteredList, setFilteredList] = useState([]);
  const [minDateRange, setMinDateRange] = useState();
  const [maxDateRange, setMaxDateRange] = useState();

  useEffect(() => {
    const fetchData = () => {
      getReservas(token)
        .then((data) => {
          let fechaCheckinMinima = null;
          let fechaCheckoutMaxima = null;

          for (const item of data) {
            if (
              item.estadoDescripcion === "Pendiente" ||
              item.estadoDescripcion === "En conflicto"
            ) {
              const fechaCheckin = new Date(item.checkin);
              const fechaCheckout = new Date(item.checkout);

              if (!fechaCheckinMinima || fechaCheckin < fechaCheckinMinima) {
                fechaCheckinMinima = fechaCheckin;
              }

              if (!fechaCheckoutMaxima || fechaCheckout > fechaCheckoutMaxima) {
                fechaCheckoutMaxima = fechaCheckout;
              }
            }
          }

          setMinDateRange(new Date(fechaCheckinMinima));
          setMaxDateRange(new Date(fechaCheckoutMaxima));
          setFormatedList(data);
          setIsLoading(false);
        })
        .catch((error) => {
          // Manejar el error aquí (mostrar una alerta, etc.)
          console.error(error);
          swal("Error", "Hubo un problema al obtener los datos.", "error");
        });
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (minDateRange && maxDateRange) {
      const filteredData = formatedList.filter((item) => {
        if (item && typeof item === "object") {
          const checkin = new Date(item.checkin);
          const checkout = new Date(item.checkout);
          return (
            (checkin >= minDateRange && checkin <= maxDateRange) ||
            (checkout >= minDateRange && checkout <= maxDateRange)
          );
        }
        return false;
      });

      setFilteredList(filteredData);
    }
  }, [formatedList, minDateRange, maxDateRange]);

  const columns = [
    {
      name: "Check In",
      sortable: true,
      selector: (row) => new Date(row.checkin).toLocaleDateString(),
    },
    {
      name: "Check Out",
      sortable: true,
      selector: (row) =>
        `${new Date(row.checkout).toLocaleDateString()} ${new Date(
          row.checkout
        ).getHours()}:00`,
    },
    {
      name: "Nombre",
      sortable: true,
      selector: (row) => row.nombre_apellido,
    },
    {
      name: "Dpto",
      sortable: true,
      selector: (row) => row.departamento,
    },
    {
      name: "Huespedes",
      sortable: true,
      selector: (row) => row.adultos + row.menores,
    },
    {
      name: "Total",
      sortable: true,
      selector: (row) =>
        row.total.toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        }),
    },
    {
      name: "Saldo",
      sortable: true,
      selector: (row) =>
        (row.saldo ? row.saldo : 0).toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        }),
    },
    {
      name: "Estado",
      sortable: true,
      selector: (row) => row.estadoDescripcion,
      cell: (row) => {
        let variant;
        switch (row.estadoDescripcion) {
          case "Completada":
            variant = "primary";
            break;
          case "Pendiente":
            variant = "warning";
            break;
          case "Cancelada":
            variant = "dark";
            break;
          case "En conflicto":
            variant = "danger";
            break;
          default:
            variant = "primary";
            break;
        }
        return (
          <Badge pill bg={variant} style={{ fontSize: "12px" }}>
            {row.estadoDescripcion}
          </Badge>
        );
      },
    },
    {
      name: "Acciones",
      cell: (row) => (
        <>
          <Button variant="success">
            <i className="fa fa-cloud-download-alt fa-lg"></i>
          </Button>
          &nbsp;
          <Button variant="danger" onClick={() => handleButtonDelete(row)}>
            <i className="fa fa-trash-alt fa-lg"></i>
          </Button>
        </>
      ),
      button: true, // Importante: Configurar la columna como botón
    },
  ];

  //Acciones
  const navigate = useNavigate();

  const handleRowClick = (row) => {
    navigate(`${PROTECTED}/reservas/${row.id}`);
  };

  const handleButtonDownload = () => {
    swal("Holi");
  };

  const handleButtonDelete = (row) => {
    swal({
      title: `Queres eliminar la reserva de: ${row.nombre_apellido}?`,
      text: "No vas a poder recuperar su información!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteReserva(token, row)
          .then(() => {
            // Eliminar "row" de "formatedList"
            const updatedList = formatedList.filter((item) => item !== row);
            setFormatedList(updatedList);

            swal(
              `la reserva de: ${row.nombre_apellido} se eliminó correctamente!`,
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
          `Tranqui, la información de la reserva de: ${row.nombre_apellido} no se eliminó!`
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
        <li className="breadcrumb-item active">Listado de Reservas</li>
      </ol>
      <h1 className="page-header">
        Reservas <small>listado</small>
      </h1>
      <Panel>
        <PanelHeader>Listado de Reservas</PanelHeader>
        <PanelBody>
          {!isLoading ? (
            <>
              {minDateRange instanceof Date && maxDateRange instanceof Date && (
                <>
                  <Row>
                    <Form.Group as={Col} md="5">
                      <div className="form-floating m-15px">
                        <input
                          type="date"
                          className="form-control h-45px fs-13px"
                          value={minDateRange.toISOString().split("T")[0]}
                          onChange={(e) =>
                            setMinDateRange(new Date(e.target.value))
                          }
                        />
                        <label
                          htmlFor="buscar"
                          className="d-flex align-items-center fs-13px text-gray-600"
                        >
                          Desde
                        </label>
                      </div>
                    </Form.Group>
                    <Form.Group as={Col} md="5">
                      <div className="form-floating m-15px">
                        <input
                          type="date"
                          className="form-control h-45px fs-13px"
                          value={maxDateRange.toISOString().split("T")[0]}
                          onChange={(e) =>
                            setMaxDateRange(new Date(e.target.value))
                          }
                        />
                        <label
                          htmlFor="buscar"
                          className="d-flex align-items-center fs-13px text-gray-600"
                        >
                          Desde
                        </label>
                      </div>
                    </Form.Group>
                    <Form.Group as={Col} md="2">
                      <div className="form-floating m-15px">
                        <Button
                          variant="outline-warning"
                          style={{ width: "100%" }}
                          size="lg"
                          onClick={() => {
                            navigate(`${PROTECTED}/reservas/nueva`);
                          }}
                        >
                          <i className="fa fa-plus"></i>
                          &nbsp;Reserva
                        </Button>
                      </div>
                    </Form.Group>
                  </Row>
                  <hr />
                </>
              )}
              <DataTable
                columns={columns}
                data={FilteredList}
                header={false}
                subHeader={true}
                pagination={true}
                handleRowClick={handleRowClick}
              />
            </>
          ) : (
            <Spinner animation="grow" variant="secondary" />
          )}
        </PanelBody>
      </Panel>
    </div>
  );
}

export default ReservasListado;
