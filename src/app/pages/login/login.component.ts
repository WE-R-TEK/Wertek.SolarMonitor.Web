import { Component } from '@angular/core';
import { LayoutService } from '../../services/app.layout.service';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';

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
  valCheck: string[] = ['remember'];

  password!: string;
  email!: string;

  constructor(
    public layoutService: LayoutService,
    private readonly authService: AuthService,
    private readonly router: Router
  )
   { }

  signIn() {
    this.authService.login(this.email, this.password);
  }
}
