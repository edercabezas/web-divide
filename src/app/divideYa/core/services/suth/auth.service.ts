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
import { updateEmail, updatePassword } from 'firebase/auth';



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
    const userCredential = await createUserWithEmailAndPassword(this.auth, data.email, data.password);

    const uid = userCredential.user.uid;
    await setDoc(doc(this.firestore, 'users', uid), {
      uid,
      ...data,
    });

    return userCredential;
  }



  async login(data: any) {
    return await signInWithEmailAndPassword(this.auth, data.email, data.password);
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
      userName,
      password,
      userSecret,
      email,
      phone,
      photo,
      password2,
      country,
      city,
      birthDate,
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
