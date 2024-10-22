import { useState, useContext, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Box,
  Chip,
  TextField,
  Button,
  Typography
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik, Field } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { AuthContext } from 'src/auth/AuthContext';
import api, { setAuthToken } from 'src/axiosInstance';
import Rating from 'src/@core/components/Rating';
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts';
import Image from 'next/image';

import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

import dayjs from 'dayjs';

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

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : '#FAFAFA',
  flexDirection: 'row',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const GiveRating = () => {
  const [age, setAge] = useState('');
  const [personName, setPersonName] = useState([]);
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [expanded, setExpanded] = useState('panel1');
  const [employees, setEmployees] = useState([]);
  const [venues, setVenues] = useState([]);

  const [files, setFiles] = useState({});
  const handleFileChange = (index) => (event) => {
    setFiles({
      ...files,
      [index]: Array.from(event.target.files),
    });
  };
  const handleRemoveFile = (index, fileIndex) => {
    const newFiles = files[index].filter((_, i) => i !== fileIndex);
    setFiles({
      ...files,
      [index]: newFiles,
    });
  };

  useEffect(() => {
    const getData = async()=>{
      try{
        setAuthToken(user.token);
        const res = await api.get('users/doormans');
        const res2 = await api.get('venues/venues');
        const data =  await res.data;
        const data2 =  await res2.data;
        const rows = data.map((item,index)=>{
          return(
            {
              id: item.id,
              employeeName: item.name,
            }
          )
        })
        setEmployees(rows);
        setVenues(data2)
      }catch(er){
        alert(er)
      } 
    }
    getData();
  },[user])

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleChange3 = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleChange4 = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const validationSchema = Yup.object().shape({
    venueId: Yup.string().required('Venue is required'),
    date: Yup.date().required('Date is required').typeError('Invalid date'),
    time: Yup.date().required('Time is required'),
    employees: Yup.array().of(
      Yup.object().shape({
        employeeId: Yup.string().required('Employee name is required'),
        // handlekraft: Yup.number().min(1).max(5).required('Handlekraft rating is required'),
        // overblik: Yup.number().min(1).max(5).required('Overblik rating is required'),
        // placering: Yup.number().min(1).max(5).required('Placering rating is required'),
        // attitude: Yup.number().min(1).max(5).required('Attitude rating is required'),
        comments: Yup.string().required('Comments are required'),

        
      })
    ).min(1, 'At least one employee must be selected'),
  });

  const formik = useFormik({
    initialValues: {
      venueId: '',
      date: null,
    //   time: null,
      employees: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      setAuthToken(user.token)

      const updatedValues = {
        ...values,
        employees: values.employees.map((employee, index) => ({
          ...employee,
          files: files[index] || null 
        }))
      };
      
      console.log('values', updatedValues, files);
      api.post('ratings/ratings', updatedValues, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(response => {
          alert('Form submitted successfully');
          router.push('/leaderboard');
        })
        .catch(error => {
          console.error('There was an error submitting the form!', error);
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  const addEmployeeFields = (employees) => {
    return employees.map(employeeId => ({
      employeeId,
      handlekraft: '',
      overblik: '',
      placering: '',
      attitude: '',
      comments: '',
    }));
  };

  const handleEmployeeChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === 'string' ? value.split(',') : value);
    formik.setFieldValue('employees', addEmployeeFields(typeof value === 'string' ? value.split(',') : value));
  };

  return (
    <ApexChartWrapper>
      <section className='sec ven-act-sec mt-4'>
        <div className="row">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h3 className="sm-head">
                  Give Rating for employees
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
                <form onSubmit={formik.handleSubmit}>
                  <div className="row row-gap-25 mt-4">
                    <div className="col-lg-4 col-12">
                      <FormControl fullWidth>
                        <InputLabel id="venue-select-label">Select Venue</InputLabel>
                        <Select
                          labelId="venue-select-label"
                          id="venue-select"
                          value={formik.values.venueId}
                          label="Select Venue"
                          onChange={(e) => formik.setFieldValue('venueId', e.target.value)}
                          error={formik.touched.venueId && Boolean(formik.errors.venueId)}
                        >
                            {
                                venues && venues.map((item, index)=>{
                                    return(
                                        <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                        {formik.touched.venueId && formik.errors.venueId && (
                          <Typography color="error">{formik.errors.venueId}</Typography>
                        )}
                      </FormControl>
                    </div>
                    <div className="col-lg-4 col-12">
                        <LocalizationProvider dateAdapter={AdapterDayjs }>
                            <DatePicker
                            fullWidth
                            className='fullwidth'
                            label="Start Date"
                            value={formik.values.date}
                            onChange={value => formik.setFieldValue('date', value)}
                            renderInput={(params) => (
                                <TextField
                                {...params}
                                fullWidth
                                error={formik.touched.date && Boolean(formik.errors.date)}
                                helperText={formik.touched.date && formik.errors.date}
                                />
                            )}
                            />
                        </LocalizationProvider>
                    </div>
                    <div className="col-lg-4 col-12">
                        <LocalizationProvider dateAdapter={AdapterDayjs }>
                      <TimePicker
                        label="Choose Time Of Inspection"
                        value={formik.values.time}
                        className='fullwidth'
                        onChange={value => formik.setFieldValue('time', value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={formik.touched.time && Boolean(formik.errors.time)}
                            helperText={formik.touched.time && formik.errors.time}
                          />
                        )}
                        format="HH:mm"
                        ampm="false"
                      />
                      </LocalizationProvider>
                    </div>
                    <div className="col-lg-12 col-12">
                      <FormControl fullWidth>
                        <InputLabel id="demo-multiple-chip-label">Employees</InputLabel>
                        <Select
                          labelId="demo-multiple-chip-label"
                          id="demo-multiple-chip"
                          multiple
                          value={personName}
                          onChange={handleEmployeeChange}
                          input={<OutlinedInput id="select-multiple-chip" label="Employees" />}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((value) => {
                                return(
                                    <Chip key={value} label={employees.filter(e=>e.id == value)[0].employeeName} />
                                )
                                })}
                            </Box>
                          )}
                          MenuProps={MenuProps}
                        >
                          {employees.length && employees.map((name) => (
                            <MenuItem
                              key={name.id}
                              value={name.id}
                              style={getStyles(name, personName, theme)}
                            >
                              {name.employeeName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-12 mb-3 mt-3">
                      <h3 className="xs-head">Rate Employees</h3>
                    </div>
                    <div className="col-12">
                      {formik.values.employees?.map((employee, index) => {
                        return(
                        <Accordion expanded={expanded === `panel${index}`} onChange={handleChange4(`panel${index}`)} key={index}>
                          <AccordionSummary aria-controls={`panel${index}d-content`} id={`panel${index}d-header`}>
                            <Typography>{employees.filter(e=>e.id == employee.employeeId)[0].employeeName}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              <div className="rate-text">
                  
                                
                                <div className="rating-container">
                                  <div className="rating-star-wrap mb-2">
                                    <p>Dørmandsservice</p>
                                    <div className="rating-star-input rating">
                                      {
                                        [...Array(5)].map((item, radioindex)=>{
                                            return(
                                              <>
                                                <input type="radio"
                                                id={`doormanservice-${radioindex}-${index}`}
                                                name={`employees[${index}].doormanservice`}
                                                label="Lorem Ipsum Doner"
                                                variant="outlined"
                                                value={5- radioindex}
                                                onChange={formik.handleChange}
                                                error={formik.touched.employees?.[index]?.doormanservice && Boolean(formik.errors.employees?.[index]?.doormanservice)}
                                                helperText={formik.touched.employees?.[index]?.doormanservice && formik.errors.employees?.[index]?.doormanservice}
                                                />
                                                <label htmlFor={`doormanservice-${radioindex}-${index}`}></label>
                                              </>
                                            )
                                        })
                                      }
                                    </div>
                                  </div>
                                  <ul>
                                    <li>
                                      *1 stjerne*: Meget utilfredsstillende service, gæsterne/kunden følte sig utryg og misforstået.
                                    </li>
                                    <li>
                                      *2 stjerner*: Under middel service, gæster/kunden oplevede nogle problemer og manglende professionalisme.
                                    </li>
                                    <li>
                                      *3 stjerner*: Gennemsnitlig service, gæsterne kunden følte sig nogenlunde tryg men ikke imponeret.
                                    </li>
                                    <li>
                                      *4 stjerner*: God service, gæsterne/kunden var tilfreds og følte sig godt behandlet.
                                    </li>
                                    <li>
                                      *5 stjerner*: Fremragende service, kunden/gæsterne følte sig meget tryg og var yderst tilfreds.
                                    </li>
                                  </ul>
                                  <div className="rating-star-wrap mb-2">
                                    <p>Handlekraft</p>
                                    <div className="rating-star-input rating">
                                      {
                                        [...Array(5)].map((item, radioindex)=>{
                                            return(
                                              <>
                                                <input type="radio"
                                                id={`handlekraft-${radioindex}-${index}`}
                                                name={`employees[${index}].handlekraft`}
                                                label="Lorem Ipsum Doner"
                                                variant="outlined"
                                                value={5- radioindex}
                                                onChange={formik.handleChange}
                                                error={formik.touched.employees?.[index]?.handlekraft && Boolean(formik.errors.employees?.[index]?.handlekraft)}
                                                helperText={formik.touched.employees?.[index]?.handlekraft && formik.errors.employees?.[index]?.handlekraft}
                                                />
                                                <label htmlFor={`handlekraft-${radioindex}-${index}`}></label>
                                              </>
                                            )
                                        })
                                      }
                                    </div>
                                  </div>
                                  <ul>
                                    <li>
                                    *1 stjerne*: Meget lav handlekraft, problemer blev ikke løst og ingen initiativ blev taget.

                                    </li>
                                    <li>
                                    *2 stjerner*: Under middel handlekraft, nogle initiativer blev taget, men problemer blev ikke fuldstændigt løst.

                                    </li>
                                    <li>
                                    *3 stjerner*: Gennemsnitlig handlekraft, medarbejderen tog initiativ til at løse problemer men med begrænset succes.

                                    </li>
                                    <li>
                                    *4 stjerner*: God handlekraft, medarbejderen løste de fleste problemer hurtigt og effektivt.

                                    </li>
                                    <li>
                                    *5 stjerner*: Fremragende handlekraft, medarbejderen var proaktiv og løste alle problemer effektivt og hurtigt.

                                    </li>
                                  </ul>
                                  <div className="rating-star-wrap mb-2">
                                    <p>Overblik</p>
                                    <div className="rating-star-input rating">
                                      {
                                        [...Array(5)].map((item, radioindex)=>{
                                            return(
                                              <>
                                                <input type="radio"
                                                id={`overblik-${radioindex}-${index}`}
                                                name={`employees[${index}].overblik`}
                                                label="Lorem Ipsum Doner"
                                                variant="outlined"
                                                value={5- radioindex}
                                                onChange={formik.handleChange}
                                                error={formik.touched.employees?.[index]?.overblik && Boolean(formik.errors.employees?.[index]?.overblik)}
                                                helperText={formik.touched.employees?.[index]?.overblik && formik.errors.employees?.[index]?.overblik}
                                                />
                                                <label htmlFor={`overblik-${radioindex}-${index}`}></label>
                                              </>
                                            )
                                        })
                                      }
                                    </div>
                                  </div>
                                  <ul>
                                    <li>
                                    *1 stjerne*: Meget dårlig overblik, medarbejderen var forvirret og uorganiseret.


                                    </li>
                                    <li>
                                    *2 stjerner*: Under middel overblik, medarbejderen havde svært ved at holde styr på opgaver og situationer.


                                    </li>
                                    <li>
                                    3 stjerner*: Gennemsnitligt overblik, medarbejderen havde nogenlunde kontrol, men manglede detaljeorientering.

                                    </li>
                                    <li>
                                    *4 stjerner*: Godt overblik, medarbejderen havde god kontrol og kunne håndtere komplekse situationer.

                                    </li>
                                    <li>
                                    *5 stjerner*: Fremragende overblik, medarbejderen havde fuldstændig kontrol og kunne hurtigt tilpasse sig ændringer.
                                    </li>
                                  </ul>
                                  <div className="rating-star-wrap mb-2">
                                    <p>Placering</p>
                                    <div className="rating-star-input rating">
                                      {
                                        [...Array(5)].map((item, radioindex)=>{
                                            return(
                                              <>
                                                <input type="radio"
                                                id={`placering-${radioindex}-${index}`}
                                                name={`employees[${index}].placering`}
                                                label="Lorem Ipsum Doner"
                                                variant="outlined"
                                                value={5- radioindex}
                                                onChange={formik.handleChange}
                                                error={formik.touched.employees?.[index]?.placering && Boolean(formik.errors.employees?.[index]?.placering)}
                                                helperText={formik.touched.employees?.[index]?.placering && formik.errors.employees?.[index]?.placering}
                                                />
                                                <label htmlFor={`placering-${radioindex}-${index}`}></label>
                                              </>
                                            )
                                        })
                                      }
                                    </div>
                                  </div>
                                  <ul>
                                    <li>
                                    *1 stjerne*: Meget dårlig placering, medarbejderen var ofte væk fra deres post og utilgængelig.
                                    </li>
                                    <li>
                                    *2 stjerner*: Under middel placering, medarbejderen var nogle gange væk fra deres post uden grund.

                                    </li>
                                    <li>
                                    *3 stjerner*: Gennemsnitlig placering, medarbejderen var til stede det meste af tiden men ikke altid synlig.

                                    </li>
                                    <li>
                                    *4 stjerner*: God placering, medarbejderen var næsten altid på deres post og let tilgængelig.

                                    </li>
                                    <li>
                                    *5 stjerner*: Fremragende placering, medarbejderen var altid på deres post, synlig og tilgængelig for kunderne.
                                    </li>
                                  </ul>
                                  <div className="rating-star-wrap">
                                    <p>Attitude</p>
                                    <div className="rating-star-input rating">
                                      {
                                        [...Array(5)].map((item, radioindex)=>{
                                            return(
                                              <>
                                                <input type="radio"
                                                id={`attitude-${radioindex}-${index}`}
                                                name={`employees[${index}].attitude`}
                                                label="Lorem Ipsum Doner"
                                                variant="outlined"
                                                value={5- radioindex}
                                                onChange={formik.handleChange}
                                                error={formik.touched.employees?.[index]?.attitude && Boolean(formik.errors.employees?.[index]?.attitude)}
                                                helperText={formik.touched.employees?.[index]?.attitude && formik.errors.employees?.[index]?.attitude}
                                                />
                                                <label htmlFor={`attitude-${radioindex}-${index}`}></label>
                                              </>
                                            )
                                        })
                                      }
                                    </div>
                                  </div>
                                  <ul>
                                    <li>
                                    1 stjerne: Meget dårlig attitude og udstråling, medarbejderen virkede uvenlig, uinteresseret og gav en negativ oplevelse.

                                    </li>
                                    <li>
                                    2 stjerner: Under middel attitude og udstråling, medarbejderen var til tider uvenlig og virkede ikke engageret.

                                    </li>
                                    <li>
                                    3 stjerner: Gennemsnitlig attitude og udstråling, medarbejderen var høflig men ikke særlig engageret eller positiv.

                                    </li>
                                    <li>
                                    4 stjerner: God attitude og udstråling, medarbejderen var venlig, imødekommende og gav en positiv oplevelse.


                                    </li>
                                    <li>
                                    5 stjerner: Fremragende attitude og udstråling, medarbejderen var meget venlig, engageret og skabte en meget positiv atmosfære.
                                    </li>
                                  </ul>
                                  {/* <Rating name={`employees[${index}].handlekraft`} label="Handlekraft" />
                                  <Rating name={`employees[${index}].overblik`} label="Overblik" />
                                  <Rating name={`employees[${index}].placering`} label="Placering" />
                                  <Rating name={`employees[${index}].attitude`} label="Attitude" /> */}
                                </div>
                                <div className="fl-inp rating-star-wrap align-items-start mt-4">
                                  <p>Comment</p>
                                  <TextField
                                    fullWidth
                                    id={`comments-${index}`}
                                    name={`employees[${index}].comments`}
                                    label="Lorem Ipsum Doner"
                                    variant="outlined"
                                    value={formik.values.employees[index].comments}
                                    onChange={formik.handleChange}
                                    error={formik.touched.employees?.[index]?.comments && Boolean(formik.errors.employees?.[index]?.comments)}
                                    helperText={formik.touched.employees?.[index]?.comments && formik.errors.employees?.[index]?.comments}
                                    multiline 
                                    rows={4} 
                                  />
                                </div>
                                <div className="fl-inp rating-star-wrap align-items-start mt-4">
                                  <p>Add Picture</p>
                                  <div className='w-100'>
                                    <div className="up-wrap mt-3">
                                        {files[index]?.map((file, fileIndex) => (
                                        <div key={fileIndex} className="up-img">
                                            <button type="button" onClick={() => handleRemoveFile(index, fileIndex)}>Remove</button>
                                            <Image src={URL.createObjectURL(file)} width={130} height={130} alt={file.name} />
                                        </div>
                                        ))}
                                        <div className="up-plus">
                                            <input type="file" id={`file-upload-${index}`} multiple onChange={handleFileChange(index)} />
                                            <label htmlFor={`file-upload-${index}`}>
                                                <Image src="/images/plus.svg" width={40} height={40} alt="" />
                                                <p>ADD IMAGE</p>
                                            </label>
                                        </div>
                                    </div>
                                    {/* <p className='xs-text mt-2'>(Upload Multiple files, Max file size 2mb, supported format jpg, png, doc.)</p> */}
                                  </div>
                                </div>
                              </div>
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                        )
                      }
                        
                      )}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    size='medium'
                    className='mt-5'
                    variant='contained'
                    sx={{ marginBottom: 7 }}
                    disabled={formik.isSubmitting}
                  >
                    Submit
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </ApexChartWrapper>
  )
}

export default GiveRating;
