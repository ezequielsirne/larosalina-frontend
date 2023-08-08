import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../components/panel/panel.jsx";
import swal from "sweetalert";
import CustomSelect from "../../components/forms/Select.jsx";
import { PROTECTED } from "../../config/app-route.jsx";

//Bootstrap
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

//Datatables
import DataTable from "../../components/dataTable/DataTable.jsx";

//Servicios
import {
  deleteGasto,
  getCategoriasGastos,
  getGastos,
} from "../../services/gastosServices.js";
import { getCuentas } from "../../services/cuentasServices.js";

//Contexts
import { useAuthContext } from "../../contexts/AuthContext.jsx";

function GastosListado() {
  const { token } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  const [formatedList, setFormatedList] = useState([]);
  const [FilteredList, setFilteredList] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [categoria, setCategoria] = useState(0);
  const [cuenta, setCuenta] = useState(0);
  const [minDateRange, setMinDateRange] = useState();
  const [maxDateRange, setMaxDateRange] = useState();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const [data, data2, data3] = await Promise.all([
            getGastos(token),
            getCuentas(token),
            getCategoriasGastos(token),
          ]);
          const currentDate = new Date();
          setMinDateRange(
            new Date(
              currentDate.getFullYear() - 1,
              currentDate.getMonth(),
              1
            )
          );
          setMaxDateRange(
            new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() + 1,
              0
            )
          );
          setFormatedList(data);
          setCuentas([...data2, { id: 0, descripcion: "Todas" }]);
          setCategorias([...data3, { id: 0, descripcion: "Todas" }]);
          setIsLoading(false);
        } catch (error) {
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

  useEffect(() => {
    if (minDateRange && maxDateRange) {
      let filteredTotal = 0;
      const filteredData = formatedList.filter((item) => {
        if (item && typeof item === "object") {
          const fecha = new Date(item.fecha);
          if (cuenta !== 0 && item.cuenta !== cuenta) {
            return false;
          }

          if (categoria !== 0 && item.categoria !== categoria) {
            return false;
          }
          if (fecha >= minDateRange && fecha <= maxDateRange) {
            filteredTotal = filteredTotal + item.importe;
            return true;
          }
        }
        return false;
      });

      setTotal(filteredTotal);
      setFilteredList(filteredData);
    }
  }, [formatedList, categoria, cuenta, minDateRange, maxDateRange]);

  const columns = [
    {
      name: "Fecha",
      sortable: true,
      selector: (row) => new Date(row.fecha).toLocaleDateString(),
    },
    {
      name: "Descripción",
      sortable: true,
      selector: (row) => row.descripcion,
    },
    {
      name: "Categoría",
      sortable: true,
      selector: (row) => row.categoriaDto.descripcion,
    },
    {
      name: "Forma de Pago",
      sortable: true,
      selector: (row) => row.cuentaDto.descripcion,
    },
    {
      name: "Importe",
      sortable: true,
      selector: (row) =>
        row.importe.toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        }),
    },
    {
      name: "Responsable",
      sortable: true,
      selector: (row) => row.responsable.nombre_apellido,
    },
    {
      name: "Eliminar",
      cell: (row) => (
        <>
          <Button
            variant="danger"
            onClick={() => handleButtonDelete(row)}
          >
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
    navigate(`${PROTECTED}/gastos/${row.id}`);
  };

  const handleButtonDelete = (row) => {
    swal({
      title: `Queres eliminar el gasto: ${row.descripcion}?`,
      text: "No vas a poder recuperar su información!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteGasto(token, row)
          .then(() => {
            // Eliminar "row" de "formatedList"
            const updatedList = formatedList.filter(
              (item) => item !== row
            );
            setFormatedList(updatedList);

            swal(
              `El gasto: ${row.descripcion} se eliminó correctamente!`,
              {
                icon: "success",
              }
            );
          })
          .catch((error) => {
            console.error(error);
            swal(
              "Error",
              "Hubo un problema al eliminar los datos.",
              "error"
            );
          });
      } else {
        swal(
          `Tranqui, la información del gasto: ${row.descripcion} no se eliminó!`
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
        <li className="breadcrumb-item active">Listado de Gastos</li>
      </ol>
      <h1 className="page-header">
        Gastos <small>listado</small>
      </h1>
      <Panel>
        <PanelHeader>Listado de Gastos</PanelHeader>
        <PanelBody>
          {!isLoading ? (
            <>
              {minDateRange instanceof Date &&
                maxDateRange instanceof Date && (
                  <>
                    <Row>
                      <Form.Group as={Col} md="2">
                        <div className="form-floating m-15px">
                          <CustomSelect
                            options={categorias}
                            defaultOption={categoria}
                            onOptionChange={(value) => {
                              setCategoria(parseInt(value, 10));
                            }}
                            unselected={false}
                          />
                          <label
                            htmlFor="buscar"
                            className="d-flex align-items-center fs-13px text-gray-600"
                          >
                            Categorías
                          </label>
                        </div>
                      </Form.Group>
                      <Form.Group as={Col} md="2">
                        <div className="form-floating m-15px">
                          <CustomSelect
                            options={cuentas}
                            defaultOption={cuenta}
                            onOptionChange={(value) => {
                              setCuenta(parseInt(value, 10));
                            }}
                            unselected={false}
                          />
                          <label
                            htmlFor="buscar"
                            className="d-flex align-items-center fs-13px text-gray-600"
                          >
                            Cuentas
                          </label>
                        </div>
                      </Form.Group>
                      <Form.Group as={Col} md="2">
                        &nbsp;
                      </Form.Group>
                      <Form.Group as={Col} md="2">
                        <div className="form-floating m-15px">
                          <input
                            type="date"
                            className="form-control h-45px fs-13px"
                            value={
                              minDateRange.toISOString().split("T")[0]
                            }
                            onChange={(e) =>
                              setMinDateRange(
                                new Date(e.target.value)
                              )
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
                          <input
                            type="date"
                            className="form-control h-45px fs-13px"
                            value={
                              maxDateRange.toISOString().split("T")[0]
                            }
                            onChange={(e) =>
                              setMaxDateRange(
                                new Date(e.target.value)
                              )
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
                              navigate(`${PROTECTED}/gastos/nuevo`);
                            }}
                          >
                            <i className="fa fa-plus"></i>
                            &nbsp;Gasto
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
              <Alert variant="info">
                Monto total de la selección:{" "}
                <b>
                  {total.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </b>
              </Alert>
            </>
          ) : (
            <Spinner animation="grow" variant="secondary" />
          )}
        </PanelBody>
      </Panel>
    </div>
  );
}

export default GastosListado;
