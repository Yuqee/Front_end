import { Tooltip, Fab, Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Input, InputAdornment, FormHelperText } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import AddIcon from '@mui/icons-material/Add';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import './upload_input.css';
import Popup from '../UI/Popup';
import HousingCard from '../UI/HousingCard';

const CreateListingModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const HostedListingPgae = (props) => {
  // console.log(props.listings);
  const [hostedIDs, setHostedIDs] = useState([]);

  useEffect(() => {
    for (let i = 0; i < props.listings.length; i++) {
      if (props.listings[i].owner === props.owner) {
        setHostedIDs(preHostedIDs => [...preHostedIDs, props.listings[i].id]);
      }
    }
  }, [])
  // console.log(hostedIDs);
  const [hostedListings, setHostedListings] = useState([]);

  const LoadListingDetails = async (id) => {
    const response = await fetch(`http://localhost:5005/listings/${id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const data = await response.json();
    if (data.error) {
      setOpenPopup(true);
      setErrorMsg(data.error);
    } else {
      const temp = {
        ...data,
        id: id,
      }
      setHostedListings((prev) => {
        return [...prev, temp];
      });
    }
  }

  useEffect(() => {
    for (let i = hostedListings.length; i < hostedIDs.length; i++) {
      LoadListingDetails(hostedIDs[i]);
    }
  }, [hostedIDs]);

  // console.log(hostedListings);

  const [openPopup, setOpenPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const onClosePopupHandler = () => {
    setOpenPopup(false);
  }

  const [openModal, setOpenModal] = useState(false);
  const openModalHandler = () => {
    setOpenModal(true);
  }
  const closeModalHandler = () => {
    setOpenModal(false);
  }

  const [title, setTitle] = useState('');
  const [ptype, setPtype] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [countryORregion, setCountryORregion] = useState('');
  const [price, setPrice] = useState(undefined);
  const [bedrooms, setBedrooms] = useState(undefined);
  const [beds, setBeds] = useState(undefined);
  const [amenities, setAmenities] = useState('');

  const [filename, setFilename] = useState('');
  const [base64, setBase64] = useState('');
  const UploadHanler = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
      setBase64('');
      setBase64('data:image/png;base64,' + reader.result.replace('data:', '').replace(/^.+,/, ''));
    }
    reader.readAsDataURL(file);
    setFilename(event.target.files[0].name);
  }

  const CreateLisingHandler = () => {
    CreateListing({
      title: title,
      price: Number(price),
      address: {
        street: street,
        city: city,
        zip: zip,
        countryORregion: countryORregion,
      },
      metadata: {
        property_type: ptype,
        bedrooms: Number(bedrooms),
        beds: Number(beds),
        amenities: amenities,
      },
      thumbnail: base64,
    });
  };

  const CreateListing = async (args) => {
    // console.log(args);
    const response = await fetch('http://localhost:5005/listings/new', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify(args),
    });
    const data = await response.json();
    if (data.error) {
      setOpenPopup(true);
      setErrorMsg(data.error);
    } else {
      setTitle('');
      setPtype('');
      setStreet('');
      setCity('');
      setZip('');
      setCountryORregion('');
      setPrice();
      setBedrooms();
      setBeds();
      setAmenities('');
      setBase64('');
      setFilename('');
      setHostedIDs(preHostedIDs => [...preHostedIDs, Number(data.listingId)]);
      setOpenModal(false);
      props.onCreate(Number(data.listingId));
    }
  }

  return (
    <>
      {hostedListings.map((list) => {
        return (
        <HousingCard
          key={list.id}
          listing={list.listing}
          id={Number(list.id)}
          token={props.token}
          isHostedPage={true}
          onPublish={props.onPublish}
          ></HousingCard>);
      })}
      <Tooltip
        title="Create a new listing"
        sx={{
          position: 'fixed',
          bottom: 20,
          left: 'calc(50% - 25px)',
        }}
        onClick={openModalHandler}>
        <Fab color="primary" aria-label="add">
          <AddIcon/>
        </Fab>
      </Tooltip>
      <CreateListingModal
        open={openModal}
        onClose={closeModalHandler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          width={380}
          height={380}
          bgcolor='white'
          p={3}
          borderRadius={5}>
          <Typography variant='h6' color='gray' textAlign='center'>Create a new listing</Typography>
          <TextField
            placeholder='eg: Oceanside Villa'
            label="Title"
            variant="standard"
            value= {title}
            onChange={(event) => { setTitle(event.target.value); }}
            sx={{
              width: '65%',
              margin: '1% 0',
              marginRight: '1%',
            }}/>
          <TextField
            placeholder='eg: House'
            label="Property type"
            variant="standard"
            value= {ptype}
            onChange={(event) => { setPtype(event.target.value); }}
            sx={{
              width: '34%',
              margin: '1% 0',
            }}/>
          <TextField
            placeholder='eg: 2723 Giraffe Hill Drive'
            label="Street Address"
            variant="standard"
            value= {street}
            onChange={(event) => { setStreet(event.target.value); }}
            sx={{
              width: '65%',
              margin: '1% 0',
              marginRight: '1%',
            }}/>
          <TextField
            placeholder='eg: Cedar Hill'
            label="City"
            variant="standard"
            value= {city}
            onChange={(event) => { setCity(event.target.value) }}
            sx={{
              width: '34%',
              margin: '1% 0',
            }}/>
          <TextField
            placeholder='eg: 75253'
            label="ZIP"
            variant="standard"
            value= {zip}
            onChange={(event) => { setZip(event.target.value) }}
            sx={{
              width: '25%',
              margin: '1% 0',
            }}/>
          <TextField
            label="Country or region"
            variant="standard"
            value= {countryORregion}
            onChange={(event) => { setCountryORregion(event.target.value); }}
            sx={{
              width: '39%',
              margin: '1% 1%',
            }}/>
          <FormControl
            fullWidth
            sx={{
              width: '34%',
              margin: '1% 0',
            }}
            variant="standard">
          <InputLabel>Price per night</InputLabel>
          <Input
            value={price}
            onChange={(event) => { setPrice(event.target.value); }}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
          </FormControl>
          <FormControl variant="standard"
            sx={{
              width: '50%',
              margin: '1% 0',
              marginTop: '3%',
              marginRight: '1%',
            }}>
            <Input
              value={amenities}
              placeholder='eg: TV, Air Conditioner'
              onChange={(event) => { setAmenities(event.target.value); }}
            />
          <FormHelperText>Amenities</FormHelperText>
          </FormControl>
          <FormControl variant="standard"
            sx={{
              width: '26%',
              margin: '1% 0',
              marginTop: '3%',
              marginRight: '1%',
            }}>
            <Input
              value={bedrooms}
              onChange={(event) => { setBedrooms(event.target.value); }}
              endAdornment={<InputAdornment position="end">bedrooms</InputAdornment>}
            />
          <FormHelperText>Number of bedrooms</FormHelperText>
          </FormControl>
          <FormControl variant="standard"
              sx={{
                width: '22%',
                margin: '1% 0',
                marginTop: '3%',
              }}>
              <Input
                value={beds}
                onChange={(event) => { setBeds(event.target.value); }}
                endAdornment={<InputAdornment position="end">beds</InputAdornment>}
              />
            <FormHelperText>Number of beds in total</FormHelperText>
          </FormControl>
          <div
            style={{
              margin: '1% 0',
              display: 'flex',
              alignItems: 'center',
            }}>
            <input
              type="file"
              id='file'
              className='inputfile'
              onChange={UploadHanler}/>
            <label
              htmlFor='file'
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '60%',
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              <UploadIcon
                sx={{
                  margin: '0 0',
                  marginRight: '1%'
                }}/>Choose your listing image
            </label>
            <span style={{
              color: 'gray',
              fontFamily: 'Roboto',
              width: '40%',
            }}>
              {filename === '' ? '' : `${filename} is chosen`}
            </span>
          </div>
          <Button
            sx={{
              width: '40%',
              margin: '3% 0',
              marginRight: '10%',
            }}
            variant='outlined'
            onClick={closeModalHandler}>
              Cancel
          </Button>
          <Button
            sx={{
              width: '40%',
              margin: '3% 0',
              marginLeft: '10%',
            }}
            variant='contained'
            onClick={CreateLisingHandler}>
              Create
          </Button>
        </Box>
      </CreateListingModal>
      <Popup
        open={openPopup}
        title={'Error'}
        msg={errorMsg}
        onClosePopup={onClosePopupHandler}/>
    </>
  );
}

HostedListingPgae.propTypes = {
  token: PropTypes.string,
  owner: PropTypes.string,
  listings: PropTypes.array,
  onPublish: PropTypes.func,
  onCreate: PropTypes.func,
};
export default HostedListingPgae;
