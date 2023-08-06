import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../components/panel/panel.jsx";
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
  addGasto,
} from "../../services/gastosServices.js";
import { getCuentas } from "../../services/cuentasServices.js";
import { addComprobantes } from "../../services/comprobantesServices.js";

//Contexts
import { useAuthContext } from "../../contexts/AuthContext.jsx";

function GastosDetalle() {
  const { token } = useAuthContext();

  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Cargando formulario");
  const [cuentas, setCuentas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [gasto, setGasto] = useState({
    fecha: new Date(),
    descripcion: "",
    categoria: 0,
    cuenta: 0,
    importe: 0,
    observaciones: "",
    f_alta: new Date(),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const [data, data2] = await Promise.all([
            getCuentas(token),
            getCategoriasGastos(token),
          ]);
          setCuentas(data);
          setCategorias(data2);
          setIsLoading(false);
        } catch (error) {
          swal("Error", "Hubo un problema al obtener los datos.", "error");
        }
      }
    };

    fetchData();
  }, [token]);

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
      addGasto(token, gasto)
        .then((data) => {
          setLoadingMessage(" Cargando comprobantes");
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
              swal("Error", "Hubo un problema al guardar los datos.", "error");
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
        <li className="breadcrumb-item active">Nuevo</li>
      </ol>
      <h1 className="page-header">
        Gasto <small>nuevo</small>
      </h1>
      <Panel>
        <PanelHeader>Datos del gasto</PanelHeader>
        <PanelBody>
          {!isLoading ? (
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Form.Group as={Col} md="3">
                  <Form.Label>Fecha:</Form.Label>
                  <Form.Control
                    controlId="fecha"
                    required
                    type="date"
                    value={new Date(gasto.f_alta).toISOString().split("T")[0]}
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
                    controlId="descripcion"
                    required
                    type="text"
                    placeholder="Descripción"
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
                    controlId="f_alta"
                    required
                    type="date"
                    value={new Date(gasto.fecha).toISOString().split("T")[0]}
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
                    controlId="importe"
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
                  <Form.Select
                    required
                    value={gasto.categoria}
                    onChange={(e) => {
                      setGasto({
                        ...gasto,
                        categoria: parseInt(e.target.value, 10),
                      });
                    }}
                  >
                    <option value="">Seleccioná una opción...</option>
                    {categorias.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.descripcion}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Forma de Pago:</Form.Label>
                  <Form.Select
                    required
                    value={gasto.cuenta}
                    onChange={(e) => {
                      setGasto({
                        ...gasto,
                        cuenta: parseInt(e.target.value, 10),
                      });
                    }}
                  >
                    <option value="">Seleccioná una opción...</option>
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
