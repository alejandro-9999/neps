import React, { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import "primeflex/primeflex.css";
import "./reportAudit.css";

const ReportAudit = ({ reportData }) => {
  const [data, setData] = useState([]);
  const [regionalData, setRegionalData] = useState({});
  const [zonalData, setZonalData] = useState({});
  const [departamentoData, setDepartamentoData] = useState({});
  const [diagnosticoData, setDiagnosticoData] = useState({});
  const [descripcionGlosaData, setDescripcionGlosaData] = useState({});
  const [valorGlosaData, setValorGlosaData] = useState({});

  useEffect(() => {
    setData(reportData);
  }, [reportData]);

  useEffect(() => {
    if (data.length > 0) {
      const regionalCount = {};
      const zonalCount = {};
      const departamentoCount = {};
      const diagnosticoCount = {};
      const descripcionGlosaCount = {};
      const valorGlosaCount = {};

      data.forEach((record) => {
        // Count Regional occurrences
        if (regionalCount[record.regional]) {
          regionalCount[record.regional]++;
        } else {
          regionalCount[record.regional] = 1;
        }

        // Count Zonal occurrences
        if (zonalCount[record.zonal]) {
          zonalCount[record.zonal]++;
        } else {
          zonalCount[record.zonal] = 1;
        }

        // Count Departamento occurrences
        if (departamentoCount[record.departamento]) {
          departamentoCount[record.departamento]++;
        } else {
          departamentoCount[record.departamento] = 1;
        }

        // Count Diagnostico occurrences
        if (diagnosticoCount[record.dxIngreso]) {
          diagnosticoCount[record.dxIngreso]++;
        } else {
          diagnosticoCount[record.dxIngreso] = 1;
        }

        // Count Descripcion Glosa occurrences
        if (descripcionGlosaCount[record.descripcionGlosaGeneral]) {
          descripcionGlosaCount[record.descripcionGlosaGeneral]++;
        } else {
          descripcionGlosaCount[record.descripcionGlosaGeneral] = 1;
        }

        // Sum Valor Glosa
        if (valorGlosaCount[record.valorGlosado]) {
          valorGlosaCount[record.valorGlosado] += parseFloat(record.valorGlosado);
        } else {
          valorGlosaCount[record.valorGlosado] = parseFloat(record.valorGlosado);
        }
      });

      setRegionalData({
        labels: Object.keys(regionalCount),
        datasets: [
          {
            data: Object.values(regionalCount),
            backgroundColor: generateColors(Object.keys(regionalCount).length),
          },
        ],
      });

      setZonalData({
        labels: Object.keys(zonalCount),
        datasets: [
          {
            data: Object.values(zonalCount),
            backgroundColor: generateColors(Object.keys(zonalCount).length),
          },
        ],
      });

      setDepartamentoData({
        labels: Object.keys(departamentoCount),
        datasets: [
          {
            data: Object.values(departamentoCount),
            backgroundColor: generateColors(Object.keys(departamentoCount).length),
          },
        ],
      });

      setDiagnosticoData({
        labels: Object.keys(diagnosticoCount),
        datasets: [
          {
            data: Object.values(diagnosticoCount),
            backgroundColor: generateColors(Object.keys(diagnosticoCount).length),
          },
        ],
      });

      setDescripcionGlosaData({
        labels: Object.keys(descripcionGlosaCount),
        datasets: [
          {
            data: Object.values(descripcionGlosaCount),
            backgroundColor: generateColors(Object.keys(descripcionGlosaCount).length),
          },
        ],
      });

      setValorGlosaData({
        labels: Object.keys(valorGlosaCount),
        datasets: [
          {
            data: Object.values(valorGlosaCount),
            backgroundColor: generateColors(Object.keys(valorGlosaCount).length),
          },
        ],
      });
    }
  }, [data]);

  const generateColors = (num) => {
    const colors = [];
    for (let i = 0; i < num; i++) {
      const color = `hsl(${(i * 360) / num}, 100%, 50%)`;
      colors.push(color);
    }
    return colors;
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="dashboard-panel">
        <div className="p-col-4 p-md-4">
          <h5>Regional Distribution</h5>
          <Chart type="doughnut" data={regionalData} options={chartOptions} className="w-full md:w-30rem" />
        </div>
        <div className="p-col-4 p-md-4">
          <h5>Zonal Distribution</h5>
          <Chart type="doughnut" data={zonalData} options={chartOptions} className="w-full md:w-30rem" />
        </div>
        <div className="p-col-12 p-md-4">
          <h5>Departamento Distribution</h5>
          <Chart type="doughnut" data={departamentoData} options={chartOptions} className="w-full md:w-30rem" />
        </div>
        <div className="p-col-12 p-md-4">
          <h5>Diagnóstico Distribution</h5>
          <Chart type="doughnut" data={diagnosticoData} options={chartOptions} className="w-full md:w-30rem" />
        </div>
        <div className="p-col-12 p-md-4">
          <h5>Descripción Glosa Distribution</h5>
          <Chart type="doughnut" data={descripcionGlosaData} options={chartOptions} className="w-full md:w-30rem" />
        </div>
        <div className="p-col-12 p-md-4">
          <h5>Valor Glosa Distribution</h5>
          <Chart type="doughnut" data={valorGlosaData} options={chartOptions} className="w-full md:w-30rem" />
        </div>
      </div>
  );
};

export default ReportAudit;
