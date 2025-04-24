import { CssBaseline, Box } from '@mui/material';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { MainContent } from '../MainContent';
import { useSignInRedirectCallback } from '../../hooks';
import { StyledEngineProvider } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import styles from './App.module.css';

export function App() {
    useSignInRedirectCallback();

    return (
        <StyledEngineProvider injectFirst>
            <CssBaseline />
            <Box className={styles.app}>
                <Header />
                <MainContent />
                <Footer />
            </Box>
        </StyledEngineProvider>
    );
}
