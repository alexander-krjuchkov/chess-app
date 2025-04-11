import { useContext } from 'react';
import { PendingContext } from './PendingContext';

export function usePending() {
    const context = useContext(PendingContext);
    if (!context) {
        throw new Error('PendingContext not found');
    }
    return context;
}
