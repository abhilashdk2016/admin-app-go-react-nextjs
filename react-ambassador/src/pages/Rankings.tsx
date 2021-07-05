import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

function Rankings() {
  const [rankings, setRankings] = useState([]);
  useEffect(() => {
    (
      async () => {
        const { data } = await axios.get("rankings");
        setRankings(data);
      }
    )();
  }, []);

  return (
    <Layout>
      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {rankings && Object.keys(rankings).map((key: any, index: number) => {
              return (
                <tr key={key}>
                  <td>{index + 1}</td>
                  <td>{key}</td>
                  <td>{rankings[key]}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default Rankings
