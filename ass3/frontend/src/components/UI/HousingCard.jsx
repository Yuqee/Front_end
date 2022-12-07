import { Card, CardHeader, CardMedia, CardContent, Rating, Tooltip, Modal, Button, Box, Typography, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import DetailsIcon from '@mui/icons-material/Details';
import BedIcon from '@mui/icons-material/Bed';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Popup from './Popup';

const HousingCard = (props) => {
  const [openModal, setOpenModal] = useState(false);
  const openModalHandler = () => {
    setOpenModal(true);
  }
  const closeModalHandler = () => {
    setOpenModal(false);
  }

  const [openPopup, setOpenPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const onClosePopupHandler = () => {
    setOpenPopup(false);
  }

  const PublishListing = async (args) => {
    const response = await fetch(`http://localhost:5005/listings/publish/${props.id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${props.token}`,
        listingid: `listingid - ${props.id}`,
      },
      body: JSON.stringify(args),
    });
    const data = await response.json();
    if (data.error) {
      setOpenPopup(true);
      setErrorMsg(data.error);
    } else {
      setOpenModal(false);
      setNewAvail('');
      const temp = {
        listing: props.listing,
        id: props.id,
      }
      props.onPublish(temp);
      console.log(temp);
    }
  }

  const PubishListingHandler = () => {
    const availArray = newAvai.split(',');
    for (let i = 0; i < availArray.length; i++) {
      availList.push(availArray[i]);
    }
    PublishListing({
      availability: availList,
    });
  }

  const [newAvai, setNewAvail] = useState('');
  const availList = props.listing.availability;

  // Temp rating
  const ratingValue = props.listing.reviews.length;

  return (
    <>
      <Card sx={{ margin: '2vh 2vw' }}>
        <CardHeader
          title={
            <span style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <h3 style={{
                margin: '0 0',
                display: 'inline',
              }}>${props.listing.price}
              </h3>
              { props.isHostedPage &&
              <span>
                <Link
                  to={'listings/edit'}
                  state={{
                    listing: {
                      title: props.listing.title,
                      street: props.listing.address.street,
                      city: props.listing.address.city,
                      zip: props.listing.address.zip,
                      countryORregion: props.listing.address.countryORregion,
                      thumbnail: props.listing.thumbnail,
                      price: props.listing.price,
                      type: props.listing.metadata.property_type,
                      beds: props.listing.metadata.beds,
                      bedrooms: props.listing.metadata.bedrooms,
                      amenities: props.listing.metadata.amenities,
                      id: props.id,
                      token: props.token,
                    },
                  }}
                  style={{
                    textDecoration: 'none',
                    color: 'black'
                  }}
                  >
                  <Tooltip
                    title='Edit this listing'>
                    <EditIcon sx={{
                      '&:hover': {
                        cursor: 'pointer',
                        color: '#1976d2',
                      },
                    }}/>
                  </Tooltip>
                </Link>
                <Tooltip
                  title='Publish this listing'>
                  <PublishIcon
                  sx={{
                    '&:hover': {
                      cursor: 'pointer',
                      color: '#1976d2',
                    },
                  }}
                  onClick={openModalHandler}/>
                </Tooltip>
              </span>}
              { !props.isHostedPage &&
              <span>
                <Link
                  to={`listing/:${props.id}`}
                  state={{
                    listing: {
                      title: props.listing.title,
                      street: props.listing.address.street,
                      city: props.listing.address.city,
                      zip: props.listing.address.zip,
                      countryORregion: props.listing.address.countryORregion,
                      thumbnail: props.listing.thumbnail,
                      price: props.listing.price,
                      type: props.listing.metadata.property_type,
                      beds: props.listing.metadata.beds,
                      bedrooms: props.listing.metadata.bedrooms,
                      amenities: props.listing.metadata.amenities,
                      id: props.id,
                      token: props.token,
                    },
                  }}
                  style={{
                    textDecoration: 'none',
                    color: 'black'
                  }}
                  >
                  <Tooltip
                    title='Details of this listing'>
                    <DetailsIcon sx={{
                      '&:hover': {
                        cursor: 'pointer',
                        color: '#1976d2',
                      },
                    }}/>
                  </Tooltip>
                </Link>
              </span>}
            </span>
        }
          subheader={
            <>
              <h4 style={{ margin: '0 0' }}>{props.listing.title}</h4>
              <h5 style={{ margin: '0 0' }}>{props.listing.ptype}</h5>
            </>}
        />
        <CardMedia
          component="img"
          height="190"
          src={props.listing.thumbnail}
          alt={props.listing.title}
        />
        <CardContent>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
            }}>
              <BedIcon
                sx={{
                  display: {
                    xs: 'none',
                    sm: 'flex'
                  },
                }}/>
              {props.listing.metadata.beds} beds
            </span>
            <span style={{
              display: 'flex',
              alignItems: 'center',
            }}>
              <BedroomParentIcon
                sx={{
                  display: {
                    xs: 'none',
                    sm: 'flex'
                  },
                }}/>
              {props.listing.metadata.bedrooms} bedrooms
            </span>
            <Rating
              name="read-only"
              value={ratingValue}
              size='small'
            />
            <span>{props.listing.reviews.length} Reviews</span>
          </div>
        </CardContent>
      </Card>
      <Modal
        open={openModal}
        onClose={closeModalHandler}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          width={380}
          height={150}
          bgcolor='white'
          p={3}
          borderRadius={5}>
          <Typography
            variant='h6'
            color='gray'
            textAlign='center'>
            Add Availability to publish this listing
          </Typography>
          <TextField
            placeholder='eg:startdate1,enddate1, format:yyyy-mm-dd'
            label="Availability"
            variant="standard"
            value= {newAvai}
            onChange={(event) => { setNewAvail(event.target.value); }}
            sx={{
              width: '100%',
              margin: '5% 0',
            }}/>
            <Button
              onClick={PubishListingHandler}
              sx={{
                width: '80%',
                margin: '3% 10%',
              }}>Publish</Button>
        </Box>
      </Modal>
      <Popup
        open={openPopup}
        title={'Error'}
        msg={errorMsg}
        onClosePopup={onClosePopupHandler}/>
    </>
  );
}

HousingCard.propTypes = {
  listing: PropTypes.object,
  id: PropTypes.number,
  token: PropTypes.string,
  isHostedPage: PropTypes.bool,
  onPublish: PropTypes.func,
};

export default HousingCard;
