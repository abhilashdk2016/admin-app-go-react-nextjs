import axios from 'axios';
import React, { Component, SyntheticEvent } from 'react'
import '../Login.css'
import { Redirect } from 'react-router-dom';
export default class Register extends Component {
  firstName = '';
  lastname = '';
  email = '';
  password = '';
  confirmPassword = '';
  state = {
    redirect: false
  }

  submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await axios.post('/register', {
      first_name: this.firstName,
      last_name: this.lastname,
      email: this.email,
      password: this.password,
      password_confirm: this.confirmPassword
    });
    this.setState({
      redirect: true
    })
    
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={'/login'} />
    }

    return (
      <main className="form-signin">
        <form onSubmit={this.submit}>
          <h1 className="h3 mb-3 fw-normal">Please Register</h1>
          <div className="form-floating">
            <input className="form-control" placeholder="First Name"
              onChange={e => this.firstName = e.target.value}
            />
            <label>First Name</label>
          </div>

          <div className="form-floating">
            <input className="form-control" placeholder="Last Name" 
              onChange={e => this.lastname = e.target.value}
            />
            <label>Last Name</label>
          </div>

          <div className="form-floating">
            <input type="email" className="form-control" placeholder="name@example.com" 
              onChange={e => this.email = e.target.value}
            />
            <label>Email address</label>
          </div>
          <div className="form-floating">
            <input type="password" className="form-control" placeholder="Password" 
              onChange={e => this.password = e.target.value}
            />
            <label>Password</label>
          </div>
          <div className="form-floating">
            <input type="password" className="form-control" placeholder="Confirm Password" 
              onChange={e => this.confirmPassword = e.target.value}
            />
            <label>Confirm Password</label>
          </div>

          <button className="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
        </form>
      </main>
    )
  }
}
