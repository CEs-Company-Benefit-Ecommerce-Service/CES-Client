import { Box, LinearProgress } from '@mui/material'
import React from 'react'

function LoadingTable(props: { isValidating: boolean }) {
    if (props.isValidating) {
        return (
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>
        )
    }
    return null

}

export default LoadingTable