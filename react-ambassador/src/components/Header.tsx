import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { User } from '../models/user';

function Header(props: { user: User | null }) {
  const [title, setTitle] = useState('Welcome')
  const [description, setDescription] = useState('Share Links to earn money');

  useEffect(() => {
    if(props.user?.id) {
      setTitle(`$${props.user.revenue}`)
      setDescription('You have earned this far');
    } else {
      setTitle(`Welcome`)
      setDescription('Share Links to earn money');
    }
  }, [props.user?.id, props.user?.revenue]);

  let buttons;

  if(!props.user?.id) {
    buttons = (
      <p>
        <Link to={'/login'} href="#" className="btn btn-primary my-2">Login</Link>
        <Link to={'/register'} href="#" className="btn btn-secondary my-2">Register</Link>
      </p>
    )
  }

  return (
    <section className="py-5 text-center container">
      <div className="row py-lg-5">
        <div className="col-lg-6 col-md-8 mx-auto">
          <h1 className="fw-light">{title}</h1>
          <p className="lead text-muted">{description}</p>
          {buttons}
        </div>
      </div>
    </section>
  )
}

const mapStateToProps = (state: {user: User}) => ({
  user: state.user
})

export default connect(mapStateToProps)(Header);
