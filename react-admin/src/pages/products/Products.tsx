import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Product } from '../../models/product';
import Layout from '../../components/Layout';
import {Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination, Button } from '@material-ui/core';
import { ToggleButtonGroup } from '@material-ui/lab';
function Products() {
  const perPage = 10;
  const [page, setPage] = useState(0)
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    (
      async () => {
        const { data } = await axios.get("products")
        setProducts(data);
      }
    )();
  }, []);

  const onDelete = async (id: number) => {
    if(window.confirm('Are you sure?')) {
      await axios.delete(`products/${id}`);
      setProducts(products.filter(product => product.id !== id))
    }
  }

  return (
    <Layout>
      <div className="pt-3 pb-2 mb-3 border-bottom">
        <Button href={'/products/create'} variant="contained" color="primary">Add</Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
            products.slice(page * perPage, page + 1 * perPage).map(product => <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell><img src={product.image} width="50" alt="Product" /></TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>
                <ToggleButtonGroup>
                  <Button variant="contained" color="primary" href={`/products/${product.id}/edit`}>Edit</Button>
                  <Button variant="contained" color="secondary" onClick={e => onDelete(product.id)}>Delete</Button>
                </ToggleButtonGroup>
              </TableCell>
            </TableRow>)
          }
        </TableBody>
        <TableFooter>
          <TablePagination 
            count={products.length} 
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

export default Products
