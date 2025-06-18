import { collection, getDocs, query, where, getFirestore, orderBy, doc, getDoc, Timestamp } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class GraphicsService {
  constructor(private firestore: Firestore) { }



   parseFechaDDMMYYYY(fechaStr: string): Date | null {
      const partes = fechaStr.split('-');
      if (partes.length !== 3) return null;
      const [dia, mes, anio] = partes.map(Number);
      return new Date(anio, mes - 1, dia);
    }

  async getGruposConCantidadMiembros(currentUserId: string) {

    const groupMembersQuery = query(
      collection(this.firestore, 'group_members'),
      where('userId', '==', currentUserId)
    );
    const groupMembersSnap = await getDocs(groupMembersQuery);
    const groupIds = groupMembersSnap.docs.map((doc: any) => doc.data().groupId);

    const resultadosPorMes: Record<string, { presupuesto: number; gastos: number }> = {};

    for (const groupId of groupIds) {
      const groupRef = doc(this.firestore, 'group', groupId);
      const groupSnap: any = await getDoc(groupRef);

      if (!groupSnap.exists()) continue;

      const data = groupSnap.data();
      const totalAmount = data.totalAmount || 0;

      let createdAtDate: Date | null = null;
      if (typeof data.createdAt === 'string') {
        createdAtDate = this.parseFechaDDMMYYYY(data.createdAt);
      } else if (data.createdAt?.toDate) {
        createdAtDate = data.createdAt.toDate();
      }

      if (!createdAtDate) continue;

      const year = createdAtDate.getFullYear();
      const nowYear = new Date().getFullYear();
      if (year !== nowYear) continue;

      const membersQuery = query(
        collection(this.firestore, 'group_members'),
        where('groupId', '==', groupId)
      );
      const membersSnap = await getDocs(membersQuery);
      const cantidadMiembros = membersSnap.size || 1;

      const presupuestoPorPersona = totalAmount / cantidadMiembros;

      // 🔥 Traer gastos del grupo
      const expensesQuery = query(
        collection(this.firestore, 'expenses'),
        where('groupID', '==', groupId)
      );
      const expensesSnap = await getDocs(expensesQuery);
      let totalGastos = 0;
      expensesSnap.forEach((doc: any) => {
        totalGastos += +doc.data().inputValue || 0;
      });

      const gastosPorPersona = totalGastos / cantidadMiembros;

      const mesKey = `${year}-${String(createdAtDate.getMonth() + 1).padStart(2, '0')}`;

      if (!resultadosPorMes[mesKey]) {
        resultadosPorMes[mesKey] = { presupuesto: 0, gastos: 0 };
      }

      resultadosPorMes[mesKey].presupuesto += presupuestoPorPersona;
      resultadosPorMes[mesKey].gastos += gastosPorPersona;
    }

    const resultadoFinal = [];
    const currentYear = new Date().getFullYear();
    for (let mes = 1; mes <= 12; mes++) {
      const key = `${currentYear}-${String(mes).padStart(2, '0')}`;
      resultadoFinal.push({
        mes: key,
        presupuestoPorPersona: Math.round(resultadosPorMes[key]?.presupuesto || 0),
        gastosTotales: Math.round(resultadosPorMes[key]?.gastos || 0)
      });
    }

    return resultadoFinal;
  }






}
