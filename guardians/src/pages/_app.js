// 'use client'
// ** Next Imports
import Head from 'next/head'
import Script from 'next/script'
// import Script
import { useState, useEffect } from 'react'
import { Router, useRouter } from 'next/router'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'
import { AuthProvider } from 'src/auth/AuthContext'
// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

import 'bootstrap/dist/css/bootstrap.min.css';

// ** Global css styles
import '../../styles/globals.css'
import '../../styles/main.scss'
import '../../styles/res.scss'

import { appWithTranslation } from 'next-i18next'


const clientSideEmotionCache = createEmotionCache()



// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = props => {
  const router = useRouter();
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  const user = {
    loggedIn: false,
  }

  console.log('Loaded namespaces:', pageProps._nextI18Next?.initialI18nStore);



  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{`${themeConfig.templateName}`}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName}`}
        />
        <meta name='keywords' content='' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />


        
      </Head>

      <AuthProvider>
        <SettingsProvider>
          <SettingsConsumer>
        
                {({ settings }) => {
                  return <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
                }}
        
          </SettingsConsumer>
        </SettingsProvider>
      </AuthProvider>
    </CacheProvider>
  )
}

export default appWithTranslation(App)
