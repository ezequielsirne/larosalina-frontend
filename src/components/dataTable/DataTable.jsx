import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Spinner from "react-bootstrap/Spinner";
import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";

const CustomDataTable = ({
  columns,
  data,
  header,
  pagination,
  subHeader,
  title,
  handleRowClick,
}) => {
  //Loader
  const CustomLoader = () => <Spinner animation="grow" variant="secondary" />;

  //Paginación
  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  //Data
  const [pending, setPending] = useState(true);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    if (data && Array.isArray(data) > 0) {
      setFilteredItems(data);
      setPending(false);
    }
  }, [data]);

  //SubHeader
  const [filterText, setFilterText] = useState();

  const subHeaderComponent = (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div className="form-floating m-15px">
        <input
          type="text"
          className="form-control h-45px fs-13px"
          placeholder="Buscar"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <label
          htmlFor="buscar"
          className="d-flex align-items-center fs-13px text-gray-600"
        >
          Buscar
        </label>
      </div>
    </div>
  );

  //Filtro
  useEffect(() => {
    let filteredList = data;

    if (filterText) {
      filteredList = filteredList.filter((item) => {
        if (item && typeof item === "object") {
          const searchValue = filterText.toLowerCase();
          return Object.values(item).some((value) => {
            const strValue = String(value);
            const lowercaseValue = strValue.toLowerCase();
            return lowercaseValue && lowercaseValue.includes(searchValue);
          });
        }
        return false;
      });
    }

    setFilteredItems(filteredList);
  }, [filterText, data]);

  //Style
  const customStyles = {
    headRow: {
      style: {
        border: "none",
      },
    },
    headCells: {
      style: {
        color: "#202124",
        fontSize: "14px",
      },
    },
    rows: {
      highlightOnHoverStyle: {
        backgroundColor: "rgb(230, 244, 244)",
        //backgroundColor: '#dcddde',
        // borderBottomColor: '#FFFFFF',
        // borderRadius: '25px',
        // outline: '1px solid #FFFFFF',
      },
      stripedStyle: {
        backgroundColor: "#e9eaeb",
        // borderRadius: '25px',
      },
    },
    pagination: {
      style: {
        border: "none",
      },
    },
  };

  return (
    <DataTable
      columns={columns}
      data={filteredItems}
      highlightOnHover //Resaltar fila cuando se pasa el maouse
      noHeader={!header}
      onRowClicked={(row) => handleRowClick(row)} //Al hacer click
      pagination={pagination}
      paginationComponentOptions={paginationComponentOptions}
      pointerOnHover={true}
      progressPending={pending}
      progressComponent={<CustomLoader />}
      responsive={true}
      striped={true} //bgColor de filas alternado
      subHeader={subHeader}
      subHeaderComponent={subHeaderComponent}
      customStyles={customStyles}
      theme="default"
      title={title}
    />
  );
};

export default CustomDataTable;
