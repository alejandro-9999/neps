import { useCallback } from 'react';

export function Pagination({
  pagesCount = 0,
  currentPage = 0,
  total,
  onPageChange,
  pageStart,
  pageEnd,
}) {
  const onPage = useCallback(
    (page) => {
      console.log('onPage', page);
      onPageChange?.(page);
    },
    [onPageChange],
  );
  console.log('total', total);
  return (
    <div class='flex flex-1 items-center justify-between'>
      <div>
        <p class='text-sm text-gray-700'>
          <span class='font-medium'>{pageStart}</span> - <span class='font-medium'>{pageEnd}</span>{' '}
          de <span class='font-medium'>{total ?? 0}</span> registros
        </p>
      </div>
      {pagesCount > 0 ? (
        <div>
          <nav class='isolate inline-flex -space-x-px rounded-md shadow-sm' aria-label='Pagination'>
            <a
              onClick={() => {
                onPage(Math.max(currentPage - 1, 0));
              }}
              class='relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
            >
              <span class='sr-only'>Previous</span>
              <svg class='h-5 w-5' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
                <path
                  fill-rule='evenodd'
                  d='M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z'
                  clip-rule='evenodd'
                />
              </svg>
            </a>

            {
              //print the pages
              Array.from({ length: pagesCount }, (_, i) => i + 1).map((page) => (
                <a
                  onClick={() => {
                    onPage(page - 1);
                  }}
                  aria-current='page'
                  className={`${currentPage === page - 1 ? 'bg-indigo-600 text-white' : 'text-gray-400 ring-1 ring-inset ring-gray-300'} relative z-10 inline-flex items-center  px-4 py-2 text-sm font-semibold  focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                >
                  {page}
                </a>
              ))
            }

            <a
              onClick={() => {
                onPage(Math.min(currentPage + 1, pagesCount - 1));
              }}
              class='relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
            >
              <span class='sr-only'>Next</span>
              <svg class='h-5 w-5' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
                <path
                  fill-rule='evenodd'
                  d='M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z'
                  clip-rule='evenodd'
                />
              </svg>
            </a>
          </nav>
        </div>
      ) : null}
      <div></div>
    </div>
  );
}
