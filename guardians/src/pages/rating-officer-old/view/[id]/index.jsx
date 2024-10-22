// ** MUI Imports
import Grid from '@mui/material/Grid'

import { useState } from 'react'

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


const ViewEmployee = () => {

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

  return (
    <ApexChartWrapper>
        <section className="emp-top-sec">
           
         
            <div className="row mt-4">
            <div className="col-12 mb-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="sm-head">
                  Martin Jepsy
                  </h3>
                  <p className="sm-para">
                  martin@gmail.com
                  </p>
                </div>
              
              </div>
            </div>
                <div className="col-12">
                    <Card>
                        <CardContent>
                            <h3 className="xs-head mb-3">Officer Details</h3>
                            
                            <div className="det-grid">
                                <div>
                                    <span>Full Name</span>
                                    <span>John Patrick</span>
                                </div>
                                <div>
                                    <span>DOB</span>
                                    <span>10 Jun 2001</span>
                                </div>
                                <div>
                                    <span>Full Name</span>
                                    <span>John Patrick</span>
                                </div>
                               
                            </div>
                            <h3 className="xs-head mb-3 mt-5">Assigned Venue</h3>
                            <div className="det-grid">
                                <div>
                                    <span>Friday-Saturday</span>
                                    <span>Metro Toronto Convention Centre, Hall A</span>
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
