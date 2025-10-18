import React, { useState, useContext } from 'react';
import './booking.css';
import { Form, FormGroup, ListGroup, ListGroupItem, Button, Label } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';
import axios from 'axios';

const Booking = ({ tour, avgRating }) => {
    const { currentPrice, reviews, title } = tour;
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [booking, setBooking] = useState({
        userId: user && user._id,
        userEmail: user && user.email,
        tourName: title,
        fullName: '',
        phone: '',
        adult: 1,
        child: false,
        childDOB: '', // Local field for calculating child price
        bookAt: '',
        totalAmount: 0,
    });

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setBooking((prev) => ({
            ...prev,
            [id]: type === 'checkbox' || type === 'radio' ? checked : value,
        }));
    };

    const calculateChildPrice = () => {
        if (!booking.childDOB) return 0;

        const birthDate = new Date(booking.childDOB);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1;
        }

        if (age <= 10) return 0; // No charge for children ≤ 10 years
        if (age > 10 && age < 18) return currentPrice / 2; // Half the adult price
        return currentPrice; // Full adult price for ≥ 18 years
    };

    const serviceFee = 100;

    const handleClick = async (e) => {
        e.preventDefault();

        if (!user) {
            return alert('Please Sign In');
        }

        // Validate booking date
        const selectedDate = new Date(booking.bookAt);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison

        if (selectedDate < today) {
            return alert('You cannot book a tour for a past date. Please select a valid date.');
        }

        const childPrice = booking.child ? calculateChildPrice() : 0;
        const totalAmount =
            Number(currentPrice) * Number(booking.adult) +
            Number(serviceFee) * Number(booking.adult) +
            childPrice;

        const bookingWithTotal = {
            ...booking,
            totalAmount: totalAmount,
        };

        delete bookingWithTotal.childDOB; // Exclude childDOB before sending to the backend

        try {
            const res = await axios.post(`${BASE_URL}/Booking/Add`, bookingWithTotal, {
                withCredentials: true,
            });

            if (res.status === 201) {
                navigate('/thank-you');
            } else {
                alert(res.data.message || 'Booking failed. Please try again.');
            }
        } catch (error) {
            alert(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="booking">
            <div className="booking__top d-flex align-items-center justify-content-between">
                <h3>
                    ${currentPrice}
                    <span>/per person</span>
                </h3>
                <span className="tour__rating d-flex align-items-center">
                    <i className="ri-star-fill"></i>
                    {avgRating === 0 ? null : avgRating} ({reviews?.length})
                </span>
            </div>

            {/* Booking Form */}
            <div className="booking__form">
                <h5>Information</h5>
                <Form className="booking__info-form" onSubmit={handleClick}>
                    <FormGroup>
                        <input
                            type="text"
                            placeholder="Full Name"
                            id="fullName"
                            required
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <input
                            type="number"
                            placeholder="Phone"
                            id="phone"
                            required
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup className="d-flex align-items-center gap-3">
                        <input type="date" id="bookAt" required onChange={handleChange} />
                        <input
                            type="number"
                            placeholder="Adults"
                            id="adult"
                            min="1"
                            required
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <div className="inline-input-label">
                            <input
                                type="radio"
                                id="child"
                                name="childSelection"
                                checked={booking.child}
                                onChange={handleChange}
                            />
                            <Label for="child">Booking with Child</Label>
                            {booking.child && (
                                <Button
                                    close
                                    aria-label="Cancel"
                                    onClick={() => {
                                        setBooking((prev) => ({
                                            ...prev,
                                            child: false,
                                            childDOB: '', // Reset child DOB field
                                        }));
                                    }}
                                />
                            )}
                        </div>
                    </FormGroup>
                    {booking.child && (
                        <FormGroup>
                            <Label>
                                Select Child's DOB:
                                <input
                                    type="date"
                                    id="childDOB"
                                    required
                                    onChange={handleChange}
                                />
                            </Label>
                        </FormGroup>
                    )}
                </Form>
            </div>

            {/* Booking Summary */}
            <div className="booking__bottom">
                <ListGroup>
                    <ListGroupItem className="border-0 px-0">
                        <h5 className="d-flex align-items-center gap-1">
                            ${currentPrice} <i className="ri-close-line"></i> {booking.adult} adult(s)
                        </h5>
                        <span>${currentPrice * booking.adult}</span>
                    </ListGroupItem>
                    <ListGroupItem className="border-0 px-0">
                        <h5>Service Charge for Adults</h5>
                        <span>${serviceFee * booking.adult}</span>
                    </ListGroupItem>
                    {booking.child && (
                        <ListGroupItem className="border-0 px-0">
                            <h5>Child Price</h5>
                            <span>${calculateChildPrice()}</span>
                        </ListGroupItem>
                    )}
                    <ListGroupItem className="border-0 px-0 total">
                        <h5>Total</h5>
                        <span>
                            $
                            {currentPrice * booking.adult +
                                serviceFee * booking.adult +
                                (booking.child ? calculateChildPrice() : 0)}
                        </span>
                    </ListGroupItem>
                </ListGroup>

                <Button className="btn primary__btn w-100 mt-4" onClick={handleClick}>
                    Book Now
                </Button>
            </div>
        </div>
    );
};

export default Booking;