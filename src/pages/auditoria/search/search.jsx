import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../../redux/actions/accountsActions";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

const Search = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [idAfiliado, setIdAfiliado] = useState(null);
  const [regional, setRegional] = useState("");
  const [nit, setNit] = useState(null);
  const [zonal, setZonal] = useState("");
  const [regimen, setRegimen] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [locationData, setLocationData] = useState({});

  const accounts = useSelector((state) => state.accounts);

  useEffect(() => {
    setLocationData(accounts.location_data);
  }, [accounts.location_data]);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Inicializa useNavigate

  const search = () => {
    setSubmitted(true);

    if (startDate && endDate) {
      const searchObject = {
        fechaInicio: startDate.toISOString().split("T")[0],
        fechaFin: endDate.toISOString().split("T")[0],
        numeroAfiliado: idAfiliado ? idAfiliado.toString() : "",
        regional: regional.trim(),
        regimen: regimen,
        nitIps: nit ? nit.toString() : "",
        zonal: zonal.trim(),
        page: 1, // Inicialmente establecemos la página en 1
        size: 25, // Puedes ajustar el tamaño de la página según tus necesidades
      };
      dispatch(fetchData(searchObject));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Elimina el objeto 'user' del localStorage
    window.location.href = 'login'; // Redirige a la página de login
  };

  const regimenOptions = [
    { label: "Contributivo", value: 1 },
    { label: "Subsidiado", value: 2 },
    { label: "PAC", value: 3 },
  ];

  const regionalOptions = [
    { label: "No seleccionar", value: "" },  // Opción para no seleccionar nada
    ...(locationData.regions?.map((region) => ({ label: region, value: region })) || [])
  ];
  
  const zonalOptions = [
    { label: "No seleccionar", value: "" },  // Opción para no seleccionar nada
    ...(locationData.zones?.map((zone) => ({ label: zone, value: zone })) || [])
  ];

  const handleStartDateChange = (e) => {
    const selectedDate = e.value;
    setStartDate(selectedDate);
    setEndDate(null); // Reinicia la fecha de fin cuando cambia la de inicio
  };

  const handleEndDateChange = (e) => {
    const selectedDate = e.value;
    const maxEndDate = new Date(startDate);
    maxEndDate.setDate(maxEndDate.getDate() + 8);

    if (selectedDate > maxEndDate) {
      // Si la fecha seleccionada excede el rango de 8 días, establece la fecha máxima permitida
      setEndDate(maxEndDate);
    } else {
      setEndDate(selectedDate);
    }
  };

  const clearForm = () => {
    setStartDate(null);
    setEndDate(null);
    setIdAfiliado(null);
    setRegional("");
    setNit(null);
    setZonal("");
    setRegimen(null);
    setSubmitted(false);
  };

  return (
    <div className="formgrid grid">
      <div className="col-12 md:col-6">
        <label htmlFor="start_date">Fecha de Inicio*</label>
        <Calendar
          id="start_date"
          className={classNames("w-full p-inputtext-sm mb-1", {
            "p-invalid": submitted && !startDate,
          })}
          value={startDate}
          onChange={handleStartDateChange}
          readOnlyInput
        />
        {submitted && !startDate && (
          <small className="p-error">Fecha de inicio es requerida.</small>
        )}
      </div>
      <div className="col-12 md:col-6">
        <label htmlFor="end_date">Fecha de Fin*</label>
        <Calendar
          id="end_date"
          className={classNames("w-full p-inputtext-sm mb-1", {
            "p-invalid": submitted && !endDate,
          })}
          value={endDate}
          onChange={handleEndDateChange}
          readOnlyInput
          minDate={startDate}
          maxDate={
            startDate
              ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 8))
              : null
          }
        />
        {submitted && !endDate && (
          <small className="p-error">Fecha de fin es requerida.</small>
        )}
      </div>
      <div className="col-12 md:col-6">
        <label htmlFor="id_afiliado">Número Identificación Afiliado</label>
        <InputNumber
          id="id_afiliado"
          className="w-full p-inputtext-sm mb-1"
          mode="decimal"
          useGrouping={false}
          value={idAfiliado}
          onChange={(e) => setIdAfiliado(e.value)}
        />
      </div>
      <div className="col-12 md:col-6">
        <label htmlFor="regional">Regional</label>
        <Dropdown
          id="regional"
          className="w-full p-inputtext-sm mb-1"
          value={regional}
          options={regionalOptions}
          onChange={(e) => setRegional(e.value)}
          placeholder="Selecciona una regional"
        />
      </div>
      <div className="col-12 md:col-6">
        <label htmlFor="nit">NIT IPS</label>
        <InputNumber
          id="nit"
          className="w-full p-inputtext-sm mb-1"
          mode="decimal"
          useGrouping={false}
          value={nit}
          onChange={(e) => setNit(e.value)}
        />
      </div>
      <div className="col-12 md:col-6">
        <label htmlFor="zonal">Zonal</label>
        <Dropdown
          id="zonal"
          className="w-full p-inputtext-sm mb-1"
          value={zonal}
          options={zonalOptions}
          onChange={(e) => setZonal(e.value)}
          placeholder="Selecciona un zonal"
        />
      </div>
      <div className="col-12 md:col-6">
        <label htmlFor="regimen">Régimen</label>
        <Dropdown
          id="regimen"
          className="w-full p-inputtext-sm mb-1"
          value={regimen}
          options={regimenOptions}
          onChange={(e) => setRegimen(e.value)}
          placeholder="Selecciona un régimen"
        />
      </div>
      <Divider align="right">
        <Button label="Buscar" icon="pi pi-search" onClick={search} />
        <Button
          label="Limpiar"
          icon="pi pi-times"
          className="p-button-secondary ml-2"
          onClick={clearForm}
        />
        <Button
          label="Cerrar Sesión"
          icon="pi pi-sign-out"
          className="p-button-secondary ml-2"
          onClick={handleLogout}
        />
       
      </Divider>
    </div>
  );
};

export default Search;
