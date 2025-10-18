import React, { useContext, useState } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import './myaccount.css';
import MyBookings from './MyBookings';
import Profile from './Profile';

import { AuthContext } from './../context/AuthContext';
import { BASE_URL } from './../utils/config';
import axios from 'axios';

const MyAccount = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [tab, setTab] = useState('bookings');
  const navigate = useNavigate();

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (confirmed) {
      try {
        await axios.delete(`${BASE_URL}/Users/Delete/${user._id}`);
        dispatch({ type: 'LOGOUT' });
        navigate('/');
      } catch (err) {
        console.error('Failed to delete account:', err.message || err);
      }
    }
  };

  return (
    <section>
      <Container>
        <Row>
          {/* ----------------- Profile details starts ----------------- */}
          <Col lg='3' md='6'>
            <div className="account__wrapper d-flex align-items-center justify-content-between">
              <div className="profile__section p-3 pb-1">
                <div className="profile__image d-flex align-items-center justify-content-between">
                  <img src={user.photo ? `${BASE_URL}${user.photo}` : ''} alt="User" />
                </div>
                <div className="profile__info">
                  <h3>{user.username}</h3>
                  <p>{user.email}</p>
                </div>
                <div className="account__actions">
                  <Button onClick={logout} className="btn btn-dark logout__btn">
                    Logout
                  </Button>
                  <Button onClick={deleteAccount} className="btn primary__btn delete__btn">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </Col>
          {/* ----------------- Profile details ends ----------------- */}

          {/* ----------------- My bookings/profile settings starts ----------------- */}
          <Col lg='6' md='6'>
            <div className="tab__wrapper d-flex align-items-center gap-5">
              <div className='tab__container d-flex align-items-center gap-4'>
                <Button className={`tab__btn ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>
                  My Bookings
                </Button>

                <Button className={`tab__btn ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>
                  Profile Settings
                </Button>
              </div>
            </div>
            {tab === 'bookings' && <MyBookings />}
            {tab === 'settings' && <Profile />}
          </Col>
          {/* ----------------- My bookings/profile settings ends ----------------- */}
        </Row>
      </Container>
    </section>
  );
};

export default MyAccount;