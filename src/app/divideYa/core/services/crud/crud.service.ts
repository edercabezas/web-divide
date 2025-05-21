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
export class CrudService {
  private _route: Router = inject(Router);
  private _general: GeneralService = inject(GeneralService);

  private messagesSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor( private firestore: Firestore) { }


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

    // Paso 2: Obtener los grupos relacionados
    const groupSnap = await getDocs(
      query(collection(this.firestore, 'group'), where(documentId(), 'in', groupIds))
    );

    const results = [];

    for (const groupDoc of groupSnap.docs) {
      const groupId = groupDoc.id;
      const groupData: any = groupDoc.data()
        ;
      const creatorId = groupData['createdBy'];
      const q: any = query(
        collection(this.firestore, 'users'),
        where('userID', '==', creatorId) // 👈 aquí estás buscando por el campo
      );

      const querySnapshot: any = await getDocs(q);
      const creatorData: any = querySnapshot.docs[0].data();


      // Paso 3: Contar cuántos miembros tiene ese grupo
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

  async readGroupGuest(token: any, userID: string): Promise<any> {

    const groupRef: any = collection(this.firestore, 'group');
    const q: any = query(groupRef,
      where('inviteToken', '==', token));
    const snapshot: any = await getDocs(q);

    if (!snapshot.empty) {
      const groupDoc: any = snapshot.docs[0];
      const groupData = groupDoc.data();
      const groupId = groupDoc.id;
      const creatorId = groupData['createdBy'];

      console.log(groupData)

      // Consulta al usuario que creó el grupo
      const q: any = query(
        collection(this.firestore, 'users'),
        where('userID', '==', creatorId) // 👈 aquí estás buscando por el campo
      );

      const querySnapshot: any = await getDocs(q);
      const creatorData: any = querySnapshot.docs[0].data();


      // Consulta cuántos miembros tiene el grupo
      const membersRef: any = collection(this.firestore, 'group_members');
      const membersQ: any = query(membersRef,
        where('groupId', '==', groupId));
      const membersSnapshot: any = await getDocs(membersQ);
      const membersCount: any = membersSnapshot.size;
      const groupCode = membersSnapshot.docs[0].data();
      console.log(membersSnapshot.docs[0].data())


      //Saber si esta o no esta en el grupo ya


      const selectMembersRef = collection(this.firestore, 'group_members');
      const membersRefQ = query(
        selectMembersRef,
        where('groupId', '==', groupId),
        where('userId', '==', userID)
      );
      const membersSnapshotRef = await getDocs(membersRefQ);

      let isMember = false;
      let memberStatus = null;
      let memberID = null;

      if (!membersSnapshotRef.empty) {
        isMember = true;
        const memberDataMember = membersSnapshotRef.docs[0].data();
        memberStatus = memberDataMember['status'];
        memberID = membersSnapshotRef.docs[0].id;
      }


      // Valor dividido entre miembros
      const valor = groupData['totalAmount'];
      const aportePorPersona: any = valor / membersCount;

      // Resultado final
      const groupInfo: any = {
        nombreGrupo: groupData['group'],
        descripcion: groupData['description'],
        createdAt: groupData['createdAt'],
        totalAmount: valor,
        miembros: membersCount,
        groupID: groupCode.groupId,
        memberID: groupCode.memberID,
        token: groupCode.token,
        aportePorPersona,
        estadoMiembro: memberStatus,
        esMiembro: isMember,
        creadoPor: creatorData?.['userName'] ?? 'Desconocido'
      };

      console.log(groupInfo);
      return groupInfo;
    } else {
      console.error('Grupo no encontrado con el token');
      return null;
    }

  }

  async registerMembersGuest(data: any): Promise<any> {

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


  delete(route: string, uid: string) { }
  updated(route: string, uid: string, data: any) { }



  async getDataFilter(uid: any, router: string) {
    return new Promise(async (resolve, reject) => {
      const userRef = doc(this.firestore, `${router}/${uid}`);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        resolve(userSnap.data());
      } else {
        reject('No user data found');
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

    // 5. Calcular aporte por persona
    const valorTotal = groupData['totalAmount'];
    const aportePorPersona = valorTotal / membersCount;

    // 6. Retornar objeto completo
    return {

      name: groupData['group'],
      userID: groupData['createdBy'],
      groupID: groupData['groupID'],
      descripcion: groupData['description'],
      createdAt: groupData['createdAt'],
      totalAmount: valorTotal,
      miembros: membersCount,
      inviteToken: groupData['inviteToken'],
      aportePorPersona,
      creadoPor: creatorData?.userName ?? 'Desconocido',
      miembrosDetalle: memberDetails
    };
  }

  //createMessage, getMessages, getGroupChat yes
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
//getGroupChat yes
  async getGroupChat(groupID: string): Promise<any> {
    //    const groupRef: any = collection(this.firestore, 'group');
    // const groupQuery: any = query(groupRef, where('groupID', '==', groupID));
    // const groupSnapshot: any = await getDocs(groupQuery);
    // const groupDoc: any = groupSnapshot.docs[0];

    const docRef = doc(this.firestore, 'group', groupID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Datos del usuario:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("No se encontró el documento");
      return null;
    }
  }

  getMessages(groupID: string) {
    console.log('ksajdksaddsajkdkjbjkdsa')
    const messagesRef = collection(this.firestore, 'chat_group');
    const q = query(
      messagesRef,
      where('groupID', '==', groupID),
      orderBy('timestamp', 'asc')
    );

    onSnapshot(q, (snapshot) => {
      console.log('Recibido snapshot:', snapshot.size);
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      this.messagesSubject.next(messages);
    });
  }


  listenToLastMessage(groupId: string, callback: (message: any) => void) {
    const q = query(
      collection(this.firestore, 'chat_group'),
      where('groupID', '==', groupId),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        callback({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      }
    });
  }

  async getUserProfile(creatorId: string): Promise<any> {
    // 2. Traer datos del creador del grupo
    const creatorRef: any = collection(this.firestore, 'users');
    const creatorQuery: any = query(creatorRef, where('userID', '==', creatorId));
    const creatorSnapshot: any = await getDocs(creatorQuery);
    const creatorData: any = creatorSnapshot.docs[0]?.data();

    return {
      userName: creatorData.userName,
      password: creatorData.password,
      userSecret: creatorData.userSecret,
      email: creatorData.email,
      phone: creatorData.phone,
      photo: creatorData.photo,
      country: creatorData.country,
      city: creatorData.city,
      birthDate: creatorData.birthDate,
      userID: creatorData.userID,
      password2: creatorData.password2,
      uid: creatorData.uid,
    }

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

}
