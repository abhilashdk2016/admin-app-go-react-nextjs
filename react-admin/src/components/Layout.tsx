import React, { useEffect } from 'react'
import Menu from './Menu'
import axios from 'axios'
export default function Layout(props: any) {
  const getUser = async () => {
    const response = await axios.get("user");
    console.log(response);
  }
  useEffect(() => {
    getUser();
  }, [])
  return (
    <div className="container-fluid">
      <div className="row">
        <Menu />

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <h2>Section title</h2>
          <div className="table-responsive">
            {props.children}
          </div>
        </main>
      </div>
    </div>

  )
}
