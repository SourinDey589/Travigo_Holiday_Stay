import React from 'react';
import './category.css';
import { Col, Row, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    title: "Adventure Travel",
    description: "Explore the wild and the unknown with our adventure travel packages.",
    image: "adventure.jpg",
    path: "/category/adventure"
  },
  {
    title: "Luxury Escapes",
    description: "Experience the ultimate in comfort and style with our luxury travel options.",
    image: "luxury.jpg",
    path: "/category/luxury"
  },
  {
    title: "Family Vacations",
    description: "Fun and safe travel packages for the whole family.",
    image: "family.jpg",
    path: "/category/family"
  },
  {
    title: "Cultural Trips",
    description: "Immerse yourself in the rich culture and history of destinations worldwide.",
    image: "culture.jpg",
    path: "/category/culture"
  },
  {
    title: "Beach Getaways",
    description: "Relax and unwind on some of the world's most beautiful beaches.",
    image: "beach.jpg",
    path: "/category/beach"
  },
  {
    title: "Wildlife Safaris",
    description: "Experience the thrill of seeing wildlife in their natural habitats.",
    image: "wildlife.jpg",
    path: "/category/wildlife"
  },
];

const Category = () => {
  const navigate = useNavigate();

  return (
    <div className="category__container">
      <h2>Explore by Category</h2>
      <Row>
        {categories.map((category, index) => (
          <Col lg="4" md="6" key={index} className="mb-4">
            <Card className="category__card" onClick={() => navigate(category.path)}>
              <img src={category.image} alt={category.title} className="category__image" />
              <CardBody>
                <CardTitle tag="h5">{category.title}</CardTitle>
                <CardText>{category.description}</CardText>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Category;
