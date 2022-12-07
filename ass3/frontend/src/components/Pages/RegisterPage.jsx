import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Popup from '../UI/Popup';
import PageButton from '../UI/PageButton';

const RegisterPage = (props) => {
  const [email, setEmail] = useState('');
  const [pwd1, setPwd1] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [name, setName] = useState('');

  const [openPopup, setOpenPopup] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  }

  const pwd1ChangeHandler = (event) => {
    setPwd1(event.target.value);
  }

  const pwd2ChangeHandler = (event) => {
    setPwd2(event.target.value);
  }

  const nameChangeHandler = (event) => {
    setName(event.target.value);
  }

  const registerHandler = async () => {
    const response = await fetch('http://localhost:5005/user/auth/register', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: pwd1,
        name: name,
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

  const checkPwd = () => {
    if (pwd1.length !== 0 && pwd2.length !== 0) {
      if (pwd1 !== pwd2) {
        setOpenPopup(true);
        setErrorMsg('Passwords do NOT match');
        setIsDisable(false);
      } else {
        setIsDisable(true);
      }
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
                    Hello, welcome to AirBrB
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
                  value={pwd1}
                  onChange={pwd1ChangeHandler}
                  onBlur={checkPwd}
                  sx={{
                    width: '45%',
                    margin: '2vh 0',
                  }}
                />
                <TextField
                  label='Confirm password'
                  type='password'
                  value={pwd2}
                  onChange={pwd2ChangeHandler}
                  onBlur={checkPwd}
                  sx={{
                    width: '45%',
                    margin: '2vh 0'
                  }}
                />
                <TextField
                  label='Name'
                  type='text'
                  value={name}
                  onChange={nameChangeHandler}
                  sx={{
                    width: '45%',
                    margin: '2vh 0',
                    marginBottom: '4vh',
                  }}
                />
                <PageButton
                  isDisable={!isDisable}
                  onClick={registerHandler}>
                    Register for AirBrB
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

RegisterPage.propTypes = {
  ownerHandler: PropTypes.func,
  tokenHandler: PropTypes.func,
  token: PropTypes.string,
};

export default RegisterPage;
