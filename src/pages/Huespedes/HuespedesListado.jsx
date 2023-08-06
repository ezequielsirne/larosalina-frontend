import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../components/panel/panel.jsx";
import swal from "sweetalert";
import { PROTECTED } from "../../config/app-route.jsx";

//Bootstrap
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

//Datatables
import DataTable from "../../components/dataTable/DataTable.jsx";

//Servicios
import {
  deleteHuesped,
  getHuespedes,
} from "../../services/huespedesServices.js";

//Contexts
import { useAuthContext } from "../../contexts/AuthContext.jsx";

function HuespedesListado() {
  const { token } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  const [formatedList, setFormatedList] = useState([]);
  const [FilteredList, setFilteredList] = useState([]);
  const [minDateRange, setMinDateRange] = useState();
  const [maxDateRange, setMaxDateRange] = useState();

  useEffect(() => {
    const fetchData = () => {
      getHuespedes(token)
        .then((data) => {
          let fechaCheckinMinima = null;
          let fechaCheckoutMaxima = null;
          for (const item of data) {
            if (item.reserva?.estado === 1) {
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
      selector: (row) => row.reserva?.departamento,
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
    navigate(`${PROTECTED}/huespedes/${row.id}`);
  };

  const handleButtonDelete = (row) => {
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
            const updatedList = formatedList.filter((item) => item !== row);
            setFormatedList(updatedList);

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

  return (
    <div>
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <Link to="/app">Admin</Link>
        </li>
        <li className="breadcrumb-item active">Listado de Huespedes</li>
      </ol>
      <h1 className="page-header">
        Huespedes <small>listado</small>
      </h1>
      <Panel>
        <PanelHeader>Listado de Huespedes</PanelHeader>
        <PanelBody>
          {!isLoading ? (
            <>
              {minDateRange instanceof Date && maxDateRange instanceof Date && (
                <>
                  <Row>
                    <Form.Group as={Col} md="6">
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
                    <Form.Group as={Col} md="6">
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
                  </Row>
                  <hr />
                </>
              )}
              <DataTable
                columns={columns}
                data={FilteredList}
                header={false}
                pagination={true}
                subHeader={true}
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

export default HuespedesListado;
