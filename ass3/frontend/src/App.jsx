import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/UI/NavBar';
import LoginPage from './components/Pages/LoginPage';
import RegisterPage from './components/Pages/RegisterPage';
import HomePage from './components/Pages/HomePage';
import HostedListingPgae from './components/Pages/HostedListingPage';
import EditListingPage from './components/Pages/EditListingPage';
import DetailsPage from './components/Pages/DetailsPage';
import Popup from './components/UI/Popup';

function App () {
  const [openPopup, setOpenPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const onClosePopupHandler = () => {
    setOpenPopup(false);
  }

  const [token, setToken] = useState(null);
  const [owner, setOwner] = useState(null);

  const [allListings, setAllListings] = useState([]);
  const LoadListing = async () => {
    const response = await fetch('http://localhost:5005/listings', {
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
      setAllListings(data.listings);
    }
  }

  useEffect(() => {
    LoadListing();
  }, []);

  const [allListingsDetail, setAllListingsDetail] = useState([]);
  const [publishedListings, setPublishedListings] = useState([]);
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
      setAllListingsDetail((prev) => {
        return [...prev, temp];
      });
    }
  }
  useEffect(() => {
    for (let i = allListingsDetail.length; i < allListings.length; i++) {
      LoadListingDetails(allListings[i].id);
    }
  }, [allListings]);

  useEffect(() => {
    if (allListingsDetail.length === allListings.length) {
      for (let i = publishedListings.length; i < allListingsDetail.length; i++) {
        if (allListingsDetail[i].listing.published) {
          setPublishedListings(pre => [...pre, allListingsDetail[i]]);
        }
      }
    }
  }, [allListingsDetail]);

  const publishHandler = (pushListing) => {
    setPublishedListings(pre => [...pre, pushListing]);
  }

  publishedListings.sort((item1, item2) => {
    return item1.listing.title.toLowerCase().charCodeAt(0) - item2.listing.title.toLowerCase().charCodeAt(0);
  });

  const [filter, setFilter] = useState({
    isSearch: false,
    key: '',
    val: '',
  });

  const searchHandler = (searchK, searchV) => {
    setFilter({
      isSearch: true,
      key: searchK,
      val: searchV,
    })
  };

  const [filteredListings, setFilteredListings] = useState([]);
  useEffect(() => {
    if (filter.isSearch) {
      // console.log(filter);
      setFilteredListings(publishedListings);
      setFilteredListings(lists => lists.filter(list => {
        if (filter.key === 'title') {
          return list.listing.title === filter.val;
        } else if (filter.key === 'city') {
          return list.listing.address.city === filter.val;
        } else if (filter.key === 'bedrooms') {
          const arr = filter.val.split(',').map(ele => Number(ele));
          const max = arr[1];
          const mini = arr[0];
          return list.listing.metadata.bedrooms <= max && list.listing.metadata.bedrooms >= mini;
        } else if (filter.key === 'price') {
          const arr = filter.val.split(',').map(ele => Number(ele));
          const max = arr[1];
          const mini = arr[0];
          return list.listing.price <= max && list.listing.price >= mini;
        } else if (filter.key === 'drange') {
          const arr = filter.val.split(',');
          const arrive = new Date(arr[0]);
          const leave = new Date(arr[1]);
          const start = new Date(list.listing.availability[0]);
          const end = new Date(list.listing.availability[1]);
          return start <= arrive && end >= arrive && start <= leave && end >= leave;
        }
        return false;
      }))
    }
  }, [filter]);

  // console.log(allListings);
  // console.log(filteredListings);
  const createHandler = (newID) => {
    setAllListings((prev) => {
      return [...prev, { id: newID }];
    });
  }

  return (
    <>
      <BrowserRouter>
        <NavBar
          token={token}
          tokenHandler={setToken}
          ownerHandler={setOwner}
          onSearch={searchHandler}/>
        <Routes>
          <Route
            path='/login'
            element={
              <LoginPage
              tokenHandler={setToken}
              token={token}
              ownerHandler={setOwner}/>}/>
          <Route
            path='/register'
            element={
              <RegisterPage
              tokenHandler={setToken}
              token={token}
              ownerHandler={setOwner}/>}/>
          <Route
            path='/hosted_listings'
            element={
              <HostedListingPgae
              token={token}
              owner={owner}
              listings={allListings}
              onPublish={publishHandler}
              onCreate={createHandler}/>}/>
          <Route
            path='/hosted_listings/listings/edit'
            element={<EditListingPage/>}
          />
          <Route path='listing/:id'
            element={
              <DetailsPage/>}
          />
          <Route path='/'
            element={
              <HomePage
                listings={filter.isSearch ? filteredListings : publishedListings}
                token={token}/>}/>
      </Routes>
      </BrowserRouter>
      <Popup
        open={openPopup}
        title={'Error'}
        msg={errorMsg}
        onClosePopup={onClosePopupHandler}/>
   </>
  );
}

export default App;
