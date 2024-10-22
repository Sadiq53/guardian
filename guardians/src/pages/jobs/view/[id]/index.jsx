import React, { useState, useEffect, useContext, useRef } from 'react';
import { useFormik, Field, FormikProvider } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image'
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  OutlinedInput,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { styled, useTheme } from '@mui/material/styles';
import PrintIcon from '@mui/icons-material/Print';

import api, {setAuthToken} from 'src/axiosInstance';

import { AuthContext } from 'src/auth/AuthContext';

import SignaturePad from 'src/layouts/components/SignaturePad';

import { useRouter } from 'next/router';

import ReactToPrint from 'react-to-print';


const steps = ['Choose Venue', 'Enter Details', 'View Summary'];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const validationSchema = [
  Yup.object().shape({
    venueId: Yup.string().required('Venue is required'),
  }),
  Yup.object().shape({
    meetingTime: Yup.date().required('Meeting Time is required').typeError('Invalid time'),
    endTime: Yup.date().required('End Time is required').typeError('Invalid time'),
    employees: Yup.array().min(1, 'At least one employee is required'),
  }),
];

const RegisterWork = () => {
  const [activeStep, setActiveStep] = useState(2);
  const [job, setJob] = useState(null);

  const componentRef = useRef();


  const {user} = useContext(AuthContext);

  const router = useRouter()

  const { id } = router.query

  useEffect(()=>{
    const getJob = async()=>{
        try{
          setAuthToken(user.token);
          const res = await api.get(`jobs/jobs/${id}`);
          console.log(res.data)
          setJob(res.data);
        }catch(er){
          alert(er)
        } 
      }
      getJob();
  }, [])

  const theme = useTheme();
  const formik = useFormik({
    initialValues: {
      venueId: '',
      employees:  [{ meetingTime: '', endTime: '', id: '' }],
      alarms: [{ place: '', remark: '', otherRemark: '' }]
    },
    validationSchema: validationSchema[activeStep],
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
    
    },
  });

  const handlePrint = () => {
    window.print();
  };

  const renderSteps = () => {
    switch (activeStep) {
      case 1:
        return (
          <>
          </>
        );
      case 2:
        return (
          <Box ref={componentRef}>
            <h3 className="xs-head mb-3">Details</h3>
            {
              job &&
              <>
                <div className="det-grid mb-3">
                    <div>
                        <span>Venue</span>
                        <span>{job?.venueName}</span>
                    </div>
                    <div>
                        <span>Age</span>
                        <span>{job.age}</span>
                    </div>
                    <div>
                        <span>Attitude</span>
                        <span>{job.attitude}</span>
                    </div>
                    <div>
                        <span>Diverse</span>
                        <span>{job.diverse}</span>
                    </div>
                    <div>
                        <span>rejections</span>
                        <span>{job.numberOfRejections}</span>
                    </div>
                    <div>
                        <span>Remark</span>
                        <span>{job.remark}</span>
                    </div>
                </div>
                <h3 className="sm-head mb-3 mt-4" style={{'font-size':'20px'}}>Employees</h3>
                {
                    job?.employees?.length > 0 &&  job?.employees?.map((item,index)=>{
                        return(
                        <div className="f-card mb-3" key={index}>
                            <div className="det-grid mb-3">
                            <div>
                                <span>Employ</span>
                                <span>{item.employee}</span>
                            </div>
                            <div>
                                <span>Meeting Time</span>
                                <span>{dayjs(item.meetingTime).format('HH:mm A')}</span>
                            </div>
                            <div>
                                <span>End Time</span>
                                <span>{dayjs(item.endTime).format('HH:mm A')}</span>
                            </div>
                            </div>
                        </div>
                        )
                    })
                }


                {
                  job?.alarms?.length ?  <h3 className="sm-head mb-3 mt-4" style={{'font-size':'20px'}}>Alarms</h3> : null
                }
                {
                    job.alarms.length > 0 &&  job.alarms.map((item,index)=>{
                        return(
                        <div className="f-card mb-3" key={index}>
                            <div className="det-grid mb-3">
                                <div>
                                    <span>Time</span>
                                    <span>{item.time && dayjs(item.time).format('HH:mm A')}</span>
                                </div>
                                <div>
                                    <span>Place</span>
                                    <span>{item.place}</span>
                                </div>
                                <div>
                                    <span>Remark</span>
                                    <span>{item.remark}</span>
                                </div>
                                <div>
                                    <span>Remark</span>
                                    <span>{item.otherRemark}</span>
                                </div>
                            </div>
                        </div>
                        )
                    })
                }
                <div className="row mt-4">
                    <div className="d-flex sign-contain justify-content-between">
                        <div>
                            <p>{job?.doormanName}</p>
                            {
                              job.doormanSignature &&
                              <Image src={job.doormanSignature} alt="" width={180} height={80} />
                            }
                   
                        </div>
                        <div>
                            <p>{job?.venueOwnerName}</p>
                            {
                              job.venueOwnerSignature &&
                              <Image src={job.venueOwnerSignature} alt="" width={180} height={80} />
                            }
                        </div>
                    </div>
                </div>
              </>
            }
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
        <div className="d-flex flex-wrap justify-content-between">
          <h3 className='sm-head mb-4'>
            JOB - {id}
          </h3>
          <ReactToPrint
            trigger={() => <Button
              size='medium'
              variant='contained'
              sx={{ marginBottom: 7 }}
              onClick={() => router.push('/jobs')}
              startIcon={<PrintIcon />}
            >
              Print
            </Button>}
            content={() => componentRef.current}
          />
          {/* <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mt: 2 }}>
              Print
            </Button> */}
        </div>
        <React.Fragment>
          <FormikProvider value={formik}>
            <form >
              <Card>
                <CardContent>{renderSteps()}</CardContent>
              </Card>
            </form>
          </FormikProvider>
        </React.Fragment>
      {/* )} */}
    </Box>
  );
};

export default RegisterWork;
