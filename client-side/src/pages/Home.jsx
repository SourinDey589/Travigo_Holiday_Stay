import React, { useState, useEffect } from 'react';
import './../styles/home.css';

import { Container, Row, Col } from 'reactstrap';
import slideImg01 from '../assets/slideshow-image1.jpg';
import slideImg02 from '../assets/slideshow-image2.jpg';
import slideImg03 from '../assets/slideshow-image3.jpg';
import slideImg04 from '../assets/slideshow-image4.jpg';
import slideImg05 from '../assets/slideshow-image5.jpg';
import experienceImg from '../assets/experience.png';

import Subtitle from '../shared/Subtitle';
import SearchBar from '../shared/SearchBar';
import ServiceList from '../services/ServiceList';
import FeaturedTourList from '../components/Featured-tours/FeaturedTourList';
import MasonryImagesGallery from '../components/Image-gallery/MasonryImagesGallery';
import Newsletter from '../shared/Newsletter';

const slides = [
  { image: slideImg01, title: 'Palolem Beach, Goa', description: 'Experience the serene beauty of Palolem Beach, a tropical paradise known for its golden sands and tranquil waters.' },
  { image: slideImg02, title: 'Kerala Backwaters', description: 'Discover the enchanting Kerala Backwaters, a network of serene canals and lagoons surrounded by lush greenery.' },
  { image: slideImg03, title: 'Darjeeling, West Bengal', description: 'Unwind in the picturesque town of Darjeeling, famous for its tea gardens, panoramic views, and the majestic Himalayas.' },
  { image: slideImg04, title: 'Jammu and Kashmir', description: 'Immerse yourself in the breathtaking beauty of Jammu and Kashmir, a region renowned for its enchanting valleys and serene lakes.' },
  { image: slideImg05, title: 'Nubra Valley, Ladakh', description: 'Explore the majestic landscapes of Nubra Valley, a hidden gem in Ladakh with stunning sand dunes and mountain vistas.' },
];

const intervalTime = 10000; // Time in milliseconds

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(nextImage, intervalTime);
    return () => clearInterval(interval);
  }, [currentImageIndex]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const { image, title, description } = slides[currentImageIndex];

  return (
    <>
      <div className="slideshow__container">
        <Container>
          <div className="slideshow">
            <div className="slideshow__content">
              <div className="slideshow__image-box">
                <img src={image} alt="Slideshow" />
                <div className="slideshow__info">
                  <h2 className="slideshow__title">{title}</h2>
                  <p className="slideshow__description">{description}</p>
                </div>
              </div>
              <button className="slideshow__button slideshow__button--prev" onClick={prevImage}>
                ‹
              </button>
              <button className="slideshow__button slideshow__button--next" onClick={nextImage}>
                ›
              </button>
              <div className="slideshow__indicators">
                {slides.map((_, index) => (
                  <span
                    key={index}
                    className={`slideshow__indicator ${
                      currentImageIndex === index ? 'active' : ''
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
            <SearchBar />
          </div>
        </Container>
      </div>

      <section>
        <Container>
          <Row>
            <Col lg="3">
              <h5 className="services__subtitle">What we serve</h5>
              <h2 className="services__title">We offer our best services</h2>
            </Col>
            <ServiceList />
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <Subtitle subtitle={'Explore'} />
              <h2 className="featured__tour-title">Our featured tours</h2>
            </Col>
            <FeaturedTourList />
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="6">
              <div className="experience__img">
                <img src={experienceImg} alt="" />
              </div>
            </Col>
            <Col lg="6">
              <div className="experience__content">
                <Subtitle subtitle={"Experience"} />
                <h2>With our experience, we will serve you</h2>
                <p>
                Travel is more than just a destination; it's about the stories you collect. Our proven experience makes sure those stories start with stress-free planning. <br />
                  Cupiditate ipsam eveniet architecto inventore unde.
                </p>
              </div>

              <div className="counter__wrapper d-flex align-items-center gap-5">
                <div className="counter__box">
                  <span>12k+</span>
                  <h6>Successful Trips</h6>
                </div>
                <div className="counter__box">
                  <span>2k+</span>
                  <h6>Regular clients</h6>
                </div>
                <div className="counter__box">
                  <span>15</span>
                  <h6>Years of experience</h6>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={"Gallery"} />
              <h2 className="gallery__title">Visit our customers' tour gallery</h2>
            </Col>
            <Col lg="12">
              <MasonryImagesGallery />
            </Col>
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default Home;