import styled from '@emotion/styled';
import { AppBar, Toolbar, Typography, TextField, MenuItem, InputBase, Avatar, Menu } from '@mui/material';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import SearchIcon from '@mui/icons-material/Search';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Popup from './Popup';
import Logged from '../../imgs/login.png';

const AirBrBToolbar = styled(Toolbar)({
  display: 'flex',
})

const Logo = styled(HolidayVillageIcon)({
  margin: '1%',
  marginLeft: '0',
  '&:hover': { cursor: 'pointer' },
})

const LogoText = styled(Typography)({
  fontFamily: 'monospace',
  letterSpacing: '.3rem',
  '&:hover': { cursor: 'pointer' },
})

const SearchBar = styled('span')({
  backgroundColor: 'white',
  margin: '0 2%',
  borderRadius: '4px',
  width: '70%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
})

const SearchButton = styled(SearchIcon)({
  color: '#1976d2;',
  margin: '0 1%',
  '&:hover': { cursor: 'pointer' }
})

const SelectInput = styled(TextField)({
  width: '30%',
  '& .MuiInputBase-root': { height: 35 },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'gray',
    },
  },
})

const searchParamters = [
  {
    value: 'title',
    label: 'title',
  },
  {
    value: 'city',
    label: 'city',
  },
  {
    value: 'bedrooms',
    label: 'bedrooms',
  },
  {
    value: 'drange',
    label: 'date range',
  },
  {
    value: 'price',
    label: 'price',
  },
  {
    value: 'rating',
    label: 'rating',
  },
];

const NavBar = (props) => {
  const [openPopup, setOpenPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const onClosePopupHandler = () => {
    setOpenPopup(false);
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    const { myValue } = event.currentTarget.dataset;
    if (myValue === 'Logout') {
      // console.log(myValue);
      logOutHandler();
    }
    setAnchorEl(null);
  };

  const logOutHandler = async () => {
    const response = await fetch('http://localhost:5005/user/auth/logout', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${props.token}`,
      },
    });
    const data = await response.json();
    // console.log(data);
    if (data.error) {
      setOpenPopup(true);
      setErrorMsg(data.error);
    } else {
      props.tokenHandler(null);
      props.ownerHandler(null);
    }
  }

  const [searchType, setSearchType] = useState('title');
  const [searchTip, setSearchRTip] = useState('Search here...');

  const handleChange = (event) => {
    if (event.target.value === 'bedrooms' || event.target.value === 'price') {
      setSearchRTip('eg: mini number,max number');
    } else if (event.target.value === 'drange') {
      setSearchRTip('eg: arrive date,leave date format:yyyy-mm-dd');
    } else {
      setSearchRTip('Search here...');
    }
    setSearchType(event.target.value);
  };
  // console.log(searchType);

  const [searchVal, setSearchVal] = useState('');
  const searchHanler = () => {
    props.onSearch(searchType, searchVal);
    // setSearchType('title');
    // setSearchVal('');
  };

  let src = '/broken-image.jpg';
  if (props.token !== null) {
    src = Logged;
  }

  let Items = <></>;
  if (props.token === null) {
    Items = <Menu
    anchorEl={anchorEl}
    id="account-menu"
    open={open}
    onClose={handleClose}
    PaperProps={{
      elevation: 0,
      sx: {
        overflow: 'visible',
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
        mt: 1.5,
        '& .MuiAvatar-root': {
          width: 32,
          height: 32,
          ml: -0.5,
          mr: 1,
        },
        '&:before': {
          content: '""',
          display: 'block',
          position: 'absolute',
          top: 0,
          right: 14,
          width: 10,
          height: 10,
          bgcolor: 'background.paper',
          transform: 'translateY(-50%) rotate(45deg)',
          zIndex: 0,
        },
      },
    }}
    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
  >
    <Link to='/login'
        style={{
          textDecoration: 'none',
          color: 'black'
        }}>
        <MenuItem onClick={handleClose}>Login</MenuItem>
    </Link>
    <Link to='/register'
        style={{
          textDecoration: 'none',
          color: 'black'
        }}>
        <MenuItem onClick={handleClose}>Register</MenuItem>
    </Link>
  </Menu>
  } else {
    Items = <Menu
    anchorEl={anchorEl}
    id="account-menu"
    open={open}
    onClose={handleClose}
    PaperProps={{
      elevation: 0,
      sx: {
        overflow: 'visible',
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
        mt: 1.5,
        '& .MuiAvatar-root': {
          width: 32,
          height: 32,
          ml: -0.5,
          mr: 1,
        },
        '&:before': {
          content: '""',
          display: 'block',
          position: 'absolute',
          top: 0,
          right: 14,
          width: 10,
          height: 10,
          bgcolor: 'background.paper',
          transform: 'translateY(-50%) rotate(45deg)',
          zIndex: 0,
        },
      },
    }}
    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
  >
    <Link to='/hosted_listings'
        style={{
          textDecoration: 'none',
          color: 'black'
        }}>
      <MenuItem onClick={handleClose}>
      Hosted Listings
      </MenuItem>
    </Link>
    <MenuItem onClick={handleClose}>
    All Listings
    </MenuItem>
    <Link to='/'
        style={{
          textDecoration: 'none',
          color: 'black'
        }}>
      <MenuItem onClick={handleClose} data-my-value='Logout'>
      Logout
      </MenuItem>
    </Link>
  </Menu>
  }

  return (
    <React.Fragment>
      <AppBar position='sticky'>
        <AirBrBToolbar>
          <Link
            to='/'
            style={{
              color: 'white',
              margin: '1vw',
              marginLeft: '0',
            }}>
            <Logo/>
          </Link>
          <Link to='/'
            style={{
              textDecoration: 'none',
              color: 'white',
            }}>
            <LogoText
            variant='h6'
            sx={{
              display: {
                xs: 'none',
                sm: 'flex'
              },
            }}>
              AirBrB
            </LogoText>
          </Link>
          <SearchBar>
            <SearchButton
              onClick={searchHanler}/>
            <InputBase
              value={searchVal}
              onChange={(event) => setSearchVal(event.target.value)}
              placeholder={searchTip}
              sx={{
                width: '70%',
              }}>
            </InputBase>
            <SelectInput
              select
              value={searchType}
              onChange={handleChange}>
              {searchParamters.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </SelectInput>
          </SearchBar>
          <Avatar
            src={src}
            sx={{
              marginLeft: '4%',
              '&:hover': { cursor: 'pointer' },
            }}
            onClick={handleClick}/>
          {Items}
        </AirBrBToolbar>
      </AppBar>
      <Popup
      open={openPopup}
      title={'Error'}
      msg={errorMsg}
      onClosePopup={onClosePopupHandler}>
      </Popup>
    </React.Fragment>
  )
};

NavBar.propTypes = {
  token: PropTypes.string,
  tokenHandler: PropTypes.func,
  ownerHandler: PropTypes.func,
  onSearch: PropTypes.func,
};

export default NavBar;
