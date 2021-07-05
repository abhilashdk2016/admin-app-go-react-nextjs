import React from 'react'
import { Redirect } from 'react-router-dom'

function RedirectToUser() {
  return (
    <Redirect to="/users" />
  )
}

export default RedirectToUser
