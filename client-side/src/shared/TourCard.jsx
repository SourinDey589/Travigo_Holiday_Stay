import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import calculateAvgRating from '../utils/avgRating';

import './tour-card.css';

const TourCard = ({ tour }) => {
  const { _id, title, city, photo, price, seasonalPrice, seasonStart, seasonEnd, featured, reviews } = tour;

  const { totalRating, avgRating } = calculateAvgRating(reviews);

  // Function to check if the current date falls within the session dates
  const isWithinSession = () => {
    const currentDate = new Date();
    const startDate = new Date(seasonStart);
    const endDate = new Date(seasonEnd);
    return currentDate >= startDate && currentDate <= endDate;
  };

  // Determine the displayed price
  const displayedPrice = isWithinSession() ? seasonalPrice : price;

  return (
    <div className="tour__card">
      <Card>
        <div className="tour__img">
          <img src={photo} alt="tour-img" />
          {featured && <span>Featured</span>}
        </div>

        <CardBody>
          <div className="card__top d-flex align-items-center justify-content-between">
            <span className="tour__location d-flex align-items-center gap-1">
              <i className="ri-map-pin-line"></i> {city}
            </span>
            <span className="tour__rating d-flex align-items-center gap-1">
              <i className="ri-star-fill"></i> {avgRating === 0 ? null : avgRating}
              {totalRating === 0 ? (
                "Not rated"
              ) : (
                <span>({reviews.length})</span>
              )}
            </span>
          </div>

          <h5 className="tour__title">
            <Link to={`/holidayPackages/${_id}`}>{title}</Link>
          </h5>

          <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
            <h5>
              ${displayedPrice} <span> /per person</span>
            </h5>

            <button className="btn booking__btn">
              <Link to={`/holidayPackages/${_id}`}>Book Now</Link>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TourCard;