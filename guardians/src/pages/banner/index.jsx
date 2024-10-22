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



const BannerList = () => {
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

  const { t } = useTranslation('common')

  console.log('Current locale:', router.locale);
  console.log('Translation for welcome:', t('welcome'));

  useEffect(() => {
    const getData = async () => {
      try {
        console.log('Loading', user.token, user)
        setAuthToken(user.token);
        const res = await api.get('banners');
        const data = await res.data;
        const rows = data.map((item, index) => {
          return (
            {
              id: item.id,
              employeeName: item.title,
            }
          )
        })
        setRows(rows);
      } catch (er) {
        alert(er)
      }
    }
    getData();
  }, [user])

  const deleteBanner = async (id) => {
    const userConfirmed = window.confirm("Are you sure you want to perform this action?");
    if (userConfirmed) {
      try {
        const res = await api.delete(`banners/${id}`);
        const getBanners = async () => {
          setAuthToken(user.token);
          const res = await api.get('banners');
          const data = res.data.map((item) => {
            // console.log(item);
            return (
              {
                id: item.id,
                employeeName: item.title,
              }
            )
          })
          setRows(data);
        }
        getBanners();
        if (res.data) {
          alert('Banner deleted successfully');
        }
      } catch (e) {
        alert('Something went wrong');
      }
    }
  }


  const columns = [
    { field: 'employeeName', headerName: 'Banner Title', width: 650 },
    {
      field: 'actions', headerName: 'Actions', width: 300,
      renderCell: (params) => {
        // console.log('para', params);
        const { id } = params.row;
        return (
          <div className='tb-btn-grp'>
            <button onClick={() => router.push(`/banner/edit/${id}`)} className="bt-chip">
              <Image src="/images/edit-icon.svg" width={20} height={20} />
              <span>Edit</span>
            </button>
            <button className="bt-chip" onClick={()=>deleteBanner(id)}>
              <Image src="/images/view-icon.svg" width={20} height={20} />
              <span>Delete</span>
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
                  {t('Banners')}
                </h3>
                <p className="sm-para">
                  Tables display sets of data. They can be fully customized
                </p>
              </div>
              <Button
                size='medium'
                variant='contained'
                sx={{ marginBottom: 7 }}
                onClick={() => router.push('/banner/add')}
                startIcon={<ArrowForwardIcon />}
              >
                Add New
              </Button>
            </div>
          </div>

          <div className="col-12 mt-4">
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
        </div>
      </section>
    </ApexChartWrapper>
  )
}

export default BannerList
