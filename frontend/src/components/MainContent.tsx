import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { authManager } from '../stores';
import { UnauthenticatedContent } from './UnauthenticatedContent';
import { AuthenticatedContent } from './AuthenticatedContent';
import styles from './MainContent.module.css';

export const MainContent = observer(function MainContent() {
    const { user } = authManager;

    return (
        <Box component='main' className={styles.mainContent}>
            {user ? <AuthenticatedContent /> : <UnauthenticatedContent />}
        </Box>
    );
});
