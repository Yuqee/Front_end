import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import Popup from '../UI/Popup';
import PageButton from '../UI/PageButton';

const LoginPage = (props) => {
  const [email, setEmail] = useState('wurt@dst.com');
  const [pwd, setPwd] = useState('123456');

  const [openPopup, setOpenPopup] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  }

  const pwdChangeHandler = (event) => {
    setPwd(event.target.value);
  }

  const loginHandler = async () => {
    const response = await fetch('http://localhost:5005/user/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: pwd,
      })
    });
    const data = await response.json();
    if (data.error) {
      setOpenPopup(true);
      setErrorMsg(data.error);
    } else {
      props.tokenHandler(data.token);
      props.ownerHandler(email);
    }
  }

  const onClosePopupHandler = () => {
    setOpenPopup(false);
  }

  if (props.token === null) {
    return (
      <React.Fragment>
        <Box
          component='form'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
          noValidate
          autoComplete='off'
        >
            <Toolbar
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
                <Typography variant='h1'
                sx={{
                  marginTop: '8vh',
                  marginBottom: '4vh',
                  fontSize: '5vw',
                }}>
                    Hello, welcome back
                </Typography>
                <TextField
                  label='Email'
                  type='email'
                  value={email}
                  onChange={emailChangeHandler}
                  sx={{
                    width: '45%',
                    margin: '2vh 0'
                  }}
                />
                <TextField
                  label='Password'
                  type='password'
                  value={pwd}
                  onChange={pwdChangeHandler}
                  sx={{
                    width: '45%',
                    margin: '2vh 0',
                    marginBottom: '4vh',
                  }}
                />
                <PageButton
                  is="contained"
                  onClick={loginHandler}>
                    Login for AirBrB
                </PageButton>
            </Toolbar>
        </Box>
        <Popup
          open={openPopup}
          title={'Error'}
          msg={errorMsg}
          onClosePopup={onClosePopupHandler}>
        </Popup>
      </React.Fragment>
    );
  } else {
    return <Navigate replace to='/'></Navigate>
  }
};

LoginPage.propTypes = {
  ownerHandler: PropTypes.func,
  tokenHandler: PropTypes.func,
  token: PropTypes.string,
};

export default LoginPage;
