import React, { useState, useEffect, useContext } from 'react';
import { useFormik, Field, FormikProvider } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
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
    StepLabel,
    CircularProgress
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { styled, useTheme } from '@mui/material/styles';

import api, { setAuthToken } from 'src/axiosInstance';

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
        meetingTime: Yup.date().required('Meeting Time is required').typeError('Invalid time'),
        endTime: Yup.date().required('End Time is required').typeError('Invalid time'),
        employees: Yup.array().min(1, 'At least one employee is required'),
    }),
];



const RegisterWork = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [personName, setPersonName] = useState([]);
    const [venues, setVenues] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [alarms, setAlarms] = useState(null);
    const [employee, setEmployee] = useState(null);
    const [job, setJob] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useContext(AuthContext);
    const router = useRouter()

    const { id } = router.query

    useEffect(() => {
        setLoading(true);
        const getJob = async () => {
            if(id){
                try {
                    setAuthToken(user.token);
                    const res = await api.get(`jobs/jobs/${id}`);
                    setJob(res.data);
                    console.log(res.data)
                    
                    if(res.data) {
                        const alr = res.data?.alarms ? Array.isArray(res.data?.alarms) ? res.data?.alarms : JSON.parse(res.data?.alarms) : null;
                        const alarms = alr?.map((alarm, i) => {
                            return ({
                                place: alarm.place || '',
                                remark: alarm.remark || '',
                                otherRemark: alarm.otherRemark || '',
                                time: alarm.time ? dayjs(alarm.time) : '',
                            })
                        })
                        const emp = res.data?.employees ? Array.isArray(res.data?.employees) ? res.data?.employees : JSON.parse(res.data?.employees) : null;
                        const employees = emp?.map((emp) => {
                            return {
                                id: emp.id || '', 
                                meetingTime: emp.meetingTime ? dayjs(emp.meetingTime) : '',
                                endTime: emp.endTime ? dayjs(emp.endTime) : '', 
                                employee: emp.employee || '', 
                                totalhour: emp.totalhour !== undefined ? emp.totalhour : 0,
                                isweekday: emp.isweekday !== undefined ? emp.isweekday : false 
                            };
                        });
                        
                        if (Array.isArray(employees)) {
                            setEmployee(employees.length > 0 ? employees : null);
                        } else {
                            setEmployee(null); 
                        }
                        setAlarms(alarms);
                        setLoading(false);
                    }
                } catch (er) {
                    alert(er)
                    setLoading(false);
                }
            }
        }
        getJob();

    }, [router.query])



    useEffect(() => {
        const getVenues = async () => {
            try {
                setAuthToken(user.token);
                const res = await api.get('venues/venues');
                setVenues(res.data);
            } catch (er) {
                alert(er)
            }
        }
        const getEmployees = async () => {
            try {
                setAuthToken(user.token);
                const res = await api.get('users/doormans');
                setEmployeeData(res.data);
                // console.log('employee data', res.data);

            } catch (er) {
                alert(er)
            }
        }
        getVenues();
        getEmployees();
    }, [router.query])

    const theme = useTheme();
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            venueId: job?.venueId || '',
            employees: employee ||  [{ meetingTime: '', endTime: '', id: '', totalhour: '', isweekday: '' }],
            age: job?.age || '',
            attitude: job?.attitude || '',
            diverse: job?.diverse || '',
            rejections: job?.numberOfRejections || '',
            // rejections: job?.numberOfRejections || '',
            doormanName: job?.doormanName || '',
            venueOwnerName: job?.venueOwnerName || '',
            alarms: alarms || [{ place: '', remark: '', otherRemark: '' }],
            comments: job.comments,
            employeeId : job?.employeeId,
        },
        validationSchema: validationSchema[activeStep],
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (values) => {
            // Submit logic here
            console.log('values', values);
            // return
            const postJob = async () => {
                try {
                    setAuthToken(user.token)
                    const res = await api.put(`jobs/jobs/${id}`, values);
                    if (res.data) {
                        alert('Form submitted successfully!');
                        router.push('/')
                    }
                } catch (e) {
                    alert('Something went wrong!');
                }
            }
            postJob();
        },
    });

    const handleEmployeeChange = (event) => {
        const { value } = event.target;
        // setPersonName(typeof value === 'string' ? value.split(',') : value);
        setJob(prevJob => ({
            ...prevJob,
            employeeIds: typeof value === 'string' ? value.split(',') : value
          }));
          formik.setFieldValue('employees', [...formik.values.employees, { meetingTime: '', endTime: '', id: '' }]);
    };

    const addAlarm = () => {
        formik.setFieldValue('alarms', [...formik.values.alarms, { place: '', remark: '', otherRemark: '' }]);
    };

    const removeAlarm = (index) => {
        const newAlarms = formik.values.alarms.filter((_, i) => i !== index);
        formik.setFieldValue('alarms', newAlarms);
    };

    const addEmploye = () => {
        formik.setFieldValue('employees', [...formik.values.employees, { meetingTime: '', endTime: '', id: '', totalhour: '' }]);
      };
    
      const removeEmploye = (index) => {
        const newEmploy = formik.values.employees.filter((_, i) => i !== index);
        formik.setFieldValue('employees', newEmploy);
      };

    useEffect(() => {
        const age = parseInt(formik.values.age, 10) || 0;
        const attitude = parseInt(formik.values.attitude, 10) || 0;
        const diverse = parseInt(formik.values.diverse, 10) || 0;
        formik.setFieldValue('rejections', age + attitude + diverse);
    }, [formik.values.age, formik.values.attitude, formik.values.diverse]);

    console.log('Person Name:', personName)
    console.log('Employee Data:', employeeData)

    if(loading) {
        return (<p>Loading...</p>)
    }else{
        return (
            <Box sx={{ width: '100%' }}>
                {/* <button onClick={()=>console.log(formik.values.employees[0]?.employee)}>ok</button> */}
                <h3 className='sm-head mb-4'>
                    Edit Job
                </h3>
    
                <React.Fragment>
                
                    <FormikProvider value={formik}>
                        <form onSubmit={formik.handleSubmit}>
                            <Card>
                                <CardContent>
                                    <div className="row">
                                        <div className="col-lg-12 col-12">
                                            <FormControl className="w-100 mb-3">
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
                                                        venues.length && venues.map((venue, index) => {
                                                            return (
                                                                <MenuItem key={index} value={venue.id}>{venue.name}</MenuItem>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                        </div>
                                        {
                                            formik.values.comments ? (
                                                <>
                                                    <div className="col-lg-12 col-12">
                                                <TextField
                                                    fullWidth
                                                    id="name"
                                                    name="comments"
                                                    label="Comment"
                                                    variant="outlined"
                                                    value={formik.values.comments}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.comments && Boolean(formik.errors.comments)}
                                                    helperText={formik.touched.comments && formik.errors.comments}
                                                    multiline
                                                    rows={4} 
                                                />
                                                </div>
                                                <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                                                <Button variant="contained" className="mt-2" onClick={()=>formik.setFieldValue('comments', "Comment Solved")}>
                                                    Solved
                                                </Button>
                                                <Button variant="contained" className="mt-2" color="error" onClick={()=>formik.setFieldValue('comments', "Comment Unsolved")}>
                                                    Unsolved
                                                </Button>
                                                </div>
                                                </>
                                                ) : null
                                        }
                                    </div>
                                    <div className="row row-gap-25">
                                        <div className="col-lg-12 col-12">
                                        {formik.values.employees && formik.values.employees.length ? formik.values.employees?.map((employee, index) => (
                                        <div key={index}>
                                            <div className="f-card mt-4">
                                            <div className="row row-gap-25">
                                            <div className="col-lg-12 col-12">
                                                <InputLabel id={`employee-select-label-${index}`}>Select Employee</InputLabel>
                                                <Select
                                                    labelId={`employee-select-label-${index}`}
                                                    id={`employee-select-${index}`}
                                                    value={employee?.id || ''}  // Set the value to employee id
                                                    label="Select Employee"
                                                    onChange={(e) => {
                                                    const selectedEmployee = employeeData.find(emp => emp.id === e.target.value);
                                                    formik.setFieldValue(`employees[${index}].employee`, selectedEmployee.name);  // Store the employee name
                                                    formik.setFieldValue(`employees[${index}].id`, e.target.value);  // Store the employee id
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
                                        )): ''}
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
                                                onChange={formik.handleChange}
                                                error={formik.touched.rejections && Boolean(formik.errors.rejections)}
                                                helperText={formik.touched.rejections && formik.errors.rejections}
                                                onInput={(e) => {
                                                    e.target.value = e.target.value.replace(/[^0-9]/g, ''); 
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        {formik.values.alarms && formik.values.alarms.length ? formik.values.alarms.map((alarm, index) => (
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
                                        )) : ''}
                                    </div>
                                    <Button variant="contained" className="mt-4" onClick={addAlarm}>
                                        Add Alarm
                                    </Button>
                                    <div className="row mt-4">
                                        <div className="d-flex sign-contain justify-content-between">
                                            <div>
                                                <TextField
                                                    fullWidth
                                                    id="doormanName"
                                                    name="doormanName"
                                                    label="Your Name"
                                                    variant="outlined"
                                                    value={formik.values.doormanName}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.doormanName && Boolean(formik.errors.doormanName)}
                                                    helperText={formik.touched.doormanName && formik.errors.doormanName}
                                                />
                                                {
                                                    job && job.doormanSignature &&
                                                    <Image src={job.doormanSignature} alt="" width={180} height={80} />
                                                }
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
                                                {
                                                    job && job.venueOwnerSignature &&
                                                    <Image src={job.venueOwnerSignature} alt="" width={180} height={80} />
                                                }
                                                
                                                <SignaturePad formik={formik} name="venueOwnerSignature" label={'Sign:'}  />
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        size='medium'
                                        className='mt-5'
                                        variant='contained'
                                        sx={{ marginBottom: 7 }}
                                        type="submit"
                                        disabled={formik.isSubmitting}
                                    >
                                        {formik.isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </form>
                    </FormikProvider>
                
                </React.Fragment>
                {/* )} */}
            </Box>
        );
    }

};

export default RegisterWork;
