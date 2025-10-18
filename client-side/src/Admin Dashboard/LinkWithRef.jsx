import React from 'react';
import PropTypes from 'prop-types';

const LinkWithRef = ({ button }) => {
  return (
    <a href="#" className={button === "true" ? "button-class" : "non-button-class"}>
      {button === "true" ? "Button Text" : "Link Text"}
    </a>
  );
};

LinkWithRef.propTypes = {
  button: PropTypes.string.isRequired,
};

export default LinkWithRef;
