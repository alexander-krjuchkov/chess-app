import { Box, Typography } from '@mui/material';
import styles from './Footer.module.css';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <Box component='footer' className={styles.mainFooter}>
            <Typography variant='body2' color='text.secondary'>
                &copy; {currentYear}
            </Typography>
        </Box>
    );
}
