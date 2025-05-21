import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  documentId,
  Firestore,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  where
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { GeneralService } from '../general/general.service';
import { BehaviorSubject } from 'rxjs';
import { limit, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _route: Router = inject(Router);
  private _general: GeneralService = inject(GeneralService);

  private messagesSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor(
    private firestore: Firestore) { }



    async createMessage(data: any): Promise<any> {

    const messagesRef = collection(this.firestore, `chat_group`);
    return addDoc(messagesRef, {
      chatID: data.chatID,
      chatMessage: data.chatMessage,
      userID: data.userID,
      groupID: data.groupID,
      timestamp: serverTimestamp(),
      userName: data.userName
    });

  }


async getMessages(groupID: string): Promise<any> {
  const messagesRef = collection(this.firestore, 'chat_group');
  const q = query(
    messagesRef,
    where('groupID', '==', groupID),
    orderBy('timestamp', 'asc')
  );

  onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    this.messagesSubject.next(messages);
  });
}


async getGroupChat(groupID: string): Promise<any> {
  const docRef = doc(this.firestore, 'group', groupID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}

  
async readGroup(userId: string): Promise<any[]> {
  if (!userId) return [];

  // Paso 1: Consultar los grupos donde el usuario es miembro
  const memberSnap = await getDocs(
    query(collection(this.firestore, 'group_members'), where('userId', '==', userId))
  );

  const groupMemberships = memberSnap.docs.map((doc: any) => ({
    groupId: doc.data().groupId,
    role: doc.data().role,
    joinedAt: doc.data().joinedAt,
  }));

  const groupIds = groupMemberships.map((m) => m.groupId);
  if (groupIds.length === 0) return [];

  // Paso 2: Obtener todos los grupos en paralelo
  const groupSnap = await getDocs(
    query(collection(this.firestore, 'group'), where(documentId(), 'in', groupIds))
  );

  const groupsData = groupSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));

  // Paso 3: Obtener todos los creadores únicos
  const creatorIds = [...new Set(groupsData.map((g: any) => g.createdBy))];

  const creatorQueries = creatorIds.map((id) =>
    getDocs(query(collection(this.firestore, 'users'), where('userID', '==', id)))
  );
  const creatorSnapshots = await Promise.all(creatorQueries);

  const creatorMap = new Map<string, string>();
  creatorSnapshots.forEach((snap) => {
    if (!snap.empty) {
      const userData: any = snap.docs[0].data();
      creatorMap.set(userData.userID, userData.userName);
    }
  });

  // Paso 4: Contar miembros de todos los grupos en paralelo
  const countQueries = groupIds.map((groupId) =>
    getCountFromServer(query(collection(this.firestore, 'group_members'), where('groupId', '==', groupId)))
  );
  const countSnapshots = await Promise.all(countQueries);

  const countMap = new Map<string, number>();
  groupIds.forEach((groupId, index) => {
    countMap.set(groupId, countSnapshots[index].data().count);
  });

  // Paso 5: Construir el resultado final
  const results = groupsData.map((group: any) => {
    const membership = groupMemberships.find((m) => m.groupId === group.id);
    return {
      id: group.id,
      name: group.group,
      groupID: group.groupID,
      createdBy: group.createdBy,
      description: group.description,
      totalAmount: group.totalAmount,
      privilege: group.privilege,
      createdAt: group.createdAt,
      inviteToken: group.inviteToken,
      role: membership?.role || 'Miembro',
      joinedAt: membership?.joinedAt,
      memberCount: countMap.get(group.id) || 0,
      creador: creatorMap.get(group.createdBy) ?? 'Desconocido'
    };
  });

  return results;
}

}
