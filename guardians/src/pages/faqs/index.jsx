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

import api, { setAuthToken } from 'src/axiosInstance'
import { AuthContext } from 'src/auth/AuthContext'

import ReactPlayer from 'react-player';

const Employees = () => {

  const [age, setAge] = useState('');
  const [view, setView] = useState('byFaq');

  const { isAuthenticated, user, loading, logout } = useContext(AuthContext);
  const [rows, setRows] = useState([])
  const [filteredRows, setFilteredRows] = useState([]);
  const [search, setSearch] = useState('');
  const [fCollapse, setFcollapse] = useState(false)
  const [faqByEmployee, setFaqByEmployee] = useState(null)
  useEffect(() => {
    const getData = async () => {
      try {
       
        setAuthToken(user.token);
        const res = await api.get('faqs/faqs');
        const data = await res.data;
        const rows = data.map((item, index) => {
          return (
            {
              id: item.id,
              FAQ: item.title,
              video: item.videoUrl,
            }
          )
        })
        setRows(rows);
      } catch (er) {
        alert(er)
      }
    }
    const getFaqByEmployee = async () => {
      try {
       
        setAuthToken(user.token);
        const res = await api.get('faqs/allfaqswithprogress');
        const data = await res.data;
        setFaqByEmployee(data)
      } catch (er) {
        alert(er)
      }
    }
    getFaqByEmployee();
    getData();
  }, [user])
  useEffect(() => {
    let filtered = rows;
    // console.log('filter', filtered);
    if (search) {
      filtered = filtered.filter(row => row.FAQ ? row.FAQ.toLowerCase().includes(search.toLowerCase()) : false);
    }
    setFilteredRows(filtered);
  }, [search, rows]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const router = useRouter()

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const columns = [
    { field: 'FAQ', headerName: 'FAQ', width: 600 },
    {
      field: 'video', headerName: 'Video',  width: 250, height:640,
      renderCell: (params) => {
        if (params.value) {
          return (
            <div className='vrp-wrap'>
              <ReactPlayer
                  url={params.value}
                  controls
              />
              {/* <Image src="/images/green-tick.svg" width={35} height={35} /> */}
            </div>
          )
        } else {
          return (
            <div className='vr-wrap'>
              <Image src="/images/red-cross.svg" width={35} height={35} />
            </div>
          )
        }
      }
    },
    {
      field: 'actions', headerName: 'Actions', width: 300,
      renderCell: (params) => {
        // console.log('para', params);
        const { id } = params.row;
        return (
          <div className='tb-btn-grp'>
            <button onClick={() => router.push(`/faqs/edit/${id}`)} className="bt-chip">
              <Image src="/images/edit-icon.svg" width={20} height={20} />
              <span>Edit</span>
            </button>
            {/*<button className="bt-chip danger" onClick={() => router.push(`/employees/view/${id}`)}>
              <Image src="/images/delete-icon.svg" width={20} height={20} />
              <span className='text-danger'>Delete</span>
            </button>*/}
          </div>
        )
      }
    },
  ];

  // const rows = [
  //   { id: 1, FAQ: 'Snow', video: true },
  //   { id: 5, FAQ: 'Snow', video: true },
  // ];

  return (
    <ApexChartWrapper>
      <section className='sec ven-act-sec mt-4'>
        <div className="row">
          <div className="col-12">
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <div>
                <h3 className="sm-head">
                  FAQs
                </h3>
                <p className="sm-para">
                  Tables display sets of data. They can be fully customized
                </p>
              </div>
              <div className='d-flex flex-wrap align-items-center gap-3'>
                <Button
                  size='medium'
                  variant='contained'
                  sx={{ marginBottom: 0 }}
                  onClick={() => setView((state) => state == 'byEmployee' ? 'byFaq' : 'byEmployee')}
                  startIcon={<ArrowForwardIcon />}
                >
                  {view == 'byEmployee' ? 'View By Faq' : 'View By Employee'}
                </Button>
                <Button
                  size='medium'
                  variant='contained'
                  sx={{ marginBottom: 0 }}
                  onClick={() => router.push('/faqs/add')}
                  startIcon={<ArrowForwardIcon />}
                >
                  Add FAQ
                </Button>
                {
                  view == 'byFaq' &&
                  <FormControl className='circ-select'>
                    <TextField fullWidth label='Search' placeholder='Search' onChange={handleSearchChange} />
                  </FormControl>
                }
              </div>
            </div>
          </div>
          {/* <div className="col-12 mt-3 mb-3">
              <div className="tp-flt-row">
                <div className="l-part">
                  <div className="it">
                    <FormControl className='circ-select'>
                      <InputLabel id="demo-simple-select-label">Select City</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={age}
                        label="Select City"
                        onChange={handleChange}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="it">
                    <FormControl className='circ-select'>
                      <InputLabel id="demo-simple-select-label">Select State</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={age}
                        label="Select State"
                        onChange={handleChange}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="it">
                    <FormControl className='circ-select'>
                      <InputLabel id="demo-simple-select-label">Salary Range</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={age}
                        label="Salary Range"
                        onChange={handleChange}
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div className="r-part">
                  <div className="it">
                    <FormControl  className='circ-select'> 
                      <TextField fullWidth label='Search' placeholder='Search' />
                    </FormControl>
                  </div>
                </div>
              </div>
            </div> */}
          {
            view == 'byFaq' ?
              <div className="col-12 mt-2">
                <div className="rec-venue-table">
                  <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    rowHeight={120}
                    disableAutosize={false}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                      },
                    }}
                    pageSizeOptions={[5, 10]}
                  // checkboxSelection
                  />
                </div>
              </div> :
              <div className="col-12 mt-4">
                
                    {
                      faqByEmployee && faqByEmployee.map((faq,i)=>{
                        
                        // const totalProgress = faq?.faqs?.reduce((acc, progress) =>{
                        //   const num1 = acc.completionPercent || 0;
                        //   const num2 = progress.completionPercent || 0;
                        
                        //   return parseInt(num1) + parseInt(num2)
                        // });
                        // const avgProgress = totalProgress ? (totalProgress / faq?.faqs?.length).toFixed(0) : 0;
                        const avgProgress = faq.averageCompletion || 0;
                        return(
                          
                          <div className="faq-prg mb-3 style-2" key={i}>
                            <div className="tp d-flex flex-wrap ">
                              <h3 className='sm-head style-2'>{faq?.name}</h3>
                              <p><span>{avgProgress.toFixed()}%</span> Completed</p>
                            </div>
                            <div className="prog-bar mt-3 mb-3">
                              <div className="bar" style={{ '--width': `${avgProgress}%` }}></div>
                            </div>
                            <Link href="javascript:void(0)" passHref>
                              <a className="link-btn" onClick={() => setFcollapse(i)}>
                                <span>View Detailed</span>
                                <Image src="/images/arrow-right-blue.svg" width={12} height={12} alt="" />
                              </a>
                            </Link>
                            {
                              fCollapse == i &&
                              <div className="faq-pr-wrap pt-3">
                                {
                                  faq.faqs && faq.faqs.map((item, index) => {

                                    return (
                                      <div className="bl-pr-wrap" key={index}>
                                        <p>{item.title}</p>
                                        <h4><span>{item.completionPercent}%</span> Watched</h4>
                                        <span style={{ '--width': `${item.completionPercent}%` }}></span>
                                      </div>
                                    )
                                  })
                                }
                              </div>
                            }
                          </div>
                       
                        )
                      })
                    }
                   
                
              </div>
          }
        </div>
      </section>
    </ApexChartWrapper>
  )
}

export default Employees
