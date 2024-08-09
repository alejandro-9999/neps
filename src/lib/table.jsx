import { useCallback, useEffect, useState } from 'react';
import { Pagination } from './pagination';

function renderRow(item, index, columns, options) {
  const dataToRender = [];

  for (const column of columns) {
    if (column.render) {
      dataToRender.push(
        <td class='whitespace-nowrap p-1 text-sm '>{column.render(item, column, options)}</td>,
      );
    } else {
      dataToRender.push(
        <td class='whitespace-nowrap p-1 text-sm '>
          <span>{item[column.field]}</span>
        </td>,
      );
    }
  }

  return <tr class='divide-x divide-gray-200'>{dataToRender.map((item) => item)}</tr>;
}

export function Table({ pageSize = 25, columns = [], data = [], rowRenderer }) {
  const [pagesCount, setPagesCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [dataToRender, setDatatoRender] = useState([]);
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(0);
  useEffect(() => {
    if (!data) {
      return;
    }
    //based in a page size of 25, get the pages count
    const pages = Math.ceil(data.length / pageSize);
    setPagesCount(pages);
    setTotal(data.length);
    onPageChange(0);
  }, [data]);

  const onPageChange = useCallback(
    (page) => {
      if (!data) return;
      console.log('onPageChange', data);
      setPage(page);
      setPageStart(page * pageSize + 1);
      setPageEnd(Math.min((page + 1) * pageSize, data.length));
      setDatatoRender(data?.slice(page * pageSize, (page + 1) * pageSize) ?? []);
    },
    [data, total, pageSize],
  );

  console.log('pagesCount', pagesCount, pageStart, pageEnd);

  return (
    <div class='overflow-x-auto overflow-y-auto'>
      <div class='block min-w-full  align-middle'>
        <table class='min-w-full divide-y divide-gray-300 border border-solid border-gray-200'>
          <thead>
            <tr class='divide-x divide-gray-200'>
              {columns.map((column) => {
                return (
                  <th
                    scope='col'
                    class='py-1 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 '
                  >
                    {column.title}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody class='divide-y divide-gray-200 bg-white'>
            {dataToRender?.map((item, index) => {
              if (rowRenderer) {
                return rowRenderer(item, index, (options) =>
                  renderRow(item, index, columns, options),
                );
              }
              return renderRow(item, index, columns);
            })}
          </tbody>
        </table>
      </div>
      {data.length > 0 ? (
        <div className='mt-2'>
          <Pagination
            pagesCount={pagesCount}
            total={total}
            currentPage={page}
            onPageChange={onPageChange}
            pageStart={pageStart}
            pageEnd={pageEnd}
          />
        </div>
      ) : null}
    </div>
  );
}
