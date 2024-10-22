import React, {useEffect, useState, useContext} from 'react'
import api, {setAuthToken} from 'src/axiosInstance'
import { AuthContext } from 'src/auth/AuthContext'
import { useRouter } from 'next/router'

import AdminDashboard from './AdminDashboard'
import EmployeeDashboard from './EmployeeDashboard'
import LeaderBoard from './leaderboard'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }) => {
    const translations = await serverSideTranslations(locale, ['common']);
    console.log('Loaded translations in getStaticProps:', translations);  // Log translations to debug

    return {
        props: {
        ...translations,
        },
    };
};

const MainPage = (props) => {
    console.log('page inner prop', props);
    const {user} = useContext(AuthContext)
    const router = useRouter();
    const [dashboard, setDashboard] = useState(<p>Loading...</p>);

    useEffect(()=>{
        if(user.role){
            switch (user.role) {
                case 'doorman':
                    console.log('role inner', user);
                    setDashboard(<EmployeeDashboard />);
                    break;
                case 'manager':
                    console.log('role inner', user);
                    setDashboard(<LeaderBoard />);
                    break;
                default:
                    setDashboard(<AdminDashboard />);
                    break;
            }
        }else{
            setDashboard(<AdminDashboard />);
        }

    },[user])

  return dashboard
}

export default MainPage