import { collection, getDocs, query, where, getFirestore, orderBy } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  constructor(private firestore: Firestore) {}

  async getUserNotifications(userId: string): Promise<any[]> {
    // Paso 1: Obtener los grupos del usuario
    const memberSnap = await getDocs(
      query(collection(this.firestore, 'group_members'), where('userId', '==', userId))
    );

    const groupIds = memberSnap.docs.map(doc => doc.data()['groupId']);

    if (groupIds.length === 0) return [];

    const allNotifications: any[] = [];

    // Paso 2: Si hay <=10 grupos, consulta directamente con 'in'
    if (groupIds.length <= 10) {
      const notifSnap = await getDocs(
        query(
          collection(this.firestore, 'notification'),
          where('groupID', 'in', groupIds),
          orderBy('timestamp', 'desc')
        )
      );

      return notifSnap.docs.map(doc => doc.data());
    }

    // Paso 3: Si hay más de 10, divide en chunks de 10
    const chunks = this.chunkArray(groupIds, 10);

    for (const chunk of chunks) {
      const notifSnap = await getDocs(
        query(
          collection(this.firestore, 'notification'),
          where('groupID', 'in', chunk),
          orderBy('timestamp', 'desc')
        )
      );

      const notifications = notifSnap.docs.map(doc => doc.data());
      allNotifications.push(...notifications);
    }

    // Paso 4: Ordenar todas las notificaciones por timestamp descendente
    return allNotifications.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
  }

  private chunkArray(arr: any[], size: number): any[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }
}
