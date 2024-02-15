import { Injectable } from '@angular/core';
import { AngularFireAuth, PERSISTENCE } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly afAuth: AngularFireAuth,
    private readonly router: Router
  ) { }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
    .then(() => {

      this.router.navigate(['/']);
    })
  }

  logout() {
    console.log('logout');
    this.afAuth.signOut()
    .then(() => {
      console.log('Logout success');
      this.router.navigate(['/login']);
    })
    .catch((error) => {
      console.error('Error on logout', error);
    });
  }

  get getUser() {
    return this.afAuth.authState;
  }

  async isAutheticated() {
    console.log('isAutheticated', await this.afAuth.currentUser);
    return await this.afAuth.currentUser !== null;
  }
}
