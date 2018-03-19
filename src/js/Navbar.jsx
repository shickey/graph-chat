import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {

  return (
    <div className="navbar">
      <Link to="/">
        <h1>Graph Chat</h1>
      </Link>
    </div>
  )

}

export default Navbar;
