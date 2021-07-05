import axios from 'axios';
import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout';
import { Link } from '../models/link';
import {Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination } from '@material-ui/core';
function Links(props: any) {
  const [links, setlinks] = useState<Link[]>([])
  const perPage = 10;
  const [page, setPage] = useState(0)
  useEffect(() => {
    (
      async () => {
        const { data } = await axios.get(`users/${props.match.params.id}/links`);
        setlinks(data);
      }
    )();
  }, [props.match.params.id])
  return (
    <Layout>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Count</TableCell>
            <TableCell>Revenue</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            links.slice(page * perPage, page + 1 * perPage).map(link => <TableRow key={link.id}>
              <TableCell>{link.id}</TableCell>
              <TableCell>{link.code}</TableCell>
              <TableCell>{link.orders.length}</TableCell>
              <TableCell>{link.orders.reduce((s, o) => s + o.total, 0)}</TableCell>
            </TableRow>)
          }
          
        </TableBody>
        <TableFooter>
          <TablePagination 
            count={links.length} 
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

export default Links
