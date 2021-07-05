import React, { Dispatch, useEffect, useState } from 'react'
import Menu from './Menu'
import axios from 'axios'
import { Redirect } from 'react-router-dom';
import Navigation from './Navigation';
import { User } from '../models/user';
import { connect } from 'react-redux';
import { setUser } from '../redux/actions/setuserAction';

function Layout(props: any) {
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    (
      async () => {
        try {
          const response = await axios.get("user");
          props.setUser(response.data);
        } catch(e) {
          setRedirect(true);
        }
      }
    )();
  }, [props])

  if (redirect) {
    return <Redirect to={'/login'} />
  }

  return (
    <div>
      <Navigation />
      <div className="container-fluid">
        <div className="row">
          <Menu />

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="table-responsive">
              {props.children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state: {user: User}) => ({
  user: state.user
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setUser: (user: User) => dispatch(setUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
