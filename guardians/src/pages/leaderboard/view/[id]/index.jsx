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
  const { id } = router.query;
  const [expanded, setExpanded] = useState('panel1');
  const [employees, setEmployees] = useState([]);
  const [venues, setVenues] = useState([]);
  const [ratingDetails, setRatingDetails] = useState([]);

  useEffect(()=>{
    const getData = async ()=>{
        setAuthToken(user.token);
        const res = await api.get(`ratings/ratingbyid/${id}`);
      
        setRatingDetails(res.data)
    }
    if(id){
      getData()
    }
},[id])

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
                  {ratingDetails?.employee?.name} ({ratingDetails?.averageRating})
                </h3>
               
              </div>
            </div>
          </div>
        
        </div>

        <div className="row mt-4">
                <div className="col-12">
                    <Card>
                        <CardContent>
                            {/* <h3 className="xs-head mb-3">Personal Details</h3> */}
                            <div className="det-grid">
                                <div>
                                    <span>Venue</span>
                                    <span>{ratingDetails?.venue?.name}</span>
                                </div>
                                <div>
                                    <span>Start date</span>
                                    <span>{ratingDetails?.startDate	 && dayjs(ratingDetails?.startDate).format('DD MMM YYYY')}</span>
                                </div>
                                <div>
                                    <span>Time Of Inspection</span>
                                    <span>{ratingDetails?.timeOfInspection && dayjs(ratingDetails?.timeOfInspection).format('HH:mm A')	}</span>
                                </div>
                                <div>
                                    <span>Comments</span>
                                    <span>{ratingDetails?.comments}</span>
                                </div>
                               
                            </div>
                            {/* <h3 className="xs-head mb-3 mt-5">Rating</h3> */}
                            <div className="det-grid mt-5">
                              <div className="rte-wrapper">
                                  <h3>Average Rating ({ratingDetails?.averageRating})</h3> <br />
                                  <div className="stars">
                                        {rateStar(ratingDetails?.averageRating)} 
                                    </div>
                              </div>
                              <div className="rte-wrapper">
                                  <h3>Handlekraft ({ratingDetails?.handlekraft})</h3> <br />
                                  <div className="stars">
                                        {rateStar(ratingDetails?.handlekraft)}
                                    </div>
                              </div>
                              <div className="rte-wrapper">
                                  <h3>Doormanservice ({ratingDetails?.doormanservice})</h3> <br />
                                  <div className="stars">
                                        {rateStar(ratingDetails?.doormanservice)}
                                    </div>
                              </div>
                              <div className="rte-wrapper">
                                  <h3>overblik ({ratingDetails?.overblik})</h3> <br />
                                  <div className="stars">
                                        {rateStar(ratingDetails?.overblik)}
                                    </div>
                              </div>
                              <div className="rte-wrapper">
                                  <h3>placering ({ratingDetails?.placering})</h3> <br />
                                  <div className="stars">
                                        {rateStar(ratingDetails?.placering)}
                                    </div>
                              </div>
                              <div className="rte-wrapper">
                                  <h3>attitude ({ratingDetails?.attitude})</h3> <br />
                                  <div className="stars">
                                        {rateStar(ratingDetails?.attitude)}
                                    </div>
                              </div>
                               
                               
                            </div>

                            {
                                ratingDetails?.images &&
                                <>
                                    {/* <h3 className="xs-head mb-3 mt-5">Legial Document/Certificates</h3> */}
                                    <div className="up-wrap mt-3">
                                        {
                                            
                                            // Array.isArray(employee?.certificate) && 
                                            JSON.parse(ratingDetails?.images).map((item, index)=>{
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

export default GiveRating;
