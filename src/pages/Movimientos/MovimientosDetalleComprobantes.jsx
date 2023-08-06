import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PROTECTED } from "../../config/app-route.jsx";
//Bootstrap
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import swal from "sweetalert";

//Servicios
import {
  deleteComprobante,
  getComprobantesByMovimiento,
} from "../../services/comprobantesServices.js";

//Contexts
import { useAuthContext } from "../../contexts/AuthContext.jsx";

function MovimientosDetalleComprobantes() {
  const { token } = useAuthContext();
  const { idMovimiento } = useParams();
  const { idReserva } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [comprobantes, setComprobantes] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      getComprobantesByMovimiento(idMovimiento, token)
        .then((data) => {
          setComprobantes(data);
          setIsLoading(false);
        })
        .catch((error) => {
          // Manejar el error aquí (mostrar una alerta, etc.)
          console.error(error);
          swal("Error", "Hubo un problema al obtener los datos.", "error");
        });
    };

    fetchData();
  }, [token, idMovimiento]);

  const navigate = useNavigate();

  const handleBack = () => {
    const currentPath = window.location.pathname;
    if (currentPath.includes("reservas/")) {
      navigate(`${PROTECTED}/reservas/${idReserva}/pagos/${idMovimiento}`);
    } else {
      navigate(`${PROTECTED}/movimientos/${idMovimiento}`);
    }
  };

  const eliminarComprobante = (comprobante) => {
    swal({
      title: `Queres eliminar el comprobante: ${comprobante.archivo_corto}?`,
      text: "No vas a poder recuperar este archivo!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteComprobante(token, comprobante)
          .then(() => {
            // Eliminar "comprobante" de "comprobantes"
            const updatedList = comprobantes.filter(
              (item) => item !== comprobante
            );
            setComprobantes(updatedList);
            swal(
              `El comprobante: ${comprobante.archivo_corto} se eliminó correctamente!`,
              {
                icon: "success",
              }
            );
          })
          .catch((error) => {
            console.error(error);
            swal(
              "Error",
              "Hubo un problema al eliminar el comprobante.",
              "error"
            );
          });
      } else {
        swal(
          `Tranqui, el comprobante: ${comprobante.archivo_corto} no se eliminó!`
        );
      }
    });
  };

  return (
    <div>
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <Link to={PROTECTED}>Admin</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to={`${PROTECTED}/movimientos/`}>Movimientos</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to={`${PROTECTED}/movimientos/${idMovimiento}`}>
            Detalles del movimiento
          </Link>
        </li>
        <li className="breadcrumb-item active">Comprobantes</li>
      </ol>
      <h1 className="page-header">
        Movimiento <small>comprobantes del movimientos</small>
      </h1>
      <ul className="timeline" style={{ background: "none!important" }}>
        {!isLoading ? (
          comprobantes.length > 0 ? (
            comprobantes.map((comprobante, index) => {
              if (
                [".jpg", ".JPG", ".jpeg", ".JPEG", ".png", ".PNG"].includes(
                  comprobante.extension
                )
              ) {
                return (
                  <div className="timeline-item" key={index}>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <div className="username">
                          Archivo: {comprobante.archivo_corto} | Tipo:{" "}
                          {comprobante.extension}
                        </div>
                      </div>
                      <div className="timeline-body">
                        <div className="mb-3">
                          <div className="row gx-1">
                            <div className="col-12">
                              <img
                                src={`data:image/${comprobante.extension};base64, ${comprobante.file}`}
                                alt="Archivo"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="timeline-footer"
                        style={{ paddingBottom: "20px", paddingLeft: "20px" }}
                      >
                        <Button
                          variant="success"
                          href={`data:image/${comprobante.extension};base64, ${comprobante.file}`}
                          download={`Comprobante_del_movimiento_${idMovimiento}${comprobante.extension}`}
                        >
                          <i className="fa fa-cloud-download-alt fa-lg"></i>
                        </Button>
                        &nbsp;
                        <Button
                          variant="danger"
                          onClick={() => eliminarComprobante(comprobante)}
                        >
                          <i className="fa fa-trash-alt fa-lg"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              }
              if ([".pdf", ".PDF"].includes(comprobante.extension)) {
                return (
                  <div className="timeline-item" key={index}>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <div className="username">
                          Archivo: {comprobante.archivo_corto} | Tipo:{" "}
                          {comprobante.extension}
                        </div>
                      </div>
                      <div className="timeline-body">
                        <div className="mb-3">
                          <div className="row gx-1">
                            <div className="col-12">
                              <iframe
                                src={`data:application/pdf;base64,${comprobante.file}`}
                                title={`${comprobante.archivo}`}
                                width="100%"
                                height="500px"
                              ></iframe>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="timeline-footer"
                        style={{ paddingBottom: "20px", paddingLeft: "20px" }}
                      >
                        <Button
                          variant="success"
                          href={`data:application/pdf;base64, ${comprobante.file}`}
                          download={`Comprobante_del_movimiento_${idMovimiento}.pdf`}
                        >
                          <i className="fa fa-cloud-download-alt fa-lg"></i>
                        </Button>
                        &nbsp;
                        <Button
                          variant="danger"
                          onClick={() => eliminarComprobante(comprobante)}
                        >
                          <i className="fa fa-trash-alt fa-lg"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div class="timeline-item">
                    <div class="timeline-content">
                      <div class="timeline-header">
                        <div class="username">
                          Archivo: {comprobante.archivo_corto} | Tipo:{" "}
                          {comprobante.extension}
                        </div>
                      </div>
                      <div class="timeline-body">
                        <div class="mb-3">
                          <div class="row gx-1">
                            <div class="col-12">
                              <p class="m-t-10">Vista previa no disponible</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        class="timeline-footer"
                        style={{ paddingBottom: "20px", paddingLeft: "20px" }}
                      >
                        <a
                          href={`data:application/octet-stream;base64, ${comprobante.file}`}
                          download={`Comprobante_del_movimiento_${idMovimiento}${comprobante.extension}`}
                        >
                          <i class="fa fa-download"></i> Descargar
                        </a>
                      </div>
                    </div>
                  </div>
                );
              }
            })
          ) : (
            <>No existen comprobantes asociados.</>
          )
        ) : (
          <>
            <Spinner animation="grow" variant="secondary" />
          </>
        )}
      </ul>
      <Button type="button" variant="secondary" size="lg" onClick={handleBack}>
        Volver al Detalle del Movimiento
      </Button>
    </div>
  );
}

export default MovimientosDetalleComprobantes;
