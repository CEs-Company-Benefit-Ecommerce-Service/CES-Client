// i18n
import '../locales/i18n'

// highlight
import '../utils/highlight'

// scroll bar
import 'simplebar/src/simplebar.css'

// lightbox
import 'react-image-lightbox/style.css'

// map
import 'mapbox-gl/dist/mapbox-gl.css'
import '../utils/mapboxgl'

// editor
import 'react-quill/dist/quill.snow.css'

// slick-carousel
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

// lazy image
import 'react-lazy-load-image-component/src/effects/black-and-white.css'
import 'react-lazy-load-image-component/src/effects/blur.css'
import 'react-lazy-load-image-component/src/effects/opacity.css'

// fullcalendar
import '@fullcalendar/common/main.min.css'
import '@fullcalendar/daygrid/main.min.css'

import cookie from 'cookie'
import { ReactElement, ReactNode } from 'react'
// next
import { NextPage } from 'next'
import App, { AppContext, AppProps } from 'next/app'
import Head from 'next/head'
//
import { Provider as ReduxProvider } from 'react-redux'
// @mui
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
// redux
import { store } from '../redux/store'
// utils
import { getSettings } from '../utils/getSettings'
// contexts
import { CollapseDrawerProvider } from '../contexts/CollapseDrawerContext'
import { SettingsProvider } from '../contexts/SettingsContext'
// theme
import ThemeProvider from '../theme'
// components
import NotistackProvider from '../components/NotistackProvider'
import ProgressBar from '../components/ProgressBar'
import MotionLazyContainer from '../components/animate/MotionLazyContainer'
import { ChartStyle } from '../components/chart'
import ThemeSettings from '../components/settings'
import { SettingsValueProps } from '../components/settings/type'

// Check our docs
// https://docs-minimals.vercel.app/authentication/ts-version

import axiosClient from 'src/api-client/axiosClient'
import ConfirmDialog from 'src/components/ConfirmDialog'
import { SWRConfig } from 'swr'
import { AuthProvider } from '../contexts/JWTContext'
// import { AuthProvider } from '../contexts/Auth0Context';
// import { AuthProvider } from '../contexts/FirebaseContext';
// import { AuthProvider } from '../contexts/AwsCognitoContext';

// ----------------------------------------------------------------------

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

interface MyAppProps extends AppProps {
  settings: SettingsValueProps
  Component: NextPageWithLayout
}

export default function MyApp(props: MyAppProps) {
  const { Component, pageProps, settings } = props

  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <SWRConfig
        value={{ fetcher: (url: string) => axiosClient.get(url), shouldRetryOnError: false }}
      >
        <AuthProvider>
          <ReduxProvider store={store}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CollapseDrawerProvider>
                <SettingsProvider defaultSettings={settings}>
                  <MotionLazyContainer>
                    <ThemeProvider>
                      <ThemeSettings>
                        <NotistackProvider>
                          <ChartStyle />
                          <ProgressBar />
                          <ConfirmDialog />
                          {getLayout(<Component {...pageProps} />)}
                        </NotistackProvider>
                      </ThemeSettings>
                    </ThemeProvider>
                  </MotionLazyContainer>
                </SettingsProvider>
              </CollapseDrawerProvider>
            </LocalizationProvider>
          </ReduxProvider>
        </AuthProvider>
      </SWRConfig>
    </>
  )
}

// ----------------------------------------------------------------------

MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context)

  const cookies = cookie.parse(
    context.ctx.req ? context.ctx.req.headers.cookie || '' : document.cookie
  )

  const settings = getSettings(cookies)

  return {
    ...appProps,
    settings,
  }
}
