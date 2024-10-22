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

import { Card, CardContent, Button, ButtonBase } from '@mui/material'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import Modal from 'react-bootstrap/Modal';

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

import { useRouter } from 'next/router';
import api, { setAuthToken } from 'src/axiosInstance'
import { AuthContext } from 'src/auth/AuthContext'
import dayjs from 'dayjs';

import { useTranslation } from 'react-i18next';
import Banner from 'src/@core/components/Banner'



const EmployeeDashboard = () => {

    const [ratingData, setRatingData] = useState(null)
    const [myRatings, setMyRatings] = useState([])
    const { user } = useContext(AuthContext);
    const [faqs, setFaqs] = useState(null)
    const [videoProgress, setVideoProgress] = useState(null)
    const [fCollapse, setFcollapse] = useState(false)
    const [averageProgress, setAverageProgress] = useState(null)
    const [position, setPosition] = useState(1)
    const [op, setop] = useState(false)
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [banners, setBanners] = useState(null);

    const handleClose = (e) => {
        setShow(false)
    };
    const handleShow = (e) => {
        setop(e)
        setShow(true)
    };

    useEffect(()=>{
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
        }
        getLeaderboard()
    },[])

    useEffect(()=>{
        if(videoProgress){
            const calculateAverageProgress = () => {
              const totalProgress = videoProgress.reduce((acc, progress) => acc + progress, 0);
              return (totalProgress / faqs.length).toFixed(0);
            };
            setAverageProgress(calculateAverageProgress)
        }
    },[videoProgress])

    useEffect(() => {
        try{
            const getDash = async ()=>{
                setAuthToken(user.token)
                const res = await api.get(`users/employeedashboard/${user.userid}`);
                setRatingData(res.data)
            }
            getDash()
        }catch(er){
            alert('something went wrong')
        }
    },[user])

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


    useEffect(() => {
        const getMyRatings = async ()=>{
            setAuthToken(user.token);
            const res = await api.get(`jobs/jobs/employee/${user.userid}`);
            // console.log(res.data?.map(value => value?.employees?.map(item => item?.employee)))
            
            const data = res.data.slice(0, 5).map((item, index)=>{
                console.log('da555ta', res.data.slice(0, 5), item?.employees);
                const emp = Array.isArray(item?.employees) ? item?.employees : JSON.parse(item?.employees);
                return(
                    {
                        id: item?.JobId,
                        startDate: emp[0]?.meetingTime && dayjs(emp[0]?.meetingTime).format('DD MMM YYYY'),
                        endDate: emp[0]?.endTime && dayjs(emp[0]?.endTime).format('DD MMM YYYY'),
                        employees: Array.isArray(emp) && emp?.map(value => value.employee),
                        comment: item?.comments || '',
                        venues: item?.venueName
                    }
                )
            })
            console.log('data', data, res.data);
            setMyRatings(data);
        }
        getMyRatings();
    }, [user])

    useEffect(()=>{
        async function getBanner() {
            setAuthToken(user.token);
            const res = await api.get(`banners/`);
            setBanners(res.data);
            console.log('banners', res.data)
        }
        getBanner()
    }, [])

    
    const columns2 = [
        { field: 'startDate', headerName: 'Start Date', width: 200},
        { field: 'endDate', headerName: 'End Date', width: 200},
        { field: 'employees', headerName: 'Employees', width: 200,
            renderCell: (params)=>{
                // console.log('para', params?.value?.length !== 1 ? params.value?.split(',') : params?.value?.length);
                const {id} = params.row;
                const val = params.value
                // console.log('dataarr', val);
                
                const arr = Array.isArray(val) && val?.map(value => value?.length !== 1 ? value?.split(',') : value);
                // console.log(params?.value?.split(','))
                console.log(arr)
                return(
                  <>
                    {
                        Array.isArray(val) && val?.map(value => value?.length !== 1 ?  value?.split(',').map((item, index)=>{
                            if(index < 2){
                                return item 
                            }
                        }) : value)
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

    

    useEffect(()=>{
        const getFaqs = async()=>{
            setAuthToken(user.token)
            const res = await api.get(`faqs/faqswithprogress/${user.userid}`);
            setFaqs(res.data)
            setVideoProgress(res.data.map(re=>re.completionPercent))
        }
        getFaqs();
      }, [])

      const { t } = useTranslation('common');

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
            {/* <h1>{t('ddd')}</h1> */}
            {
                banners &&
                <Banner data={banners} />
            }
            <section className="emp-top-sec">
                
                <div className="row row-gap-25">
                    <div className="col-lg-6 col-12">
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
                                        <p>Total Number of Ratings : {ratingData && ratingData.totalRatings}</p>
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
                    <div className="col-lg-3 col-12">
                        <Card className='emp-stat-card h-100'>
                            <CardContent>
                                <Image src="/images/hours.svg" width={55} height={55} alt="" />
                                <h3>{ratingData && ratingData.totalWorkingHours.toFixed()}</h3>
                                <p>Hours Worked</p>
                                {/* <Link href="/" passHref>
                                    <a className="link-btn">
                                        <span>View All</span>
                                        <Image src="/images/arrow-right-blue.svg" width={12} height={12} alt="" />
                                    </a>
                                </Link> */}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-lg-3 col-12">
                        <Card className='emp-stat-card h-100'>
                            <CardContent>
                                <Image src="/images/bolt.svg" width={55} height={55} alt="" />
                                <h3>{ratingData && ratingData.totalJobsDone}</h3>
                                <p>Jobs Done</p>
                                {/* <Link href="/" passHref>
                                    <a className="link-btn">
                                        <span>View All</span>
                                        <Image src="/images/arrow-right-blue.svg" width={12} height={12} alt="" />
                                    </a>
                                </Link> */}
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Card className='mt-4'>
                            <CardContent>
                                <div className="faq-prg">
                                    <div className="tp d-flex flex-wrap ">
                                        <h3 className='sm-head style-2'>Faq Progress</h3>
                                        <p><span>{averageProgress}%</span> Completed</p>
                                    </div>
                                    <div className="prog-bar mt-3 mb-3">
                                        <div className="bar" style={{ '--width': `${averageProgress}%` }}></div>
                                    </div>
                                    <Link href="javascript:void(0)" passHref>
                                        <a className="link-btn" onClick={()=>setFcollapse((state)=>!state)}>
                                            <span>View Detailed</span>
                                            <Image src="/images/arrow-right-blue.svg" width={12} height={12} alt="" />
                                        </a>
                                    </Link>
                                    {
                                    fCollapse &&
                                    <div className="faq-pr-wrap pt-3">
                                        {
                                            faqs && faqs.map((item, index)=>{
                                                
                                                return(
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
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="row pt-5">
                    <div className="col-12">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="sm-head">
                                    New Jobs
                                </h3>
                                <p className="sm-para">
                                    Watch yourself and your teammates on leaderboard
                                </p>
                            </div>
                            <Button
                                size='medium'
                                variant='contained'
                                sx={{ marginBottom: 7 }}
                                onClick={() => router.push('/my-jobs')}
                                endIcon={<ArrowForwardIcon />}
                            >
                                All Jobs
                            </Button>
                        </div>
                    </div>
                    <div className="col-12 mt-2">
                        <div className="rec-venue-table">
                            <DataGrid
                                rows={myRatings || []}
                                columns={columns2}
                                disableAutosize={false}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 10 },
                                    },
                                }}
                                pageSizeOptions={[5, 10]}
                               
                            />
                        </div>
                    </div>
                </div>

            </section>
        </ApexChartWrapper>
    )
}

export default EmployeeDashboard
