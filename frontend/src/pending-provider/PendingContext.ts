import { createContext, MutableRefObject } from 'react';

type PendingContextProps = {
    isPendingState: boolean;
    isPendingRef: MutableRefObject<boolean>;
    setPending: (status: boolean) => void;
};

export const PendingContext = createContext<PendingContextProps | null>(null);
