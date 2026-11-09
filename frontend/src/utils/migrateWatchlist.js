import { fetchWatchlistServer, addToWatchlistServer } from '../services/watchlistApi';

export async function migrateLocalToServer(userKey) {
  if (!userKey) return { migrated: 0, skipped: 0, error: null };
  try {
    const globalKey = 'ss_watchlist';
    const userKeyName = `ss_watchlist::${userKey}`;

    const gather = (k) => {
      try { return JSON.parse(localStorage.getItem(k) || '[]').map(String); } catch { return []; }
    };

    const globalList = gather(globalKey);
    const userList = gather(userKeyName);
    const localIds = Array.from(new Set([...globalList, ...userList]));
    if (localIds.length === 0) return { migrated: 0, skipped: 0, error: null };

    const serverList = await fetchWatchlistServer();
    const serverIds = serverList.map(String);

    let migrated = 0;
    for (const id of localIds) {
      if (!serverIds.includes(String(id))) {
        await addToWatchlistServer(String(id));
        migrated++;
      }
    }
    try { localStorage.removeItem(globalKey); } catch (e) { console.warn(e); }
    try { localStorage.removeItem(userKeyName); } catch (e) { console.warn(e); }

    return { migrated, skipped: localIds.length - migrated, error: null };
  } catch (err) {
    console.error('migrate error', err);
    return { migrated: 0, skipped: 0, error: err?.message || String(err) };
  }
}
