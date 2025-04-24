import { ReactNode } from 'react';
import { Button } from '@mui/material';
import styles from './HeaderButton.module.css';

type HeaderButtonProps = {
    icon: ReactNode;
    text: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
};

export const HeaderButton = ({
    icon,
    text,
    onClick,
    disabled,
}: HeaderButtonProps) => {
    return (
        <Button
            color='inherit'
            startIcon={icon}
            onClick={onClick}
            disabled={disabled}
            className={styles.button}
        >
            <span className={styles.buttonText}>{text}</span>
        </Button>
    );
};
