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
  const [faqs, setFaqs] = useState([{ question: '', answer: '', videoUrl: '' }]);

  const {user} = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      faqs: [{ title: '', videoUrl: '' }],
    },
    validationSchema: Yup.object({
      faqs: Yup.array().of(
        Yup.object({
          title: Yup.string().required('Question is required'),
          videoUrl: Yup.string().url('Invalid URL').required('Video URL is required'),
        })
      ),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      setAuthToken(user.token)
      api.post('faqs/faqs', values.faqs)
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
    const newFaqs = [...formik.values.faqs, { title: '', content: '', videoUrl: '' }];
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
                  Add FAQ
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
                  {formik.values.faqs.map((faq, index) => (
                    <div key={index} className="add-faq-card">
                      <div>
                        <TextField
                          fullWidth
                          id={`faqs[${index}].title`}
                          name={`faqs[${index}].title`}
                          label="title"
                          className="mb-3"
                          variant="outlined"
                          value={formik.values.faqs[index]?.title}
                          onChange={formik.handleChange}
                          error={formik.touched.faqs?.[index]?.title && Boolean(formik.errors.faqs?.[index]?.title)}
                          helperText={formik.touched.faqs?.[index]?.title && formik.errors.faqs?.[index]?.title}
                        />
                        {/* <TextField
                          fullWidth
                          id={`faqs[${index}].content`}
                          name={`faqs[${index}].content`}
                          label="content"
                          className="mb-3"
                          variant="outlined"
                          value={formik.values.faqs[index]?.content}
                          onChange={formik.handleChange}
                          error={formik.touched.faqs?.[index]?.content && Boolean(formik.errors.faqs?.[index]?.content)}
                          helperText={formik.touched.faqs?.[index]?.content && formik.errors.faqs?.[index]?.content}
                        /> */}
                        <TextField
                          fullWidth
                          id={`faqs[${index}].videoUrl`}
                          name={`faqs[${index}].videoUrl`}
                          label="Video URL"
                          variant="outlined"
                          value={formik.values.faqs[index]?.videoUrl}
                          onChange={formik.handleChange}
                          error={formik.touched.faqs?.[index]?.videoUrl && Boolean(formik.errors.faqs?.[index]?.videoUrl)}
                          helperText={formik.touched.faqs?.[index]?.videoUrl && formik.errors.faqs?.[index]?.videoUrl}
                        />
                      </div>
                      {
                        formik.values.faqs.length > 1 &&
                      <button type="button" className="dlt-btn" onClick={() => removeFaq(index)}>
                        <Image src="/images/trash.svg" width={40} height={40} alt="Delete" />
                      </button>
                      }
                    </div>
                  ))}
                  <div>
                    <button type="button" className="add-more-btn mt-3" onClick={addFaq}>
                      <span>Add More</span>
                    </button>
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
