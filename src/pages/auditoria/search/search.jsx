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

const Search = () => {
  const [dates, setDates] = useState(null);
  const [idAfiliado, setIdAfiliado] = useState(null);
  const [regional, setRegional] = useState("");
  const [nit, setNit] = useState(null);
  const [zonal, setZonal] = useState("");
  const [regimen, setRegimen] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [locationData, setLocationData] = useState({});


  const accounts = useSelector((state) => state.accounts);


  useEffect(()=>{
    setLocationData(accounts.location_data);
  },[accounts.location_data]);

  const dispatch = useDispatch();

  const search = () => {
    setSubmitted(true);

    if (dates) {
      const searchObject = {
        fechaInicio: dates[0].toISOString().split('T')[0],
        fechaFin: dates[1].toISOString().split('T')[0],
        numeroAfiliado: idAfiliado ? idAfiliado.toString() : "",
        regional: regional.trim(),
        regimen:regimen,
        nitIps: nit ? nit.toString() : "",
        zonal: zonal.trim(),
        page: 1,  // Inicialmente establecemos la página en 1
        size: 25  // Puedes ajustar el tamaño de la página según tus necesidades
      };
      dispatch(fetchData(searchObject));
    }
  };

  const regimenOptions = [
    { label: "Contributivo", value: "Contributivo" },
    { label: "Subsidiado", value: "Subsidiado" },
    { label: "PAC", value: "PAC" },
  ];

  const regionalOptions = locationData.regions?.map(region => ({ label: region, value: region })) || [];
  const zonalOptions = locationData.zones?.map(zone => ({ label: zone, value: zone })) || [];

  return (
    <div className="formgrid grid">
      <div className="col-12">
        <label htmlFor="date">Periodo*</label>
        <Calendar
          id="date"
          className={classNames("w-full p-inputtext-sm mb-1", {
            "p-invalid": submitted && !dates,
          })}
          value={dates}
          onChange={(e) => setDates(e.value)}
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
        />
        {submitted && !dates && <small className="p-error">Periodo es requerido.</small>}
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
      </Divider>
    </div>
  );
};

export default Search;
