import React, { useState, useEffect, useContext } from 'react';
import { useFormik, Field, FormikProvider } from 'formik';
import * as Yup from 'yup';
import moment from 'moment-timezone';
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
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { styled, useTheme } from '@mui/material/styles';

import api, {setAuthToken} from 'src/axiosInstance';

import { AuthContext } from 'src/auth/AuthContext';

import SignaturePad from 'src/layouts/components/SignaturePad';

import { useRouter } from 'next/router';


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
    // meetingTime: Yup.date().required('Meeting Time is required').typeError('Invalid time'),
    // endTime: Yup.date().required('End Time is required').typeError('Invalid time'),
    employees: Yup.array().min(1, 'At least one employee is required'),
  }),
];


const RegisterWork = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [personName, setPersonName] = useState([]);
  const [venues, setVenues] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [emp, setEmp] = useState(null);

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  
  const {user} = useContext(AuthContext);
  
  const router = useRouter()
  
  
  useEffect(()=>{
    const getVenues = async()=>{
        try{
          setAuthToken(user.token);
          const res = await api.get('venues/venues');
          setVenues(res.data);
        }catch(er){
          alert(er)
        } 
      }
    const getEmployees = async()=>{
        try{
          setAuthToken(user.token);
          const res = await api.get('users/doormans');
          // console.log(res.data)
          setEmployeeData(res.data);
        }catch(er){
          alert(er)
        } 
      }
      getVenues();
      getEmployees();
  }, [])

  const theme = useTheme();
  const formik = useFormik({
    initialValues: {
      venueId: '',
      employees: [{ meetingTime: '', endTime: '', id: '', totalhour: '', isweekday: '' }],
      alarms: [{ place: '', remark: '', otherRemark: '' }],
      remark : ''
    },
    validationSchema: validationSchema[activeStep],
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      console.log(values)
      // Submit logic here
      console.log('values', values);
      const postJob = async()=>{
        try{
            setAuthToken(user.token)
            const res = await api.post('jobs/jobs', values);
            if(res.data){
                alert('Form submitted successfully!');
                router.push('/')
            }
        }catch(e){
            alert('Something went wrong!');
        }
      }
      postJob();
    },
  });

  const handleEmployeeChange = (event) => {
    const { value } = event.target;
    setPersonName(typeof value === 'string' ? value.split(',') : value);
    // formik.setFieldValue('employees', typeof value === 'string' ? value.split(',') : value);
  };

  const handleChangeEmployee =  (event, value) =>{
    const uniqueValues = value.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    );
    value = uniqueValues.map(vl=>vl.id);
    // console.log('values', value, uniqueValues);
    setSelectedEmployees(uniqueValues);
    setEmp(value)
    formik.setFieldValue('employees', typeof value === 'string' ? value.split(',') : value);
  }

  const addAlarm = () => {
    formik.setFieldValue('alarms', [...formik.values.alarms, { place: '', remark: '', otherRemark: '' }]);
  };

  const removeAlarm = (index) => {
    const newAlarms = formik.values.alarms.filter((_, i) => i !== index);
    formik.setFieldValue('alarms', newAlarms);
  };

  const addEmploye = () => {
    formik.setFieldValue('employees', [...formik.values.employees, { meetingTime: '', endTime: '', id: '', totalhour: '', isweekday: '' }]);
  };

  const removeEmploye = (index) => {
    const newEmploy = formik.values.employees.filter((_, i) => i !== index);
    formik.setFieldValue('employees', newEmploy);
  };

  const handleNext = async () => {
    if (await formik.validateForm() && Object.keys(formik.errors).length === 0) {
      let newSkipped = skipped;
      if(activeStep == 2) {
        console.log('submi');
        formik.handleSubmit();
        return
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
        console.log('formik', formik.errors);
        alert('error')
      formik.setTouched({ ...formik.touched, ...formik.errors });
    }

   
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    formik.resetForm();
  };

  const isStepOptional = (step) => step === 1;
  const isStepSkipped = (step) => skipped.has(step);

  const [sum, setSum] = useState(0);

  // useEffect(() => {
  //   const age = parseInt(formik.values.age, 10) || 0;
  //   const attitude = parseInt(formik.values.attitude, 10) || 0;
  //   const diverse = parseInt(formik.values.diverse, 10) || 0;

  //   setSum(age + attitude + diverse);
  // }, [formik.values.age, formik.values.attitude, formik.values.diverse]);

  useEffect(() => {
    const age = parseInt(formik.values.age, 10) || 0;
    const attitude = parseInt(formik.values.attitude, 10) || 0;
    const diverse = parseInt(formik.values.diverse, 10) || 0;
    formik.setFieldValue('rejections', age + attitude + diverse);
  }, [formik.values.age, formik.values.attitude, formik.values.diverse]);

  const renderSteps = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="row">
            <div className="col-lg-12 col-12">
              <FormControl className="w-100">
                <InputLabel id="demo-simple-select-label">Select Venue</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formik.values.venueId}
                  label="Select Venue"
                  onChange={(e) => formik.setFieldValue('venueId', e.target.value)}
                  fullWidth
                  className="w-100"
                  error={formik.touched.venueId && Boolean(formik.errors.venueId)}
                  helperText={formik.touched.venueId && formik.errors.venueId}
                >
                    {
                        venues.length && venues.map((venue,index) =>{
                            return(
                                <MenuItem key={index} value={venue.id}>{venue.name}</MenuItem>
                            )
                        })
                    }
                </Select>
              </FormControl>
            </div>
          </div>
        );
      case 1:
        return (
          <>
          
            <div className="row row-gap-25">
              {/* <div className="col-lg-6 col-12">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Meeting Time"
                    className='fullwidth'
                    value={formik.values.meetingTime}
                    onChange={(value) =>{
                      console.log('meeting', value.format('HH:mm'), value)
                      const formatedTime = value.format('HH:mm');
                      formik.setFieldValue('meetingTime', value)
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={formik.touched.meetingTime && Boolean(formik.errors.meetingTime)}
                        helperText={formik.touched.meetingTime && formik.errors.meetingTime}
                      />
                    )}
                    format="HH:mm"
                  />
                </LocalizationProvider>
              </div>
              <div className="col-lg-6 col-12">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="End Time"
                    className='fullwidth'
                    value={formik.values.endTime}
                    onChange={(value) => {
                      console.log('vl', value);
                      
                      formik.setFieldValue('endTime', value)
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                        helperText={formik.touched.endTime && formik.errors.endTime}
                      />
                    )}
                    format="HH:mm"
                  />
                </LocalizationProvider>
              </div> */}
              <div className="col-lg-12 col-12">
                {/* {JSON.stringify(employeeData)} */}
               
                {formik.values.employees.map((employee, index) => (
                  <div key={index}>
                    <div className="f-card mt-4">
                      <div className="row row-gap-25">
                        <div className="col-lg-12 col-12">
                          <InputLabel id={`employee-select-label-${index}`}>Select Employee</InputLabel>
                          <Select
                            labelId={`employee-select-label-${index}`}
                            id={`employee-select-${index}`}
                            value={formik.values.employees[index].employee}  // Access employee id from formik values
                            label="Select Employee"
                            onChange={(e) => {
                              const selectedEmployee = employeeData.find(emp => emp.id === e.target.value);
                              formik.setFieldValue(`employees[${index}].employee`, selectedEmployee.name);  // Store the full employee object
                              formik.setFieldValue(`employees[${index}].id`, e.target.value);  // Store the full employee object
                              console.log(formik.values.employees[index]);
                            }}
                            fullWidth
                            className="w-100"
                            error={formik.touched.employees?.[index]?.id && Boolean(formik.errors.employees?.[index]?.id)}
                            helperText={formik.touched.employees?.[index]?.id && formik.errors.employees?.[index]?.id}
                          >
                            {employeeData.map((employeeDataItem, empIndex) => (
                              <MenuItem key={empIndex} value={employeeDataItem.id}>
                                {employeeDataItem.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                        
                        {/* Meeting Time Picker */}
                        <div className="col-lg-6 col-12">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              label="Meeting Time"
                              className='fullwidth'
                              value={formik.values.employees[index].meetingTime || null}  // Access meetingTime for this employee
                              onChange={(value) => formik.setFieldValue(`employees[${index}].meetingTime`, value)}  // Set the value dynamically
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  error={formik.touched.employees?.[index]?.meetingTime && Boolean(formik.errors.employees?.[index]?.meetingTime)}
                                  helperText={formik.touched.employees?.[index]?.meetingTime && formik.errors.employees?.[index]?.meetingTime}
                                />
                              )}
                              format="HH:mm"
                              ampm={false} 
                            />
                          </LocalizationProvider>
                        </div>
                        
                        {/* End Time Picker */}
                        <div className="col-lg-6 col-12">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              label="End Time"
                              className='fullwidth'
                              value={formik.values.employees[index].endTime || null}  // Access endTime for this employee
                              onChange={(value) => formik.setFieldValue(`employees[${index}].endTime`, value)}  // Set the value dynamically
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  error={formik.touched.employees?.[index]?.endTime && Boolean(formik.errors.employees?.[index]?.endTime)}
                                  helperText={formik.touched.employees?.[index]?.endTime && formik.errors.employees?.[index]?.endTime}
                                />
                              )}
                              format="HH:mm"
                              ampm={false} 
                            />
                          </LocalizationProvider>
                        </div>
                      </div>
                      
                      <Button variant="contained" className="mt-3" color="error" onClick={() => removeEmploye(index)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

              <Button variant="contained" className="mt-4" onClick={addEmploye}>
              Add Employee
            </Button>
              </div>
              <div className="col-lg-4 col-12">
                <TextField
                  fullWidth
                  id="age"
                  name="age"
                  label="Age"
                  variant="outlined"
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  error={formik.touched.age && Boolean(formik.errors.age)}
                  helperText={formik.touched.age && formik.errors.age}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ''); 
                  }}
                />
              </div>
              <div className="col-lg-4 col-12">
                <TextField
                  fullWidth
                  id="attitude"
                  name="attitude"
                  label="Attitude"
                  variant="outlined"
                  value={formik.values.attitude}
                  onChange={formik.handleChange}
                  error={formik.touched.attitude && Boolean(formik.errors.attitude)}
                  helperText={formik.touched.attitude && formik.errors.attitude}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ''); 
                  }}
                />
              </div>
              <div className="col-lg-4 col-12">
                <TextField
                  fullWidth
                  id="diverse"
                  name="diverse"
                  label="Diverse"
                  variant="outlined"
                  value={formik.values.diverse}
                  onChange={formik.handleChange}
                  error={formik.touched.diverse && Boolean(formik.errors.diverse)}
                  helperText={formik.touched.diverse && formik.errors.diverse}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ''); 
                  }}
                />
              </div>
              <div className="col-lg-12 col-12">
                <TextField
                  fullWidth
                  id="rejections"
                  name="rejections"
                  label="Numbers Of Rejections"
                  variant="outlined"
                  value={formik.values.rejections}
                  InputProps={{
                    readOnly: true,
                  }}
                  onChange={formik.handleChange}
                  error={formik.touched.rejections && Boolean(formik.errors.rejections)}
                  helperText={formik.touched.rejections && formik.errors.rejections}
                />
              </div>
              <div className="col-lg-12 col-12">
                <TextField
                  fullWidth
                  id="remak"
                  name="remark"
                  label="Overall Remark"
                  variant="outlined"
                  value={formik.values.remark}
                  onChange={formik.handleChange}
                  error={formik.touched.remark && Boolean(formik.errors.remark)}
                  helperText={formik.touched.remark && formik.errors.remark}
                />
              </div>
            </div>
            {/* ALARAM SECTION----------------------------------------------------------- */}
            <div className="row">
              {formik.values.alarms.map((alarm, index) => (
                <div key={index}>
                    <div className="f-card mt-4">
                        <div className="row row-gap-25">
                            <div className="col-lg-4 col-12">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        label="Time"
                                        className='fullwidth'
                                        value={formik.values.alarms[index].time}
                                        onChange={(value) => formik.setFieldValue(`alarms[${index}].time`, value)}
                                        renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            error={formik.touched.alarms[index].time && Boolean(formik.errors.alarms[index].time)}
                                            helperText={formik.touched.alarms[index].time && formik.errors.alarms[index].time}
                                            
                                        />
                                        )}
                                        format="HH:mm"
                                        ampm={false} 
                                    />
                                </LocalizationProvider>
                            </div>
                            <div className="col-lg-4 col-12">
                                <TextField
                                    fullWidth
                                    id={`alarms.${index}.place`}
                                    name={`alarms.${index}.place`}
                                    label="Place"
                                    variant="outlined"
                                    value={formik.values.alarms[index].place}
                                    onChange={formik.handleChange}
                                    error={formik.touched.alarms?.[index]?.place && Boolean(formik.errors.alarms?.[index]?.place)}
                                    helperText={formik.touched.alarms?.[index]?.place && formik.errors.alarms?.[index]?.place}
                                />
                            </div>
                            <div className="col-lg-4 col-12">
                                <TextField
                                    fullWidth
                                    id={`alarms.${index}.remark`}
                                    name={`alarms.${index}.remark`}
                                    label="Remark"
                                    variant="outlined"
                                    value={formik.values.alarms[index].remark}
                                    onChange={formik.handleChange}
                                    error={formik.touched.alarms?.[index]?.remark && Boolean(formik.errors.alarms?.[index]?.remark)}
                                    helperText={formik.touched.alarms?.[index]?.remark && formik.errors.alarms?.[index]?.remark}
                                />
                            </div>
                            <div className="col-lg-12 col-12">
                                <TextField
                                    fullWidth
                                    id={`alarms.${index}.otherRemark`}
                                    name={`alarms.${index}.otherRemark`}
                                    label="Other Remark"
                                    variant="outlined"
                                    value={formik.values.alarms[index].otherRemark}
                                    onChange={formik.handleChange}
                                    error={formik.touched.alarms?.[index]?.otherRemark && Boolean(formik.errors.alarms?.[index]?.otherRemark)}
                                    helperText={formik.touched.alarms?.[index]?.otherRemark && formik.errors.alarms?.[index]?.otherRemark}
                                />
                            </div>
                        </div>
                        <Button variant="contained" className="mt-3" color="error" onClick={() => removeAlarm(index)}>
                            Remove
                        </Button>
                    </div>
                </div>
              ))}
            </div>
            {/* ALARAM SECTION----------------------------------------------------------- */}
            <Button variant="contained" className="mt-4" onClick={addAlarm}>
              Add Alarm
            </Button>
          </>
        );
      case 2:
        return (
          <Box>
           
            {/* <pre>{JSON.stringify(formik.values, null, 2)}</pre> */}
            <h3 className="xs-head mb-3">Details</h3>
            <div className="det-grid mb-3">
                <div>
                    <span>Venue</span>
                    <span>{ (formik.values.venueId && venues && venues.length) && venues.filter((v)=>v.id==formik.values.venueId)[0]?.name}</span>
                </div>
                {/* <div>
                    <span>Meeting Time</span>
                    <span>{dayjs(formik.values.meetingTime).format('HH:mm A')}</span>
                </div>
                <div>
                    <span>End Time</span>
                    <span>{dayjs(formik.values.endTime).format('HH:mm A')}</span>
                </div>
                <div>
                    <span>Employees</span>
                    <span>{
                                formik.values.employees && formik.values.employees.map((em,index) =>{
                                    const name = employeeData.length && employeeData.filter(emp=>emp.id == em)[0].name;
                                    return name
                                }).join(', ')
                            }</span>
                </div> */}
                <div>
                    <span>Age</span>
                    <span>{formik.values.age}</span>
                </div>
                <div>
                    <span>Attitude</span>
                    <span>{formik.values.attitude}</span>
                </div>
                <div>
                    <span>Diverse</span>
                    <span>{formik.values.diverse}</span>
                </div>
                <div>
                    <span>rejections</span>
                    <span>{formik.values.rejections}</span>
                </div>
                <div>
                    <span>Remark</span>
                    <span>{formik.values.remark}</span>
                </div>
            </div>
            <h3 className="sm-head mb-3 mt-4" style={{'font-size':'20px'}}>Employees</h3>
            {
                formik.values.employees.length > 0 &&  formik.values.employees.map((item,index)=>{
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
            <h3 className="sm-head mb-3 mt-4" style={{'font-size':'20px'}}>Alarms</h3>
            {
                formik.values.alarms.length > 0 &&  formik.values.alarms.map((item,index)=>{
                    return(
                    <div className="f-card mb-3" key={index}>
                        <div className="det-grid mb-3">
                            <div>
                                <span>Time</span>
                                <span>{dayjs(item.time).format('HH:mm A')}</span>
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
                      <FormControl className="w-100">
                        {/* <InputLabel id="demo-simple-select-label">Doorman</InputLabel> */}
                        <TextField
                            fullWidth
                            id="doormanName"
                            name="doormanName"
                            label="Doorman"
                            variant="outlined"
                            value={formik.values.doormanName}
                            onChange={formik.handleChange}
                            error={formik.touched.doormanName && Boolean(formik.errors.doormanName)}
                            helperText={formik.touched.doormanName && formik.errors.doormanName}
                        />
                        {/* <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={formik.values.doormanName}
                          label="Select Doorman"
                          onChange={(e) => formik.setFieldValue('doormanName', e.target.value)}
                          fullWidth
                          className="w-100"
                          error={formik.touched.doormanName && Boolean(formik.errors.doormanName)}
                          helperText={formik.touched.doormanName && formik.errors.doormanName}
                        >
                            {
                                (emp && emp.length) && emp.map((em,index) =>{
                                  const name = employeeData.length && employeeData.filter(emp=>emp.id == em)[0].name;
                                    return(
                                        <MenuItem key={index} value={name}>{name}</MenuItem>
                                    )
                                })
                              }
                              <MenuItem value={user.name}>{user.name}</MenuItem>
                        </Select> */}
                      </FormControl>
                        {/* <TextField
                            fullWidth
                            id="doormanName"
                            name="doormanName"
                            label="Your Name"
                            variant="outlined"
                            value={formik.values.doormanName}
                            onChange={formik.handleChange}
                            error={formik.touched.doormanName && Boolean(formik.errors.doormanName)}
                            helperText={formik.touched.doormanName && formik.errors.doormanName}
                        /> */}
                        <SignaturePad formik={formik} name="doormanSignature" label={'Sign:'} />
                    </div>
                    <div>
                        <TextField
                            fullWidth
                            id="venueOwnerName"
                            name="venueOwnerName"
                            label="Venue Owner Name"
                            variant="outlined"
                            value={formik.values.venueOwnerName}
                            onChange={formik.handleChange}
                            error={formik.touched.venueOwnerName && Boolean(formik.errors.venueOwnerName)}
                            helperText={formik.touched.venueOwnerName && formik.errors.venueOwnerName}
                        />
                        <SignaturePad formik={formik} name="venueOwnerSignature" label={'Sign:'}  />
                    </div>
                </div>
            </div>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <h3 className='sm-head'>
        Register Work
      </h3>
      <Stepper activeStep={activeStep} className='mb-4 mt-5'>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
        //   if (isStepOptional(index)) {
        //     labelProps.optional = <Typography variant="caption">Optional</Typography>;
        //   }
        //   if (isStepSkipped(index)) {
        //     stepProps.completed = false;
        //   }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {/* {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : ( */}
        <React.Fragment>
          <FormikProvider value={formik}>
            <form >
              <Card>
                <CardContent>{renderSteps()}</CardContent>
              </Card>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {/* {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleNext} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )} */}
                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box>
            </form>
          </FormikProvider>
        </React.Fragment>
      {/* )} */}
    </Box>
  );
};

export default RegisterWork;
