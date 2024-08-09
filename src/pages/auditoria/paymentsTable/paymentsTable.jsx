import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { stringify } from "csv-stringify/browser/esm/sync";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Divider } from "primereact/divider";

const PaymentsTable = ({ tableData }) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(null);
  const [fileFormat, setFileFormat] = useState("csv");

  useEffect(() => {
    setData(tableData);
    if(tableData){
      const totalValue = tableData.reduce((acc, curr) => {
        return acc + parseFloat(curr.valor_aplicacion);
      }, 0);

      const formattedTotal = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(totalValue);

      setTotal(formattedTotal);
      console.log(totalValue);
    }
}, [tableData]);

  const fileFormats = [
    { label: "CSV", value: "csv" },
    { label: "Excel", value: "xlsx" },
    { label: "Text", value: "txt" },
  ];

  const handleDownload = () => {
    if (data.length === 0) {
      alert("No data to export!");
      return;
    }

    const fileName = `accounts_data.${fileFormat}`;

    switch (fileFormat) {
      case "csv":
        const csvData = stringify(data, { header: true });
        const csvBlob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
        saveAs(csvBlob, fileName);
        break;

      case "xlsx":
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Accounts");
        XLSX.writeFile(wb, fileName);
        break;

      case "txt":
        const txtData = data
          .map((row) => Object.values(row).join("\t"))
          .join("\n");
        const txtBlob = new Blob([txtData], {
          type: "text/plain;charset=utf-8",
        });
        saveAs(txtBlob, fileName);
        break;

      default:
        console.error("Unsupported file format");
    }
  };

  const paginatorRight = (
    <div className="flex align-items-center">
      <Dropdown
        value={fileFormat}
        options={fileFormats}
        onChange={(e) => setFileFormat(e.value)}
        placeholder="Select a format"
        className="mr-2"
      />
      <Button
        type="button"
        icon="pi pi-download"
        onClick={handleDownload}
        tooltip="Download"
      />
    </div>
  );

  return (
    <div>
      <Chip template={<p>Total Valor Aplicación <b>{total}</b></p>} />
      <Divider />
      <DataTable
        value={data}
        paginator
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rows={1000}
        size={"small"}
        className="p-datatable-sm"
        paginatorRight={paginatorRight}
      >
        <Column field="nitIps" header="NIT IPS"></Column>
        <Column field="ips" header="Nombre IPS"></Column>
        <Column field="fechaIngreso" header="Fecha Legalización"></Column>
        <Column field="numeroFactura" header="Número Factura"></Column>
        <Column field="numeroRadicado" header="Número Radicado"></Column>
        <Column field="regimenCont" header="Régimen Cont"></Column>
        <Column
          field="numero_comprobante_anticipo"
          header="Número Comprobante Anticipo"
        ></Column>
        <Column field="fecha_anticipo" header="Fecha de Anticipo"></Column>
        <Column field="valor_aplicacion" header="Valor Aplicación"></Column>
        <Column
          field="cod_tipo_comprobante"
          header="Cod Tipo Comprobante"
        ></Column>
      </DataTable>
    </div>
  );
};

export default PaymentsTable;
