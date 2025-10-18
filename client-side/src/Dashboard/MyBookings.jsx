import React, { useContext, useState, useEffect } from 'react';
import {
  Container,
  Col,
  Row,
  Button,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import { Link } from 'react-router-dom';
import './my-bookings.css';

import calculateAvgRating from '../utils/avgRating';
import { AuthContext } from './../context/AuthContext';
import { BASE_URL } from './../utils/config';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [tours, setTours] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formData, setFormData] = useState({});
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookingById = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/MyBookings/${user._id}`);
        const allBookings = response.data.bookings || [];
        const currentTours = response.data.tours || [];

        // Filter out expired bookings
        const currentDate = new Date();
        const validBookings = [];
        for (const booking of allBookings) {
          if (new Date(booking.bookAt) >= currentDate) {
            validBookings.push(booking);
          } else {
            // Delete outdated booking from the database
            await axios.delete(`${BASE_URL}/Booking/Delete/${booking._id}`);
          }
        }

        setBookings(validBookings);
        setTours(currentTours);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingById();
  }, [user._id]);

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await axios.delete(`${BASE_URL}/Booking/Delete/${bookingId}`);
        setBookings(bookings.filter((booking) => booking._id !== bookingId));
      } catch (err) {
        setError('Failed to delete booking');
      }
    }
  };

  const handleEditClick = async (booking) => {
    try {
      const response = await axios.get(`${BASE_URL}/Booking/View/${booking._id}`);
      setEditingBooking(response.data);
      setFormData(response.data);
      setIsEditing(true);
    } catch (err) {
      setError('Failed to fetch booking details');
    }
  };

  const calculateTotalAmount = (bookingData) => {
    const tour = tours.find((tour) => tour.title === bookingData.tourName);
    const tourPrice = tour ? tour.price : 0;
    const serviceFee = 100;

    const childDiscount = bookingData.child ? tourPrice : 0;

    return (
      tourPrice * Number(bookingData.adult) +
      childDiscount +
      serviceFee * Number(bookingData.adult)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === 'child' ? value === 'true' : value;
    const updatedFormData = { ...formData, [name]: updatedValue };
    updatedFormData.totalAmount = calculateTotalAmount(updatedFormData);
    setFormData(updatedFormData);
  };

  const handleSaveClick = async () => {
    const updatedBooking = { ...formData, totalAmount: calculateTotalAmount(formData) };
    try {
      await axios.put(`${BASE_URL}/Booking/Update/${editingBooking._id}`, updatedBooking);
      setBookings(
        bookings.map((booking) =>
          booking._id === editingBooking._id ? updatedBooking : booking
        )
      );
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update booking');
    }
  };

  const handleCloseModal = () => {
    setIsEditing(false);
  };

  if (loading) return <h4>Loading...</h4>;
  if (error) return <h4>Error: {error}</h4>;

  return (
    <>
      <Container>
        <Row>
          {bookings.length === 0 ? (
            <div className="no-bookings-container d-flex align-items-center justify-content-between gap-5">
              <h2 className="no-bookings-message">
                You did not book any holiday package yet!
              </h2>
            </div>
          ) : (
            bookings.map((booking, index) => {
              const correspondingTour = tours.find(
                (tour) => tour.title === booking.tourName
              );
              return (
                <Col lg="4" md="5" sm="6" xs="12" key={index} className="mb-4">
                  <Card>
                    <div className="tour__img">
                      <img
                        src={correspondingTour?.photo || '/placeholder.jpg'}
                        alt="tour-img"
                      />
                      {correspondingTour?.featured && <span>Featured</span>}
                    </div>
                    <CardBody>
                      <div className="card__top d-flex align-items-center justify-content-between">
                        <span className="tour__location d-flex align-items-center gap-1">
                          <i className="ri-map-pin-line"></i> {correspondingTour.city}
                        </span>
                        <span className="tour__rating d-flex align-items-center gap-1">
                          <i className="ri-star-fill"></i>{' '}
                          {calculateAvgRating(correspondingTour.reviews).avgRating || 'Not rated'}
                          {correspondingTour.reviews.length > 0 && (
                            <span>({correspondingTour.reviews.length})</span>
                          )}
                        </span>
                      </div>
                      <h5 className="tour__title">
                        <Link to={`/holidayPackages/${correspondingTour?._id}`}>
                          {correspondingTour?.title || 'Unknown Tour'}
                        </Link>
                      </h5>
                      <div className="card__bottom d-flex gap-2">
                        <Button className="btn-info" onClick={() => handleEditClick(booking)}>
                          Edit
                        </Button>
                        <Button className="btn-danger" onClick={() => handleDelete(booking._id)}>
                          Delete
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              );
            })
          )}
        </Row>
      </Container>

      <Modal isOpen={isEditing} toggle={handleCloseModal}>
        <ModalHeader toggle={handleCloseModal}>Edit Booking</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <h4 className="tour__name d-flex justify-content-center mb-2">
                {formData.tourName || ''}
              </h4>
            </FormGroup>
            <FormGroup>
              <Label for="fullName">Full Name</Label>
              <Input
                type="text"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="phone">Phone</Label>
              <Input
                type="number"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="bookAt">Date</Label>
              <Input
                type="date"
                name="bookAt"
                value={formData.bookAt ? formData.bookAt.split('T')[0] : ''}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup className="d-flex align-items-center gap-3">
              <Label for="adult">Adults</Label>
              <Input
                type="number"
                name="adult"
                value={formData.adult || 0}
                onChange={handleInputChange}
                min="1"
              />
            </FormGroup>
            <FormGroup className="d-flex align-items-center gap-3">
              <Label>Children</Label>
              <FormGroup check>
                <Label check>
                  <Input
                    type="radio"
                    name="child"
                    value={true}
                    checked={formData.child === true}
                    onChange={handleInputChange}
                  />
                  Yes
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    type="radio"
                    name="child"
                    value={false}
                    checked={formData.child === false}
                    onChange={handleInputChange}
                  />
                  No
                </Label>
              </FormGroup>
            </FormGroup>
            <div className="booking__bottom">
              <ListGroup>
                <ListGroupItem className="border-0 px-0">
                  <div className="d-flex justify-content-between">
                    <h5>
                      {tours.find(tour => tour.title === formData.tourName)?.price || 0}{' '}
                      <i className="ri-close-line"></i> {formData.adult} Adult(s)
                    </h5>
                    <span>
                      $
                      {(tours.find(tour => tour.title === formData.tourName)?.price || 0) *
                        formData.adult}
                    </span>
                  </div>
                </ListGroupItem>
                {formData.child && (
                  <ListGroupItem className="border-0 px-0">
                    <div className="d-flex justify-content-between">
                      <h5>Discount for Children</h5>
                      <span>50% off adult price</span>
                    </div>
                  </ListGroupItem>
                )}
                <ListGroupItem className="border-0 px-0">
                  <div className="d-flex justify-content-between">
                    <h5>Service Fee</h5>
                    <span>$100 x {formData.adult}</span>
                  </div>
                </ListGroupItem>
                <ListGroupItem className="border-0 px-0 total">
                  <div className="d-flex justify-content-between">
                    <h5>Total:</h5>
                    <span>${calculateTotalAmount(formData)}</span>
                  </div>
                </ListGroupItem>
              </ListGroup>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSaveClick}>
            Save
          </Button>{' '}
          <Button className="btn btn-dark" onClick={handleCloseModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default MyBookings;
