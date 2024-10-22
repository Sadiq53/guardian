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

  const [ratingOfficer, setRatingOfficer] = useState(null)

  const { id } = router.query;
  useEffect(() => {
    if (id) {
      setAuthToken(user.token);
      api.get(`users/users/${id}`)
        .then(response => {
          setRatingOfficer(response.data);
        })
        .catch(error => {
          console.error('Error fetching venue:', error);
        //   toast.error('Error fetching venue. Please try again.');
        });
    }
  }, [router.query]);

  const formik = useFormik({
    enableReinitialize: true, 
    initialValues: {
      name: ratingOfficer?.name || '',
      phone: ratingOfficer?.phone || '',
      email: ratingOfficer?.email || ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      // phone: Yup.string().required('Phone Number is required'),
      // email: Yup.string().required('Email is required')
    }),
    onSubmit: values => {
      setAuthToken(user.token);
      const data = {...values, role: 'manager'}
      api.put(`users/users/${id}`, data).then(response => {
          alert('Form submitted successfully');
          router.push('/rating-officer')
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
                  Edit Rating Officer
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
        <h3 className="xs-head">Officer Details</h3>
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
            {/* <div className="col-lg-6 col-12">
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                variant="outlined"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </div> */}
            
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
