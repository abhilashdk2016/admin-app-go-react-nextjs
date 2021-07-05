import axios from 'axios'
import React, { Dispatch } from 'react'
import { connect } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import { User } from '../models/user';
import { setUser } from '../redux/actions/setuserAction';

function Nav(props: any) {
  const logout = async () => { 
    await axios.post('logout');
    props.setUser(null);
  }
  
  let menu;
  if(props.user?.id) {
    menu = (
      <div className="text-end">
          <Link to={'/stats'} className="btn btn-outline-light me-2">Stats</Link>
          <Link to={'/Rankings'} className="btn btn-outline-light me-2">Rankings</Link>
          <Link to={'/login'} className="btn btn-outline-light me-2" 
            onClick = { logout }
          > Logout</Link>
          <Link to={'/profile'} className="btn btn-warning">{props.user.first_name} {props.user.last_name}</Link>
        </div>
    )
  } else {
    menu = (
      <div className="text-end">
        <Link to={'/login'} className="btn btn-outline-light me-2">Login</Link>
        <Link to={'/register'} className="btn btn-warning">Sign-up</Link>
      </div>
    )
  }
  return (
    <header className="p-3 bg-dark text-white">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">

          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li><NavLink to={'/'} href="#" className="nav-link px-2 link-secondary" activeClassName='text-white' exact>Frontend</NavLink></li>
            <li><NavLink to={'/backend'} href="#" className="nav-link px-2 link-secondary" activeClassName='text-white'>Backend</NavLink></li>
          </ul>

          {menu}
          
        </div>
      </div>
    </header>
  )
}

const mapStateToProps = (state: {user: User}) => ({
  user: state.user
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setUser: (user: User) => dispatch(setUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
