
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


const AddComment = () => {

    const [files, setFiles] = useState([]);

    const { isAuthenticated, user, loading, logout } = useContext(AuthContext);

    const router = useRouter()

    const {id} = router.query;

    const handleFileChange = (event) => {
        setFiles([...files, ...Array.from(event.target.files)]);
    };

    const handleRemoveFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
    };

    const formik = useFormik({
        initialValues: {
            comment: '',
        },
        validationSchema: Yup.object({
            comment: Yup.string().required('comment is required'),
        }),
        onSubmit: values => {
            setAuthToken(user.token);
            
            api.put(`jobs/comments/${id}`, values)
            .then(response => {
                alert('Form submitted successfully');
                router.push('/my-jobs')
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
                                Add Comments
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-3 mb-3">
                        <Card>
                            <CardContent>
                                <h3 className="xs-head">Write a Comment</h3>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="row row-gap-25 mt-4">
                                        <div className="col-lg-6 col-12">
                                            <TextField
                                                fullWidth
                                                id="name"
                                                name="comment"
                                                label="Comment"
                                                variant="outlined"
                                                value={formik.values.comment}
                                                onChange={formik.handleChange}
                                                error={formik.touched.comment && Boolean(formik.errors.comment)}
                                                helperText={formik.touched.comment && formik.errors.comment}
                                                multiline
                                                rows={4} 
                                            />
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

export default AddComment

