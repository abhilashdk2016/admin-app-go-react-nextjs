import axios from 'axios'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { User } from '../models/user'

function Navigation(props: { user: User | null }) {
  return (
    <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <Link to={'/'} className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">Admin</Link>
        <ul className="my-2 my-md-0 mr-md-3">
          <Link to={'/profile'} href="#" className="p-2 text-white text-decoration-none">{props.user?.first_name} {props.user?.last_name}</Link>
          <Link to={'/login'} href="#" className="p-2 text-white text-decoration-none" 
          onClick={async () => await axios.post('logout')}>Sign Out</Link>
        </ul>
      </header>
  )
}

const mapStateToProps = (state: {user: User}) => ({
  user: state.user
})

export default connect(mapStateToProps)(Navigation);
