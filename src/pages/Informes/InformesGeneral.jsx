import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
 Panel,
 PanelHeader,
 PanelBody,
} from "../../components/panel/panel.jsx";
import CardWidget from "../../components/widgets/CardWidget.jsx";
import swal from "sweetalert";

//Bootstrap
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

//Datatables
import DataTable from "../../components/dataTable/DataTable.jsx";

//Servicios
import {
 getIndicadores,
 getEconomico,
 getGastos,
 getFinanciero,
} from "../../services/informesServices.js";

//Contexts
import { useAuthContext } from "../../contexts/AuthContext.jsx";

function InformesGeneral() {
 const { token } = useAuthContext();
 const [isLoading, setIsLoading] = useState(true);

 //Producción
 //  const currentDate = new Date();
 //  const [dateRange, setDateRange] = useState({
 //   Desde: new Date(
 //    currentDate.getFullYear(),
 //    currentDate.getMonth() - 1,
 //    1
 //   ),
 //   Hasta: new Date(
 //    currentDate.getFullYear(),
 //    currentDate.getMonth(),
 //    0
 //   ),
 //  });

 //Demo
 const currentDate = new Date();
 const [dateRange, setDateRange] = useState({
  Desde: new Date(2023, 0, 1),
  Hasta: new Date(2023, 0, 31),
 });

 const [indicadores, setIndicadores] = useState();
 const [dataEconomico, setDataEconomico] = useState();
 const [dataGastos, setDataGastos] = useState();
 const [dataFinanciero, setDataFinanciero] = useState();

 useEffect(() => {
  const fetchData = async () => {
   if (token) {
    try {
     const [data, data2, data3, data4] = await Promise.all([
      getIndicadores(token, dateRange),
      getEconomico(token, dateRange),
      getGastos(token, dateRange),
      getFinanciero(token, dateRange),
     ]);
     setIndicadores(data);
     setDataEconomico(data2);
     setDataGastos(data3);
     setDataFinanciero(data4);

     setIsLoading(false);
    } catch (error) {
     swal("Error", "Hubo un problema al obtener los datos.", "error");
    }
   }
  };

  fetchData();
 }, [token, dateRange]);

 const columnsEconomico = [
  {
   name: "Periodo",
   sortable: true,
   selector: (row) => row.mes,
  },
  {
   name: "Ingresos",
   sortable: true,
   selector: (row) =>
    row.ingresos.toLocaleString("es-AR", {
     style: "currency",
     currency: "ARS",
    }),
  },
  {
   name: "Gastos",
   sortable: true,
   selector: (row) =>
    row.gastos.toLocaleString("es-AR", {
     style: "currency",
     currency: "ARS",
    }),
  },
  {
   name: "Resultados",
   sortable: true,
   selector: (row) =>
    row.resultado.toLocaleString("es-AR", {
     style: "currency",
     currency: "ARS",
    }),
  },
  {
   name: "Ocupación",
   sortable: true,
   selector: (row) =>
    row.ocupacion.toLocaleString("es-AR", {
     style: "percent",
     minimumFractionDigits: 2,
     maximumFractionDigits: 2,
    }),
  },
  {
   name: "Precio promedio por noche",
   sortable: true,
   selector: (row) =>
    row.ppn.toLocaleString("es-AR", {
     style: "currency",
     currency: "ARS",
    }),
  },
 ];

 const columnsGastos = [
  {
   name: "Descripción",
   sortable: true,
   selector: (row) => row.descripcion,
  },
  {
   name: "Total ($)",
   sortable: true,
   selector: (row) =>
    row.total.toLocaleString("es-AR", {
     style: "currency",
     currency: "ARS",
    }),
  },
  {
   name: "Participación (%)",
   sortable: true,
   selector: (row) =>
    row.participacion.toLocaleString("es-AR", {
     style: "percent",
     minimumFractionDigits: 2,
     maximumFractionDigits: 2,
    }),
  },
 ];

 const columnsFinanciero = [
  {
   name: "Cuenta",
   sortable: true,
   selector: (row) => row.cuenta,
  },
  {
   name: "Estado Inicial",
   sortable: true,
   selector: (row) =>
    row.inicial.toLocaleString("es-AR", {
     style: "currency",
     currency: "ARS",
    }),
  },
  {
   name: "Ingresos",
   sortable: true,
   selector: (row) =>
    row.ingresos.toLocaleString("es-AR", {
     style: "currency",
     currency: "ARS",
    }),
  },
  {
   name: "Erogaciones",
   sortable: true,
   selector: (row) =>
    row.gastos.toLocaleString("es-AR", {
     style: "currency",
     currency: "ARS",
    }),
  },
  {
   name: "Mov. Salientes",
   sortable: true,
   selector: (row) =>
    row.salientes.toLocaleString("es-AR", {
     style: "currency",
     currency: "ARS",
    }),
  },
  {
   name: "Mov. Entrantes",
   sortable: true,
   selector: (row) =>
    row.entrantes.toLocaleString("es-AR", {
     style: "currency",
     currency: "ARS",
    }),
  },
  {
   name: "Estado Final",
   sortable: true,
   selector: (row) =>
    row.final.toLocaleString("es-AR", {
     style: "currency",
     currency: "ARS",
    }),
  },
 ];

 return (
  <div>
   <ol className="breadcrumb float-xl-end">
    <li className="breadcrumb-item">
     <Link to="/app">Admin</Link>
    </li>
    <li className="breadcrumb-item">Informes</li>
    <li className="breadcrumb-item active">General</li>
   </ol>
   <h1 className="page-header">
    Informe <small>general</small>
   </h1>

   <Row>
    <CardWidget
     title="INGRESOS POR RESERVAS"
     number={indicadores?.ingresos.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
     })}
     progress={100}
     description={`Cantidad de Reservas (${indicadores?.cantidad})`}
     iconClassName="fas fa-calendar-check fa-fw"
     widgetColor="teal"
     isLoading={isLoading}
    />
    <CardWidget
     title="PRECIO PROMEDIO"
     number={indicadores?.ppn.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
     })}
     progress={indicadores?.ocupacion * 100}
     description={`Porcentaje de ocupación (${indicadores?.ocupacion.toLocaleString(
      "es-AR",
      {
       style: "percent",
       minimumFractionDigits: 2,
       maximumFractionDigits: 2,
      }
     )})`}
     iconClassName="fa fa-dollar-sign fa-fw"
     widgetColor="blue"
     isLoading={isLoading}
    />
    <CardWidget
     title="EGRESOS POR GASTOS"
     number={indicadores?.gastos.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
     })}
     progress={(indicadores?.gastos / indicadores?.ingresos) * 100}
     description={`Porcentaje sobre los ingresos (${(
      indicadores?.gastos / indicadores?.ingresos
     ).toLocaleString("es-AR", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
     })})`}
     iconClassName="fas fa-shopping-cart fa-fw"
     widgetColor="warning"
     isLoading={isLoading}
    />
    <CardWidget
     title="RESULTADO DEL PERIODO"
     number={indicadores?.resultado.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
     })}
     progress={(indicadores?.resultado / indicadores?.ingresos) * 100}
     description={`Porcentaje sobre los ingresos (${(
      indicadores?.resultado / indicadores?.ingresos
     ).toLocaleString("es-AR", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
     })})`}
     iconClassName="fas fa-chart-line fa-fw"
     widgetColor="indigo"
     isLoading={isLoading}
    />
   </Row>

   <Panel>
    <PanelHeader>Datos del Informe</PanelHeader>
    <PanelBody>
     {!isLoading ? (
      <>
       <Row>
        <Form.Group as={Col} md="6">
         <div className="form-floating m-15px">
          <input
           type="date"
           className="form-control h-45px fs-13px"
           value={dateRange.Desde.toISOString().split("T")[0]}
           onChange={(e) =>
            setDateRange({
             ...dateRange,
             Desde: new Date(e.target.value),
            })
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
           value={dateRange.Hasta.toISOString().split("T")[0]}
           onChange={(e) =>
            setDateRange({
             ...dateRange,
             Hasta: new Date(e.target.value),
            })
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
       <Row>
        <Col xl={8} md={8}>
         <h3 className="mt-10px">
          <i className="fas fa-dollar-sign"></i> Análisis Económico
         </h3>
         <DataTable
          columns={columnsEconomico}
          data={dataEconomico}
          header={false}
          subHeader={false}
          pagination={true}
         />
        </Col>
        <Col xl={4} md={4}>
         <h3 className="mt-10px">
          <i className="fas fa-sign-out-alt"></i> Gastos por categoría
         </h3>
         <DataTable
          columns={columnsGastos}
          data={dataGastos}
          header={false}
          subHeader={false}
          pagination={true}
         />
        </Col>
       </Row>
       <hr />
       <Row>
        <h3 className="mt-10px">
         <i className="fas fa-list-alt"></i> Análisis Financiero
        </h3>
        <DataTable
         columns={columnsFinanciero}
         data={dataFinanciero}
         header={false}
         subHeader={false}
         pagination={false}
        />
       </Row>
      </>
     ) : (
      <Spinner animation="grow" variant="secondary" />
     )}
    </PanelBody>
   </Panel>
  </div>
 );
}

export default InformesGeneral;
