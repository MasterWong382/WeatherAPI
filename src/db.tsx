import { openDB, IDBPDatabase } from 'idb';

interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: Record<string, string>;
  hourly: {
    time: string[];
    relativehumidity_2m: number[];
    direct_radiation: number[];
  };
}

const DB_NAME = 'WeatherDB';
const STORE_NAME = 'WeatherData';

let dbPromise: Promise<IDBPDatabase>;

export const initDB = async () => {
  dbPromise = openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const saveData = async (data: WeatherData) => {
  const db = await dbPromise;  // Ensure dbPromise is resolved
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.store;
  await store.put({ data });  // Store data without explicitly defining `id`
  await tx.done;
};

export const getData = async (): Promise<WeatherData | null> => {
  const db = await dbPromise;  // Ensure dbPromise is resolved
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.store;
  const result = await store.getAll();  // Use getAll to retrieve all stored data

  // Return the first entry or null if no data
  return result.length > 0 ? result[0].data : null;
};
