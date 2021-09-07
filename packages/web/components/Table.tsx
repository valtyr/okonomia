/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import classNames from '../lib/classNames';
import fleirtala from '../lib/fleirtala';

import {
  AvatarIcon,
  CaretDownIcon,
  CaretSortIcon,
  CaretUpIcon,
  DotFilledIcon,
  DotsVerticalIcon,
  IdCardIcon,
  MagicWandIcon,
  MagnifyingGlassIcon,
  Pencil1Icon,
  TrashIcon,
} from '@radix-ui/react-icons';
import {
  useTable,
  useSortBy,
  HeaderGroup,
  useGlobalFilter,
  Column,
} from 'react-table';

import FocusRing from './FocusRing';
import Input from './Input';
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  RightSlot,
} from './DropdownMenu';
import Avatar from './Avatar';
import {
  useDeleteUserMutation,
  useDemoteToMemberMutation,
  usePromoteToAdminMutation,
  User,
} from '../lib/queries';
import AlertDialog from './Alert';

const TH: React.FC<React.HTMLProps<HTMLTableHeaderCellElement>> = ({
  children,
  className,
  ...props
}) => (
  <th
    {...props}
    className={classNames(
      'px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider',
      'select-none',
      className,
    )}
  >
    {children}
  </th>
);

const TD: React.FC<React.HTMLProps<HTMLTableDataCellElement>> = ({
  children,
  className,
  ...props
}) => (
  <td {...props} className={classNames('px-4 py-2', className)}>
    {children}
  </td>
);

const TR: React.FC<React.HTMLProps<HTMLTableRowElement>> = ({
  children,
  className,
  ...props
}) => (
  <tr
    {...props}
    className={classNames('px-4 py-4 whitespace-nowrap', className)}
  >
    {children}
  </tr>
);

const SortIndicator: React.FC<{ column: HeaderGroup<any> }> = ({ column }) => {
  if (!column.isSorted) return <CaretSortIcon className="inline ml-1 mb-0.5" />;
  if (!column.isSortedDesc)
    return <CaretDownIcon className="inline ml-1 mb-0.5" />;
  return <CaretUpIcon className="inline ml-1 mb-0.5" />;
};

const Status: React.FC<{ value: 'waiting' | 'paid' }> = ({ value }) => {
  if (value === 'waiting')
    return (
      <div
        className="rounded-l-full rounded-r-full bg-yellow-200
        border border-yellow-300 text-yellow-600
        text-center text-xs p-1 uppercase"
      >
        Í bið
      </div>
    );

  return (
    <div
      className="rounded-l-full rounded-r-full bg-green-200
      border border-green-300 text-green-600
      text-center text-xs p-1 uppercase"
    >
      Greitt
    </div>
  );
};

const TableActions: React.FC<{ value: User }> = ({ value }) => {
  const deleteUser = useDeleteUserMutation();
  const promoteToAdmin = usePromoteToAdminMutation();
  const demoteToMember = useDemoteToMemberMutation();
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <>
      <AlertDialog
        title="Farðu varlega"
        cancelText="Hætta við"
        confirmText="Eyða meðlim"
        confirmStyle="dangerous"
        description={
          <div>
            <p>
              Þegar þú eyðir notanda missir hann aðgang að skírteinu sínu, ef
              hann hefur ekki þegar sótt það.
            </p>

            <div className="grid grid-cols-[100px,1fr] gap-1 p-4 my-4 bg-gray-100 rounded-md">
              <div className="font-semibold text-gray-500">Nafn:</div>
              <div>{value.name}</div>
              <div className="font-semibold text-gray-500">Netfang:</div>
              <div>{value.email}</div>
            </div>

            <p>Ertu alveg viss?</p>
          </div>
        }
        onClose={() => setAlertOpen(false)}
        onConfirm={() => deleteUser.mutate(value.id)}
        open={alertOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <FocusRing>
            <div className="outline-none select-none rounded-full p-1 -m-1 text-gray-300">
              <DotsVerticalIcon />
            </div>
          </FocusRing>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuArrow />
          <DropdownMenuItem
            onSelect={() => {
              console.log('ID');
              window?.open(`/api/user/pass/${value.id}`, '_blank')?.focus();
            }}
          >
            Sækja skírteini
            <RightSlot>
              <IdCardIcon />
            </RightSlot>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={value.isAdmin ? 'admin' : 'member'}
            onValueChange={(role) => {
              if (role === 'admin') promoteToAdmin.mutate(value.id);
              if (role === 'member') demoteToMember.mutate(value.id);
            }}
          >
            <DropdownMenuRadioItem value="member">
              <DropdownMenuItemIndicator>
                <DotFilledIcon />
              </DropdownMenuItemIndicator>
              Meðlimur
              <RightSlot>
                <AvatarIcon />
              </RightSlot>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="admin">
              <DropdownMenuItemIndicator>
                <DotFilledIcon />
              </DropdownMenuItemIndicator>
              Sjórnandi
              <RightSlot>
                <MagicWandIcon />
              </RightSlot>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Breyta notanda
            <RightSlot>
              <Pencil1Icon />
            </RightSlot>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setAlertOpen(true)}>
            Eyða notanda
            <RightSlot>
              <TrashIcon />
            </RightSlot>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const UserAvatar: React.FC<{ value: User }> = ({ value }) =>
  value ? (
    <Avatar name={value.name} imageSrc={`/api/dp/${value.imageKey}`} />
  ) : null;

const Table: React.FC<{
  data: User[];
}> = ({ data }) => {
  const columns = React.useMemo<Array<Column<User>>>(
    () => [
      {
        id: 'dp',
        accessor: (user: User) => user,
        Cell: UserAvatar,
        disableGlobalFilter: true,
      },
      { Header: 'Nafn', accessor: 'name' },
      { Header: 'Netfang', accessor: 'email' },
      { Header: 'Símanúmer', accessor: 'phone' },
      { Header: 'Kennitala', accessor: 'kennitala' },
      {
        Header: 'Staða',
        accessor: (item: User) => {
          if (item.hasPaid) return 'paid';
          return 'waiting';
        },
        id: 'state',
        Cell: Status,
      },
      {
        id: 'actions',
        accessor: (user: User) => user,
        Cell: TableActions,
        disableGlobalFilter: true,
      },
    ],
    [],
  );

  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    rows,
    prepareRow,
    setGlobalFilter,
    globalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
  );

  return (
    <div className="space-y-3">
      <header>
        <h2 className="font-medium text-xl">Meðlimir</h2>
        <p className="text-sm text-gray-500 font-light">
          {data.length} {fleirtala(data.length, 'meðlimur', 'meðlimir')}
        </p>
      </header>

      <Input
        className="w-full"
        placeholder="Leit"
        value={globalFilter as string}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setGlobalFilter(e.target.value)
        }
        Icon={MagnifyingGlassIcon}
      />
      <main className="rounded-t-lg border border-gray-100 overflow-x-auto">
        <table
          {...getTableProps()}
          className="w-full divide-y divide-gray-100 text-sm  min-w-[800px] "
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-50">
                {headerGroup.headers.map((column) => (
                  <TH {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    {!(column as any).disableGlobalFilter && (
                      <SortIndicator column={column} />
                    )}
                  </TH>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            {...getTableBodyProps()}
            className="bg-white divide-y divide-gray-100"
          >
            {rows.map((row) => {
              prepareRow(row);
              return (
                <TR {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <TD {...cell.getCellProps()}>{cell.render('Cell')}</TD>
                  ))}
                </TR>
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Table;
