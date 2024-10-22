'use client'
// ** MUI Imports
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import VerticalLayout from 'src/@core/layouts/VerticalLayout'

// ** Navigation Imports
import VerticalNavItems from 'src/navigation/vertical'

// ** Component Import
import UpgradeToProButton from './components/UpgradeToProButton'
import VerticalAppBarContent from './components/vertical/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'

import React, { useContext, useEffect } from 'react';
import { AuthContext } from 'src/auth/AuthContext'

import { useRouter } from 'next/router'

import LoginPage from 'src/pages/pages/login'


const hasAccess = (user, route) => {
  // const userRoles = user?.roles || [];
  // const routePermissions = {
  //   '/some-secured-route': ['admin', 'editor'],
  // };

  // const requiredRoles = routePermissions[route] || [];
  // return requiredRoles.some(role => userRoles.includes(role));
  return true;
};

const UserLayout = ({ children }) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()
  const { isAuthenticated, user, loading, logout } = useContext(AuthContext);
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const router = useRouter();
  const currentRoute = router.pathname;

  useEffect(() => {
    // console.log("User:", !user, user, !loading, loading); 
    if (!loading && !user) {
      router.push('/pages/login');
    }else if (!loading && user && !hasAccess(user, currentRoute)) {
      router.push('/pages/404');
    }
  }, [ router, user, loading, currentRoute]);

    if (!user || (user && !hasAccess(user, currentRoute))) {
      return null;
    }

    return (
      <VerticalLayout
        hidden={hidden}
        settings={settings}
        saveSettings={saveSettings}
        verticalNavItems={VerticalNavItems()}
  
        verticalAppBarContent={(props) => (
          <VerticalAppBarContent
            hidden={hidden}
            settings={settings}
            saveSettings={saveSettings}
            toggleNavVisibility={props.toggleNavVisibility}
          />
        )}
      >
        {children}
    
      </VerticalLayout>
    )

}

export default UserLayout
