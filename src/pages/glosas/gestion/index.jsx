import { useCallback, useState } from 'react';
import { Pagination } from '../../../lib/pagination';
import { Table } from '../../../lib/table';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { Utils, renderDate } from '../../../lib/utils';
import Confirmation from '../../../lib/confirmation';

const COLUMNS = [
  {
    title: 'ID Transacción',
    field: 'idTransaccion',
  },
  {
    title: 'Prefijo Factura',
    field: 'gglPrefijoFactura',
  },
  {
    title: 'Numero Factura',
    field: 'gglNumeroFactura',
  },
  {
    title: 'Nro Radicacion De La Cuenta',
    field: 'gglNroRadicacionDeLaCuenta',
  },
  {
    title: 'Tipo Identificacion Del Afiliado',
    field: 'gglTipoIdentificacionAfiliado',
  },
  {
    title: 'Numero De Identificacion Del Afiliado',
    field: 'gglNumeroIdentificacionAfiliado',
  },
  {
    title: 'Fecha Prestacion Servicio',
    field: 'gglFechaPrestacionServicio',
    render: renderDate,
  },
  {
    title: 'Fecha De Emision De Factura',
    field: 'gglFechaDeEmisionDeFactura',
    render: renderDate,
  },
  {
    title: 'Fecha Presentacion Factura',
    field: 'gglFechaPresentacionFactura',
    render: renderDate,
  },
  {
    title: 'Fecha Glosa Inicial',
    field: 'gglFechaGlosaInicial',
    render: renderDate,
  },
  {
    title: 'Codigo De Procedimiento',
    field: 'gglCodigoDeProcedimiento',
  },
  {
    title: 'Consecutivo De Atencion De Radicacion De La Cuenta',
    field: 'gglConsatenRadicacionCuenta',
  },
  {
    title: 'Valor Factura',
    field: 'gglValorFactura',
  },
  {
    title: 'Valor Glosa Inicial',
    field: 'gglValorGlosaInicial',
  },
  {
    title: 'Codigo Glosa Inicial',
    field: '',
  },
  {
    title: 'Numero Orden De Pago',
    field: 'gglNumeroOrdenPago',
  },
  {
    title: 'Numero Autorizacion',
    field: 'gglNumeroAutorizacion',
  },
  {
    title: 'Cant. Fact. Ips',
    field: 'gglCantidadFacturadaIps',
  },
  {
    title: 'Cant. Eps',
    field: 'gglCantidadFacturadaEps',
  },
  {
    title: 'Valor Bruto Eps',
    field: '',
  },
  {
    title: 'Fecha Autorizacion',
    field: 'gglFechaAutorizacion',
    render: renderDate,
  },
  {
    title: 'Fecha Respuesta Glosa Inicial',
    field: 'gglFechaRespuestaGlosaInicial',
  },
  {
    title: 'Tipo Glosa',
    field: 'gglTipoGlosa',
  },
  {
    title: 'Observacion',
    field: 'gglObservacionGlosa',
    render: (item, column, options) => {
      return <textarea readOnly value={item.gglObservacionGlosa ?? ''} />;
    },
  },
  {
    title: 'Codigo Respuesta Glosa Inicial (Desplegable)',
    field: '',
    render: (item, column, options) => {
      if (!options.form) return null;
      const { register } = options.form;
      return (
        <select
          disabled={item.gestion != null}
          {...register('items.' + options.index + '.codigoRespuestaGlosaInicial', {
            required: false,
          })}
          class='block w-fit rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
        >
          <option value='911 Ips no responde en los terminos definidos'>
            911 Ips no responde en los terminos definidos
          </option>
          <option value='912 Glosa o devolución ratificada'>
            912 Glosa o devolución ratificada
          </option>
          <option value='995 Glosa o devolución extemporánea'>
            995 Glosa o devolución extemporánea
          </option>
          <option value='996 Glosa o devolución injustificada'>
            996 Glosa o devolución injustificada
          </option>
          <option value='997 Glosa o devolución totalmente aceptada'>
            997 Glosa o devolución totalmente aceptada
          </option>
          <option value='998 Glosa o devolución parcialmente aceptada'>
            998 Glosa o devolución parcialmente aceptada
          </option>
          <option value='999 Glosa o devolución no aceptada'>
            999 Glosa o devolución no aceptada
          </option>
        </select>
      );
    },
  },
  {
    title: 'Valor Aceptado Ips',
    field: '',
    render: (item, column, options) => {
      if (!options.form) return null;
      const {
        register,
        formState: { errors },
      } = options.form;
      return (
        <div>
          <input
            disabled={item.gestion != null}
            {...register('items.' + options.index + '.valorAceptadoIps', { required: false })}
            class='block w-[10rem] rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            placeholder=''
          />
          {errors.items?.[options.index]?.observaciones && (
            <span className='text-xs text-red-500'>
              {errors.items?.[options.index]?.observaciones?.message}
            </span>
          )}
        </div>
      );
    },
  },
  {
    title: 'Valor Soportado',
    field: '',
    render: (item, column, options) => {
      if (!options.form) return null;
      const { register, watch } = options.form;
      const valorAceptado = watch('items.' + options.index + '.valorAceptadoIps');
      const valorSoportado = (item.gglValorGlosaInicial ?? 0) - Number.parseFloat(valorAceptado);
      return Number.isNaN(valorSoportado) ? '-' : valorSoportado;
    },
  },
  {
    title: 'Observaciones',
    field: '',
    render: (item, column, options) => {
      if (!options.form) return null;
      const {
        register,
        formState: { errors },
      } = options.form;
      return (
        <div>
          <input
            disabled={item.gestion != null}
            {...register('items.' + options.index + '.observaciones', { required: false })}
            class='block w-[10rem] rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            placeholder=''
          />
          {errors.items?.[options.index]?.observaciones && (
            <span className='text-xs text-red-500'>
              {errors.items?.[options.index]?.observaciones?.message}
            </span>
          )}
        </div>
      );
    },
  },
  {
    title: 'Guardar',
    field: '',
    render: (item, column, options) => {
      if (!options.form || !options.onSave) return null;

      const { handleSubmit } = options.form;
      return (
        <button
          disabled={
            item.gglValorAceptadoIps > 0 || item.gglValorSoportadoEps > 0 || item.gestion != null
          }
          onClick={handleSubmit(options.onSave)}
        >
          Guardar
        </button>
      );
    },
  },
  {
    title: 'Estado (Soportado Eps - Aceptado Ips- Ratificado- En Revision)',
    field: '',
  },
  {
    title: 'Observaciones Eps',
    field: 'gglObservacionesEps',
  },
  {
    title: 'Valor Soportado Eps',
    field: 'gglValorSoportadoEps',
  },
  {
    title: 'Valor Aceptado Ips',
    field: 'gglValorAceptadoIps',
  },
  {
    title: 'Valor Ratificado',
    field: 'gglValorRatificado',
  },
  {
    title: 'Fecha Respuesta Eps',
    field: '',
  },
  {
    title: 'Fecha Radicacion',
    field: 'gglFechaRadicacion',
    render: renderDate,
  },
];

export default function GestionGlosas() {
  const [showResults, setShowResults] = useState(false);
  const [data, setData] = useState([]);
  const [prestador, setDataPrestador] = useState(null);
  const [totales, setTotales] = useState(null);
  const [total, setTotal] = useState(0);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [recordToSave, setRecordToSave] = useState(null);
  const [lastSearch, setLastSearch] = useState({});

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm({ defaultValues: {} });

  const onBuscar = useCallback(async (data) => {
    setShowResults(true);

    const resQuery = await axios.post(Utils.BASE_PATH + 'api/gestion-glosas', data);
    const response = resQuery?.data;
    setLastSearch(data);

    setDataPrestador({ nit: response?.nit });
    setTotales(response?.totales);
    setTotal(response?.total ?? 0);

    if (response?.total <= 100) {
      setShowResults(true);
      setData(response?.data ?? []);
    }
  }, []);

  const onSubmit = useCallback(async (data) => {
    onBuscar(data);
  }, []);

  const fechaInicio = watch('fechaInicial');
  const fechaFin = watch('fechaFinal');

  const form = useForm({ defaultValues: { items: [] } });

  const { setError } = form;

  const onSave = useCallback(
    (options) => {
      return async (data) => {
        if (data?.items[options.index]?.valorAceptadoIps === undefined) {
          setError('items.' + options.index + '.valorAceptadoIps', {
            type: 'manual',
            message: 'Este campo es requerido',
          });
          return;
        }

        if (
          data?.items[options.index]?.observaciones === undefined ||
          data?.items[options.index]?.observaciones?.trim() === ''
        ) {
          setError('items.' + options.index + '.observaciones', {
            type: 'manual',
            message: 'Este campo es requerido',
          });
          return;
        }
        const record = data?.items[options.index];
        console.log('data to save', options.row, record);
        setRecordToSave({ record, row: options.row });
        setOpenConfirmation(true);
      };
    },
    [setError],
  );

  const onAlmacenar = useCallback(async () => {
    console.log('record to save', recordToSave);
    const resQuery = await axios.post(Utils.BASE_PATH + 'api/gestion-glosas/guardar', recordToSave);
    const response = resQuery?.data;
    console.log('response', response);
    setOpenConfirmation(false);
    onBuscar(lastSearch);
  }, [recordToSave, lastSearch]);

  const rowRender = useCallback(
    (row, index, callback) => {
      return callback({ form, index, onSave: onSave({ form, row, index }) });
    },
    [onSave, form],
  );

  return (
    <>
      <div className='flex w-full flex-col '>
        <div className='flex flex-col items-center gap-8'>
          <div className='w-full max-w-6xl ring-1 ring-gray-200'>
            <div className='bg-gray-200'>BUSQUEDA</div>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2 bg-white p-4'>
              <div className='mt-4 grid grid-cols-3 gap-8'>
                <div>
                  <div className='flex flex-col gap-2'>
                    <div className='grid grid-cols-2 items-center items-baseline justify-center gap-2 align-middle'>
                      <label for='email' class='block leading-6 text-gray-900'>
                        NIT
                      </label>
                      <div>
                        <input
                          {...register('nit', { required: false })}
                          type='text'
                          id='fechainicial'
                          class='block  w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-2 items-baseline justify-center gap-2 align-middle'>
                      <label for='email' class='block leading-6 text-gray-900'>
                        Nombre IPS
                      </label>
                      <div>
                        <input
                          type='text'
                          {...register('nombreIPS', { required: false })}
                          class='block  w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className='flex flex-col gap-2'>
                    <div className='grid grid-cols-2 flex-row items-baseline justify-center gap-2 align-middle'>
                      <label for='email' class='block leading-6 text-gray-900'>
                        Nro Radicaci&oacute;n de la cuenta
                      </label>
                      <div>
                        <input
                          {...register('nroRadicacionCuenta', { required: false })}
                          type='text'
                          class='block  w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-2 flex-row items-baseline justify-center gap-2 align-middle'>
                      <label for='email' class='block leading-6 text-gray-900'>
                        N&uacute;mero de Factura
                      </label>
                      <div>
                        <input
                          {...register('nroFactura', { required: false })}
                          type='text'
                          class='block  w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className='flex flex-col gap-2'>
                    <div className='grid grid-cols-2 flex-row items-baseline justify-center gap-2 align-middle'>
                      <label for='email' class='block leading-6 text-gray-900'>
                        Id Transacci&oacute;n
                      </label>
                      <div>
                        <input
                          {...register('idTransaccion', { required: false })}
                          type='text'
                          class='block  w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex w-full flex-row justify-end'>
                <button
                  type='submit'
                  class='rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>
          {showResults ? (
            <>
              <div className='w-full'>
                <div>
                  <div class='mt-8 flow-root'>
                    <>
                      <Table columns={COLUMNS} data={data ?? []} rowRenderer={rowRender} />
                    </>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <Confirmation
        open={openConfirmation && recordToSave != null}
        onClose={() => {
          setRecordToSave(null);
          setOpenConfirmation(false);
        }}
      >
        <div className='flex flex-col gap-6'>
          <span>¿Esta seguro que desea almacenar los datos registrados?</span>

          <div className='mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3'>
            <button
              type='button'
              className='inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
              sm:col-start-2'
              onClick={onAlmacenar}
            >
              Almacenar
            </button>
            <button
              type='button'
              className='mt-3 inline-flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1
              sm:mt-0
              '
              onClick={() => {
                setRecordToSave(null);
                setOpenConfirmation(false);
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Confirmation>
    </>
  );
}
