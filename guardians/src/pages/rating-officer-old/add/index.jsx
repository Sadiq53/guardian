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


const AddEmployee = () => {

  return (
    <ApexChartWrapper>
        <section className='sec ven-act-sec mt-4'>
          <div className="row">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="sm-head">
                  Add Rating Officer
                  </h3>
                  <p className="sm-para">
                  Tables display sets of data. They can be fully customized
                  </p>
                </div>
               
              </div>
            </div>
            <div className="col-12 mt-3 mb-3">
              <Card>
                <CardContent >
                    <h3 className="xs-head">
                    Officer Details
                    </h3>
                    <div className="row row-gap-25 mt-4">
                        <div className="col-lg-6 col-12">
                            <TextField fullWidth id="inp1" label="Name" variant="outlined" />
                        </div>
                        <div className="col-lg-6 col-12">
                            <TextField fullWidth id="inp2" label="Phone Number" variant="outlined" />
                        </div>
                        <div className="col-lg-6 col-12">
                            <TextField fullWidth id="inp3" label="Email Address" variant="outlined" />
                        </div>
                    </div>
                    <h3 className="xs-head mt-4">
                    Assign For Specific Job
                    </h3>
                    <div className="row row-gap-25 mt-4">
                        
                        <div className="col-lg-4 col-12">
                        <FormControl>
                            {/* <label htmlFor="" className="label-text ">Doorman Course</label> */}
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="no" control={<Radio />} label="No" />
                                
                            </RadioGroup>
                        </FormControl>
                        </div>
                       
                    </div>
                    <Button
                    size='medium'
                    className='mt-5'
                    variant='contained'
                    sx={{ marginBottom: 7 }}
                    onClick={() => alert()}
                    >
                        Submit
                    </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
    </ApexChartWrapper>
  )
}

export default AddEmployee
