import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Card, CardContent, Button, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AuthContext } from 'src/auth/AuthContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import api, { setAuthToken } from 'src/axiosInstance';

import dayjs from 'dayjs';

const EditVenue = () => {
  const { isAuthenticated, user, loading, logout } = useContext(AuthContext);
  const router = useRouter();
  const [venue, setVenue] = useState(null);

  // Fetch venue data based on venue ID from URL params
  useEffect(() => {
    const { id } = router.query;
    if (id) {
      setAuthToken(user.token);
      api.get(`venues/venues/${id}`)
        .then(response => {
          setVenue(response.data);
        })
        .catch(error => {
          console.error('Error fetching venue:', error);
        //   toast.error('Error fetching venue. Please try again.');
        });
    }
  }, [router.query]);

  const initialStartDate = venue?.startDate ? dayjs(venue.startDate) : null;

  const formik = useFormik({
    enableReinitialize: true, 
    initialValues: {
      name: venue?.name || '',
      phone: venue?.phone || '',
      state: venue?.state || '',
      city: venue?.city || '',
      country: venue?.country || '',
      fullAddress: venue?.fullAddress || '',
      startDate: initialStartDate,
      ratesSundayToThursday: venue?.ratesSundayToThursday || '',
      ratesFridaySaturday: venue?.ratesFridaySaturday || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      phone: Yup.string().required('Phone Number is required'),
      state: Yup.string().required('Regioner is required'),
      city: Yup.string().required('City is required'),
      country: Yup.string().required('Country is required'),
      fullAddress: Yup.string().required('Full Address is required'),
      startDate: Yup.date().required('Start Date is required').typeError('Invalid date'),
      ratesSundayToThursday: Yup.number().required('Rates for Sunday-Thursday are required').typeError('Must be a number'),
      ratesFridaySaturday: Yup.number().required('Rates for Friday-Saturday are required').typeError('Must be a number')
    }),
    onSubmit: values => {
      setAuthToken(user.token);
      const data = { ...values, role: 'venue' };
      const { id } = router.query;
      if (id) {
        // Update existing venue
        api.put(`venues/venues/${id}`, values)
          .then(response => {
            // toast.success('Venue updated successfully!');
            router.push('/venues');
          })
          .catch(error => {
            console.error('Error updating venue:', error);
            // toast.error('Error updating venue. Please try again.');
          });
      } else {
        // Handle if no venue ID found (optional, based on your app flow)
        console.error('No venue ID found.');
        // toast.error('Venue ID not found.');
      }
    },
  });

  if (!venue) {
    return <p>Loading...</p>; // Add loader or handle loading state
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card>
        <CardContent>
          <h3>Edit Venue</h3>
          <form onSubmit={formik.handleSubmit}>
          <div className="row row-gap-25 mt-4">
            <div className="col-lg-6 col-12">
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </div>
            <div className="col-lg-6 col-12">
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone Number"
                variant="outlined"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </div>
            <div className="col-lg-6 col-12">
              <TextField
                fullWidth
                id="state"
                name="state"
                label="Regioner"
                variant="outlined"
                value={formik.values.state}
                onChange={formik.handleChange}
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && formik.errors.state}
              />
            </div>
            <div className="col-lg-6 col-12">
              <TextField
                fullWidth
                id="city"
                name="city"
                label="City"
                variant="outlined"
                value={formik.values.city}
                onChange={formik.handleChange}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
              />
            </div>
            <div className="col-lg-6 col-12">
              <TextField
                fullWidth
                id="country"
                name="country"
                label="Country"
                variant="outlined"
                value={formik.values.country}
                onChange={formik.handleChange}
                error={formik.touched.country && Boolean(formik.errors.country)}
                helperText={formik.touched.country && formik.errors.country}
              />
            </div>
            <div className="col-lg-6 col-12">
              <TextField
                fullWidth
                id="fullAddress"
                name="fullAddress"
                label="Full Address"
                variant="outlined"
                value={formik.values.fullAddress}
                onChange={formik.handleChange}
                error={formik.touched.fullAddress && Boolean(formik.errors.fullAddress)}
                helperText={formik.touched.fullAddress && formik.errors.fullAddress}
              />
            </div>
            <div className="col-lg-6 col-12">
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker />
              </LocalizationProvider> */}
              <LocalizationProvider dateAdapter={AdapterDayjs }>
                <DatePicker
                  fullWidth
                  className='fullwidth'
                  label="Start Date"
                  value={formik.values.startDate}
                  onChange={value => formik.setFieldValue('startDate', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                      helperText={formik.touched.startDate && formik.errors.startDate}
                    />
                  )}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className="row row-gap-25">
            <div className="col-lg-6 col-12">
              <h3 className="xs-head mt-4">Rates (Sunday-Thursday)</h3>
              <TextField
                fullWidth
                id="ratesSundayToThursday"
                name="ratesSundayToThursday"
                label="Rates"
                variant="outlined"
                value={formik.values.ratesSundayToThursday}
                onChange={formik.handleChange}
                error={formik.touched.ratesSundayToThursday && Boolean(formik.errors.ratesSundayToThursday)}
                helperText={formik.touched.ratesSundayToThursday && formik.errors.ratesSundayToThursday}
              />
            </div>
            <div className="col-lg-6 col-12">
              <h3 className="xs-head mt-4">Rates (Friday-Saturday)</h3>
              <TextField
                fullWidth
                id="ratesFridaySaturday"
                name="ratesFridaySaturday"
                label="Rates"
                variant="outlined"
                value={formik.values.ratesFridaySaturday}
                onChange={formik.handleChange}
                error={formik.touched.ratesFridaySaturday && Boolean(formik.errors.ratesFridaySaturday)}
                helperText={formik.touched.ratesFridaySaturday && formik.errors.ratesFridaySaturday}
              />
            </div>
          </div>
            <Button
              size='medium'
              className='mt-5'
              variant='contained'
              sx={{ marginBottom: 7 }}
              type="submit"
            >
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default EditVenue;
