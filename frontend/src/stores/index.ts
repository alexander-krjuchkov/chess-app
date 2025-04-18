import { AuthManager } from './AuthManager';
import { GamesManager } from './GamesManager';
import { PendingStore } from './PendingStore';

export const authManager = new AuthManager();
export const pendingStore = new PendingStore();
export const gamesManager = new GamesManager(authManager, pendingStore);
