// ** MUI Imports
import React, { useContext, useEffect } from 'react';
import Grid from '@mui/material/Grid'

import { useState } from 'react'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

import { Card, CardContent, Button, ButtonBase } from '@mui/material'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import Trophy from 'src/views/dashboard/Trophy'
import TotalEarning from 'src/views/dashboard/TotalEarning'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview'
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'
import SalesByCountries from 'src/views/dashboard/SalesByCountries'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';

import { DataGrid, GridColDef } from '@mui/x-data-grid';

import Image from 'next/image'
import Link from 'next/link'

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField'

// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import api, { setAuthToken } from 'src/axiosInstance'

import { useRouter } from 'next/router'

import { AuthContext } from 'src/auth/AuthContext'


const AddEmployee = () => {

  const { isAuthenticated, user, loading, logout } = useContext(AuthContext);

  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      state: '',
      city: '',
      country: '',
      fullAddress: '',
      startDate: null,
      ratesSundayToThursday: '',
      ratesFridaySaturday: ''
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
      const data = {...values, role: 'venue'}
      api.post('venues/venues', values)
        .then(response => {
          alert('Form submitted successfully');
          router.push('/venues')
        })
        .catch(error => {
          console.error('There was an error submitting the form!', error);
        });
    },
  });

  return (
    <ApexChartWrapper>
        <section className='sec ven-act-sec mt-4'>
          <div className="row">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="sm-head">
                  Add New Venue
                  </h3>
                  <p className="sm-para">
                  Tables display sets of data. They can be fully customized
                  </p>
                </div>
               
              </div>
            </div>
            <div className="col-12 mt-3 mb-3">
            <Card>
      <CardContent>
        <h3 className="xs-head">Venue Details</h3>
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
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
            </div>
          </div>
        </section>
    </ApexChartWrapper>
  )
}

export default AddEmployee
