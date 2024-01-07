import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { Login, Role } from 'src/app/type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoggedIn: boolean = false;
  roles: Role[];

  message: string = '';
  email: string;
  password: string;
  auth: AuthService;
  _loginFormGroup: FormGroup | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.auth = this.authService;

    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
      this.router.navigate(['/']);

    } else {
      this._loginFormGroup = this.formBuilder.group({
        email: [this.email, Validators.required],
        password: [this.password, Validators.required]
      });
    }
  }

  setMessage(m: string) {
    this.message = m;
  }

  login() {
    this.message = 'Tentative de connexion en cours ...';
    if (this._loginFormGroup && this._loginFormGroup?.value.email && this._loginFormGroup?.value.password) {

      this.auth.login(this._loginFormGroup?.value.email, this._loginFormGroup?.value.password)
        .subscribe((result: Login) => {
          if (result) {
            this.setMessage('Vous êtes connecté !');
            this.router.navigate(['/']);
            this.storageService.saveUser(result);
            this.isLoggedIn = true;
            window.location.reload();
          } else {
            this.setMessage('Identifiant ou mot de passe incorrect !');
            this.password = '';
            this.router.navigate(['/login']);
          }
        })
    }
  }

  logout() {
    this.auth.logout();
    this.setMessage('Vous êtes déconnecté !');
  }
}