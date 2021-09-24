import React, {useEffect, useState} from 'react'
import { Navbar, Nav, Container,NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import {logout} from '../actions/userActions'

import  { useHistory } from 'react-router-dom'


function Header() {


    
    const [isLogin, setIsLogin] = useState(false)
    const [name, setName] = useState("")

    const dispatch = useDispatch()

    let history = useHistory();

    const logoutHandler = () => {
        dispatch(logout())
        history.push('/admin')
    }

    useEffect(() => {
      if(localStorage.getItem('userInfo'))
      {
        let obj = JSON.parse(localStorage.getItem('userInfo'))
        let name = obj.message.original.details.name

        setIsLogin(true)
        setName(name)

      }
    }, [])

    return (
    <header>
        <Navbar bg="info" variant="dark" expand="lg" collapseOnSelect className="p-3">
            <Container>
                <Link to={`/`}>
                    <img
                        src="/icon.png"
                        width="200"
                        height="55"
                        className="d-inline-block align-top"
                        alt="Energy Sense Rebate Program"
                    />
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {isLogin ? (
                        <NavDropdown className="text-white"  title={<i className="fa fa-user"></i>} id='username'>
                            <NavDropdown.Item>Hi! {name}</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <LinkContainer to='/change'>
                                <NavDropdown.Item>Change Password</NavDropdown.Item>
                            </LinkContainer>
                            <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                        </NavDropdown>
                        
                    ) : (
                        <Nav className="ms-auto">
                            <h2 className="text-light">Energy Sense Rebate Program</h2>
                        </Nav>
                    )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
    );
}

export default Header
