import {
    ApiError,
    AuthError,
    GameFinishedError,
    GameNotFoundError,
    InvalidMoveError,
    OutOfSyncError,
    ServerError,
    UnknownApiError,
} from '../errors/api-errors';

export function defaultApiErrorHandler(error: unknown) {
    console.error('Error:', error);

    if (!(error instanceof ApiError)) {
        alert(
            'An unexpected error occurred. Please reload the page or try again later.',
        );
        return;
    }

    const message = (() => {
        switch (true) {
            case error instanceof OutOfSyncError:
                return 'Game is out of sync. Please reload the page.';
            case error instanceof GameFinishedError:
                return 'Game is already finished.';
            case error instanceof GameNotFoundError:
                return 'Game not found.';
            case error instanceof InvalidMoveError:
                return 'Invalid move. Please try again.';
            case error instanceof AuthError:
                return 'Auth issue. Please make sure you are signed in and have the necessary permissions.';
            case error instanceof ServerError:
                return 'Server error. Please try again later.';
            case error instanceof UnknownApiError:
            default:
                return 'Something went wrong. Please reload the page or try again later.';
        }
    })();

    alert(message);
}
