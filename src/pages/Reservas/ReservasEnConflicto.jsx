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
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

//Datatables
import DataTable from "../../components/dataTable/DataTable.jsx";

//Servicios
import {
  getEnConflicto,
  deleteReserva,
} from "../../services/reservasServices.js";

//Contexts
import { useAuthContext } from "../../contexts/AuthContext.jsx";

function ReservasEnConflicto() {
  const { token } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  const [formatedList, setFormatedList] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      getEnConflicto(token)
        .then((data) => {
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
      cell: (row) => {
        return (
          <Badge pill bg="danger" style={{ fontSize: "12px" }}>
            En conflicto
          </Badge>
        );
      },
    },
    {
      name: "Acciones",
      cell: (row) => (
        <>
          <Button variant="success" onClick={() => handleButtonDownload(row)}>
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
    navigate(`${PROTECTED}/reservas/enconflicto/${row.id}`);
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
        <li className="breadcrumb-item active">Reservas en conflicto</li>
      </ol>
      <h1 className="page-header">
        Reservas <small>en conflicto</small>
      </h1>
      <Panel>
        <PanelHeader>Reservas en Conflicto</PanelHeader>
        <PanelBody>
          {!isLoading ? (
            <DataTable
              columns={columns}
              data={formatedList}
              header={false}
              subHeader={true}
              pagination={true}
              handleRowClick={handleRowClick}
            />
          ) : (
            <Spinner animation="grow" variant="secondary" />
          )}
        </PanelBody>
      </Panel>
    </div>
  );
}

export default ReservasEnConflicto;
