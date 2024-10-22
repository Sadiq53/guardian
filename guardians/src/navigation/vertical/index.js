// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'

import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import StarHalfOutlinedIcon from '@mui/icons-material/StarHalfOutlined';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';

import { useContext } from 'react'

import { AuthContext } from 'src/auth/AuthContext'

const navigation = () => {

  const {user} = useContext(AuthContext)

  switch (user.role) {
    case 'manager':
      return[
        {
          title: 'Ratings',
          path: '/',
          icon: StarHalfOutlinedIcon
        },
      ]
      break;
    case 'doorman':
      return[
        {
          title: 'Dashboard',
          icon: HomeOutline,
          path: '/'
        },
        {
          title: 'Ratings',
          path: '/ratings',
          icon: StarHalfOutlinedIcon
        },
        {
          title: 'Faq',
          icon: ChatBubbleOutlineOutlinedIcon,
          path: '/faq'
        },
        {
          title: 'Register Job',
          icon: WorkOutlineIcon,
          path: '/register-work',
          openInNewTab: false
        },
        {
          title: 'My Jobs',
          icon: WorkOutlineIcon,
          path: '/my-jobs',
          openInNewTab: false
        },
      ]
      break;
  
    default:
      return [
        {
          title: 'Dashboard',
          icon: HomeOutline,
          path: '/'
        },
        {
          title: 'Employees',
          icon: PermIdentityIcon,
          path: '/employees'
        },
        // {
        //   sectionTitle: 'Pages'
        // },
        {
          title: 'Venues',
          icon: CalendarTodayIcon,
          path: '/venues',
          openInNewTab: false
        },
        {
          title: 'Rating Officers',
          icon: LocalPoliceIcon,
          path: '/rating-officer',
          openInNewTab: false
        },
        {
          title: 'Jobs Reports',
          icon: WorkOutlineIcon,
          path: '/job-reports',
          openInNewTab: false
        },
        // {
        //   sectionTitle: 'User Interface'
        // },
        {
          title: 'Faqs',
          icon: ChatBubbleOutlineOutlinedIcon,
          path: '/faqs'
        },
        {
          title: 'Ratings',
          path: '/leaderboard',
          icon: StarHalfOutlinedIcon
        },
        {
          title: 'Banners',
          path: '/banner',
          icon: ViewCarouselIcon
        },
        // {
        //   title: 'Cards',
        //   icon: CreditCardOutline,
        //   path: '/cards'
        // },
        // {
        //   title: 'Tables',
        //   icon: Table,
        //   path: '/tables'
        // },
        // {
        //   icon: CubeOutline,
        //   title: 'Form Layouts',
        //   path: '/form-layouts'
        // }
      ]
      break;
  }


}

export default navigation
