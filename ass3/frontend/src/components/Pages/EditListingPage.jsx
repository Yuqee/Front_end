import { Box, Typography, TextField, Button, FormControl, InputLabel, Input, InputAdornment, FormHelperText } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Popup from '../UI/Popup';
import './upload_input.css';

const EditListingPage = () => {
  const { listing } = useLocation().state;

  const [openPopup, setOpenPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const onClosePopupHandler = () => {
    setOpenPopup(false);
  };

  const EditListing = async (args) => {
    const response = await fetch(`http://localhost:5005/listings/${listing.id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${listing.token}`,
        listingid: `listingid - ${listing.id}`,
      },
      body: JSON.stringify(args),
    });
    const data = await response.json();
    if (data.error) {
      setOpenPopup(true);
      setErrorMsg(data.error);
    }
  };

  const EditLisingHandler = () => {
    EditListing({
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
  }

  const [title, setTitle] = useState(listing.title);
  const [ptype, setPtype] = useState(listing.type);
  const [street, setStreet] = useState(listing.street);
  const [city, setCity] = useState(listing.city);
  const [zip, setZip] = useState(listing.zip);
  const [countryORregion, setCountryORregion] = useState(listing.countryORregion);
  const [price, setPrice] = useState(listing.price);
  const [bedrooms, setBedrooms] = useState(listing.bedrooms);
  const [beds, setBeds] = useState(listing.beds);
  const [amenities, setAmenities] = useState(listing.amenities);

  const [filename, setFilename] = useState('');
  const [base64, setBase64] = useState(listing.thumbnail);
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
  console.log(base64);
  return (
    <>
        <Box
          p={3}>
          <Typography variant='h6' color='gray' textAlign='center'>Edit this listing</Typography>
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
          <img
            style={{
              width: '100%',
            }}
            src={base64}/>
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
                }}/>Edit your listing image
            </label>
            <span style={{
              color: 'gray',
              fontFamily: 'Roboto',
              width: '40%',
            }}>
              {filename === '' ? '' : `${filename} is chosen`}
            </span>
          </div>
          <Link
            style={{
              textDecoration: 'none',
            }}
            to='/hosted_listings'>
            <Button
              sx={{
                width: '60%',
                margin: '3% 20%',
              }}
              variant='outlined'
              onClick={EditLisingHandler}>
                Save all Changes
            </Button>
          </Link>
        </Box>
      <Popup
        open={openPopup}
        title={'Error'}
        msg={errorMsg}
        onClosePopup={onClosePopupHandler}/>
    </>
  );
}

export default EditListingPage;
