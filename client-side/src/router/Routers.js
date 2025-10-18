import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'

import Home from './../pages/Home'
import HolidayPackages from './../pages/HolidayPackages'
import HolidayPackageDetails from './../pages/HolidayPackageDetails'
import Login from '../pages/Login'
import Register from '../pages/Register'
import SearchResultList from './../pages/SearchResultList'
import Admin from'./../pages/Admin'
import ThankYou from '../pages/ThankYou'
import MyAccount from './../Dashboard/MyAccount';
import UsersPanel from './../Admin Dashboard/UsersPanel'
import HolidayPackagesPanel from './../Admin Dashboard/HolidayPackagesPanel'
import BookingsPanel from './../Admin Dashboard/BookingsPanel'
import Dashboard from './../Admin Dashboard/Dashboard'

import { AuthContext } from '../context/AuthContext';

const Routers = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={user?.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/home" />} />
        <Route path='/home' element={ <Home /> } />
        <Route path='/holidayPackages' element={ <HolidayPackages /> } />
        <Route path='/holidayPackages/:id' element={ <HolidayPackageDetails /> } />
        <Route path='/login' element={ <Login /> } />
        <Route path='/register' element={ <Register /> } />
        <Route path='/admin/*' element={ <Admin /> } />
        <Route path='/thank-you' element={ <ThankYou /> } />
        <Route path='/holidayPackages/search' element={ <SearchResultList /> } />
        <Route path='/my-account' element={ <MyAccount /> } />
        <Route path='/admin/dashboard' element={ <Dashboard /> } />
        <Route path='/admin/users' element={ <UsersPanel /> } />
        <Route path='/admin/holiday-packages' element={ <HolidayPackagesPanel /> } />
        <Route path='/admin/bookings' element={ <BookingsPanel /> } />
    </Routes> 
  )
}

export default Routers