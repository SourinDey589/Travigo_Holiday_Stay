import React, { useState, useEffect } from 'react';
import CommonSection from '../shared/CommonSection';

import '../styles/holidayPackage.css';
import TourCard from './../shared/TourCard';
import SearchBar from './../shared/SearchBar';
import Newsletter from './../shared/Newsletter';
import { Container, Row, Col } from 'reactstrap';

import { BASE_URL } from '../utils/config';
import axios from 'axios';

const HolidayPackages = () => {
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [tours, setTours] = useState([]);
  const [toursCounts, setToursCounts] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTours = async () => {
      try {
        const allTours = await axios.get(`${BASE_URL}/Tour/View?page=${page}`);
          setTours(allTours.data.tour);

        const getCount = await axios.get(`${BASE_URL}/Search/getTourCount`);
          setToursCounts(getCount.data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false); 
      }
    };

    fetchAllTours();
  }, [page]); 

  useEffect(() => {
    const pages = Math.ceil(toursCounts / 8);
    setPageCount(pages);
    window.scrollTo(0, 0);
  }, [ toursCounts, tours ]); 

  if (loading) return <h4>Loading.....</h4>;
  if (error) return <h4>Error: {error}</h4>;

  return (
    <>
      <CommonSection title={"All Holiday Packages"} />
      <section>
        <Container>
          <Row>
            <SearchBar />
          </Row>
        </Container>
      </section>
      <section className='pt-0'>
        <Container>
          <Row>
            {
              tours.map(tour => (
                <Col lg='3' md='6' sm='6' className='mb-4' key={tour.id}>
                  <TourCard tour={tour} />
                </Col>
              ))
            }
            <Col lg='12'>
              <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                {[...Array(pageCount).keys()].map(number => (
                  <span key={number} onClick={() => setPage(number)}
                    className={page === number ? "active__page" : ""}>
                    {number + 1}
                  </span>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  );
}

export default HolidayPackages;
