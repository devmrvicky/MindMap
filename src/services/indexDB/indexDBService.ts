import { env } from "@/env/env";

type StoreName = "chat" | "chatRoom" | "model" | "currentlyUsedModels";

export default class IndexedDBService {
  private readonly DB_NAME: string;
  private readonly DB_VERSION: number;
  private readonly storeNames: StoreName[];

  constructor() {
    this.DB_NAME = env.VITE_INDEXDB_NAME;
    this.DB_VERSION = 3;
    this.storeNames = ["chat", "chatRoom", "model", "currentlyUsedModels"];
  }

  // --- Private method: open DB ---
  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;

        this.storeNames.forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, {
              keyPath: storeName === "chatRoom" ? "chatRoomId" : "id",
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

  // --- Get all data ---
  async getAllData({
    storeName,
  }: {
    storeName: StoreName;
  }): Promise<Chat[] | ChatRoom[] | Model[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll() as IDBRequest<
        Chat[] | ChatRoom[] | Model[]
      >;

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // --- Update or add ---
  async updateData({ storeName, data }: { storeName: StoreName; data: Data }) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);

      const request = store.put(
        storeName === "chatRoom"
          ? { id: (data as ChatRoom).chatRoomId, ...data }
          : storeName === "chat"
          ? { id: (data as Chat).chatId, ...data }
          : data
      );

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // --- Delete by ID ---
  async deleteData({ storeName, id }: { storeName: StoreName; id: string }) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);

      transaction.oncomplete = () => db.close();
    });
  }

  // --- Clear a store ---
  async clearStore(storeName: StoreName) {
    const db = await this.openDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);

      transaction.oncomplete = () => db.close();
    });
  }

  // --- Replace all data in store ---
  async setAllData({
    storeName,
    data,
  }: {
    storeName: StoreName;
    data: Data[];
  }) {
    const db = await this.openDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);

      const clearRequest = store.clear();
      clearRequest.onsuccess = () => {
        if (data.length === 0) {
          resolve();
          db.close();
          return;
        }
        let addCount = 0;
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

  // --- Get chats by chatRoomId ---
  async getChatsByChatRoomId(chatRoomId: string): Promise<Chat[]> {
    const db = await this.openDB();
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
}

// singleton instance
export const Idb = new IndexedDBService();
