import { useMediaQuery } from '@mui/material';

export const useIsMobile = () => !useMediaQuery('(min-width: 960px)');
