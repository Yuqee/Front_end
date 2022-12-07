import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

const PageButton = (props) => {
  return (
    <Button
      onClick={props.onClick}
      disabled={props.isDisable}
      variant="contained"
      style={{
        width: '45%',
        textTransform: 'none',
      }}>
        {props.children}
    </Button>
  )
}

PageButton.propTypes = {
  children: PropTypes.node.isRequired,
  isDisable: PropTypes.bool,
  onClick: PropTypes.func
};
export default PageButton;
