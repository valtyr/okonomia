import { NextPage } from 'next';
import React from 'react';
import AlertDialog from '../components/Alert';
import Avatar from '../components/Avatar';
import Table from '../components/Table';
import { useUsersQuery } from '../lib/queries';

const Users: NextPage = () => {
  const { data } = useUsersQuery();

  return (
    <div className="w-full max-w-5xl mx-auto">
      {data && <Table data={data.users} />}
    </div>
  );
};

export default Users;
