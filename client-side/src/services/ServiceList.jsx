import React from 'react'
import ServiceCard from './ServiceCard'
import { Col } from 'reactstrap'

import weatherImg from '../assets/images/weather.png'
import guideImg from '../assets/images/guide.png'
import customizationImg from '../assets/images/customization.png'

const servicesData = [
    {
        imgUrl: weatherImg,
        title: "Calculate Weather",
        desc: "Never worry about the elements again. We track the sunshine so you don't have to."
    },
    {
        imgUrl: guideImg,
        title: "Best Tour Guide",
        desc: "Unlock hidden gems and authentic experiences only locals know."
    },
    {
        imgUrl: customizationImg,
        title: "Customization",
        desc: "Forget standard packages. Build the itinerary that truly defines your dream vacation."
    },
]

const ServiceList = () => {
  return (
    <>
        { servicesData.map((item, index) => (
            <Col lg='3' md='6' sm='12' className='mb-4' key={index}>
                <ServiceCard item={item} />
            </Col>
        ))}
    </>
  )
}

export default ServiceList