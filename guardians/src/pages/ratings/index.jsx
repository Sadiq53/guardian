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

const Employees = () => {

    const [age, setAge] = useState('');
    const [value, setValue] = useState(0);

    const [myRatings, setMyRatings] = useState([])
    const [leaderboard, setLeaderboard] = useState([])
    const [position, setPosition] = useState(0)
    const [ratingData, setRatingData] = useState(null)
    const {user} = useContext(AuthContext)

    const handleChange2 = (event, newValue) => {
        setValue(newValue);
    };

    const router = useRouter()

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    useEffect(() => {
        
        const getLeaderboard = async ()=>{
            setAuthToken(user.token);
            const res = await api.get('ratings/ratings');
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
            setPosition(data.findIndex((obj) => obj.id == user.userid)+1)
            setLeaderboard(data);
        }
        const getDash = async ()=>{
            const res = await api.get(`users/employeedashboard/${user.userid}`);
            setRatingData(res.data)
        }
        getDash()
       
        getLeaderboard();
    }, [user])

    const columns = [
        { field: 'rank', headerName: 'Rank', width: 200, 
            renderCell: (params) => {
                const { id } = params.row;
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
        { field: 'venue', headerName: 'Venue', width: 200},
        { field: 'time', headerName: 'Time Of inspection', width: 200,},
        { field: 'noRating', headerName: 'No. Of Ratings', width: 130 },
        { field: 'actions', headerName: 'Actions', width: 130,
            renderCell: (params)=>{
                // console.log('para', params);
                const {id} = params.row;
                return(
                  <div className='tb-btn-grp'>
                    <button className="bt-chip sq" onClick={()=>router.push(`/employees/view/${id}`)}>
                    <Image src="/images/view-icon.svg" width={20} height={20} />
                      {/* <span>View All</span> */}
                    </button>
                    <button className="bt-chip sq danger" onClick={()=>router.push(`/employees/view/${id}`)}>
                    <Image src="/images/delete-icon.svg" width={20} height={20} />
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

    const rateStar = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            if (rating > i) {
                stars.push(<Image src="/images/filled-star.svg" width={32} height={32} alt="" />);
            } else {
                stars.push(<Image src="/images/unfilled-star.svg" width={32} height={32} alt="" />);
            }
        }
        return <div>{stars}</div>;
    }

    return (
        <ApexChartWrapper>
            <section className='sec ven-act-sec '>
                <div className="row">
                    <div className="col-12">
                        <Card className='emp-main-card h-100'>
                            {
                                position == 1?
                                <Image src="/images/gold.svg" className='medal' width={45} height={45} />
                                : position == 2?
                                <Image src="/images/silver.svg" className='medal' width={45} height={45} />
                                : position == 3?
                                <Image src="/images/bronze.svg" className='medal' width={45} height={45} />
                                :<span>#{position}</span>
                            }
                            <CardContent>
                                <div className="emp-main-card-inner">
                                    <div className="l-part">
                                        <h3>{user?.name}</h3>
                                        <div className="stars">
                                            {rateStar(ratingData && ratingData.averageRating)}
                                            <span>({ratingData && ratingData.averageRating}/5)</span>
                                        </div>
                                        <p>You’re position is {position}/{leaderboard.length}</p>
                                    </div>
                                    <div className="r-part">
                                        <Button
                                            size='medium'
                                            className='circ-gr-btn mb-0'
                                            variant='contained'
                                            sx={{ marginBottom: 7 }}
                                            onClick={() => router.push(`ratings/all-ratings/${user.userid}`)}
                                        >
                                            View All Ratings
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Box sx={{ width: '100%' }} className='c-tabs'>
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
                                                className='dt-grid'
                                                pageSizeOptions={[5, 10]}
                                                getRowClassName={(params) => 
                                                    params.row.id === user.userid ? 'highlight-row' : ''
                                                }
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

export default Employees
