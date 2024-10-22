import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import i18nextConfig from '../../../next-i18next.config'; // adjust the path to your config

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const LanguageSelector = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { locales, locale: activeLocale } = router;
  
  const changeLanguage = (e) => {
    const locale = e.target.value;
    const path = router.asPath;
    router.push(path, path, { locale });
  };

  // console.log('locales lang', locales, i18nextConfig.i18n.locales);
  

  return (
    // <>
    // </>
    <>
      {/* <select onChange={changeLanguage} value={activeLocale}>
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            
            {locale == 'pl' ? 'Dutch' : 'English'}
          </option>
        ))}
      </select> */}

      <FormControl >
        {/* <InputLabel id="city-select-label">Select Language</InputLabel> */}
        <Select
          labelId="city-select-label"
          id="city-select"
          value={activeLocale}
          // label="Select Language"
          onChange={changeLanguage}
        >
          {locales.map((locale, index) => (
            <MenuItem key={index} value={locale}>{locale == 'pl' ? 'DE' : 'ENG'}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default LanguageSelector;
