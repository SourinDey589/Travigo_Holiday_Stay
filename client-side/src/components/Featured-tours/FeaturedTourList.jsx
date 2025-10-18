import React, { useState, useEffect } from 'react'
import TourCard from '../../shared/TourCard'
import { Col } from 'reactstrap'

import { BASE_URL } from '../../utils/config';
import axios from 'axios'

const FeaturedTourList = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API using axios
    const fetchFeaturedTours = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/Search/Featured`);
        setData(response.data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTours();
  }, []);

  if (loading) return <h4>Loading.....</h4>;
  if (error) return <h4>Error: {error}</h4>;

  return (
    <>
      {
        data?.map(tour => (
          <Col lg='3' md='6' sm='6' className='mb-4' key={tour._id}>
            <TourCard tour={tour} />
          </Col>
        ))
      }
    </>
  );
}

export default FeaturedTourList;
