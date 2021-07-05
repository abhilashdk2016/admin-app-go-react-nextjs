import React, { useEffect, Dispatch } from 'react';
import axios from 'axios';
import Nav from './Nav';
import Header from './Header';
import { User } from '../models/user';
import { connect } from 'react-redux';
import { setUser } from '../redux/actions/setuserAction';
import { useLocation } from 'react-router-dom';

function Layout(props: any) {
  const location = useLocation();
  useEffect(() => {
    (
      async () => {
        try {
          const response = await axios.get("user");
          props.setUser(response.data);
        } catch(e) {
          console.log(e);
        }
      }
    )();
  }, []);

  let header;
  if(location.pathname === '/' || location.pathname === '/backend') {
    header = <Header />
  } else {
    header = null;
  }

  return (
    <div>
      <Nav />

      <main>
        {header}
        <div className="album py-5 bg-light">
          <div className="container">

            {props.children}
          </div>
        </div>

      </main>
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
