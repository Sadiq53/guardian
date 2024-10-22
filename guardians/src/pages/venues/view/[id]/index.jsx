// ** MUI Imports
import {useState,useEffect,useContext } from 'react'
import Grid from '@mui/material/Grid'

// import { useState } from 'react'

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

import dayjs from 'dayjs'

const ViewEmployee = () => {

    const {user} = useContext(AuthContext);

    const [venue, setVenue] = useState('');

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

    const router = useRouter();

    useEffect(() => {
        const { id } = router.query;
        if (id) {
          setAuthToken(user.token);
          api.get(`venues/venues/${id}`)
            .then(response => {
              setVenue(response.data);
            })
            .catch(error => {
              console.error('Error fetching venue:', error);
            //   toast.error('Error fetching venue. Please try again.');
            });
        }
      }, [router.query]);

      if(!venue){
        return(<p>Loading...</p>)
      }
  return (
    <ApexChartWrapper>
        <section className="emp-top-sec">
            <div className="row mt-4">
                <div className="col-12 mb-4">
                    <h3 className='sm-head'>
                    {venue?.name}
                    </h3>
                    <p>{venue?.fullAddress}</p>
                </div>
                <div className="col-12">
                    <Card>
                        <CardContent>
                            <h3 className="xs-head mb-3">Details</h3>
                            
                            <div className="det-grid">
                                <div>
                                    <span>Name</span>
                                    <span>{venue?.name}</span>
                                </div>
                                <div>
                                    <span>Phone Number</span>
                                    <span>{venue?.phone}</span>
                                </div>
                                <div>
                                    <span>Regioner</span>
                                    <span>{venue?.state}</span>
                                </div>
                                <div>
                                    <span>City</span>
                                    <span>{venue?.city}</span>
                                </div>
                                <div>
                                    <span>Country</span>
                                    <span>{venue?.country}</span>
                                </div>
                                <div>
                                    <span>Start Date</span>
                                    <span>{venue?.startDate && dayjs(venue?.startDate).format('DD MMM YYYY')}</span>
                                </div>
                                <div>
                                    <span>Full Address</span>
                                    <span>{venue?.fullAddress}</span>
                                </div>
                                
                            </div>
                            <h3 className="xs-head mb-3 mt-5">Rate Details</h3>
                            <div className="det-grid">
                                <div>
                                    <span>Sunday-Thursday</span>
                                    <span>{venue?.ratesSundayToThursday}</span>
                                </div>
                                <div></div>
                                <div>
                                    <span>Friday-Saturday</span>
                                    <span>{venue?.ratesFridaySaturday}</span>
                                </div>
                               
                            </div>
                            
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    </ApexChartWrapper>
  )
}

export default ViewEmployee
