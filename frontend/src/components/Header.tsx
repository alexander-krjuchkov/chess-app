import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { HeaderMenu } from './HeaderMenu';
import logo from '../assets/logo.svg';
import styles from './Header.module.css';

const Logo = () => {
    return (
        <Box className={styles.logo}>
            <img
                src={logo}
                alt='Chess vs Computer'
                className={styles.logoIcon}
            />
            <Typography variant='h6' className={styles.logoText}>
                Chess vs Computer
            </Typography>
        </Box>
    );
};

export function Header() {
    return (
        <AppBar position='sticky' color='default' className={styles.mainHeader}>
            <Toolbar className={styles.toolbar}>
                <Logo />
                <HeaderMenu />
            </Toolbar>
        </AppBar>
    );
}
