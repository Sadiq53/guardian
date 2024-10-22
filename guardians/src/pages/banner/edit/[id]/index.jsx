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

    const router = useRouter()

    const { isAuthenticated, user, loading, logout } = useContext(AuthContext);

    const [files, setFiles] = useState([]);
    const [files2, setFiles2] = useState([]);
    const [data, setdata] = useState([]);
    const [existing, setExisting] = useState([]);
    const handleFileChange = (event) => {
        setFiles([...files, ...Array.from(event.target.files)]);
    };
    const handleFileChange2 = (event) => {
        setFiles2([...files2, ...Array.from(event.target.files)]);
    };

    const handleRemoveFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
    };
    const handleRemoveFile2 = (index) => {
        const newFiles = files2.filter((_, i) => i !== index);
        setFiles2(newFiles);
    };

    const {id} = router.query;

    useEffect(() => {
        const getData = ()=>{
            setAuthToken(user.token)
            api.get(`/banners/${id}`)
                .then(res => {
                    setdata(res.data)
                    // setFiles([res.data.desktopImage])
                    // setFiles2([res.data.mobileImage])
                    setExisting([res.data.desktopImage ? res.data.desktopImage: '',res.data.mobileImage?res.data.mobileImage:''])
                })
                .catch(error => {
                    console.error('There was an error submitting the form!', error);
                });
        }
        getData()
    }, [id])


    const formik = useFormik({
        enableReinitialize: true, 
        initialValues: {
            title: data?.title || '',
            link: data?.link || '',
            // email: ''
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            // phone: Yup.string().required('Phone Number is required'),
            link: Yup.string().url('Invalid URL format').required('Link is required'),
        }),
        onSubmit: values => {
            setAuthToken(user.token);
            var data = values;
            // const data = { ...values, role: 'manager' }
            console.log('data', data?.desktopImage, data?.mobileImage, data);
            
            data = {...values, files: [files[0] || '', files2[0] || ''], existmobile: existing[1], existdesktop: existing[0]}
            api.put(`banners/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    alert('Form submitted successfully');
                    router.push('/banner')
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
                                    Add New Banner
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
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="row row-gap-25 mt-4">
                                        <div className="col-lg-6 col-12">
                                            <TextField
                                                fullWidth
                                                id="name"
                                                name="title"
                                                label="Title"
                                                variant="outlined"
                                                value={formik.values.title}
                                                onChange={formik.handleChange}
                                                error={formik.touched.title && Boolean(formik.errors.title)}
                                                helperText={formik.touched.title && formik.errors.title}
                                            />
                                        </div>
                                        <div className="col-lg-6 col-12">
                                            <TextField
                                                fullWidth
                                                id="email"
                                                name="link"
                                                label="link"
                                                variant="outlined"
                                                value={formik.values.link}
                                                onChange={formik.handleChange}
                                                error={formik.touched.link && Boolean(formik.errors.link)}
                                                helperText={formik.touched.link && formik.errors.link}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="" className="label-text">Upload Banner (for desktop)</label>
                                            <div className="up-wrap mt-3">
                                                {
                                                    files.length == 0 &&
                                                    data?.desktopImage && [data?.desktopImage].map((file, index) => (
                                                        <div key={index} className="up-img">
                                                            
                                                            <Image src={process.env.NEXT_PUBLIC_API_BASE_URL+file} width={130} height={130} alt={file.name} />
                                                        </div>
                                                    ))
                                                }
                                                
                                                {files.map((file, index) => (
                                                    <div key={index} className="up-img">
                                                        <button type="button" onClick={() => handleRemoveFile(index)}>Remove</button>
                                                        <Image src={URL.createObjectURL(file)} width={130} height={130} alt={file.name} />
                                                    </div>
                                                ))}
                                                {
                                                    files == 0 &&
                                                    <div className="up-plus">
                                                        <input type="file" id="file" multiple onChange={handleFileChange} />
                                                        <label htmlFor="file">
                                                            <Image src="/images/plus.svg" width={40} height={40} alt="" />
                                                            <p>ADD IMAGE</p>
                                                        </label>
                                                    </div>
                                                }
                                            </div>
                                            <p className="sm-text mt-2 mb-0">(Upload Multiple files, Max file size 2mb, supported format jpg, png, doc.)</p>
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="" className="label-text">Upload Banner (for Mobile)</label>
                                            <div className="up-wrap mt-3">
                                                {
                                                    files2.length == 0 &&
                                                    data?.mobileImage && [data?.mobileImage].map((file, index) => (
                                                        <div key={index} className="up-img">
                                                           
                                                            <Image src={process.env.NEXT_PUBLIC_API_BASE_URL+file} width={130} height={130} alt={file.name} />
                                                        </div>
                                                    ))
                                                }
                                                
                                                {files2.map((file, index) => (
                                                    <div key={index} className="up-img">
                                                        <button type="button" onClick={() => handleRemoveFile2(index)}>Remove</button>
                                                        <Image src={URL.createObjectURL(file)} width={130} height={130} alt={file.name} />
                                                    </div>
                                                ))}
                                                {
                                                    files2 == 0 &&
                                                    <div className="up-plus">
                                                        <input type="file" id="file2" multiple onChange={handleFileChange2} />
                                                        <label htmlFor="file2">
                                                            <Image src="/images/plus.svg" width={40} height={40} alt="" />
                                                            <p>ADD IMAGE</p>
                                                        </label>
                                                    </div>
                                                }
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
