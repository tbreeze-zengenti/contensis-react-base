import React from 'react';
import PropTypes from 'prop-types';

import FeaturedEventCardStyled from '../components.styled/FeaturedEventCard.styled';

import formatDate from '../util/formatDate';

const FeaturedEventCard = ({ date, imageAlt, imagePath, title, uri }) => {
  let missingProp = false;
  [date, imageAlt, imagePath, title, uri].map(prop => {
    if (!prop || prop == '') missingProp = true;
  });
  if (missingProp) return null;
  const dateArr = date && formatDate(date, 'dd|MMM').split('|');
  return (
    <FeaturedEventCardStyled href={uri} data-testid="eventCard">
      <img
        className="fecImage"
        data-testid="image"
        alt={imageAlt}
        src={imagePath}
      />
      <div className="fecDate">
        <div className="fecDateInner">
          <span className="fecDateDay" data-testid="dateDay">
            {dateArr[0]}
          </span>
          <span className="fecDateMonth" data-testid="dateMonth">
            {dateArr[1]}
          </span>
        </div>
      </div>
      <h3 className="fecTitle" data-testid="title">
        {title}
      </h3>
    </FeaturedEventCardStyled>
  );
};

FeaturedEventCard.propTypes = {
  date: PropTypes.string,
  imageAlt: PropTypes.string,
  imagePath: PropTypes.string,
  title: PropTypes.string,
  uri: PropTypes.string,
};

export default FeaturedEventCard;
