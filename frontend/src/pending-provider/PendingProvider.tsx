import { ReactNode, useRef, useState } from 'react';
import { PendingContext } from './PendingContext';

export function PendingProvider({ children }: { children: ReactNode }) {
    const [isPendingState, setIsPending] = useState(false);
    const isPendingRef = useRef(false);

    const setPending = (status: boolean) => {
        isPendingRef.current = status;
        setIsPending(status);
    };

    return (
        <PendingContext.Provider
            value={{ isPendingState, isPendingRef, setPending }}
        >
            {children}
        </PendingContext.Provider>
    );
}
