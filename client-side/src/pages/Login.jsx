import React, { useState, useContext } from 'react'

import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/login.css'

import loginImg from '../assets/images/login.png'
import userIcon from '../assets/images/user.png'

import { AuthContext } from './../context/AuthContext'
import { BASE_URL } from './../utils/config'
import axios from 'axios'

const Login = () => {

  const [ credentials, setCredentials ] = useState({
    email: '',
    password: ''
  });

  const { dispatch } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.id]:e.target.value }))
  };

  const handleClick = async (e) => {
    e.preventDefault();

    dispatch({ type: 'LOGIN_START'});

    try {
      const res = await axios.post(`${BASE_URL}/SignIn`, credentials);

      if (res.data.user) {
        // alert(res.data.message);

        if (res.data.role === 'admin') {
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data.user });
            navigate('/admin');
        } else {
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data.user });
            navigate('/');
        }
      } else {
        throw new Error('User data is missing from the response.');
    }

    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.response?.data?.message || error.message });
      alert(error.response?.data?.message || error.message);
    }
  }

  return (
    <section>
      <Container>
        <Row>
          <Col lg='8' className='m-auto'>
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={loginImg} alt="" />
              </div>

              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="" />
                </div>
                <h2>Login</h2>

                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <input type="email" placeholder='Email' required id='email' onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <input type="password" placeholder='Password' required id='password' onChange={handleChange} />
                  </FormGroup>
                  <Button className="btn secondary__btn auth__btn" type='submit'>
                    Login
                  </Button>
                </Form>
                <p>Don't have an account? <Link to='/register'>Create</Link></p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Login