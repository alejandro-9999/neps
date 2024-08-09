import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { stringify } from 'csv-stringify/browser/esm/sync';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';
import PaymentsTable from '../paymentsTable/paymentsTable';
import { Divider } from 'primereact/divider';
import ReportAudit from '../reportAudit/reportAudit';
import './accountsTable.css';  
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../../../redux/actions/accountsActions';

const AccountsTable = ({ tableData, query }) => {
  const [data, setData] = useState([]);
  const [fileFormat, setFileFormat] = useState('csv');
  const [rows, setRows] = useState(25);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [reportVisible, setReportVisible] = useState(false);
  const [first, setFirst] = useState(0);  // Página inicial

  const accounts = useSelector((state) => state.accounts);
  const dispatch = useDispatch();

  useEffect(() => {
    setTotalRecords(tableData.cantidadRegistros);
    setData(tableData.amconcurrencias);
  }, [tableData]);

  const onPage = (event) => {
    var new_query = {...accounts.query};
    new_query.page = event.page+1;
    new_query.size = event.rows;

    dispatch(fetchData(new_query));

    setRows(event.rows);

    setFirst(event.page * event.rows + 1);
  };

  const fileFormats = [
    { label: 'CSV', value: 'csv' },
    { label: 'Excel', value: 'xlsx' },
    { label: 'Text', value: 'txt' },
  ];

  const validRows = [
    { label: '5', value: '5' },
    { label: '10', value: '10' },
    { label: '25', value: '25' },
    { label: '50', value: '50' },
    { label: '100', value: '100' },
  ];

  const handleDownload = () => {
    if (data.length === 0) {
      alert('No data to export!');
      return;
    }

    const fileName = `accounts_data.${fileFormat}`;

    switch (fileFormat) {
      case 'csv':
        const csvData = stringify(data, { header: true });
        const csvBlob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
        saveAs(csvBlob, fileName);
        break;

      case 'xlsx':
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Accounts');
        XLSX.writeFile(wb, fileName);
        break;

      case 'txt':
        const txtData = data.map((row) => Object.values(row).join('\t')).join('\n');
        const txtBlob = new Blob([txtData], { type: 'text/plain;charset=utf-8' });
        saveAs(txtBlob, fileName);
        break;

      default:
        console.error('Unsupported file format');
    }
  };

  const paginatorRight = (
    <div className='align-items-center flex'>
      <Dropdown
        value={fileFormat}
        options={fileFormats}
        onChange={(e) => setFileFormat(e.value)}
        placeholder='Select a format'
        className='mr-2'
      />
      <Button type='button' icon='pi pi-download' onClick={handleDownload} tooltip='Download' />
    </div>
  );

  const showPayments = async (row) => {
    const { numeroFactura, nitIps } = row;

    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}${import.meta.env.VITE_REACT_APP_API_PAYMENTS_ENDPOINT}`, {
        params: {
          numeroFactura,
          nitIps,
        },
      });
      setSelectedPayments(response.data);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching payments', error);
    }
  };

  const toggleReport = (value) => {
    setReportVisible(value);
  };

  const paymentsTemplate = (rowData) => {
    return (
      <Button
        type='button'
        label='Ver Pagos Relacionados'
        onClick={() => showPayments(rowData)}
      />
    );
  };

  return (
    <div>
      <Button type='button' label='Dashboard' onClick={() => toggleReport(true)} />
      <Divider />
      <div className='table-container'>
        <DataTable
          value={data}
          paginator
          lazy
          first={first}
          loading={accounts.loading}
          rows={rows} // Tamaño de la página
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          totalRecords={totalRecords}
          size={'small'}
          onPage={onPage}
          paginatorRight={paginatorRight}
          className='p-datatable-gridlines'
          emptyMessage='No data found'
        >
          <Column field='nitIps' header='NIT IPS' sortable></Column>
          <Column field='ips' header='Nombre IPS' sortable></Column>
          <Column field='regional' header='Regional' sortable></Column>
          <Column field='zonal' header='Zonal' sortable></Column>
          <Column field='departamento' header='Departamento' sortable></Column>
          <Column
            field='numeroIdentificacionAfiliado'
            header='Número Identificación Afiliado'
            sortable
          ></Column>
          <Column field='nombresYApellidos' header='Nombres y Apellidos' sortable></Column>
          <Column field='fechaIngreso' header='Fecha Ingreso' sortable></Column>
          <Column field='dxIngreso' header='Diagnóstico' sortable></Column>
          <Column field='codigoMapiiss' header='Código MAPIIS' sortable></Column>
          <Column field='numeroFactura' header='Número Factura' sortable></Column>
          <Column field='valorFactura' header='Valor Factura' sortable></Column>
          <Column field='descripcionGlosaGeneral' header='Descripción Glosa' sortable></Column>
          <Column field='valorGlosado' header='Valor Glosa' sortable></Column>
          <Column field='eventosAdverso1' header='Eventos Adversos' sortable></Column>
          <Column field='iaas' header='IAAS' sortable></Column>
          <Column field='condicionAlta' header='Condición de alta' sortable></Column>
          <Column field='cohorte' header='Cohorte' sortable></Column>
          <Column field='fechaEgreso' header='Fecha de egreso' sortable></Column>
          <Column body={paymentsTemplate} header='Pagos'></Column>
        </DataTable>
      </div>
      <Dialog header='Payments' visible={modalVisible} onHide={() => setModalVisible(false)} maximizable>
        <PaymentsTable paymentsData={selectedPayments} />
      </Dialog>
      <Dialog header='Report Audit' visible={reportVisible} onHide={() => setReportVisible(false)} maximizable>
        <ReportAudit reportData={data}/>
      </Dialog>
    </div>
  );
};

export default AccountsTable;
