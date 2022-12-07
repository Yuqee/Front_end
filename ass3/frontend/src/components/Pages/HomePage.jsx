import React from 'react';
import PropTypes from 'prop-types';
import HousingCard from '../UI/HousingCard';

const HomePage = (props) => {
  return (
    <>
      {props.listings.map((list) => {
        return (
        <HousingCard
          key={list.id}
          listing={list.listing}
          id={Number(list.id)}
          token={props.token}
          isHostedPage={false}
          ></HousingCard>);
      })}
    </>
  );
}

HomePage.propTypes = {
  listings: PropTypes.array,
  token: PropTypes.string,
};

export default HomePage;
