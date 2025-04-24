import { Box, Typography, Button } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { authManager } from '../stores';
import styles from './UnauthenticatedContent.module.css';

const login = () => {
    void authManager.signInRedirect();
};

export const UnauthenticatedContent = () => (
    <Box className={styles.container}>
        <Typography
            variant='h5'
            color='text.secondary'
            className={styles.message}
        >
            Please sign in to continue
        </Typography>
        <Button variant='contained' startIcon={<LoginIcon />} onClick={login}>
            Sign in
        </Button>
    </Box>
);
