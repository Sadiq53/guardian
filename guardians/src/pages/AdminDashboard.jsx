// ** MUI Imports
import Grid from '@mui/material/Grid'

import {useState, useEffect, useContext} from 'react'

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

import Modal from 'react-bootstrap/Modal';

import Image from 'next/image'
import Link from 'next/link'

import { useTranslation } from 'next-i18next'

import api, {setAuthToken} from 'src/axiosInstance'
import { AuthContext } from 'src/auth/AuthContext'

import dayjs from 'dayjs'

import { useRouter } from 'next/router'


const AdminDashboard = () => {
  const { t } = useTranslation('common')
  
  const {user} = useContext(AuthContext)
  
  const router = useRouter()


  const [dashData, setDashData] = useState(null);
  const [rows, setRows] = useState([])

  const [op, setop] = useState(false)
const [show, setShow] = useState(false);

    const handleClose = (e) => {
        setShow(false)
    };
    const handleShow = (e) => {
        setop(e)
        setShow(true)
    };


  useEffect(()=>{
    const getDashData = async ()=>{
      setAuthToken(user.token)
      const res = await api.get('users/admindashboard');
      // const data = res.data.map((de,in)=>{
      //   return(
      //     {
      //       venueName: de.
      //     }
      //   )
      // })
      setDashData(res.data);
      const data = res.data.processedJobs.slice(0, 10).map((job,index)=>{
        const emp =  job?.employees ? Array.isArray(job?.employees) ? job?.employees: JSON.parse(job.employees) : null;
        return(
          {
            id: job.JobId || '',
            doorman: job.doormanName || '',
            venueName: job.venueName || '',
            employees: emp.map((item,index)=>item.employee).join(',') || '',
            comment: job.comments || '',
            date: emp[0]?.meetingTime && dayjs(emp[0]?.meetingTime).format('DD MMM YYYY'),
          }
        )
      })
      setRows(data)
    }
    getDashData();
  },[])

  const columns = [
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
  
  // const rows = [
  //   { id: 1, venueName: 'Snow', location: 'Jon', phoneNumber: 35, verified: true },
  //   { id: 25, venueName: 'Snow', location: 'Jon', phoneNumber: 35, verified: true},
  // ];

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
        <div className="bl-wrap">
          <p>{t("welcome")}</p>
          <p>Guardian Standard: Elevating Security to New Heights</p>
        </div>
        <div className="row mt-4">
          <div className="col-lg-4 col-12">
            <Card className='dash-card'>
              <CardContent>
                <div className="dash-card-inner">
                  <Image src="/images/dash-profile.svg" width={100} height={100} alt="" />
                  <div>
                    <h3>{dashData?.totalEmployees}</h3>
                    <p>Employees</p>
                    <Link href="/employees" >
                      <a className="link-btn">
                          <span>View All</span>
                          <Image src="/images/arrow-right-blue.svg" width={12} height={12} alt="" />
                      </a>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-lg-4 col-12">
            <Card className='dash-card'>
              <CardContent>
                <div className="dash-card-inner">
                  <Image src="/images/dash-venue.svg" width={100} height={100} alt="" />
                  <div>
                    <h3>{dashData?.totalVenues}</h3>
                    <p>Venues</p>
                    <Link href="/venues" >
                      <a className="link-btn">
                          <span>View All</span>
                          <Image src="/images/arrow-right-blue.svg" width={12} height={12} alt="" />
                      </a>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-lg-4 col-12">
            <Card className='dash-card'>
              <CardContent>
                <div className="dash-card-inner">
                  <Image src="/images/dash-bolt.svg" width={100} height={100} alt="" />
                  <div>
                    <h3>{dashData?.totalJobs}</h3>
                    <p>Jobs</p>
                    <Link href="/jobs" >
                      <a className="link-btn">
                          <span>View All</span>
                          <Image src="/images/arrow-right-blue.svg" width={12} height={12} alt="" />
                      </a>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <section className='sec ven-act-sec mt-4'>
          <div className="row">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="sm-head">
                    Recent Activities from venues
                  </h3>
                  <p className="sm-para">
                  Recent activities
                  </p>
                </div>
                <Button
                  size='medium'
                  variant='contained'
                  sx={{ marginBottom: 7 }}
                  onClick={() => router.push('/jobs')}
                  endIcon={<ArrowForwardIcon />}
                >
                  Veiw All
                </Button>
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

export default AdminDashboard
