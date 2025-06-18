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
import { deleteDoc, limit, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _route: Router = inject(Router);
  private _general: GeneralService = inject(GeneralService);

  private messagesSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSubject.asObservable();
  lastTimestamp: any;

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
      const messages: any = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
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

  async getMembersChat(groupId: string): Promise<any[]> {

    const memberSnap = await getDocs(
      query(collection(this.firestore, 'group_members'), where('groupId', '==', groupId))
    );

    const groupMemberships = memberSnap.docs.map((doc: any) => ({
      groupId: doc.data().groupId,
      role: doc.data().role,
      userId: doc.data().userId,
      memberID: doc.data().memberID,
      uid: doc.id
    }));

    const userIDs = groupMemberships.map((m: any) => m.userId);

    if (userIDs.length === 0) return [];

    const userSnap = await getDocs(
      query(collection(this.firestore, 'users'), where('userID', 'in', userIDs))
    );

    const users = userSnap.docs.map((doc: any) => doc.data());

    const mergedData = groupMemberships.map((member: any) => {
      const user = users.find((u: any) => u.userID === member.userId);
      return {
        uid: member.uid,
        role: member.role,
        groupId: member.groupId,
        userID: user.userID,
        photo: user.photo,
        userName: user.userName,
        memberID: member.memberID
      };
    });

    return mergedData;
  }

  async removeGroupMember(memberID: string): Promise<any> {
    try {
      const memberDocRef = doc(this.firestore, 'group_members', memberID);
      const response = await deleteDoc(memberDocRef);
      console.log('Miembro eliminado');
      return {
        response
      }

    } catch (error) {
      console.error('Error al eliminar el miembro:', error);
      return {
        error
      }

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

  async getDataUserGroupDelete(userID: string, groupID: string): Promise<any> {

    const q: any = query(
      collection(this.firestore, 'group_members'),
      where('groupId', '==', groupID),
      where('userId', '==', userID)
    );

    const querySnapshot: any = await getDocs(q);
    const creatorData: any = querySnapshot.docs[0].id;
    return creatorData;
  }

  async searchUser(user: string = ''): Promise<any> {

      const memberSnap = await getDocs(
      query(collection(this.firestore, 'users'), where('userSecret', '==', user))
    );

    const groupMemberships = memberSnap.docs.map((doc: any) => ({
      userID: doc.data().userID,
      userSecret: doc.data().userSecret,
      userName: doc.data().userName,
    }));

    return groupMemberships

  }

   async createdGroupChat(route: string, data: any): Promise<any> {

    const groupRef: any = await addDoc(collection(this.firestore, route), {
      group: data.group,
      description: data.description,
      totalAmount: data.totalAmount,
      createdAt: data.createdAt,
      createdBy: data.createdBy,
      privilege: data.privilege,
      inviteToken: data.inviteToken,
      groupID: data.groupID
    });

    const groupId = groupRef.id;
    const userId = data.createdBy;
    const inviteToken = data.inviteToken;
    const createdAt = data.createdAt;

    await addDoc(collection(this.firestore, 'group_members'), {
      groupId: groupId,
      userId: userId,
      role: 'Admin',
      joinedAt: createdAt,
      token: inviteToken,
      memberID: this._general?.generateId(),
      status: true,
      payGroup: false,
    });

    return {
      inviteToken,
      groupId
    };
  }

    async registerFriend(data: any): Promise<any> {

    console.log(data)
    return await addDoc(collection(this.firestore, 'group_members'), {
      groupId: data.groupId || '',
      userId: data.userId || '',
      role: data.role || '',
      joinedAt: data.joinedAt || '',
      token: data.token || '',
      memberID: data.memberID || '',
      status: data.status || '',
      payGroup: false,
    });
  }
}
