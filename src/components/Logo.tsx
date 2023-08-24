import { forwardRef } from 'react'
// @mui
import { Box, BoxProps } from '@mui/material'

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  disabledLink?: boolean
}

const Logo = forwardRef<any, Props>(({ disabledLink = false, sx }, ref) => {
  // const theme = useTheme()

  // const PRIMARY_LIGHT = theme.palette.primary.light

  // const PRIMARY_MAIN = theme.palette.primary.main

  // const PRIMARY_DARK = theme.palette.primary.dark

  // OR
  // const logo = (
  //   <Box ref={ref} sx={{ cursor: 'pointer', ...sx }}>
  //     <SvgIcon>
  //       <svg
  //         id="Layer_1"
  //         data-name="Layer 1"
  //         xmlns="http://www.w3.org/2000/svg"
  //         viewBox="0 0 84.11 94.4"
  //         fill="#f05150"
  //       >
  //         <defs>
  //           <style>.cls-1</style>
  //         </defs>
  //         <title>Ces_web2</title>
  //         <polygon
  //           className="cls-1"
  //           points="75.32 24.96 42.09 7.08 15.57 21.51 48.32 40.4 42.09 44.11 2.49 21.25 42.09 0 81.57 21.38 75.32 24.96"
  //         />
  //         <polygon
  //           className="cls-1"
  //           points="33.77 51.32 0 31.91 0 24.32 40.15 47.68 40.15 54.66 33.77 51.32"
  //         />
  //         <polygon
  //           className="cls-1"
  //           points="24 63.68 0 49.61 0 44.11 28.53 61.05 28.53 66.11 24 63.68"
  //         />
  //         <polygon
  //           className="cls-1"
  //           points="6.42 35.6 6.42 66.57 40.15 87.38 40.15 94.4 0 70.02 0 31.91 6.42 35.6"
  //         />
  //         <polygon
  //           className="cls-1"
  //           points="77.98 35.26 50.33 51.21 44.36 54.66 44.36 47.51 84.11 24.7 84.11 31.91 77.98 35.26"
  //         />
  //         <polygon
  //           className="cls-1"
  //           points="77.98 51.51 50.33 67.47 44.36 70.92 44.36 63.77 84.11 40.96 84.11 48.17 77.98 51.51"
  //         />
  //         <polygon
  //           className="cls-1"
  //           points="44.36 65.3 44.36 54.66 50.33 51.21 50.33 61.81 44.36 65.3"
  //         />
  //         <polygon
  //           className="cls-1"
  //           points="77.98 51.51 77.98 66.11 44.36 87 44.36 94.4 84.11 69.81 84.11 48.17 77.98 51.51"
  //         />
  //       </svg>
  //     </SvgIcon>
  //   </Box>
  // )

  const logo = (
    <Box ref={ref} sx={{ width: 24, height: 24, cursor: 'pointer', ...sx }}>
      <svg
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 84.11 94.4"
        fill="#f05150"
        // fill={PRIMARY_MAIN}
      >
        <title>Ces_web2</title>
        <polygon
          className="cls-1"
          points="75.32 24.96 42.09 7.08 15.57 21.51 48.32 40.4 42.09 44.11 2.49 21.25 42.09 0 81.57 21.38 75.32 24.96"
        />
        <polygon
          className="cls-1"
          points="33.77 51.32 0 31.91 0 24.32 40.15 47.68 40.15 54.66 33.77 51.32"
        />
        <polygon
          className="cls-1"
          points="24 63.68 0 49.61 0 44.11 28.53 61.05 28.53 66.11 24 63.68"
        />
        <polygon
          className="cls-1"
          points="6.42 35.6 6.42 66.57 40.15 87.38 40.15 94.4 0 70.02 0 31.91 6.42 35.6"
        />
        <polygon
          className="cls-1"
          points="77.98 35.26 50.33 51.21 44.36 54.66 44.36 47.51 84.11 24.7 84.11 31.91 77.98 35.26"
        />
        <polygon
          className="cls-1"
          points="77.98 51.51 50.33 67.47 44.36 70.92 44.36 63.77 84.11 40.96 84.11 48.17 77.98 51.51"
        />
        <polygon
          className="cls-1"
          points="44.36 65.3 44.36 54.66 50.33 51.21 50.33 61.81 44.36 65.3"
        />
        <polygon
          className="cls-1"
          points="77.98 51.51 77.98 66.11 44.36 87 44.36 94.4 84.11 69.81 84.11 48.17 77.98 51.51"
        />
      </svg>
    </Box>
  )

  // if (disabledLink) {
  // }
  return <>{logo}</>

  // return <NextLink href="/dashboard/app">{logo}</NextLink>
})

export default Logo
