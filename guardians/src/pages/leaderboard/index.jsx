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

import { DataGrid, GridColDef } from '@mui/x-data-grid';

import Image from 'next/image'
import Link from 'next/link'

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import TextField from '@mui/material/TextField'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import AddIcon from '@mui/icons-material/Add';

import { useRouter } from 'next/router'

import { AuthContext } from 'src/auth/AuthContext'

import api, {setAuthToken} from 'src/axiosInstance'
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

const LeaderBoard = () => {

    const [age, setAge] = useState('');
    const [value, setValue] = useState(0);

    const [myRatings, setMyRatings] = useState([])
    const [leaderboard, setLeaderboard] = useState([])
    const {user} = useContext(AuthContext)

    const handleChange2 = (event, newValue) => {
        setValue(newValue);
    };

    const router = useRouter()

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const deleteRating = async (id)=>{
        const userConfirmed = window.confirm("Are you sure you want to perform this action?");
        if (userConfirmed) {
            try{
                const res = await api.delete(`ratings/ratings/${id}`);
                const getMyRatings = async ()=>{
                    setAuthToken(user.token);
                    const res = await api.get('ratings/myratedratings');
                    const data = res.data.map((item)=>{
                        // console.log(item);
                        return(
                            {
                                id: item.id,
                                date: item.startDate && dayjs(item.startDate).format('DD MMM YYYY'),
                                venue: item.venueName,
                                time: item.timeofinspection,
                                time: item.timeofinspection && dayjs(item.timeofinspection).format('HH:mm A'),
                                noRating: item.averageRating
                            }
                        )
                    })
                    setMyRatings(data);
                }
                getMyRatings();
                if(res.data){
                    alert('Rating deleted successfully');
                }
            }catch(e){
                alert('Something went wrong');
            }
        }
    }

    useEffect(() => {
        const getMyRatings = async ()=>{
            setAuthToken(user.token);
            const res = await api.get('ratings/myratedratings');
            const data = res.data.map((item)=>{
                // console.log(item);
                return(
                    {
                        id: item.id,
                        employee: item?.employeeName,
                        employeeCity: item?.employeeCity,
                        date: item.startDate && dayjs(item.startDate).format('DD MMM YYYY'),
                        venue: item.venueName,
                        // time: item.timeofinspection,
                        time: item.timeofinspection && dayjs(item.timeofinspection).format('HH:mm A'),
                    }
                )
            })
            setMyRatings(data);
        }
        const getLeaderboard = async ()=>{
            setAuthToken(user.token);
            const res = await api.get('ratings/ratings');
            console.log(res.data)
            const data = res.data.map((item, index)=>{
                return(
                    {
                        id: item.employee.id,
                        rank: index + 1,
                        name: item.employee.name,
                        ratings: item.averageRating,
                        noRatings: item.numberOfRatings
                    }
                )
            })
            setLeaderboard(data);
        }
        getMyRatings();
        getLeaderboard();
    }, [user])

    const columns = [
        { field: 'rank', headerName: 'Rank', width: 200, 
            renderCell: (params) => {
                const { id } = params.row;
                console.log(params.value)
                switch (params.value) {
                    case 1:
                        return (<div className="rank"><Image src="/images/gold.svg" width={45} height={45} alt='' /></div>)
                        break;
                    case 2:
                        return (<div className="rank"><Image src="/images/silver.svg" width={45} height={45} alt='' /></div>)
                        break;
                    case 3:
                        return (<div className="rank"><Image src="/images/bronze.svg" width={45} height={45} alt='' /></div>)
                        break;
                
                    default:
                        return (<div className="rank">#{params.value}</div>)
                        break;
                }
            }
         },
        { field: 'name', headerName: 'Employee Name', width: 200},
        { field: 'ratings', headerName: 'Ratings', width: 200,
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
        { field: 'noRatings', headerName: 'No. Of Ratings', width: 130 },
        { field: 'actions', headerName: 'Actions', width: 130,
            renderCell: (params)=>{
                // console.log('para', params);
                const {id} = params.row;
                return(
                  <div className='tb-btn-grp'>
                    <button className="bt-chip" onClick={()=>router.push(`/ratings/all-ratings/${id}`)}>
                    <Image src="/images/view-icon.svg" width={20} height={20} />
                      <span>View All</span>
                    </button>
                  </div>
                )
              }
        },
    ];
    const columns2 = [
        { field: 'date', headerName: 'Date', width: 200},
        { field: 'employee', headerName: 'Employee Name', width: 200},
        { field: 'employeeCity', headerName: 'City', width: 200},
        { field: 'venue', headerName: 'Venue', width: 200},
        { field: 'time', headerName: 'Time Of inspection', width: 200,},
        // { field: 'noRating', headerName: 'No. Of Ratings', width: 130 },
        { field: 'actions', headerName: 'Actions', width: 180,
            renderCell: (params)=>{
                // console.log('para', params);
                const {id} = params.row;
                return(
                  <div className='tb-btn-grp'>
                    <button className="bt-chip sq" onClick={()=>router.push(`/leaderboard/view/${id}`)}>
                    <Image src="/images/view-icon.svg" width={20} height={20} />
                      {/* <span>View All</span> */}
                    </button>
                    <button className="bt-chip sq danger" onClick={()=>deleteRating(id)}>
                    <Image src="/images/delete-icon.svg" width={20} height={20} />
                      {/* <span>View All</span> */}
                    </button>
                    <button className="bt-chip sq " onClick={()=>router.push(`/leaderboard/edit/${id}`)}>
                    <Image src="/images/edit-icon.svg" width={20} height={20} />
                      {/* <span>View All</span> */}
                    </button>
                  </div>
                )
              }
        },
    ];

    const rows = [
        { id: 1, rank: 1, employeeName: 'Robert William', ratings: '(4.5 / 5)', noRatings: '4655'},
        { id: 3, rank: 2, employeeName: 'Jesica Johnson', ratings: '(4.5 / 5)', noRatings: '4655'},
    ];
    const rows2 = [
        { id: 1, date: '24 Jun 2024', venue: 'Robert William', time: '(4.5 / 5)', noRating: '4655'},
        { id: 2, date: '24 Jun 2024', venue: 'Robert William', time: '(4.5 / 5)', noRating: '4655'},
    ];

    return (
        <ApexChartWrapper>
            <section className='sec ven-act-sec '>
                <div className="row">
                    <div className="col-12">
                        <Box sx={{ width: '100%' }} className='c-tabs'>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange2} aria-label="basic tabs example">
                                    <Tab label="Leaderboard" {...a11yProps(0)} />
                                    <Tab label="My Rated Employees" {...a11yProps(1)} />
                                </Tabs>
                            </Box>
                            <CustomTabPanel value={value} index={0} className="p-0 tab-body">
                                <>
                                    <div className="col-12">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <h3 className="sm-head">
                                                Leaderboard
                                                </h3>
                                                <p className="sm-para">
                                                    Tables display sets of data. They can be fully customized
                                                </p>
                                            </div>
                                            <Button
                                                size='medium'
                                                variant='contained'
                                                sx={{ marginBottom: 7 }}
                                                onClick={() => router.push('/leaderboard/give-rating')}
                                                startIcon={<AddIcon />}
                                            >
                                                Give rating
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <div className="col-12 mt-2">
                                        <div className="rec-venue-table">
                                            <DataGrid
                                                rows={leaderboard}
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
                                    <div className="col-12">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <h3 className="sm-head">
                                                My Rated Employees
                                                </h3>
                                                <p className="sm-para">
                                                    Tables display sets of data. They can be fully customized
                                                </p>
                                            </div>
                                            <Button
                                                size='medium'
                                                variant='contained'
                                                sx={{ marginBottom: 7 }}
                                                onClick={() => router.push('/leaderboard/give-rating')}
                                                startIcon={<AddIcon />}
                                            >
                                                Give rating
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-2">
                                        <div className="rec-venue-table">
                                            <DataGrid
                                                rows={myRatings}
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
                                        </div>
                                    </div>
                                </>
                            </CustomTabPanel>
                        </Box>
                    </div>

                </div>
            </section>
        </ApexChartWrapper>
    )
}

export default LeaderBoard
