import {
    collection,
    getDocs,
    query,
    where,
    updateDoc,
    doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase.init";

const colRef = collection(db, "upiAccounts");

export const upiService = {
  async listAll() {
    const snap = await getDocs(colRef);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async getActive() {
    const q = query(colRef, where("isActive", "==", true));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  },

  async setActive(id) {
    const snap = await getDocs(colRef);
    const updates = snap.docs.map((d) =>
      updateDoc(doc(db, "upiAccounts", d.id), {
        isActive: d.id === id,
      }),
    );
    await Promise.all(updates);
  },
};
