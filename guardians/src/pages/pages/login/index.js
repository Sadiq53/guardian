// ** React Imports
import { useState, useContext } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

import { AuthContext } from 'src/auth/AuthContext'

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

import api from 'src/axiosInstance'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LoginPage = () => {
  // ** State
  const [error, setError] = useState('');
  const [values, setValues] = useState({
    password: '',
    showPassword: false
  })

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // ** Hook
  const theme = useTheme()
  const router = useRouter()

  const { login } = useContext(AuthContext);

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  // const handleClickShowPassword = () => {
  //   setValues({ ...values, showPassword: !values.showPassword })
  // }

  // const handleMouseDownPassword = event => {
  //   event.preventDefault()
  // }

  // const handleSubmit = (e)=>{
  //   e.preventDefault();
  //   login('admin@admin.com', '123456');
  //   router.push('/')
  // }

  const initialValues = {
    email: '',
    password: '',
    rememberMe: false,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const res = await login(values);
  
    if(res){
      router.push('/')
    }else{
      setError('Please enter a valid creadentials.')
    }
    setSubmitting(false)
  };


  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <div className='lg-logo'>
            <Image src="/images/logo.svg" width={200} height={100} alt="" />
          </div>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
            Velkommen til Guardian Service Group 👋🏻
            </Typography>
            <Typography variant='body2'>Please sign-in to your account and start the adventure</Typography>
          </Box>
          <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched }) => (
        <Form noValidate autoComplete='off' onSubmit={handleSubmit}>
          <Field
            as={TextField}
            autoFocus
            fullWidth
            id='email'
            name='email'
            label='Email'
            variant='outlined'
            sx={{ marginBottom: 4 }}
            error={touched.email && !!errors.email}
            helperText={touched.email && errors.email}
          />
          <FormControl fullWidth sx={{ marginBottom: 4 }}>
            <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
            <OutlinedInput
              id='auth-login-password'
              name='password'
              label='Password'
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              type={showPassword ? 'text' : 'password'}
              error={touched.password && !!errors.password}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    aria-label='toggle password visibility'
                  >
                    {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {touched.password && errors.password && (
              <Typography variant='body2' color='error'>{errors.password}</Typography>
            )}
          </FormControl>
          {/* <Box
            sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
          >
            <FormControlLabel
              control={<Checkbox
                id="rememberMe"
                name="rememberMe"
                checked={values.rememberMe}
                onChange={handleChange}
                color="primary"
              />}
              label='Remember Me'
            />
            <Typography variant='body2'>
              Forgot Password?
            </Typography>
          </Box> */}
          <Button
            fullWidth
            size='large'
            variant='contained'
            sx={{ marginBottom: 7 }}
            type='submit'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
          {error && (
            <Typography variant='body2' color='error' sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
        </Form>
      )}
    </Formik>

        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
