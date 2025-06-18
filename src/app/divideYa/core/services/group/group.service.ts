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
import { deleteDoc, limit, onSnapshot, orderBy, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
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
      query(collection(this.firestore, 'group_members'), 
      where('userId', '==', userId))
    );

    const groupMemberships = memberSnap.docs.map((doc: any) => ({
      groupId: doc.data().groupId,
      role: doc.data().role,
      joinedAt: doc.data().joinedAt
    }));

    const groupIds = groupMemberships.map(m => m.groupId);

    if (groupIds.length === 0) return [];

    const groupSnap = await getDocs(
      query(collection(this.firestore, 'group'),
      where(documentId(), 'in', groupIds),
       where('type', '==', 'Group'),
      // orderBy('createdAt', 'desc')
    )
    );

    const results = [];

    for (const groupDoc of groupSnap.docs) {
      const groupId = groupDoc.id;
      const groupData: any = groupDoc.data();
      const creatorId = groupData['createdBy'];
      const type = groupData['type'];
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
        type: type,
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
      groupID: data.groupID,
      status: true,
      type: data.type,
      typeGroup: data.typeGroup
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

  async returnNumberMembers(groupID: string): Promise<any> {

    const membersRef: any = collection(this.firestore, 'group_members');
    const membersQuery: any = query(membersRef, where('groupId', '==', groupID));
    const membersSnapshot: any = await getDocs(membersQuery);
    const membersCount: any = membersSnapshot.size;

    return {
      membersCount
    }

  }


  async readGroupMessage(userID: string, moduleName: string): Promise<any> {

    const groupRef: any = collection(this.firestore, 'count_register');
    const groupQuery: any = query(groupRef,
      where('userID', '==', userID),
      where('muduloName', '==', moduleName));
    const groupSnapshot: any = await getDocs(groupQuery);

    if (groupSnapshot.empty) {
      return null;
    }
    const idData: any = groupSnapshot.docs[0];
    const groupDoc: any = groupSnapshot.docs[0].data();
    const groupId: any = idData.id;

    return {
      groupDoc,
      groupId,
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

  async updateExpense(statu: boolean, code: string): Promise<any> {

    const docRef = doc(this.firestore, `group_members/${code}`);

    return updateDoc(docRef, {
      payGroup: statu
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


  async getReadExpense(groupID: string): Promise<any> {
    // 1. Buscar grupo por token
    const groupRef: any = collection(this.firestore, 'group');
    const groupQuery: any = query(groupRef, where('groupID', '==', groupID));
    const groupSnapshot: any = await getDocs(groupQuery);

    if (groupSnapshot.empty) {
      console.error('Grupo no encontrado con el token');
      return null;
    }

    const groupDoc: any = groupSnapshot.docs[0];
    const groupData = groupDoc.data();
    const groupId: any = groupDoc.id;
    const creatorId = groupData['createdBy'];

    // 2. Traer datos del creador del grupo
    const creatorRef: any = collection(this.firestore, 'users');
    const creatorQuery: any = query(creatorRef, where('userID', '==', creatorId));
    const creatorSnapshot: any = await getDocs(creatorQuery);
    const creatorData: any = creatorSnapshot.docs[0]?.data();

    // 3. Traer miembros del grupo
    const membersRef: any = collection(this.firestore, 'group_members');
    const membersQuery: any = query(membersRef, where('groupId', '==', groupId));
    const membersSnapshot: any = await getDocs(membersQuery);
    const membersCount: any = membersSnapshot.size;
    const colection: any = membersSnapshot.docs[0]?.id;


    // 4. Obtener información de cada miembro incluyendo su nombre de `users`
    const memberDetails = await Promise.all(membersSnapshot.docs.map(async (doc: any) => {
      const colection: any = doc.id;
      const member: any = doc.data();
      const userId = member.userId;

      // Buscar el usuario por su userId
      const userQuery: any = query(collection(this.firestore, 'users'), where('userID', '==', userId));
      const userSnapshot: any = await getDocs(userQuery);
      const userData: any = userSnapshot.docs[0]?.data();


      return {
        memberID: member.memberID,
        colection,
        userId,
        userName: userData?.userName ?? 'Invitado sin nombre',
        joinedAt: member.joinedAt,
        payGroup: member.payGroup,
      };
    }));

    const valorTotal = groupData['totalAmount'];
    const aportePorPersona = valorTotal / membersCount;

    return {
      name: groupData['group'],
      userID: groupData['createdBy'],
      groupID: groupData['groupID'],
      uid: groupId,
      descripcion: groupData['description'],
      createdAt: groupData['createdAt'],
      status: groupData['status'],
      totalAmount: valorTotal,
      miembros: membersCount,
      inviteToken: groupData['inviteToken'],
      aportePorPersona,
      creadoPor: creatorData?.userName ?? 'Desconocido',
      miembrosDetalle: memberDetails
    };
  }

  async closeOrOpenGroup(statu: boolean, code: string): Promise<any> {

    const docRef = doc(this.firestore, `group/${code}`);

    return updateDoc(docRef, {
      status: statu
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

  
  async createExpense(data: any): Promise<any> {
    try {
    await addDoc(collection(this.firestore, 'expenses'), {
      expenseID: data.expenseID,
      inputExpense: data.inputExpense,
      inputValue: data.inputValue,
      userID: data.userID,
      groupID: data.groupID,
      userName: data.userName,
      timestamp: data.timestamp
    })
        return {
        status: true,
        message: 'Gasto Agregado exitosamente.'
      }

    } catch (error) {
      return {
        status: false,
        message: 'Error al Agregar el gasto intentelo mas tarde'
      }

    }
  }

async getExpenses(groupID: string): Promise<any[]> {
  const q = query(
    collection(this.firestore, 'expenses'),
    where('groupID', '==', groupID)
  );

  const querySnapshot = await getDocs(q);

  const dataExpenses = querySnapshot.docs.map(doc => ({
    id: doc.id,          // Si quieres incluir el ID del documento
    ...doc.data()
  }));

  return dataExpenses;
}

 async removeExpense(memberID: string): Promise<any> {  
    try {
      const memberDocRef = doc(this.firestore, 'expenses', memberID);
       await deleteDoc(memberDocRef);
      return {
        status: true,
        message: 'Gasto eliminado exitosamente.'
      }

    } catch (error) {
      return {
        status: false,
        message: 'Error al eliminar el gasto'
      }

    }
  }


}
