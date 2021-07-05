import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout';
import { Order } from '../models/order';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';
import { Accordion, AccordionSummary,AccordionDetails, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    (
      async () => {
        const { data } = await axios.get("orders")
        setOrders(data);
      }
    )();
  }, []);

  return (
    <Layout>
      {orders.map(order => {
        return (
          <Accordion key={order.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {order.name} ${order.total}
            </AccordionSummary>
            <AccordionDetails>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Product Title</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    order.order_items.map(item => {
                      return (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.product_title}</TableCell>
                          <TableCell>{item.price}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        )
      })}
    </Layout>
  )
}

export default Orders