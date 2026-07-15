import CircularProgress from '@mui/material/CircularProgress';
import type { CircularProgressProps } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number },
) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex', height: '42px' }}>
            <CircularProgress
                size={42}
                thickness={4}
                variant="determinate"
                enableTrackSlot
                aria-label="Step progress"
                {...props}
                sx={{
                    color: 'primary.main'
                }}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    sx={{ color: 'custom.600', fontSize: 12 }}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

