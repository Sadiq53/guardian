// ** MUI Imports
import Grid from '@mui/material/Grid'

import { useState, useEffect, useContext, useRef } from 'react'

import { styled, useTheme } from '@mui/material/styles';

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

import { Card, CardContent, Button, ButtonBase } from '@mui/material'

import LockIcon from '@mui/icons-material/Lock';

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CheckIcon from '@mui/icons-material/Check';

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
import api, { setAuthToken } from 'src/axiosInstance'
import { AuthContext } from 'src/auth/AuthContext'
import dayjs from 'dayjs';

import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

import ReactPlayer from 'react-player';

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
            : '#fff',
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



const EmployeeDashboard = () => {

    // const [employee, setEmployee] = useState(null)
    const { user } = useContext(AuthContext);
    const [expanded, setExpanded] = useState('panel1');
    const [videoUrls, setVideoUrls] = useState([]);
    const [videoProgress, setVideoProgress] = useState([]);
    const [completedVideos, setCompletedVideos] = useState([]);
    const videoRef = useRef(null);

    const handleChange4 = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const rateStar = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            if (rating > i) {
                stars.push(<Image src="/images/filled-star.svg" width={32} height={32} alt="" />);
            } else {
                stars.push(<Image src="/images/unfilled-star.svg" width={32} height={32} alt="" />);
            }
        }
        return <div>{stars}</div>;
    }

    // useEffect(()=>{
    //     const fetchVideos = async ()=>{
    //         setAuthToken(user.token)
    //         const res = await api.get('faqs/faqs');
    //         const data = res.data;
    //         setVideoUrls(data);
    //         console.log('l', data.length);
    //         setVideoProgress([...Array(data.length)].map(()=>0))
    //         setCompletedVideos([...Array(data.length)].map(()=>false))
    //     }
    //     fetchVideos();
    // },[])

    // const router = useRouter();

    // useEffect(() => {
    //     const { id } = router.query;
    //     if (id) {
    //       setAuthToken(user.token);
    //       api.get(`users/users/${id}`)
    //         .then(response => {
    //           setEmployee(response.data);
    //         })
    //         .catch(error => {
    //           console.error('Error fetching venue:', error);
    //         });
    //     }
    //   }, [router.query]);

    //   if(!employee){
    //     return(<p>Loading...</p>)
    //   }

    const columns = [
        { field: 'ID', headerName: 'ID', width: 200 },
        { field: 'startDate', headerName: 'Start Date', width: 200 },
        { field: 'endDate', headerName: 'End Date', width: 200 },
        {
            field: 'Employees', headerName: 'Employees', width: 130,
            renderCell: (params) => {
                const { id } = params.row;
                return (
                    <>
                        <span>{params.value}</span>
                    </>
                )
            }
        },
        { field: 'venueName', headerName: 'venue Name', width: 130 },
        {
            field: 'actions', headerName: 'Actions', width: 300,
            renderCell: (params) => {
                const { id } = params.row;
                return (
                    <div className='tb-btn-grp'>
                        <Button
                            size='medium'
                            variant='contained'
                            sx={{ marginBottom: 7 }}
                            onClick={() => router.push('/employees/add')}
                            endIcon={<ArrowForwardIcon />}
                        >
                            Add Comments
                        </Button>
                    </div>
                )
            }
        },
    ];

    const rows = []

    useEffect(() => {
        const lastCompletedIndex = completedVideos.lastIndexOf(true);
        if (lastCompletedIndex !== -1) {
            setExpanded(lastCompletedIndex + 1);
        }else {
            setExpanded(0);
        }
    }, [completedVideos]);



    // video proggress
    const handleChange = (panel) => (event, isExpanded) => {
        if (panel === 0 || completedVideos[panel - 1]) {
            setExpanded(isExpanded ? panel : false);
        }
    };

    // const updateVideoProgress = async (index) => {
    //     const newProgress = videoProgress[index].toFixed(0);
    //     const currentProgress = videoUrls[index].completionPercent || 0;
    
    //     if (newProgress > currentProgress) {
    //         const values = {
    //             employeeId: user.userid,
    //             faqId: videoUrls[index].id,
    //             completionPercent: videoProgress[index].toFixed(0)
    //         };
    
    //         try {
    //             await api.post('faqs/faqs/progress', values);
    //         } catch (error) {
    //             console.error('Error updating video progress:', error);
    //         }
    //     }
    // };

    // const handleSeek = (event) => {
    //     // Prevent skipping by resetting the video to the current progress
    //     if (videoRef.current) {
    //         const currentProgress = videoProgress[index]; // Get the current progress
    //         videoRef.current.seekTo(currentProgress / 100); // Reset to the current progress
    //     }
    // };

    // const handleVideoProgress = async(index, played, faq) => {

    // console.log(index, played)
       
    //     const progress = played.played * 100;

    //     // const newProgress = videoProgress[index].toFixed(0);
    //     const currentProgress = videoUrls[index].completionPercent || 0;
    //     // console.log('played', progress,currentProgress)
    //     // Prevent skipping by resetting the video to the current progress
    //     if (videoRef.current) {
    //         const currentProgress = videoProgress[index]; // Get the current progress
    //         videoRef.current.seekTo(currentProgress / 100); // Reset to the current progress
    //     }
    //     if (progress > currentProgress) {

    //         setVideoProgress(prevProgress => {
    //             const newProgress = [...prevProgress];
    //             newProgress[index] = progress;
    //             return newProgress;
    //         });
    
    //         if (progress === 100) {

    //             const values = {
    //                 employeeId: user.userid,
    //                 faqId: videoUrls[index].id,
    //                 completionPercent: videoProgress[index].toFixed(0)
    //             };
        
    //             try {
    //                 await api.post('faqs/faqs/progress', values);
    //             } catch (error) {
    //                 console.error('Error updating video progress:', error);
    //             }

    //             setCompletedVideos(prevCompleted => {
    //                 const newCompleted = [...prevCompleted];
    //                 newCompleted[index] = true;
    //                 return newCompleted;
    //             });
    
    //             if (index < videoUrls.length - 1) {
    //                 setExpanded(index + 1);
    //                 setVideoProgress(prevProgress => {
    //                     const newProgress = [...prevProgress];
    //                     newProgress[index + 1] = 0;
    //                     return newProgress;
    //                 });
    //             }
    //         }
    //     }

    // };


    // const calculateAverageProgress = () => {
    //     const totalProgress = videoProgress.reduce((acc, progress) => acc + progress, 0);
    //     return (totalProgress / videoUrls.length).toFixed(0);
    // };

    // const averageProgress = calculateAverageProgress();

    const updateVideoProgress = async (index) => {
        const newProgress = videoProgress[index].toFixed(0);
        const currentProgress = videoUrls[index].completionPercent || 0;

        // Only update progress if the new progress is greater than the current progress
        if (newProgress > currentProgress) {
            const values = {
                employeeId: user.userid,
                faqId: videoUrls[index].id,
                completionPercent: newProgress,
            };

            try {
                await api.post('faqs/faqs/progress', values);
            } catch (error) {
                console.error('Error updating video progress:', error);
            }
        }
    };

    const handleVideoProgress = async (index, played) => {
        const progress = played.played * 100;
        const currentProgress = videoProgress[index];

        // Prevent skipping by resetting the video to the last known progress
        if (progress > currentProgress + 5) {
            if (videoRef.current) {
                videoRef.current.seekTo(currentProgress / 100); // Reset to the last recorded progress
                return;
            }
        }

        // Update the progress if the user is not skipping
        if (progress > currentProgress) {
            setVideoProgress((prevProgress) => {
                const newProgress = [...prevProgress];
                newProgress[index] = progress;
                return newProgress;
            });

            // If the video reaches 100%, mark it as completed
            if (progress >= 100) {
                const values = {
                    employeeId: user.userid,
                    faqId: videoUrls[index].id,
                    completionPercent: 100,
                };

                try {
                    await api.post('faqs/faqs/progress', values);
                } catch (error) {
                    console.error('Error updating video progress:', error);
                }

                setCompletedVideos((prevCompleted) => {
                    const newCompleted = [...prevCompleted];
                    newCompleted[index] = true;
                    return newCompleted;
                });

                // Move to the next video if available
                if (index < videoUrls.length - 1) {
                    setExpanded(index + 1);
                    setVideoProgress((prevProgress) => {
                        const newProgress = [...prevProgress];
                        newProgress[index + 1] = 0; // Reset the progress of the next video
                        return newProgress;
                    });
                }
            }
        }
    };

    const handleSeek = (index) => {
        // Prevent skipping by seeking back to the last known progress
        if (videoRef.current) {
            const currentProgress = videoProgress[index];
            videoRef.current.seekTo(currentProgress / 100); // Reset to the last known progress
        }
    };

    const calculateAverageProgress = () => {
        const totalProgress = videoProgress.reduce((acc, progress) => acc + progress, 0);
        return (totalProgress / videoUrls.length).toFixed(0);
    };

    const averageProgress = calculateAverageProgress();
    
    // Assuming data structure: [{ url: 'videoUrl', progress: 50, completed: false }, ...]
    useEffect(() => {
        const fetchData = async () => {
            try {
                setAuthToken(user.token)
                const response = await api.get(`faqs/faqswithprogress/${user.userid}`);
                const data = response.data;
                setVideoUrls(data);
                const progress = data.map(item => item.completionPercent);
                const completed = data.map(item => item.completionPercent == 100);
                console.log('pro', data.map(item => item.completionPercent))
                setVideoProgress(progress); 
                setCompletedVideos(completed);

                const lastCompletedIndex = completed.lastIndexOf(true);
                if (lastCompletedIndex !== -1) {
                    setExpanded(lastCompletedIndex + 1);
                } else {
                    setExpanded(0);
                }
            } catch (error) {
                console.error('Error fetching video progress data:', error);
            }
        };

        fetchData();
    }, [user.token]);

    

    return (
        <ApexChartWrapper>
            <section className="emp-top-sec">
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h3 className="sm-head">
                                    FAQs
                                </h3>
                                <p className="sm-para">
                                    Tables display sets of data. They can be fully customized
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <Card className='mt-4'>
                            <CardContent>
                                <div className="faq-prg">
                                    <div className="tp d-flex flex-wrap ">
                                        <h3 className='sm-head style-2'>Complete Your FAQs</h3>
                                        <p><span>{averageProgress}%</span> Completed</p>
                                    </div>
                                    <div className="prog-bar mt-3 mb-3">
                                        <div className="bar" style={{ '--width': `${averageProgress}%` }}></div>
                                    </div>
                                    <p className="sm-text mb-0">Get a verified batch by completing these course</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="row pt-4">
                    <div className="col-12 mt-2">
                        <div className="emp-faq-section">
                         
                            {
                                (videoUrls.length && videoProgress.length && completedVideos.length)  && videoUrls.map((item, index) => {
                                    let status = 'locked';
                                    if (completedVideos[index]) {
                                        status = 'completed';
                                    } else if (videoProgress[index] > 0) {
                                        status = 'in-progress';
                                    }
                                    return (
                                        <div className={` fq-acc-row ${completedVideos[index] ? 'active' : ''}`} style={{ '--width': `${videoProgress[index].toFixed(0)}%` }} key={index}>
                                            <span className={` num ${completedVideos[index] ? 'active' : ''}`}>
                                                {
                                                    status == 'completed'?
                                                    <CheckIcon />
                                                    :
                                                    status == 'in-progress' || index == 0?
                                                    <>
                                                        <p>{videoProgress[index].toFixed(0)}%</p>
                                                        <span>{completedVideos[index] ? "Completed" : "In Progress"}</span>
                                                    </>:
                                                    status == 'locked'?
                                                    <LockIcon />
                                                    : ''
                                                }
                                            </span>
                                            {/* <Accordion expanded={expanded === `panel${index}`} onChange={handleChange4(`panel${index}`)} key={index}>
                                                <AccordionSummary aria-controls={`panel${index}d-content`} id={`panel${index}d-header`} className="faq-acc">
                                                    <h3>Faq Question will be here</h3>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <div className="sec">
                                                        <div className="row align-items-center">
                                                            <div className="col-lg-6 col-12">
                                                                <div className="video-wrapper">
                                                                    <video src=""></video>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 col-12">
                                                                <div className="con">
                                                                    <p className="para mb-0">
                                                                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorem omnis labore ratione eaque reiciendis cupiditate. Dolorem soluta quibusdam praesentium atque? Consectetur magni eaque delectus nihil quibusdam! Eaque illum ducimus soluta!
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionDetails>
                                            </Accordion> */}

                                            <Accordion expanded={expanded === index} onChange={handleChange(index)}>
                                                <AccordionSummary aria-controls={`panel${index}d-content`} id={`panel${index}d-header`} className="faq-acc">
                                                    <h3>{item.title}</h3>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <div className="sec">
                                                        <div className="row align-items-center">
                                                            <div className="col-lg-12 col-12">
                                                                <div className="video-wrapper">
                                                                <ReactPlayer
                    key={index}
                    url={item?.videoUrl}
                    ref={videoRef}
                    controls
                    onProgress={(progress) => handleVideoProgress(index, progress)}
                    onSeek={() => handleSeek(index)} // Reset the video on seek attempt
                    onPause={() => updateVideoProgress(index)} // Update progress on pause
                    onPlay={() => updateVideoProgress(index)} // Update progress on play
                />
                                                                </div>
                                                            </div>
                                                            {/* <div className="col-lg-6 col-12">
                                                                <div className="con">
                                                                    <p className="para mb-0">
                                                                        {item?.content}
                                                                    </p>
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </AccordionDetails>
                                            </Accordion>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

            </section>
        </ApexChartWrapper>
    )
}

export default EmployeeDashboard
