
// ** MUI Imports
import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid'

// import { , useEffect } from 'react'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

import { Card, CardContent, Button, ButtonBase, FormHelperText, CircularProgress   } from '@mui/material'

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
import dayjs from 'dayjs';


const EditEmployee = () => {

    const [files, setFiles] = useState([]);
    const [files2, setFiles2] = useState([]);
    const [employee, setEmployee] = useState([]);

    const { isAuthenticated, user, loading, logout } = useContext(AuthContext);

    const router = useRouter()

    const handleFileChange = (event) => {
        setFiles([...files, ...Array.from(event.target.files)]);
    };

    const handleRemoveFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
    };
    const handleRemoveFile2 = (index) => {
        const newFiles = files2.filter((_, i) => i !== index);
        setFiles2(newFiles);
    };
    const { id } = router.query;

    useEffect(() => {
        if (id) {
          setAuthToken(user.token);
          api.get(`users/users/${id}`)
            .then(response => {
                setEmployee(response.data);
                setFiles2(JSON.parse(response.data.certificate));
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
            name: employee.name || '',
            email: employee.email ||'',
            phone: employee.phone ||'',
            birthday: employee?.birthday ? dayjs(employee.birthday) : null,
            startDate: employee?.startDate ? dayjs(employee.startDate) : null,
            cprnumber: employee.cprnumber ||'',
            state: employee.state ||'',
            city:employee.city || '',
            fulladdress: employee.fulladdress ||'',
            weekDaysSalary: employee.weekDaysSalary ||'',
            weekEndSalary: employee.weekEndSalary ||'',
            doormanCourse: employee.doormanCourse || '',
            password: employee.password || '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            doormanCourse: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            phone: Yup.string().required('Phone Number is required'),
            birthday: Yup.date().required('Start Date is required').typeError('Invalid date'),
            startDate: Yup.date().required('Start Date is required').typeError('Invalid date'),
            cprnumber: Yup.number().required('CPR number is required').typeError('Must be a number'),
            state: Yup.string().required('State is required'),
            city: Yup.string().required('City is required'),
            fulladdress: Yup.string().required('Full Address is required'),
            weekDaysSalary: Yup.number().required('Salary rates is required').typeError('Must be a number'),
            weekEndSalary: Yup.number().required('Salary rates is required').typeError('Must be a number')
        }),
        onSubmit: values => {
            setAuthToken(user.token);
            let data = { ...values, role: 'doorman'}
            if(files){
                data = {...data, certificate: files, existingCertificates: files2}
            }
            api.put(`users/users/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(response => {
                alert('Form submitted successfully');
                router.push('/employees')
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
                                Add New Employee
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
                                <h3 className="xs-head">Personal Details</h3>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="row row-gap-25 mt-4">
                                        <div className="col-lg-4 col-12">
                                            <TextField
                                                fullWidth
                                                id="name"
                                                name="name"
                                                label="Full Name"
                                                variant="outlined"
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                error={formik.touched.name && Boolean(formik.errors.name)}
                                                helperText={formik.touched.name && formik.errors.name}
                                            />
                                        </div>
                                        <div className="col-lg-4 col-12">
                                            <TextField
                                                fullWidth
                                                id="email"
                                                name="email"
                                                label="Email Address"
                                                variant="outlined"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                error={formik.touched.email && Boolean(formik.errors.email)}
                                                helperText={formik.touched.email && formik.errors.email}
                                            />
                                        </div>
                                        <div className="col-lg-4 col-12">
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
                                        <div className="col-lg-4 col-12">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    fullWidth
                                                    className='fullwidth'
                                                    label="birthday"
                                                    value={formik.values.birthday}
                                                    onChange={value => formik.setFieldValue('birthday', value)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            error={formik.touched.birthday && Boolean(formik.errors.birthday)}
                                                            helperText={formik.touched.birthday && formik.errors.birthday}
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </div>
                                        <div className="col-lg-4 col-12">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    fullWidth
                                                    className='fullwidth'
                                                    label="Employment Hiring Date "
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
                                        <div className="col-lg-4 col-12">
                                            <TextField
                                                fullWidth
                                                id="state"
                                                name="cprnumber"
                                                label="CPR Number"
                                                variant="outlined"
                                                value={formik.values.cprnumber}
                                                onChange={formik.handleChange}
                                                error={formik.touched.cprnumber && Boolean(formik.errors.cprnumber)}
                                                helperText={formik.touched.cprnumber && formik.errors.cprnumber}
                                            />
                                        </div>
                                        <div className="col-lg-4 col-12">
                                            <TextField
                                                fullWidth
                                                id="State"
                                                name="state"
                                                label="Regioner"
                                                variant="outlined"
                                                value={formik.values.state}
                                                onChange={formik.handleChange}
                                                error={formik.touched.state && Boolean(formik.errors.state)}
                                                helperText={formik.touched.state && formik.errors.state}
                                            />
                                        </div>
                                        <div className="col-lg-4 col-12">
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
                                        <div className="col-lg-4 col-12">
                                            <TextField
                                                fullWidth
                                                id="fulladdress"
                                                name="fulladdress"
                                                label="Full Address"
                                                variant="outlined"
                                                value={formik.values.fulladdress}
                                                onChange={formik.handleChange}
                                                error={formik.touched.fulladdress && Boolean(formik.errors.fulladdress)}
                                                helperText={formik.touched.fulladdress && formik.errors.fulladdress}
                                            />
                                        </div>
                                        <div className="col-lg-4 col-12">
                                            <TextField
                                                fullWidth
                                                id="password"
                                                name="password"
                                                label="Password"
                                                variant="outlined"
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                // error={formik.touched.password && Boolean(formik.errors.password)}
                                                // helperText={formik.touched.password && formik.errors.password}
                                            />
                                        </div>
                                      
                                    </div>
                                    <div className="row row-gap-25">
                                        <div className="col-12">
                                            <h3 className="xs-head mt-4">Work Details</h3>
                                        </div>
                                        <div className="col-lg-4 col-12">
                                            <TextField
                                                fullWidth
                                                id="ratesSundayToThursday"
                                                name="weekDaysSalary"
                                                label="Offdays Salary"
                                                variant="outlined"
                                                value={formik.values.weekDaysSalary}
                                                onChange={formik.handleChange}
                                                error={formik.touched.weekDaysSalary && Boolean(formik.errors.weekDaysSalary)}
                                                helperText={formik.touched.weekDaysSalary && formik.errors.weekDaysSalary}
                                            />
                                        </div>
                                        <div className="col-lg-4 col-12">
                                            <TextField
                                                fullWidth
                                                id="ratesSundayToThursday"
                                                name="weekEndSalary"
                                                label="Weekends Salary"
                                                variant="outlined"
                                                value={formik.values.weekEndSalary}
                                                onChange={formik.handleChange}
                                                error={formik.touched.weekEndSalary && Boolean(formik.errors.weekEndSalary)}
                                                helperText={formik.touched.weekEndSalary && formik.errors.weekEndSalary}
                                            />
                                        </div>
                                        <div className="col-lg-4 col-12">
                                            <FormControl>
                                                <label htmlFor="" className="label-text ">Doorman Course</label>
                                                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" 
                                                name="doormanCourse"
                                                value={formik.values.doormanCourse}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                >
                                                    <FormControlLabel value="yes"  control={<Radio  />} label="Yes" />
                                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                                </RadioGroup>
                                                {formik.touched.doormanCourse && formik.errors.doormanCourse && (
                                                <FormHelperText>{formik.errors.doormanCourse}</FormHelperText>
                                                )}
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className="row mt-4">
                                    <div className="col-12">
                                        <label htmlFor="" className="label-text">Any Legal Document/Certificates</label>
                                       
                                            {
                                                files2.length &&
                                                <>
                                                    <div className="up-wrap mt-3">
                                                        {
                                                            
                                                            // Array.isArray(employee?.certificate) && 
                                                            files2.map((item, index)=>{
                                                                return(
                                                                <div className="up-img" key={index}>
                                                                    <button type="button" onClick={() => handleRemoveFile2(index)}>Remove</button>
                                                                    <Image src={process.env.NEXT_PUBLIC_API_BASE_URL+item} width={130} height={130} alt="" />
                                                                </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </>
                                            }
                                           
                                       
                                        <div className="up-wrap mt-3">
                                            {files.map((file, index) => (
                                            <div key={index} className="up-img">
                                                <button type="button" onClick={() => handleRemoveFile(index)}>Remove</button>
                                                <Image src={URL.createObjectURL(file)} width={130} height={130} alt={file.name} />
                                            </div>
                                            ))}
                                            <div className="up-plus">
                                                <input type="file" id="file" multiple onChange={handleFileChange} />
                                                <label htmlFor="file">
                                                    <Image src="/images/plus.svg" width={40} height={40} alt="" />
                                                    <p>ADD IMAGE</p>
                                                </label>
                                            </div>
                                        </div>
                                        <p className="sm-text mt-2 mb-0">(Upload Multiple files, Max file size 2mb, supported format jpg, png, doc.)</p>
                                    </div>
                                    </div>
                                    <Button
                                    size='medium'
                                    className='mt-5'
                                    variant='contained'
                                    sx={{ marginBottom: 7 }}
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                >
                                    {formik.isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
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

export default EditEmployee

