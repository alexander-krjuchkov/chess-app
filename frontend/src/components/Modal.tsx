import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import styles from './Modal.module.css';

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    children: JSX.Element;
};

export const Modal = ({ open, onClose, title, children }: ModalProps) => (
    <Dialog open={open} onClose={onClose} fullScreen className={styles.modal}>
        <DialogTitle className={styles.modalHeader}>
            <Box className={styles.modalTitleText}>{title}</Box>
            <IconButton onClick={onClose}>
                <CloseIcon fontSize='large' />
            </IconButton>
        </DialogTitle>
        <DialogContent>{children}</DialogContent>
    </Dialog>
);
