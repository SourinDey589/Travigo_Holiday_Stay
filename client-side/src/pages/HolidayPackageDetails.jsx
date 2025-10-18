import React, { useRef, useState, useEffect, useContext } from 'react'
import '../styles/holidayPackage-details.css'
import { Container, Row, Col, Form, ListGroup } from 'reactstrap'
import { useParams } from 'react-router-dom'
import calculeteAvgRating from './../utils/avgRating'
import Booking from '../components/Booking/Booking'
import Newsletter from '../shared/Newsletter'

import { BASE_URL } from '../utils/config'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const HolidayPackageDetails = () => {
  const { id } = useParams();
  const reviewMsgRef = useRef('');
  const [tourRating, setTourRating] = useState(null);
  const [tour, setTour] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Fetch data from database
  useEffect(() => {
    const fetchTourById = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/Tour/View/${id}`);
        setTour(response.data.holidayPackage); // Updated to access `holidayPackage`
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchTourById();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <h4>Loading.....</h4>;
  if (error) return <h4>Error: {error}</h4>;

  const {
    photo,
    title,
    desc,
    currentPrice, // Updated to use `currentPrice`
    address,
    reviews = [],
    city,
    distance,
    maxGroupSize,
  } = tour;

  const { totalRating, avgRating } = calculeteAvgRating(reviews);

  // Format date
  const options = { day: 'numeric', month: 'long', year: 'numeric' };

  // Submit request to the server
  const submitHandler = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;

    if (!user) {
      return alert('Please Sign In');
    }

    const reviewObj = {
      username: user.username,
      userImg: user.photo ? `${BASE_URL}${user.photo}` : '',
      reviewText,
      rating: tourRating,
    };

    try {
      const res = await axios.post(`${BASE_URL}/Review/Add/${id}`, reviewObj, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg="8">
              <div className="tour__content">
                <img src={photo} alt="" />

                <div className="tour__info">
                  <h2>{title}</h2>

                  <div className="d-flex align-items-center gap-5">
                    <span className="tour__rating d-flex align-items-center gap-1">
                      <i className="ri-star-fill" style={{ color: 'var(--secondary-color)' }}></i>
                      {avgRating ? avgRating : 'Not rated'}
                      {totalRating > 0 && <span>({reviews.length} reviews)</span>}
                    </span>

                    <span>
                      <i className="ri-map-pin-user-fill"></i> {address}
                    </span>
                  </div>

                  <div className="tour__extra-details">
                    <span>
                      <i className="ri-map-pin-2-line"></i> {city}
                    </span>

                    <span>
                      <i className="ri-money-dollar-circle-line"></i> ${currentPrice} /per person
                    </span>
                    <span>
                      <i className="ri-map-pin-time-line"></i> {distance} k/m
                    </span>

                    <span>
                      <i className="ri-group-line"></i> {maxGroupSize} people
                    </span>
                  </div>
                  <h5>Description</h5>
                  <p>{desc}</p>
                </div>

                {/* Tour reviews section */}
                <div className="tour__reviews mt-4">
                  <h4>Reviews ({reviews?.length} reviews)</h4>

                  <Form onSubmit={submitHandler}>
                    <div className="d-flex align-items-center gap-3 mb-4 rating__group">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} onClick={() => setTourRating(i + 1)}>
                          {i + 1} <i className="ri-star-s-fill"></i>
                        </span>
                      ))}
                    </div>

                    <div className="review__input">
                      <input type="text" ref={reviewMsgRef} placeholder="Share your thoughts" required />
                      <button className="btn primary__btn text-white" type="submit">
                        Submit
                      </button>
                    </div>
                  </Form>

                  <ListGroup className="user__reviews">
                    {reviews.map((review) => (
                      <div className="review__item" key={review._id}>
                        <img src={review.userImg} alt={review.username} />

                        <div className="w-100">
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <h5>{review.username}</h5>
                              <p>{new Date(review.createdAt).toLocaleDateString('en-US', options)}</p>
                            </div>
                            <span className="d-flex align-items-center">
                              {review.rating}
                              <i className="ri-star-s-fill"></i>
                            </span>
                          </div>

                          <h6>{review.reviewText}</h6>
                        </div>
                      </div>
                    ))}
                  </ListGroup>
                </div>
              </div>
            </Col>

            <Col lg="4">
              <Booking tour={tour} avgRating={avgRating} />
            </Col>
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default HolidayPackageDetails;