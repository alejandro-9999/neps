import { useCallback, useState } from 'react';
import { Pagination } from '../../../lib/pagination';
import { Table } from '../../../lib/table';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { Utils, getDifferenceInDays, renderDate } from '../../../lib/utils';

const COLUMNS = [
  {
    title: 'Nit IPS Prestadora',
    field: 'rpaNitIpsPrestadora',
  },
  {
    title: 'Razon social Ips Prestadora',
    field: 'rpaRazonSocialIps',
  },
  {
    title: 'Fecha de Pago',
    field: 'rpaFechaPago',
    render: renderDate,
  },
  {
    title: 'Numero Comprobante',
    field: 'rpaNumeroComprobante',
  },
  {
    title: 'Valor debito',
    field: 'rpaValorDebito',
  },
  {
    title: 'Tipo Comprobante',
    field: 'rpaCodigoTipoComprobante',
  },
  {
    title: 'Número de acta',
    field: 'rpaNumeroActa',
  },
];

function renderDescargar(watch) {
  return (
    <div>
      <form target='_blank' method='post' action={Utils.BASE_PATH + 'api/reporte-pagos/descargar'}>
        <div className='flex w-full flex-row items-center justify-end gap-8 pt-4'>
          <button
            type='submit'
            class='rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
          >
            Descargar
          </button>
          <div className='flex flex-row items-baseline gap-2'>
            <input type='hidden' name='tipoFecha' value={watch('tipoFecha')} />
            <input type='hidden' name='fechaInicial' value={watch('fechaInicial')} />
            <input type='hidden' name='fechaFinal' value={watch('fechaFinal')} />
            <input type='hidden' name='comprobante' value={watch('comprobante')} />

            <>
              <label for='location' class='block text-sm font-medium leading-6 text-gray-900'>
                Formato
              </label>
              <select
                id='formato'
                name='formato'
                class='block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
              >
                <option>.csv</option>
              </select>
            </>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function ReportePagos() {
  const [showResults, setShowResults] = useState(false);
  const [data, setData] = useState([]);
  const [prestador, setDataPrestador] = useState(null);
  const [totales, setTotales] = useState(null);
  const [total, setTotal] = useState(0);
  const [messageError, setMessageError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm({ defaultValues: { tipoFecha: 'fechaPrestacionServicio' } });

  const onBuscar = useCallback(async (data) => {
    console.log('onBuscar', new Date());

    const resQuery = await axios.post(Utils.BASE_PATH + 'api/reporte-pagos', data);
    const response = resQuery?.data;
    console.log('response', response, resQuery);

    setDataPrestador({ nit: response?.nit });
    setTotales(response?.totales);
    setTotal(response?.total ?? 0);

    setShowResults(true);

    if (response?.total <= 100) {
      setData(response?.data ?? []);
    }
  }, []);

  const onSubmit = useCallback(async (data) => {
    console.log('data', data);
    setMessageError(null);
    if (!data.comprobante || data.comprobante === '') {
      if (
        (!data.fechaInicial || data.fechaInicial === '') &&
        (!data.fechaFinal || data.fechaFinal === '')
      ) {
        setMessageError(
          'Debe ingresar al menos un criterio de búsqueda: (Fecha Inicial, Fecha Final) o (Comprobante de anticipo)',
        );
        return;
      }
    }

    const fechaInicial = data.fechaInicial;
    const fechaFinal = data.fechaFinal;

    if (fechaInicial && !fechaFinal) {
      setMessageError('Debe ingresar la Fecha Final');
      return;
    }

    if (!fechaInicial && fechaFinal) {
      setMessageError('Debe ingresar la Fecha Inicial');
      return;
    }

    if (fechaInicial && fechaFinal) {
      if (new Date(fechaInicial) > new Date(fechaFinal)) {
        setMessageError('La Fecha Inicial no puede ser mayor a la Fecha Final');
        return;
      }

      //la diferencia en dias de la fecha inicial a la fecha final no puede ser mayor a 7 dias
      const diff = getDifferenceInDays(fechaInicial, fechaFinal);
      console.log('diff', diff);
      if (diff > 7) {
        setMessageError('El rango de fechas no puede ser mayor a 7 días');
        return;
      }
    }
    onBuscar(data);
  }, []);

  const fechaInicio = watch('fechaInicial');
  const fechaFin = watch('fechaFinal');

  console.log('data', data);

  return (
    <div className='flex w-full flex-col '>
      <div className='flex flex-col items-center gap-8'>
        <div className='flex flex-col gap-2'>
          <div className='text-xl font-semibold'>RELACION PAGOS</div>
        </div>
        <div className='w-full max-w-6xl ring-1 ring-gray-200'>
          <div className='bg-gray-200'>BUSQUEDA</div>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2 bg-white p-4'>
            <div className='mt-4 grid grid-cols-3 gap-8'>
              <div className='flex flex-col'>
                <fieldset className='flex flex-col'>
                  <div class='flex flex-col gap-2'>
                    <div class='flex h-9 items-center'>
                      <Controller
                        name='tipoFecha'
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            checked={true}
                            type='radio'
                            value='fechaPagos'
                            class='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                          />
                        )}
                      />
                      <label for='sms' class='ml-3 block leading-6 text-gray-900'>
                        Fecha Pagos
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div>
                <div className='flex flex-col gap-2'>
                  <div className='grid grid-cols-2 items-center items-baseline justify-center gap-2 align-middle'>
                    <label for='email' class='block leading-6 text-gray-900'>
                      Fecha Inicial
                    </label>
                    <div>
                      <input
                        {...register('fechaInicial', { required: false })}
                        type='date'
                        id='fechainicial'
                        class='block  w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 items-baseline justify-center gap-2 align-middle'>
                    <label for='email' class='block leading-6 text-gray-900'>
                      Fecha Final
                    </label>
                    <div>
                      <input
                        type='date'
                        {...register('fechaFinal', { required: false })}
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
                      Comprobante de anticipo
                    </label>
                    <div>
                      <input
                        {...register('comprobante', { required: false })}
                        type='text'
                        class='block  w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {messageError ? (
              <div className='flex w-full flex-row justify-end'>
                <div className='text-red-500'>{messageError}</div>
              </div>
            ) : null}
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
            <div className='w-full max-w-6xl'>
              <div className='grid grid-cols-2'>
                <div className='flex flex-col gap-1'>
                  <div>
                    <span className='font-medium'>RELACION PAGOS</span>
                  </div>
                  <div>
                    <span className='font-medium'>
                      De {fechaInicio ?? ''} a {fechaFin ?? ''}
                    </span>
                  </div>
                  <div>
                    <span className='font-medium'>{prestador?.nit ?? ''}</span>
                  </div>
                </div>
                <div className='flex flex-col justify-end'>
                  <div className='flex ring-1 ring-gray-200'>
                    <div className='flex-grow bg-sky-200 px-2 font-medium'>T. Valor Debito</div>
                    <div className='p-2'>{totales?.totalValorDebito ?? ''}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full'>
              <div>
                <div class='mt-8 flow-root'>
                  {total > 100 ? (
                    <>
                      <div>
                        <span>
                          Informamos que la busqueda tiene m&aacute;s de 100 registros, est&aacute;
                          generando {total} registros. Para consultar la totalidad de la información
                          genere la Descarga.
                        </span>
                        {renderDescargar(watch, false)}
                      </div>
                    </>
                  ) : (
                    <>
                      <Table columns={COLUMNS} data={data} />
                      <div>
                        <div className='pb-4 pt-4'>
                          <span>
                            Tener en cuenta que se generaron {total}, en pantalla solo podrá
                            visualizar 100 registros. Para consultar la totalidad de la información
                            genere la Descarga.
                          </span>
                        </div>
                        <div>{renderDescargar(watch, false)}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
