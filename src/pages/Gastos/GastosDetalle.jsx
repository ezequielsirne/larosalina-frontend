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
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import swal from "sweetalert";
import { useDropzone } from "react-dropzone";

//Servicios
import {
  getCategoriasGastos,
  getGasto,
  updateGasto,
} from "../../services/gastosServices.js";
import { getCuentas } from "../../services/cuentasServices.js";
import { getComprobantesByGasto } from "../../services/comprobantesServices.js";
import { addComprobantes } from "../../services/comprobantesServices.js";

//Contexts
import { useAuthContext } from "../../contexts/AuthContext.jsx";

function GastosDetalle() {
  const { token } = useAuthContext();
  const { idGasto } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Cargando formulario");
  const [comprobantes, setComprobantes] = useState([]);
  const [gasto, setGasto] = useState();
  const [cuentas, setCuentas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const [data, data2, data3, data4] = await Promise.all([
            getGasto(idGasto, token),
            getCuentas(token),
            getCategoriasGastos(token),
            getComprobantesByGasto(idGasto, token),
          ]);
          setGasto(data);
          console.log(data);
          setCuentas(data2);
          setCategorias(data3);
          setComprobantes(data4);
          setIsLoading(false);
        } catch (error) {
          swal("Error", "Hubo un problema al obtener los datos.", "error");
        }
      }
    };

    fetchData();
  }, [token, idGasto]);

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
      Promise.all([
        updateGasto(token, gasto),
        addComprobantes(token, files, gasto.movimientos[0].id),
      ])
        .then(() => {
          return getComprobantesByGasto(idGasto, token);
        })
        .then((data) => {
          setComprobantes(data);
          setFiles([]);
          setLoadingMessage("");
          setIsLoading(false);
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
          swal("Error", "Hubo un problema al guardar los datos.", "error");
        });
    }
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`${PROTECTED}/gastos`);
  };

  return (
    <div>
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <Link to="/app">Admin</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to={PROTECTED + "/gastos"}>Gastos</Link>
        </li>
        <li className="breadcrumb-item active">Detalles del gasto</li>
      </ol>
      <h1 className="page-header">
        Gasto <small>detalles del gasto</small>
      </h1>
      <Panel>
        <PanelHeader>Detalles del gasto</PanelHeader>
        <PanelBody>
          {!isLoading ? (
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Form.Group as={Col} md="3">
                  <Form.Label>Fecha:</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    value={
                      gasto
                        ? new Date(gasto.f_alta).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setGasto({
                        ...gasto,
                        f_alta: new Date(e.target.value),
                      })
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label>Descripción:</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    value={gasto.descripcion}
                    onChange={(e) =>
                      setGasto({
                        ...gasto,
                        descripcion: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label>Fecha del pago:</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    value={
                      gasto
                        ? new Date(gasto.fecha).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setGasto({
                        ...gasto,
                        fecha: new Date(e.target.value),
                      })
                    }
                  />
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label>Importe ($):</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    min="1"
                    step="0.01"
                    value={gasto.importe}
                    onChange={(e) =>
                      setGasto({ ...gasto, importe: e.target.value })
                    }
                  />
                </Form.Group>
              </Row>
              <Row>&nbsp;</Row>
              <Row>
                <Form.Group as={Col} md="6">
                  <Form.Label>Categoría:</Form.Label>
                  <CustomSelect
                    options={categorias}
                    defaultOption={gasto.categoria}
                    onOptionChange={(value) => {
                      setGasto({
                        ...gasto,
                        categoria: parseInt(value, 10),
                      });
                    }}
                    unselected={false}
                  />
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Forma de Pago:</Form.Label>
                  <CustomSelect
                    options={cuentas}
                    defaultOption={gasto.cuenta}
                    onOptionChange={(value) => {
                      setGasto({
                        ...gasto,
                        cuenta: parseInt(value, 10),
                      });
                    }}
                    unselected={false}
                  />
                </Form.Group>
              </Row>
              <Row>&nbsp;</Row>
              <Row>
                <h5>
                  <i className="fa fa-file fa-2x pull-left fa-fw"></i>
                  {comprobantes.length > 0 ? (
                    <>
                      Comprobantes asociados ({comprobantes.length}): &nbsp;
                      <b>
                        <Link
                          to={`${PROTECTED}/gastos/comprobantes/${idGasto}`}
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
                Volver
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

export default GastosDetalle;
