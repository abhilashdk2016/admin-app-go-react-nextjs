import axios from 'axios';
import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout';
import { User } from '../models/user';
import {Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination, Button } from '@material-ui/core';
function Users() {
  const perPage = 10;
  const [users, setUsers] = useState<User[]>([])
  const [page, setPage] = useState(0)
  const getAmbassadors = async () => {
    const { data } = await axios.get('ambassadors');
    setUsers(data);
  }
  useEffect(() => {
    getAmbassadors();
  }, [])
  return (
    <Layout>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            users.slice(page * perPage, page + 1 * perPage).map(user => <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.first_name} {user.last_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary" href={`users/${user.id}/links`}>View</Button>
              </TableCell>
            </TableRow>)
          }
          
        </TableBody>
        <TableFooter>
          <TablePagination 
            count={users.length} 
            onChangePage={(e, newPage) => setPage(newPage)} 
            page={page} 
            rowsPerPage={perPage}
            rowsPerPageOptions={[]}
            />
        </TableFooter>
      </Table>
    </Layout>
  )
}

export default Users;
