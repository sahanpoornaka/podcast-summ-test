import React from 'react';
import { useTable, useFilters, useSortBy, useRowSelect } from 'react-table';
import { Table} from 'reactstrap';
import { Checkbox } from './Checkbox';
import { Filter, DefaultColumnFilter } from './filters';

const TableContainer = ({ columns, data, setSelectColData }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
  } = useTable({
    columns,
    data,
    defaultColumn: { Filter: DefaultColumnFilter }
  },
  useFilters,
  useSortBy,
  useRowSelect,
  (hooks) => {
    hooks.visibleColumns.push((columns)=> {
      return [
        {
          id: 'selection',
          Header: ({getToggleAllRowsSelectedProps}) => (
            <Checkbox {...getToggleAllRowsSelectedProps()}/>
          ),
          Cell: ({row}) => (
            <Checkbox {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ]
    })
  }
  );

  //onClick={setSelectColData(selectedFlatRows.map((row) => row.original))}

  const generateSortingIndicator = column => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""
  }


  return (
    // <table {...getTableProps()}>
    <div>
        <Table bordered hover {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>
                <div {...column.getSortByToggleProps()}>
                  {column.render("Header")}
                  {generateSortingIndicator(column)}
                </div>
                <Filter column={column} />
            </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            // <tr {...row.getRowProps()} onClick={() => rowClick(row.original)}>
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
      </Table>
      <pre>
        <code>
          {setSelectColData(selectedFlatRows.map((row) => row.original))}
        </code>
      </pre>

      {/* <pre> */}
        {/* <code>
          {JSON.stringify(
            {
              selectedFlatRows: selectedFlatRows.map((row) => row.original),
            },
            null,
            2
          )}
        </code> */}
        {/* <code>
          {setSelectColData(selectedFlatRows.map((row) => row.original))}
        </code> */}
      {/* </pre> */}
    </div>
    
      
  );
};

export default TableContainer;