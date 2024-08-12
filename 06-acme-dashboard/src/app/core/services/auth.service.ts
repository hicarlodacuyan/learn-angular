import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {}

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signup(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.signOut();
  }

  getUser() {
    return this.afAuth.authState;
  }

  isLoggedIn(): boolean {
    return !!this.afAuth.currentUser;
  }

  redirectToLogin() {
    return this.router.navigate(['/login']);
  }
}
