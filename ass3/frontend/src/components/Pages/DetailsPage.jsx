import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log(id);
  console.log(navigate);
  const { listing } = useLocation().state;
  return (
    <>
    title:{ listing.title }
    </>
  );
}

export default DetailsPage;
