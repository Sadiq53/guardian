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

import dayjs from 'dayjs';
import Modal from 'react-bootstrap/Modal';

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
    const {user} = useContext(AuthContext)

    const [op, setop] = useState(false)
    const [show, setShow] = useState(false);

    const handleClose = (e) => {
        setShow(false)
    };
    const handleShow = (e) => {
        setop(e)
        setShow(true)
    };

    const handleChange2 = (event, newValue) => {
        setValue(newValue);
    };

    const router = useRouter()

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    useEffect(() => {
        const getMyRatings = async ()=>{
            setAuthToken(user.token);
            const res = await api.get(`jobs/jobs/employee/${user.userid}`);
            console.log(res.data)
            const data = res.data.map((item)=>{
                // console.log(item);
                const emp= JSON.parse(item?.employees);
                return(
                    {
                        id: item.JobId,
                        startDate: emp[0].meetingTime && dayjs(emp[0]?.meetingTime).format('DD MMM YYYY'),
                        endDate: emp[0].endTime && dayjs(emp[0]?.endTime).format('DD MMM YYYY'),
                        employees: Array.isArray(emp) && emp?.map(value => value.employee),
                        comment: item.comments || '',
                        venues: item.venueName
                    }
                )
            })
            setMyRatings(data);
        }
        
        getMyRatings();
    }, [user])

    
    const columns2 = [
        { field: 'startDate', headerName: 'Start Date', width: 200},
        { field: 'endDate', headerName: 'End Date', width: 200},
        { field: 'employees', headerName: 'Employees', width: 200,
            renderCell: (params)=>{
                const {id} = params.row;
                const val = params.value
                const arr = val?.map(value => value?.length !== 1 ? value?.split(',') : value);
                // console.log(params?.value?.split(','))
                console.log(val)
                return(
                  <>
                    {
                       val?.map(value => {
                        if (value?.length !== 1) {
                          // Check if the value contains a comma; if not, insert one between the first two parts
                          if (!value.includes(',')) {
                            return value.replace(/([a-z])([A-Z])/g, '$1, $2');  // Inserts a comma before capital letters (like Mustafa, Test)
                          } else {
                            return value.split(',').slice(0, 2).join(', ');  // Handle strings already containing commas
                          }
                        }
                        return value;
                      })
                      
                    }
                    {
                        arr?.length > 2 &&
                        <span className='pill-more'>
                            + {arr?.length - 2} more
                        </span>
                    }
                  </>
                )
              }
        },
        { field: 'venues', headerName: 'venue Name', width: 130 },
        { field: 'comment', headerName: 'Comment', width: 250,
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
                        </div>
                        :
                        <Button
                            size='medium'
                            variant='contained'
                            onClick={() => router.push(`/add-comment/${id}`)}
                            endIcon={<ArrowForwardIcon />}
                        >
                            Add Comment
                        </Button>
                    }
                    
                  </>
                )
              }
         },
        { field: 'actions', headerName: 'Actions', width: 200,
            renderCell: (params)=>{
                // console.log('para', params);
                const {id} = params.row;
                const {comment} = params.row;
                return(
                  <div className='tb-btn-grp'>
                    
                    <button className="bt-chip sq" style={{'min-width':'max-content', 'padding': '12px 15px'}} onClick={()=>router.push(`/my-jobs/${id}`)}>
                    <Image src="/images/view-icon.svg" width={20} height={20} />
                      <span>View</span>
                    </button>
                    {/* {
                        !comment&&
                        <Button
                            size='medium'
                            variant='contained'
                            onClick={() => router.push(`/add-comment/${id}`)}
                            endIcon={<ArrowForwardIcon />}
                        >
                            Add Comment
                        </Button>
                    } */}
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
            <section className='sec ven-act-sec '>

                <div className="row">
                    <div className="col-12">
                        <Box sx={{ width: '100%' }} className='c-tabs'>
                            <CustomTabPanel value={value} index={0} className="p-0 tab-body">
                                <>
                                    <div className="col-12">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <h3 className="sm-head">
                                                My Jobs
                                                </h3>
                                                <p className="sm-para">
                                                    Tables display sets of data. They can be fully customized
                                                </p>
                                            </div>
                                            <Button
                                                size='medium'
                                                variant='contained'
                                                onClick={() => router.push('/register-work')}
                                                endIcon={<ArrowForwardIcon />}
                                            >
                                                Register Work
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

export default Employees
