const DB_NAME = import.meta.env.VITE_DB_NAME || "LLM_CHATS_DB";
const storeNames: storeName[] = ["chat", "chatRoom", "model"];

const DB_VERSION = 2;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      // console.log("creating object store");
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
      console.log({ db });
      storeNames.forEach((storeName: storeName) => {
        console.log(storeName);
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

// get all data from a given store
export async function getAllData({
  storeName,
}: {
  storeName: storeName;
}): Promise<Chat[] | ChatRoom[] | Model[]> {
  console.log({ storeName });
  const db = await openDB();
  return await new Promise((resolve, reject) => {
    const transaction: IDBTransaction = db.transaction([storeName], "readonly");
    const store: IDBObjectStore = transaction.objectStore(storeName);
    const request = store.getAll() as IDBRequest<Chat[] | ChatRoom[] | Model[]>;

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// update or add data to a given store
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
      storeName === "chatRoom"
        ? { id: (data as ChatRoom).chatRoomId, ...data }
        : storeName === "chat"
        ? { id: (data as Chat).chatId, ...data }
        : data // this expression is useful because chat room data does not contain id; chat room has chatRoomId and indexDB is supposed to have id for storing data.
    );

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// delete data from a given store by id
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

// delete all data from a given store
export async function clearStore(storeName: storeName): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

// set all data to a given store
export async function setAllData({
  data,
  storeName,
}: {
  data: Data[];
  storeName: storeName;
}): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);

    // First clear the store
    const clearRequest = store.clear();
    clearRequest.onsuccess = () => {
      // Then add all new data
      let addCount = 0;
      if (data.length === 0) {
        resolve();
        db.close();
        return;
      }
      data.forEach((item) => {
        const putRequest = store.put(
          storeName === "chatRoom"
            ? { id: (item as ChatRoom).chatRoomId, ...item }
            : item
        );
        putRequest.onsuccess = () => {
          addCount++;
          if (addCount === data.length) {
            resolve();
            db.close();
          }
        };
        putRequest.onerror = () => {
          reject(putRequest.error);
          db.close();
        };
      });
    };
    clearRequest.onerror = () => {
      reject(clearRequest.error);
      db.close();
    };
  });
}

// write a function that fetch chats that have a specific chat room id
export async function getChatsByChatRoomId(
  chatRoomId: string
): Promise<Chat[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["chat"], "readonly");
    const store = transaction.objectStore("chat");
    const request = store.getAll();

    request.onsuccess = () => {
      const chats = (request.result as Chat[]).filter(
        (chat) => chat.chatRoomId === chatRoomId
      );
      resolve(chats);
      db.close();
    };

    request.onerror = () => {
      reject(request.error);
      db.close();
    };
  });
}
