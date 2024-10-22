// ** MUI Imports
import Grid from '@mui/material/Grid'

import { useState, useEffect, useContext } from 'react'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

import { Card, CardContent, Button } from '@mui/material'

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

import { useRouter } from 'next/router'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api, {setAuthToken} from 'src/axiosInstance'
import { AuthContext } from 'src/auth/AuthContext'


const AddFaqs = () => {
  const router = useRouter();
  const [faqs, setFaqs] = useState([]);

  const {user} = useContext(AuthContext);

  const { id } = router.query;
  useEffect(() => {
    if (id) {
      setAuthToken(user.token);
      api.get(`faqs/faq/${id}`)
        .then(response => {
          setFaqs(response.data);
        })
        .catch(error => {
          console.error('Error fetching faq:', error);
        //   toast.error('Error fetching venue. Please try again.');
        });
    }
  }, [router.query]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: faqs.title || '',
      // content: faqs.content || '', 
      videoUrl: faqs.videoUrl || '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Question is required'),
      // content: Yup.string().required('Answer is required'),
      videoUrl: Yup.string().url('Invalid URL').required('Video URL is required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      setAuthToken(user.token)
      api.put(`faqs/faq/${id}`, values)
        .then(response => {
          alert('Form submitted successfully');
          router.push('/faqs');
        })
        .catch(error => {
          console.error('There was an error submitting the form!', error);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  const addFaq = () => {
    const newFaqs = [...formik.values.faqs, { title: '', videoUrl: '' }];
    formik.setFieldValue('faqs', newFaqs);
  };

  const removeFaq = (index) => {
    const newFaqs = formik.values.faqs.filter((_, i) => i !== index);
    formik.setFieldValue('faqs', newFaqs);
  };

  return (
    <ApexChartWrapper>
      <section className='sec ven-act-sec mt-4'>
        <div className="row">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h3 className="sm-head">
                  Edit FAQ
                </h3>
                <p className="sm-para">
                  Tables display sets of data. They can be fully customized
                </p>
              </div>

            </div>
          </div>
          <div className="col-12">
            {/* <div className="up-wrap mt-3">
                    <div className="up-plus btn">
                        <input type="file" id="file" multiple />
                        <label htmlFor="file">
                            <Image src="/images/plus.svg" width={20} height={20} alt="" />
                            <p>Add VIDEO</p>
                        </label>
                    </div>
                </div> */}
            <Card className='mt-4'>
              <CardContent>
                <form onSubmit={formik.handleSubmit}>
                  
                    <div className="add-faq-card">
                      <div>
                        <TextField
                          fullWidth
                          id={`title`}
                          name={`title`}
                          label="title"
                          className="mb-3"
                          variant="outlined"
                          value={formik.values?.title}
                          onChange={formik.handleChange}
                          error={formik.touched.title && Boolean(formik.errors?.title)}
                          helperText={formik.touched.title && formik.errors.title}
                        />
                        {/* <TextField
                          fullWidth
                          id={`content`}
                          name={`content`}
                          label="content"
                          className="mb-3"
                          variant="outlined"
                          value={formik.values?.content}
                          onChange={formik.handleChange}
                          error={formik.touched.content && Boolean(formik.errors.content)}
                          helperText={formik.touched.content && formik.errors.content}
                        /> */}
                        <TextField
                          fullWidth
                          id={`videoUrl`}
                          name={`videoUrl`}
                          label="Video URL"
                          variant="outlined"
                          value={formik.values?.videoUrl}
                          onChange={formik.handleChange}
                          error={formik.touched?.videoUrl && Boolean(formik.errors?.videoUrl)}
                          helperText={formik.touched?.videoUrl && formik.errors?.videoUrl}
                        />
                      </div>
                    </div>
                  
                  <Button
                    size="medium"
                    variant="contained"
                    sx={{ marginBottom: 0 }}
                    type="submit"
                    className="mt-4"
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting ? 'Submitting...' : 'Submit'}
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

export default AddFaqs
