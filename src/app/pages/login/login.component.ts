import { Component, inject } from '@angular/core';
import { LayoutService } from '../../services/app.layout.service';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PasswordModule, CommonModule, FormsModule, CheckboxModule, RouterModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less',
  styles: [
    `
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `
  ]
})
export class LoginComponent {
  private auth: Auth = inject(Auth);
  valCheck: string[] = ['remember'];

  password!: string;
  email!: string;

  constructor(
    public layoutService: LayoutService,
    private readonly router: Router
  )
   { }

  signIn() {
    signInWithEmailAndPassword(this.auth, this.email, this.password).then(() => {
      this.router.navigate(['']);
    });
  }
}
