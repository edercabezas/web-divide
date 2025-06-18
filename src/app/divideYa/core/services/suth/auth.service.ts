import { inject, Injectable } from '@angular/core';
import { Firestore, setDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import {
  createUserWithEmailAndPassword,
  Auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getAuth
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //
  // private _auth: AngularFireAuth = inject(AngularFireAuth);
  // private db: AngularFirestore = inject(AngularFirestore);
  private _route: Router = inject(Router);
  constructor(
    private auth: Auth,
    private firestore: Firestore) { }


  async createUser(route: string, data: any): Promise<any> {

    console.log(route, data)

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, data.email, data.password);
      const uid = userCredential.user.uid;
      await setDoc(doc(this.firestore, 'users', uid), {
        uid,
        ...data,
      });
      if (userCredential && userCredential.user) {

        return { status: true, message: 'Usuario creado exitosamente' };
      } else {

        return { status: false, message: 'No se pudo crear el usuario.' };
      }

    } catch (error) {
      const firebaseError = error as FirebaseError;

      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          return {
            status: false,
            message: 'El correo ya está registrado.'
          };
        case 'auth/invalid-email':
          return {
            message: 'El correo ingresado no es válido.',
            status: false
          };
        case 'auth/weak-password':
          return {
            message: 'La contraseña es demasiado débil. Usa al menos 6 caracteres.',
            status: false
          };
        default:
          return {
            message: 'Ocurrió un error al registrar el usuario.',
            status: false
          };
      }
    }






    // return userCredential;
  }



  async login(data: any) {


    try {
      return await signInWithEmailAndPassword(this.auth, data.email, data.password);

    } catch (error) {
      return {
        status: false
      }
    }

  }

  async logout() {
    await this.auth.signOut();
    return await this._route.navigateByUrl('/');
  }


  async getUserData(uid: any, router: string) {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          const userRef = doc(this.firestore, `${router}/${uid}`);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            resolve(userSnap.data());
          } else {
            reject('No user data found');
          }
        } else {
          reject('No user logged in');
        }
      });
    });
  }


  async reauthenticateUser(currentEmail: string, currentPassword: string) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const credential = EmailAuthProvider.credential(currentEmail, currentPassword);

    await reauthenticateWithCredential(user, credential);
  }


  async updateUser(userId: string, data: any) {
    const user = this.auth.currentUser;
    if (!user || user.uid !== userId) throw new Error('No autorizado');

    if (data.email && data.email !== user.email) {
      await updateEmail(user, data.email);
    }

    if (data.password) {
      await updatePassword(user, data.password);
    }

    const userRef = doc(this.firestore, 'users', user.uid);

    const {
      password,
      password2,
      email,
      ...firestoreData
    } = data;

    await updateDoc(userRef, firestoreData);
  }




  getCurrentUserId(): string | null {
    const auth = getAuth();
    return auth.currentUser?.uid || null;
  }

  isAuthenticated(): Promise<boolean> {
    const auth = getAuth();

    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user: any | null) => {
        resolve(!!user);
      });
    });
  }


  isAuthenticatedStorage(): boolean {
    let user;
    if (typeof window !== 'undefined') {
      user = localStorage.getItem('dataUser');
    }
    return !!user;
  }

}
