// ** MUI Imports
import Grid from '@mui/material/Grid'

import { useState, useContext, useEffect } from 'react'

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

import dayjs from 'dayjs'
import { t } from 'i18next'

import { useTranslation } from 'react-i18next'



const Employees = () => {
  const { isAuthenticated, user, loading, logout } = useContext(AuthContext);

  const [rows, setRows] = useState([])

  const [age, setAge] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [weekDaySalaryRange, setWeekDaySalaryRange] = useState('');
  const [search, setSearch] = useState('');

  const router = useRouter()

  const {t} = useTranslation('common')

  console.log('Current locale:', router.locale);
  console.log('Translation for welcome:', t('welcome'));

  useEffect(() => {
    const getData = async()=>{
      try{
        console.log('Loading', user.token, user)
        setAuthToken(user.token);
        const res = await api.get('venues/venues');
        const data =  await res.data;
        const rows = data.map((item,index)=>{
          return(
            {
              id: item.id,
              employeeName: item.name,
              city: item.city,
              state: item.state,
              weekDay: item.ratesSundayToThursday,
              weekEnd: item.ratesFridaySaturday,
              startDate: item.startDate && dayjs(item.startDate).format('DD MMM YYYY')
            }
          )
        })
        setRows(rows);
      }catch(er){
        alert(er)
      } 
    }
    getData();
  },[user])

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    let filtered = rows;
    if (city) {
      filtered = filtered.filter(row => row.city === city);
    }
    if (state) {
      filtered = filtered.filter(row => row.state === state);
    }
    if (salaryRange) {
      // Assuming salaryRange is a range like "10-20"
      const [min, max] = salaryRange.split('-').map(Number);
      filtered = filtered.filter(row => row.weekEnd >= min && row.weekEnd <= max);
    }
    if (weekDaySalaryRange) {
      // Assuming salaryRange is a range like "10-20"
      const [min, max] = salaryRange.split('-').map(Number);
      filtered = filtered.filter(row => row.weekDay >= min && row.weekDay <= max);
    }
    if (search) {
      filtered = filtered.filter(row => row.employeeName.toLowerCase().includes(search.toLowerCase()));
    }
    setFilteredRows(filtered);
  }, [city, state, salaryRange, search, rows, weekDaySalaryRange]);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleStateChange = (event) => {
    setState(event.target.value);
  };

  const handleSalaryRangeChange = (event) => {
    setSalaryRange(event.target.value);
  };

  const handleSalaryRangeChange2 = (event) => {
    setWeekDaySalaryRange(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const range = ['100-500','500-1000','1000-1500','1500-2000']

  const columns = [
    { field: 'employeeName', headerName: 'venue Name', width: 200},
    { field: 'city', headerName: 'City', width: 150},
    { field: 'state', headerName: 'Regioner', width: 150},
    { field: 'weekDay', headerName: 'Week Day', width: 100},
    { field: 'weekEnd', headerName: 'Off Day', width: 100},
    { field: 'startDate', headerName: 'Start date', width: 200},
    { field: 'actions', headerName: 'Actions', width: 300, 
      renderCell: (params)=>{
        // console.log('para', params);
        const {id} = params.row;
        return(
          <div className='tb-btn-grp'>
            <button onClick={()=>router.push(`/venues/edit/${id}`)} className="bt-chip">
              <Image src="/images/edit-icon.svg" width={20} height={20} />
              <span>Edit</span>
            </button>
            <button className="bt-chip" onClick={()=>router.push(`/venues/view/${id}`)}>
            <Image src="/images/view-icon.svg" width={20} height={20} />
              <span>View</span>
            </button>
          </div>
        )
      }
     },
  ];
  
  // const rows = [
  //   { id: 1, employeeName: "Canada's Bridal Show", location: 'Metro Toronto Convention Centre, Hall A', phoneNumber: '0271 2025 23658', startDate: '10 JUN 1993'},
  //   { id: 1, employeeName: "Canada's Bridal Show", location: 'Metro Toronto Convention Centre, Hall A', phoneNumber: '0271 2025 23658', startDate: '10 JUN 1993'},
    
  // ];

  return (
    <ApexChartWrapper>
        <section className='sec ven-act-sec mt-4'>
          <div className="row">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="sm-head">
                  {t('venues')}
                  </h3>
                  <p className="sm-para">
                  Tables display sets of data. They can be fully customized
                  </p>
                </div>
                <Button
                  size='medium'
                  variant='contained'
                  sx={{ marginBottom: 7 }}
                  onClick={() => router.push('/venues/add')}
                  startIcon={<ArrowForwardIcon />}
                >
                  Add New
                </Button>
              </div>
            </div>
            <div className="col-12 mt-3 mb-3">
                  {/* {JSON.stringify(rows)} */}
            <div className="tp-flt-row">
              <div className="l-part">
                <div className="it">
                  <FormControl className='circ-select'>
                    <InputLabel id="city-select-label">Select City</InputLabel>
                    <Select
                      labelId="city-select-label"
                      id="city-select"
                      value={city}
                      label="Select City"
                      onChange={handleCityChange}
                    >
                      <MenuItem value={''}>All</MenuItem>
                      {
                        rows && Array.from(new Set(rows.map(row => row.city))).map((row, index) =>{
                          return(
                            <MenuItem key={index} value={row}>{row}</MenuItem>
                          )
                        })
                      }
                    </Select>
                  </FormControl>
                </div>
                <div className="it">
                  <FormControl className='circ-select'>
                    <InputLabel id="state-select-label">Select Regioner</InputLabel>
                    <Select
                      labelId="state-select-label"
                      id="state-select"
                      value={state}
                      label="Select State"
                      onChange={handleStateChange}
                    >
                      <MenuItem value={''}>All</MenuItem>
                      {
                        rows && Array.from(new Set(rows.map(row => row.state))).map((row, index) =>{
                          return(
                            <MenuItem key={index} value={row}>{row}</MenuItem>
                          )
                        })
                      }
                    </Select>
                  </FormControl>
                </div>
                <div className="it">
                  <FormControl className='circ-select'>
                    <InputLabel id="salary-range-select-label">Week End</InputLabel>
                    <Select
                      labelId="salary-range-select-label"
                      id="salary-range-select"
                      value={salaryRange}
                      label="Salary Range"
                      onChange={handleSalaryRangeChange}
                    >
                      <MenuItem value={''}>All</MenuItem>
                      {
                        range.map((range, i) =>{
                          return (
                            <MenuItem key={i} value={range}>{range}</MenuItem>
                          )
                        })
                      }
                    </Select>
                  </FormControl>
                </div>
                <div className="it">
                  <FormControl className='circ-select'>
                    <InputLabel id="salary-range-select-label">Off Day</InputLabel>
                    <Select
                      labelId="salary-range-select-label"
                      id="salary-range-select"
                      value={weekDaySalaryRange}
                      label="Salary Range"
                      onChange={handleSalaryRangeChange2}
                    >
                      <MenuItem value={''}>All</MenuItem>
                      {
                        range.map((range, i) =>{
                          return (
                            <MenuItem key={i} value={range}>{range}</MenuItem>
                          )
                        })
                      }
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="r-part">
                <div className="it">
                  <FormControl className='circ-select'>
                    <TextField fullWidth label='Search' placeholder='Search' value={search} onChange={handleSearchChange} />
                  </FormControl>
                </div>
              </div>
            </div>
            </div>
            <div className="col-12 mt-2">
              <div className="rec-venue-table">
                <DataGrid
                  rows={filteredRows}
                  columns={columns}
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
            </div>
          </div>
        </section>
    </ApexChartWrapper>
  )
}

export default Employees
