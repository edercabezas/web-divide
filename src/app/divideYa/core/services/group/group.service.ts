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
import { limit, onSnapshot, orderBy, serverTimestamp, updateDoc } from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private _route: Router = inject(Router);
  private _general: GeneralService = inject(GeneralService);

  private messagesSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor(private firestore: Firestore) { }

  // yes
  async readGroup(userId: string): Promise<any> {

    if (!userId) return;
    const memberSnap = await getDocs(
      query(collection(this.firestore, 'group_members'), where('userId', '==', userId))
    );

    const groupMemberships = memberSnap.docs.map((doc: any) => ({
      groupId: doc.data().groupId,
      role: doc.data().role,
      joinedAt: doc.data().joinedAt
    }));

    const groupIds = groupMemberships.map(m => m.groupId);

    if (groupIds.length === 0) return [];

    const groupSnap = await getDocs(
      query(collection(this.firestore, 'group'), where(documentId(), 'in', groupIds))
    );

    const results = [];

    for (const groupDoc of groupSnap.docs) {
      const groupId = groupDoc.id;
      const groupData: any = groupDoc.data();
      const creatorId = groupData['createdBy'];
      const q: any = query(
        collection(this.firestore, 'users'),
        where('userID', '==', creatorId)
      );

      const querySnapshot: any = await getDocs(q);
      const creatorData: any = querySnapshot.docs[0].data();

      const memberCountSnap: any = await getCountFromServer(
        query(collection(this.firestore, 'group_members'), where('groupId', '==', groupId))
      );

      const membership = groupMemberships.find(m => m.groupId === groupId);

      results.push({
        id: groupId,
        name: groupData.group,
        groupID: groupData.groupID,
        createdBy: groupData.createdBy,
        description: groupData.description,
        totalAmount: groupData.totalAmount,
        privilege: groupData.privilege,
        createdAt: groupData.createdAt,
        inviteToken: groupData.inviteToken,
        role: membership?.role || 'Miembro',
        joinedAt: membership?.joinedAt,
        memberCount: memberCountSnap.data().count,
        creador: creatorData?.['userName'] ?? 'Desconocido'
      });
    }

    return results;


  }
  // yes
  async createdGroup(route: string, data: any): Promise<any> {

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
  }

  async countGroupMessageCreate(data: any): Promise<any> {
    await addDoc(collection(this.firestore, 'count_register'), {
      userID: data.userID,
      muduloName: data.muduloName,
      amountRegister: data.amountRegister,
      groupMessaID: data.groupMessaID,
    }).then(() => {
      return {
        statu: true,
        message: 'El Registro fue modificado exitosamente'
      }
    }).catch((error) => {
      return {
        statu: false,
        message: 'Error al actualizar'
      }
    })
  }

  async readGroupMessage(userID: string, moduleName: string): Promise<any> {

    const groupRef: any = collection(this.firestore, 'count_register');
    const groupQuery: any = query(groupRef,
      where('userID', '==', userID),
      where('muduloName', '==', moduleName));
    const groupSnapshot: any = await getDocs(groupQuery);


    if (groupSnapshot.empty) {
      console.error('No hay registros');
      return null;
    }
    const idData: any = groupSnapshot.docs[0];
    const groupDoc: any = groupSnapshot.docs[0].data();
    const groupId: any = idData.id;

    return {
      groupDoc,
      groupId
    }
  }

  async updateCountRegister(amountRegister: number, code: string): Promise<any> {
    const docRef = doc(this.firestore, `count_register/${code}`);

    return updateDoc(docRef, {
      amountRegister: amountRegister
    }).then(() => {
      return {
        statu: true,
        message: 'El Registro fue modificado exitosamente'
      }
    }).catch((error) => {
      return {
        statu: false,
        message: 'Error al actualizar'
      }
    });
  }
}
