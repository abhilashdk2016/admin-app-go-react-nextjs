import axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import React, { useEffect } from 'react'
import Layout from '../components/Layout';
import constants from '../constants';

const Success = () => {
  const router = useRouter();
  const { source } = router.query;

  useEffect(() => {
    if (source !== undefined) {
      (
        async () => {
          const { data } = await axios.post(`${constants.endPoint}/orders/confirm`, { source });
        }
      )();
    }
  }, [source]);
  return (
    <Layout>
      <div className="py-5 text-center">
        <h2>Success</h2>
        <p className="lead"> Your purchase has been completed</p>
      </div>
    </Layout>
  )
}

export default Success;
