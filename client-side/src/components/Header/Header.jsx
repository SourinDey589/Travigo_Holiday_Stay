import React, { useRef, useEffect, useContext } from 'react';
import { Button, Container, Row } from 'reactstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config'; // Adjust the path if necessary

import logo from './../../assets/logo.jpg';
import './header.css';

const nav__links = [
  {
    path: '/home',
    display: 'Home'
  },
  {
    path: '/holidayPackages',
    display: 'Holiday Packages'
  },
  {
    path: '/about',
    display: 'About'
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  useEffect(() => {
    const stickyHeaderFunc = () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add('sticky__header');
      } else {
        headerRef.current.classList.remove('sticky__header');
      }
    };

    window.addEventListener('scroll', stickyHeaderFunc);

    return () => window.removeEventListener('scroll', stickyHeaderFunc);
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle('show__menu');

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between">
            {/* -----------  logo start -------------- */}
            <div className="logo">
              <img src={logo} alt="Logo" />
            </div>
            {/* -----------  logo end -------------- */}
            
            {/* -----------  menu start -------------- */}
            <div className="navigation" ref={menuRef}>
              <ul className="menu d-flex align-items-center gap-5">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink to={item.path} className={(navClass) => (navClass.isActive ? 'active__link' : '')}>
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            {/* -----------  menu end -------------- */}
            
            <div className="nav__right d-flex align-items-center gap-4">
              <div className="nav__btns d-flex align-items-center gap-4">
                {user ? (
                  <>
                    <div className="profile d-flex align-items-center gap-4">
                      <Link to='/my-account'>
                        <img
                          src={user.photo ? `${BASE_URL}${user.photo}` : ''}
                          alt="User"
                          style={{ width: '3rem', height: '3rem', borderRadius: '50%' }}
                        />
                      </Link>
                    </div>
                    <Button className="btn btn-dark" onClick={logout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className='btn primary__btn'>
                      <Link to='/login'>Sign in</Link>
                    </Button>
                  </>
                )}
              </div>
              
              <span className="mobile__menu" onClick={toggleMenu}>
                <i className="ri-menu-line"></i>
              </span>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;