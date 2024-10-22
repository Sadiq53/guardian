// ** MUI Imports
import Grid from '@mui/material/Grid'

import { useState } from 'react'

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



const Employees = () => {

  const [age, setAge] = useState('');

  const router = useRouter()

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const columns = [
    { field: 'employeeName', headerName: 'oFFICER NAME', width: 200},
    { field: 'rating', headerName: 'assigned FOR ', width: 200, 
      renderCell: (params)=>{
        // console.log('para', params);
        const {id} = params.row;
        return(
          <div className='rt-star'>
            <Image src="/images/rt-star.svg" width={20} height={20} />
            <span>{params.value}</span>
          </div>
        )
      }
    },
    { field: 'months', headerName: 'Phone number', width: 200 },
    { field: 'dateOfHiring', headerName: 'Email Address', width: 130},
    { field: 'actions', headerName: 'Actions', width: 300, 
      renderCell: (params)=>{
        // console.log('para', params);
        const {id} = params.row;
        return(
          <div className='tb-btn-grp'>
            <button onClick={()=>alert(id)} className="bt-chip">
              <Image src="/images/edit-icon.svg" width={20} height={20} />
              <span>Edit</span>
            </button>
            <button className="bt-chip" onClick={()=>router.push(`/rating-officer/view/${id}`)}>
            <Image src="/images/view-icon.svg" width={20} height={20} />
              <span>View</span>
            </button>
          </div>
        )
      }
     },
  ];
  
  const rows = [
    { id: 1, employeeName: 'Snow', rating: '4.5', months: '50 Hrs', dateOfHiring: '10 JUN 1993', faqProgress:'100%'},
    { id: 25, venueName: 'Snow', location: 'Jon', phoneNumber: 35, verified: true},
  ];

  return (
    <ApexChartWrapper>
        <section className='sec ven-act-sec mt-4'>
          <div className="row">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="sm-head">
                  Rating Officers
                  </h3>
                  <p className="sm-para">
                  Tables display sets of data. They can be fully customized
                  </p>
                </div>
                <Button
                  size='medium'
                  variant='contained'
                  sx={{ marginBottom: 7 }}
                  onClick={() => router.push('/rating-officer/add')}
                  startIcon={<ArrowForwardIcon />}
                >
                  Add Officer
                </Button>
              </div>
            </div>
            <div className="col-12 mt-3 mb-3">
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
            </div>
            <div className="col-12 mt-2">
              <div className="rec-venue-table">
                <DataGrid
                  rows={rows}
                  columns={columns}
                  disableAutosize={false}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 10 },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
                  checkboxSelection
                />
              </div>
            </div>
          </div>
        </section>
    </ApexChartWrapper>
  )
}

export default Employees
