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

import { Card, CardContent, Button, Box } from '@mui/material'

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

import { checkGridRowIdIsValid, DataGrid, GridColDef } from '@mui/x-data-grid';

import Image from 'next/image'
import Link from 'next/link'

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import TextField from '@mui/material/TextField'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import { useTranslation } from 'next-i18next'

import AddIcon from '@mui/icons-material/Add';
import Modal from 'react-bootstrap/Modal';
// const { t } = useTranslation('common')


import { useRouter } from 'next/router'

import { AuthContext } from 'src/auth/AuthContext'
import api, { setAuthToken } from 'src/axiosInstance'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import dayjs from 'dayjs'

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;



    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const getWeekDays = (startDate) => {
    const weekDays = [];
    const start = new Date(startDate);
    for (let i = 0; i < 7; i++) {
        const current = new Date(start);
        current.setDate(start.getDate() + i);
        weekDays.push(current);
    }
    return weekDays;
};

const getMonthsDays = (startDate) => {
    const weekDays = [];
    const start = new Date(startDate);
    for (let i = 0; i < 31; i++) {
        const current = new Date(start);
        current.setDate(start.getDate() + i);
        weekDays.push(current);
    }
    return weekDays;
};

const JobReports = () => {

    const { user } = useContext(AuthContext);

    const [age, setAge] = useState('');
    const [venues, setVenues] = useState([]);
    const [venueId, setVenueId] = useState(0);
    const [venueId2, setVenueId2] = useState(0);
    const [venueId3, setVenueId3] = useState(0);
    const [value, setValue] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const [startDate2, setStartDate2] = useState(null);
    const [startDate3, setStartDate3] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [endDate2, setEndDate2] = useState(null);
    const [endDate3, setEndDate3] = useState(null);
    const [weekData, setWeekData] = useState(null);
    const [weekDays, setWeekDays] = useState(null);
    const [monthData, setMonthData] = useState(null);
    const [monthDays, setMonthDays] = useState(null);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(null);
    const [changeTab, setChangeTab] = useState(null)
    const [dashData, setDashData] = useState(null);
    const [row, setRow] = useState([])
    const [op, setop] = useState(false)
    const [show, setShow] = useState(false);


    useEffect(() => {
        const getVenues = async () => {
            try {
                setAuthToken(user.token);
                const res = await api.get('venues/venues');
                setVenues(res.data);
            } catch (er) {
                alert(er)
            }
        }
        getVenues()
    }, [])

    useEffect(() => {
        if (startDate && endDate && venueId) {
            if (new Date(startDate) < new Date(endDate)) {

                setAuthToken(user.token);
                const getData = async () => {
                    const res = await api.post(`jobs/jobs/venue/${venueId}`, { startDate: startDate, endDate: endDate });
                    const data = res.data.jobs?.map((item) => {
                        const employees = item?.employees ? item.employees : [];
                    
                        // Calculate total hours spent and format it to two decimal places with "hr"
                        const totalHoursSpent = employees?.reduce((total, value) => {
                            return total + (value.totalhour || 0);
                        }, 0);
                    
                        const formattedTotalHours = totalHoursSpent ? `${totalHoursSpent.toFixed(2)}hr` : '0.00hr'; // Format to 2 decimal places
                    
                        const isWeekday = employees?.some(value => value.isweekday) ? 'Yes' : 'No';
                        const firstMeetingDate = employees.length > 0 ? dayjs(employees[0].meetingTime).format('DD MMM YYYY') : '';
                    
                        return {
                            id: item?.JobId,
                            date: firstMeetingDate, // Return the first formatted meeting date
                            weekday: isWeekday,
                            employees: employees?.map(value => value.employee), // Get the employee names
                            hoursSpend: formattedTotalHours // Total hours spent formatted
                        };
                    });
                    
                    
                    // Set the rows with the transformed data
                    setRows(data);
                    
                }
                getData()
            } else {
                console.error('Start date should be less than end date');
            }
        }
    }, [startDate, endDate, venueId, changeTab])

    useEffect(() => {
        console.log('start data', dayjs(startDate2).format('YYYY-MM-DD'), 'end date', dayjs(endDate2));
        const sd = dayjs(startDate2).format('YYYY-MM-DD')
        const ed = dayjs(endDate2).format('YYYY-MM-DD')
        if (startDate2 && endDate2 && venueId2) {
            if (new Date(startDate2) < new Date(endDate2)) {
                setAuthToken(user.token);
                setLoading(true);
                const getData = async () => {
                    const res = await api.post(`jobs/jobs/venuegroup/${venueId2}`, { startDate: sd, endDate: ed });
                    setWeekDays(getWeekDays(startDate2))
                    // console.log(res.data)
                    setWeekData(res.data);
                    setLoading(false);
                    setMonthData(null)
                    setMonthDays(null)
                    setVenueId3(null)
                }
                getData()
            } else {
                console.error('Start date should be less than end date');
            }
        }
    }, [startDate2, endDate2, venueId2, changeTab])

    useEffect(() => {
        console.log('start data', dayjs(startDate3).format('YYYY-MM-DD'), 'end date', dayjs(endDate3));
        const sd = dayjs(startDate3).format('YYYY-MM-DD')
        const ed = dayjs(endDate3).format('YYYY-MM-DD')
        if (startDate3 && endDate3 && venueId2) {
            if (new Date(startDate3) < new Date(endDate3)) {
                setAuthToken(user.token);
                setLoading(true);
                const getData = async () => {
                    const res = await api.post(`jobs/jobs/venuegroup/${venueId2}`, { startDate: sd, endDate: ed });
                    setMonthDays(getMonthsDays(startDate3))
                    setMonthData(res.data);
                    setLoading(false);
                    setWeekData(null)
                    setWeekDays(null)
                    setVenueId2(null)
                }
                getData()
            } else {
                console.error('Start date should be less than end date');
            }
        }
    }, [startDate3, endDate3, venueId3, changeTab])

    useEffect(()=>{
        const getDashData = async ()=>{
          const res = await api.get('users/admindashboard');
          setDashData(res.data);
        //   console.log(res.data)
          const data = res.data.processedJobs.slice(0, 10).map((job,index)=>{
            return(
              {
                id: job.JobId || '',
                doorman: job.doormanName || '',
                venueName: job.venueName || '',
                employees: job.employeeNames || '',
                comment: job.comments || '',
                date: job?.employees[0]?.meetingTime && dayjs(job?.employees[0]?.meetingTime).format('DD MMM YYYY'),
              }
            )
          })
          setRow(data)
        }
        getDashData();
      },[])

      const handleClose = (e) => {
        setShow(false)
    };
      const handleShow = (e) => {
        setop(e)
        setShow(true)
    };

      const columnsForAllData = [
        { field: 'doorman', headerName: 'Submited By', width: 200},
        { field: 'venueName', headerName: 'Venue Name', width: 200},
        { field: 'employees', headerName: 'Employees', width: 200},
        { field: 'comment', headerName: 'Comment', width: 200,
          renderCell: (params)=>{
            // console.log('para', params);
            const {id} = params.row;
            const val = params.value
            return(
              <>
                
                {
                    val ?
                    <div className='com-wr'>
                        <p>{val}</p>
                        <span className='pill-more' onClick={()=>handleShow(val)}>
                            read more
                        </span>
                    </div>:
                    '-'
                }
                
              </>
            )
          }
         },
        { field: 'date', headerName: 'Date', width: 200 },
        // { field: 'verified', headerName: 'Verified', width: 130, 
        //   renderCell: (params)=>{
        //     if(params.value){
        //       return(
        //         <div className='vr-wrap'>
        //         <Image src="/images/green-tick.svg" width={35} height={35} />
        //         </div>
        //       )
        //     }else{
        //       return(
        //         <div className='vr-wrap'>
        //         <Image src="/images/red-cross.svg" width={35} height={35} />
        //         </div>
        //       )
        //     }
        //   }
        //  },
        { field: 'actions', headerName: 'Actions', width: 300, 
          renderCell: (params)=>{
            // console.log('para', params);
            const {id} = params.row;
            return(
              <div className='tb-btn-grp'>
                <button onClick={()=>router.push(`/jobs/edit/${id}`)} className="bt-chip">
                  <Image src="/images/edit-icon.svg" width={20} height={20} />
                  <span>Edit</span>
                </button>
                <button className="bt-chip" onClick={()=>router.push(`/jobs/view/${id}`)}>
                <Image src="/images/view-icon.svg" width={20} height={20} />
                  <span>View</span>
                </button>
              </div>
            )
          }
         },
      ];

    const handleChange2 = (event, newValue) => {
        setChangeTab(newValue)
        setValue(newValue);
    };

    const router = useRouter()

    const handleChange = (event) => {
        setVenueId(event.target.value);
    };
    const handleChange3 = (event) => {
        setVenueId2(event.target.value);
    };

    const handleChange4 = (event) => {
        setVenueId3(event.target.value);
    };

    const columns = [
        { field: 'date', headerName: 'Date', width: 200 },
        { field: 'weekday', headerName: 'Offday', width: 200 },
        { field: 'employees', headerName: 'Employees', width: 130 },
        { field: 'hoursSpend', headerName: 'Hours Spend', width: 130 },
        {
            field: 'actions', headerName: 'Actions', width: 250,
            renderCell: (params) => {
                // console.log('para', params);
                const { id } = params.row;
                return (
                    <div className='tb-btn-grp'>
                        <button className="bt-chip" onClick={() => router.push(`/jobs/edit/${id}`)}>
                            <Image src="/images/edit-icon.svg" width={20} height={20} />
                            <span>Edit</span>
                        </button>
                        <button className="bt-chip" onClick={() => router.push(`/jobs/view/${id}`)}>
                            <Image src="/images/view-icon.svg" width={20} height={20} />
                            <span>View All</span>
                        </button>
                    </div>
                )
            }
        },
    ];
    const columns2 = [
        { field: 'Date', headerName: 'Week', width: 200 },
        { field: 'Weekday', headerName: 'Weekday', width: 200 },
        { field: 'Weekend', headerName: 'Weekend', width: 200, },
        { field: 'VenueLocation', headerName: 'Venue Location', width: 130 },
        { field: 'HoursSPend', headerName: 'Hours Spend', width: 130 },
        {
            field: 'actions', headerName: 'Actions', width: 250,
            renderCell: (params) => {
                // console.log('para', params);
                const { id } = params.row;
                return (
                    <div className='tb-btn-grp'>
                        {/* <button className="bt-chip" onClick={() => router.push(`/employees/view/${id}`)}>
                            <Image src="/images/edit-icon.svg" width={20} height={20} />
                            <span>Edit</span>
                        </button> */}
                        <button className="bt-chip" onClick={() => router.push(`/employees/view/${id}`)}>
                            <Image src="/images/view-icon.svg" width={20} height={20} />
                            <span>View All</span>
                        </button>
                    </div>
                )
            }
        },
    ];

    // const rows = [
    //     { id: 1, Date: '24 JUN 2024', Weekday: 'Yes', Weekend: 'No', VenueLocation: 'Moiz Saifee', HoursSPend: '20:00' },
    //     { id: 2, Date: '24 JUN 2024', Weekday: 'Yes', Weekend: 'No', VenueLocation: 'Richardson Garden', HoursSPend: '20:00' },
    // ];
    const rows2 = [
        { id: 1, Date: 'week 2 of 2024', Weekday: 'Yes', Weekend: 'No', VenueLocation: 'Moiz Saifee', HoursSPend: '20:00' },
        { id: 2, Date: 'week 2 of 2024', Weekday: 'Yes', Weekend: 'No', VenueLocation: 'Richardson Garden', HoursSPend: '20:00' },
    ];

    const handlePrev = () => {
        setStartDate2((prev) => dayjs(prev).subtract(6, 'day').toDate());
        setEndDate2((prev) => dayjs(prev).subtract(6, 'day').toDate());
    };

    const handleNext = () => {
        setStartDate2((prev) => dayjs(prev).add(6, 'day').toDate());
        setEndDate2((prev) => dayjs(prev).add(6, 'day').toDate());
    };
//-------------------------------------------------------------------------------
    const handlePrev2 = () => {
        setStartDate3((prev) => dayjs(prev).subtract(30, 'day').toDate());
        setEndDate3((prev) => dayjs(prev).subtract(30, 'day').toDate());
    };

    const handleNext2 = () => {
        setStartDate3((prev) => dayjs(prev).add(30, 'day').toDate());
        setEndDate3((prev) => dayjs(prev).add(30, 'day').toDate());
    };

    return (
        <ApexChartWrapper>
            <section className='sec ven-act-sec '>
                <div className="row">
                    <div className="col-12">
                        <Box sx={{ width: '100%' }} className='c-tabs'>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange2} aria-label="basic tabs example">
                                    <Tab label="All Jobs" {...a11yProps(0)} />
                                    <Tab label="Weekly Report" {...a11yProps(1)} />
                                    <Tab label="Monthly Report" {...a11yProps(2)} />
                                    <Tab label="Venue Vise" {...a11yProps(3)} />
                                </Tabs>
                            </Box>
                            <CustomTabPanel value={value} index={3} className="p-0 tab-body">
                                <>
                                    <Card className='mb-4'>
                                        <CardContent>
                                            <div className="col-12">
                                                <div className="row align-items-center row-gap-25">
                                                    <div className='col-lg-5 col-12'>
                                                        <h3 className="sm-head">
                                                            Job Reports
                                                        </h3>
                                                        <p className="sm-para">
                                                            Tables display sets of data. They can be fully customized
                                                        </p>
                                                    </div>
                                                    <div className="col-lg-7 col-12">
                                                        <div className="row row-gap-25">
                                                            <div className="col-lg-4 col-12">
                                                                {
                                                                    venues.length &&
                                                                    <FormControl fullWidth>
                                                                        <InputLabel id="demo-simple-select-label">Select Venue</InputLabel>
                                                                        <Select
                                                                            labelId="demo-simple-select-label"
                                                                            id="demo-simple-select"
                                                                            // value={venueId}
                                                                            label="Select Venue"
                                                                            onChange={handleChange}
                                                                        >

                                                                            {
                                                                                venues.length && venues.map((venue, index) => {
                                                                                    return (
                                                                                        <MenuItem key={index} value={venue.id}>{venue.name}</MenuItem>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </Select>
                                                                    </FormControl>
                                                                }

                                                            </div>
                                                            <div className="col-lg-8 col-12">
                                                                <div className="row row-gap-25">
                                                                    <div className="col-lg-6 col-12">
                                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                            <DatePicker
                                                                                fullWidth
                                                                                className='fullwidth'
                                                                                label="From"
                                                                                onChange={value => setStartDate(value)}
                                                                                renderInput={(params) => (
                                                                                    <TextField
                                                                                        {...params}
                                                                                        fullWidth
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </LocalizationProvider>
                                                                    </div>
                                                                    <div className="col-lg-6 col-12">
                                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                            <DatePicker
                                                                                fullWidth
                                                                                className='fullwidth'
                                                                                label="To"
                                                                                onChange={value => setEndDate(value)}
                                                                                renderInput={(params) => (
                                                                                    <TextField
                                                                                        {...params}
                                                                                        fullWidth
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </LocalizationProvider>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bl-card">
                                                    <div className="l-part">
                                                        <h3 className="sm-head">
                                                            Total Billing Hours
                                                        </h3>
                                                        <p>
                                                            Billing hours for <b>{venues.length && venues.filter((v) => v.id == venueId)[0]?.name}</b> From <b>{startDate && dayjs(startDate).format('DD MMM YYYY')} - {endDate && dayjs(endDate).format('DD MMM YYYY')}</b> is:
                                                        </p>
                                                    </div>
                                                    <div className="r-part">
                                                        <h2>
                                                            {/* {rows.length && rows.reduce((a,b)=>parseInt(a.hoursSpend)+parseInt(b.hoursSpend))} Hours */}
                                                            {rows.length > 0 && (
                                                                rows.length === 1
                                                                    ? `${parseInt(rows[0]?.hoursSpend)} Hours`
                                                                    : `${rows.reduce((a, b) => parseInt(a.hoursSpend) + parseInt(b.hoursSpend))} Hours`
                                                            )}
                                                        </h2>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
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
                                            // checkboxSelection
                                            />
                                        </div>
                                    </div>
                                </>
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={1} className="tab-body">
                                <>
                                    <Card className='mb-4'>
                                        <CardContent>
                                            <div className="row align-items-center row-gap-25">
                                                <div className='col-lg-7 col-12'>
                                                    <h3 className="sm-head">
                                                        Job Reports
                                                    </h3>
                                                    <p className="sm-para">
                                                        Tables display sets of data. They can be fully customized
                                                    </p>
                                                </div>
                                                <div className="col-lg-5 col-12">
                                                    <div className="row row-gap-25">
                                                        <div className="col-lg-6 col-12">
                                                            {
                                                                venues.length &&
                                                                <FormControl fullWidth>
                                                                    <InputLabel id="demo-simple-select-label">Select Venue</InputLabel>
                                                                    <Select
                                                                        labelId="demo-simple-select-label"
                                                                        id="demo-simple-select"
                                                                        // value={venueId}
                                                                        label="Select Venue"
                                                                        onChange={handleChange3}
                                                                    >

                                                                        {
                                                                            venues.length && venues.map((venue, index) => {
                                                                                return (
                                                                                    <MenuItem key={index} value={venue.id}>{venue.name}</MenuItem>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Select>
                                                                </FormControl>
                                                            }

                                                        </div>
                                                        <div className="col-lg-6 col-12">
                                                            <div className="row row-gap-25">
                                                                <div className="col-lg-12 col-12">
                                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                        <DatePicker
                                                                            fullWidth
                                                                            className='fullwidth'
                                                                            label="Start Date"
                                                                            onChange={value => {
                                                                                setStartDate2(value)
                                                                                setEndDate2(dayjs(value).add(6, 'day').toDate());
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    fullWidth
                                                                                />
                                                                            )}
                                                                        />
                                                                    </LocalizationProvider>
                                                                </div>
                                                                {/* <div className="col-lg-6 col-12">
                                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                        <DatePicker
                                                                            fullWidth
                                                                            className='fullwidth'
                                                                            label="To"
                                                                            onChange={value => setEndDate2(value)}
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    fullWidth
                                                                                />
                                                                            )}
                                                                        />
                                                                    </LocalizationProvider>
                                                                </div> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="col-12">
                                                <div className="d-flex flex-wrap align-items-center justify-content-between">
                                                    <div>
                                                        <h3 className="sm-head">
                                                            Job Reports
                                                        </h3>
                                                        <p className="sm-para">
                                                            Tables display sets of data. They can be fully customized
                                                        </p>
                                                    </div>
                                                    <div className="d-flex align-itesms-center gap-2">
                                                        <FormControl fullWidth>
                                                            <InputLabel id="demo-simple-select-label">Select Date Range</InputLabel>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={age}
                                                                label="Select Venue"
                                                                onChange={handleChange}
                                                            >
                                                                <MenuItem value={10}>Ten</MenuItem>
                                                                <MenuItem value={20}>Twenty</MenuItem>
                                                                <MenuItem value={30}>Thirty</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                </div>
                                                <div className="bl-card">
                                                    <div className="l-part">
                                                        <h3 className="sm-head">
                                                            All Venues
                                                        </h3>
                                                        <p>
                                                            Billing hours for <b>gokuldas garden</b> From <b>24 JUN 2024 - 15 JUL 2024</b> is:
                                                        </p>
                                                    </div>

                                                </div>
                                            </div> */}
                                        </CardContent>
                                    </Card>
                                    <div className="col-12 mt-2">
                                        <Card>
                                            <CardContent>
                                                <div className="week-container">
                                                    <div className="week-top">
                                                        <div>
                                                            <h3 className="sm-head">{venues && venues.filter((v)=>v.id == venueId2)[0]?.name}</h3>
                                                            <p className="para">{dayjs(startDate2).format('YYYY-MM-DD') || 'From'} - {dayjs(endDate2).format('YYYY-MM-DD') || 'To'}</p>
                                                        </div>
                                                        <div className="nv">
                                                            <button className='prev' onClick={handlePrev}><Image src="/images/prev.svg" width={55} height={55} alt="" /></button>
                                                            <button className='next' onClick={handleNext}><Image src="/images/next.svg" width={55} height={55} alt="" /></button>
                                                        </div>
                                                    </div>
                                                    <div className={`week-calender ${loading && 'loading'}`}>
                                                        {/* {
                                                            weekData &&
                                                            weekData.length > 0 &&
                                                            weekData.groupedJobs.length > 0 && weekData.groupedJobs.map((item,i)=>{

                                                            })
                                                        } */}
                                                        {/* <div className="week-col">
                                                            <div className="week-head">
                                                                <h3>MON</h3>
                                                                <p>20 Jun 2024</p>
                                                            </div>
                                                            <div className="week-data">
                                                                <div className="week-card">
                                                                    <div className="tp">
                                                                        <span>16:00 - 20:00</span>
                                                                    </div>
                                                                    <div className="week-cell">
                                                                        <p>Johnkdjcjkdbdbjkdbfkjvbfkjvb</p>
                                                                        <span>+4</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                        {(weekDays && weekData) && weekDays.map((date, i) => {
                                                            const dateString = date.toISOString().split('T')[0];
                                                            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
                                                            const dayJobs = weekData.groupedJobs[dateString] || {};
                                                            const weekd = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

                                                            return (
                                                                <div className="week-col" data-ff={new Date(date)} key={dateString}>
                                                                    <div className="week-head">
                                                                        <h3>{weekd[new Date(dateString).getDay() + 1]}</h3>
                                                                        <p>{date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                                    </div>
                                                                    <div className="week-data">
                                                                        {Object.keys(dayJobs).length > 0 ? (
                                                                            Object.entries(dayJobs).map(([timeSlot, jobs]) => (
                                                                                jobs.map(job => (
                                                                                    <div className="week-card" key={job.JobId}>
                                                                                        <div className="tp">
                                                                                            <span>{timeSlot}</span> {/* Display the time slot */}
                                                                                        </div>
                                                                                        <div className="week-cell">
                                                                                            <p title={job.employeeName}>{job.employeeName}</p> {/* Display the employee name */}
                                                                                            {/* <p>Total Hours: {job.totalWorkingHours}</p> {/* Display total working hours
                                                                                            <p>Expenditure: {job.expenditure}</p> Display expenditure */}
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                            ))
                                                                        ) : (
                                                                            <div className="week-card">
                                                                                <div className="tp">
                                                                                    <span>No jobs</span>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}

                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <div className="exp-wrap mt-4">
                                            <div className="exp-card">
                                                <h3>₹{weekData?.totalExpenditure.toFixed() || 0}</h3>
                                                <p>Total Expenditure for week</p>
                                            </div>
                                            <div className="exp-card">
                                                <h3>{weekData?.totalWeekdayHours.toFixed() || 0} /Hrs</h3>
                                                <p>Total billable hours for Offdays</p>
                                            </div>
                                            <div className="exp-card">
                                                <h3>{weekData?.totalWeekendHours.toFixed() || 0} /Hrs</h3>
                                                <p>Total billable hours for Weekends</p>
                                            </div>
                                        </div>
                                        {/* <div className="rec-venue-table">
                                            <DataGrid
                                                rows={rows2}
                                                columns={columns2}
                                                disableAutosize={false}
                                                initialState={{
                                                    pagination: {
                                                        paginationModel: { page: 0, pageSize: 10 },
                                                    },
                                                }}
                                                pageSizeOptions={[5, 10]}
                                            // checkboxSelection
                                            />
                                        </div> */}
                                    </div>
                                </>
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={2} className="tab-body">
                                <>
                                    <Card className='mb-4'>
                                        <CardContent>
                                            <div className="row align-items-center row-gap-25">
                                                <div className='col-lg-7 col-12'>
                                                    <h3 className="sm-head">
                                                        Job Reports
                                                    </h3>
                                                    <p className="sm-para">
                                                        Tables display sets of data. They can be fully customized
                                                    </p>
                                                </div>
                                                <div className="col-lg-5 col-12">
                                                    <div className="row row-gap-25">
                                                        <div className="col-lg-6 col-12">
                                                            {
                                                                venues.length &&
                                                                <FormControl fullWidth>
                                                                    <InputLabel id="demo-simple-select-label">Select Venue</InputLabel>
                                                                    <Select
                                                                        labelId="demo-simple-select-label"
                                                                        id="demo-simple-select"
                                                                        // value={venueId}
                                                                        label="Select Venue"
                                                                        onChange={handleChange4}
                                                                    >

                                                                        {
                                                                            venues.length && venues.map((venue, index) => {
                                                                                return (
                                                                                    <MenuItem key={index} value={venue.id}>{venue.name}</MenuItem>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Select>
                                                                </FormControl>
                                                            }

                                                        </div>
                                                        <div className="col-lg-6 col-12">
                                                            <div className="row row-gap-25">
                                                                <div className="col-lg-12 col-12">
                                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                        <DatePicker
                                                                            fullWidth
                                                                            className='fullwidth'
                                                                            label="Start Date"
                                                                            onChange={value => {
                                                                                setStartDate3(value)
                                                                                setEndDate3(dayjs(value).add(30, 'day').toDate());
                                                                            }}
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    fullWidth
                                                                                />
                                                                            )}
                                                                        />
                                                                    </LocalizationProvider>
                                                                </div>
                                                                {/* <div className="col-lg-6 col-12">
                                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                        <DatePicker
                                                                            fullWidth
                                                                            className='fullwidth'
                                                                            label="To"
                                                                            onChange={value => setEndDate2(value)}
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    fullWidth
                                                                                />
                                                                            )}
                                                                        />
                                                                    </LocalizationProvider>
                                                                </div> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="col-12">
                                                <div className="d-flex flex-wrap align-items-center justify-content-between">
                                                    <div>
                                                        <h3 className="sm-head">
                                                            Job Reports
                                                        </h3>
                                                        <p className="sm-para">
                                                            Tables display sets of data. They can be fully customized
                                                        </p>
                                                    </div>
                                                    <div className="d-flex align-itesms-center gap-2">
                                                        <FormControl fullWidth>
                                                            <InputLabel id="demo-simple-select-label">Select Date Range</InputLabel>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={age}
                                                                label="Select Venue"
                                                                onChange={handleChange}
                                                            >
                                                                <MenuItem value={10}>Ten</MenuItem>
                                                                <MenuItem value={20}>Twenty</MenuItem>
                                                                <MenuItem value={30}>Thirty</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                </div>
                                                <div className="bl-card">
                                                    <div className="l-part">
                                                        <h3 className="sm-head">
                                                            All Venues
                                                        </h3>
                                                        <p>
                                                            Billing hours for <b>gokuldas garden</b> From <b>24 JUN 2024 - 15 JUL 2024</b> is:
                                                        </p>
                                                    </div>

                                                </div>
                                            </div> */}
                                        </CardContent>
                                    </Card>
                                    <div className="col-12 mt-2">
                                        <Card>
                                            <CardContent>
                                                <div className="week-container">
                                                    <div className="week-top">
                                                        <div>
                                                            <h3 className="sm-head">{venues && venues.filter((v)=>v.id == venueId3)[0]?.name}</h3>
                                                            <p className="para">{dayjs(startDate3).format('YYYY-MM-DD') || 'From'} - {dayjs(endDate3).format('YYYY-MM-DD') || 'To'}</p>
                                                        </div>
                                                        <div className="nv">
                                                            <button className='prev' onClick={handlePrev2}><Image src="/images/prev.svg" width={55} height={55} alt="" /></button>
                                                            <button className='next' onClick={handleNext2}><Image src="/images/next.svg" width={55} height={55} alt="" /></button>
                                                        </div>
                                                    </div>
                                                    <div className={`week-calender ${loading && 'loading'}`}>
                                                        {/* {
                                                            weekData &&
                                                            weekData.length > 0 &&
                                                            weekData.groupedJobs.length > 0 && weekData.groupedJobs.map((item,i)=>{

                                                            })
                                                        } */}
                                                        {/* <div className="week-col">
                                                            <div className="week-head">
                                                                <h3>MON</h3>
                                                                <p>20 Jun 2024</p>
                                                            </div>
                                                            <div className="week-data">
                                                                <div className="week-card">
                                                                    <div className="tp">
                                                                        <span>16:00 - 20:00</span>
                                                                    </div>
                                                                    <div className="week-cell">
                                                                        <p>Johnkdjcjkdbdbjkdbfkjvbfkjvb</p>
                                                                        <span>+4</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                        {(monthDays && monthData) && monthDays.map((date, i) => {
                                                            const dateString = date.toISOString().split('T')[0];
                                                            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
                                                            const dayJobs = monthData.groupedJobs[dateString] || {};
                                                            const weekd = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

                                                            return (
                                                                <div className="week-col" data-ff={new Date(date)} key={dateString}>
                                                                    <div className="week-head">
                                                                        <h3>{weekd[new Date(dateString).getDay() + 1]}</h3>
                                                                        <p>{date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                                    </div>
                                                                    <div className="week-data">
                                                                        {Object.keys(dayJobs).length > 0 ? (
                                                                            Object.entries(dayJobs).map(([timeSlot, jobs]) => (
                                                                                jobs.map(job => (
                                                                                    <div className="week-card" key={job.JobId}>
                                                                                        <div className="tp">
                                                                                            <span>{timeSlot}</span> {/* Display the time slot */}
                                                                                        </div>
                                                                                        <div className="week-cell">
                                                                                            <p title={job.employeeName}>{job.employeeName}</p> {/* Display the employee name */}
                                                                                            {/* <p>Total Hours: {job.totalWorkingHours}</p> {/* Display total working hours
                                                                                            <p>Expenditure: {job.expenditure}</p> Display expenditure */}
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                            ))
                                                                        ) : (
                                                                            <div className="week-card">
                                                                                <div className="tp">
                                                                                    <span>No jobs</span>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <div className="exp-wrap mt-4">
                                            <div className="exp-card">
                                                <h3>₹{monthData?.totalExpenditure.toFixed() || 0}</h3>
                                                <p>Total Expenditure for week</p>
                                            </div>
                                            <div className="exp-card">
                                                <h3>{monthData?.totalWeekdayHours.toFixed() || 0} /Hrs</h3>
                                                <p>Total billable hours for Offdays</p>
                                            </div>
                                            <div className="exp-card">
                                                <h3>{monthData?.totalWeekendHours.toFixed() || 0} /Hrs</h3>
                                                <p>Total billable hours for Weekends</p>
                                            </div>
                                        </div>
                                        {/* <div className="rec-venue-table">
                                            <DataGrid
                                                rows={rows2}
                                                columns={columns2}
                                                disableAutosize={false}
                                                initialState={{
                                                    pagination: {
                                                        paginationModel: { page: 0, pageSize: 10 },
                                                    },
                                                }}
                                                pageSizeOptions={[5, 10]}
                                            // checkboxSelection
                                            />
                                        </div> */}
                                    </div>
                                </>
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={0} className="tab-body">
                            <ApexChartWrapper>
                                    <Modal show={show} onHide={handleClose} centered>
                                        <Modal.Header closeButton>
                                        <Modal.Title>Comment</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="com-wrr">
                                                <p>
                                                    {op}
                                                </p>
                                            </div>
                                        </Modal.Body>
                                    
                                    </Modal>
                                    
                                    <section className='sec ven-act-sec mt-4'>
                                    <div className="row">
                                        <div className="col-12">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                            <h3 className="sm-head">
                                                All Jobs
                                            </h3>
                                            {/* <p className="sm-para">
                                            Recent activities
                                            </p> */}
                                            </div>
                                            {/* <Button
                                            size='medium'
                                            variant='contained'
                                            sx={{ marginBottom: 7 }}
                                            onClick={() => router.push('/jobs')}
                                            endIcon={<ArrowForwardIcon />}
                                            >
                                            Veiw All
                                            </Button> */}
                                        </div>
                                        </div>
                                        <div className="col-12 mt-2">
                                        <div className="rec-venue-table">
                                            <DataGrid
                                            rows={row}
                                            columns={columnsForAllData}
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
                            </CustomTabPanel>
                        </Box>
                    </div>

                </div>
            </section>
        </ApexChartWrapper>
    )
}

export default JobReports
