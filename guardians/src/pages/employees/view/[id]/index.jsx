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
import api, {setAuthToken } from 'src/axiosInstance'
import { AuthContext } from 'src/auth/AuthContext'
import dayjs from 'dayjs';


const ViewEmployee = () => {

    const [employee, setEmployee] = useState(null)
    const [fCollapse, setFcollapse] = useState(false)
    const [faqs, setFaqs] = useState(null)
    const [videoProgress, setVideoProgress] = useState(null)
    const [averageProgress, setAverageProgress] = useState(null)
    const [dashData, setDashData] = useState(null)
    const {user} = useContext(AuthContext);
    const [position, setPosition] = useState(1)

    const router = useRouter();

    const { id } = router.query;

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
            setPosition(data.findIndex((obj) => obj.id == id)+1)
        }
        getLeaderboard()
    },[])

    const rateStar = (rating)=>{
        const stars = [];
        for(let i = 0; i < 5; i++){
            if(rating > i){
                stars.push(<Image src="/images/filled-star.svg" width={32} height={32} alt="" />);
            }else{
                stars.push(<Image src="/images/unfilled-star.svg" width={32} height={32} alt="" />);
            }
        }
        return <div>{stars}</div>;
    }

   

    

    useEffect(()=>{
        if(videoProgress){
            const calculateAverageProgress = () => {
              const totalProgress = videoProgress.reduce((acc, progress) => acc + progress, 0);
              const n = (totalProgress / faqs.length).toFixed(0)
              return isNaN(n) ? 0 : n;
            };
            setAverageProgress(calculateAverageProgress)
        }
    },[videoProgress])
    
    useEffect(() => {
        if (id) {
          setAuthToken(user.token);
          api.get(`users/users/${id}`)
            .then(response => {
              setEmployee(response.data);
              console.log(response.data)
            })
            .catch(error => {
              console.error('Error fetching venue:', error);
            //   toast.error('Error fetching venue. Please try again.');
            });
          api.get(`users/employeedashboard/${id}`)
            .then(response => {
                const data = response.data;
              setDashData(data);
            })
            .catch(error => {
              console.error('Error fetching employee ratings:', error);
            //   toast.error('Error fetching venue. Please try again.');
            });
        }
      }, [router.query]);

      useEffect(()=>{
        const getFaqs = async()=>{
            const res = await api.get(`faqs/faqswithprogress/${id}`);
            setFaqs(res.data)
            setVideoProgress(res.data.map(re=>re.completionPercent))
        }
        getFaqs();
      }, [])

      if(!employee){
        return(<p>Loading...</p>)
      }

      


  return (
    <ApexChartWrapper>
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
                                    <h3>{employee?.name}</h3>
                                    <div className="stars">
                                        {rateStar(dashData?.averageRating)}
                                        <span>({dashData?.averageRating}/5)</span>
                                    </div>
                                    <p>Total Number of Ratings : {dashData?.totalRatings}</p>
                                </div>
                                <div className="r-part">
                                    <Button
                                    size='medium'
                                    className='circ-gr-btn mb-0'
                                    variant='contained'
                                    sx={{ marginBottom: 7 }}
                                    onClick={() => router.push(`/ratings/all-ratings/${id}`)}
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
                            <h3>{dashData?.totalWorkingHours.toFixed()}</h3>
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
                            <h3>{dashData?.totalJobsDone.toFixed()}</h3>
                            <p>Total Jobs Done</p>
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
                                    <div className="bar" style={{'--width': `${averageProgress}%`}}></div>
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
            <div className="row mt-4">
                <div className="col-12">
                    <Card>
                        <CardContent>
                            <h3 className="xs-head mb-3">Personal Details</h3>
                            <div className="det-grid">
                                <div>
                                    <span>Full Name</span>
                                    <span>{employee?.name}</span>
                                </div>
                                <div>
                                    <span>DOB</span>
                                    <span>{employee?.birthday && dayjs(employee.startDate).format('DD MMM YYYY')}</span>
                                </div>
                                <div>
                                    <span>Email Address</span>
                                    <span>{employee?.email}</span>
                                </div>
                                <div>
                                    <span>Joining Date</span>
                                    <span>{employee?.startDate && dayjs(employee.startDate).format('DD MMM YYYY')}</span>
                                </div>
                                <div>
                                    <span>Phone Number</span>
                                    <span>{employee?.phone}</span>
                                </div>
                                <div>
                                    <span>CPR Number</span>
                                    <span>{employee?.cprnumber}</span>
                                </div>
                                <div>
                                    <span>Regioner</span>
                                    <span>{employee?.state}</span>
                                </div>
                                <div>
                                    <span>City</span>
                                    <span>{employee?.city}</span>
                                </div>
                                <div>
                                    <span>Full Address</span>
                                    <span>{employee?.fulladdress}</span>
                                </div>
                                <div>
                                    <span>Password</span>
                                    <span>{employee?.password}</span>
                                </div>
                            </div>
                            <h3 className="xs-head mb-3 mt-5">Work Details</h3>
                            <div className="det-grid">
                                <div>
                                    <span>Start Date</span>
                                    <span>{employee?.startDate && dayjs(employee.startDate).format('DD MMM YYYY')}</span>
                                </div>
                                <div>
                                    <span>Doorman Course</span>
                                    <span>{employee?.doormanCource ? 'Yes': 'No'}</span>
                                </div>
                                <div>
                                    <span>OffDay Salary</span>
                                    <span>{employee?.weekDaysSalary || '-'} /hour</span>
                                </div>
                                <div>
                                    <span>WeekEnd Salary</span>
                                    <span>{employee?.weekEndSalary} /hour</span>
                                </div>
                               
                            </div>
                            {
                                employee?.certificate &&
                                <>
                                    <h3 className="xs-head mb-3 mt-5">Legial Document/Certificates</h3>
                                    <div className="up-wrap mt-3">
                                        {
                                            
                                            // Array.isArray(employee?.certificate) && 
                                            JSON.parse(employee?.certificate).map((item, index)=>{
                                                return(
                                                <div className="up-img" key={index}>
                                                    <Image src={process.env.NEXT_PUBLIC_API_BASE_URL+item} width={130} height={130} alt="" />
                                                </div>
                                                )
                                            })
                                        }
                                    </div>
                                </>
                            }
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    </ApexChartWrapper>
  )
}

export default ViewEmployee
