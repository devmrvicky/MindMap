const DB_NAME = import.meta.env.VITE_DB_NAME || "LLM_CHATS_DB";
const storeNames: storeName[] = ["chat", "chatRoom"];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      // console.log("creating object store");
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
      storeNames.forEach((storeName: storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, {
            keyPath: storeName === "chatRoom" ? "chatRoomId" : "id",
            // autoIncrement: false,
          });
        }
      });
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

export async function getAllData({
  storeName,
}: {
  storeName: storeName;
}): Promise<Chat[] | ChatRoom[]> {
  const db = await openDB();
  return await new Promise((resolve, reject) => {
    const transaction: IDBTransaction = db.transaction([storeName], "readonly");
    const store: IDBObjectStore = transaction.objectStore(storeName);
    const request = store.getAll() as IDBRequest<Chat[] | ChatRoom[]>;

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function updateData({
  data,
  storeName,
}: {
  data: Data;
  storeName: storeName;
}) {
  const db = await openDB();
  return await new Promise((resolve, reject) => {
    const transaction: IDBTransaction = db.transaction(
      [storeName],
      "readwrite"
    );
    const store: IDBObjectStore = transaction.objectStore(storeName);
    // console.log(data);
    const request = store.put(
      storeName === "chatRoom" ? { id: data.chatRoomId, ...data } : data
    );

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function deleteData({
  id,
  storeName,
}: {
  id: IDBValidKey | IDBKeyRange;
  storeName: storeName;
}): Promise<unknown> {
  const db = await openDB();
  return await new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    // console.log(request);

    request.onsuccess = () => {
      // console.log(`id: ${id}: deleted`);
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}
