import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from '@angular/material/form-field';
import {Router, RouterLink, RouterModule} from '@angular/router';
import {MatCard} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../core/services/suth/auth.service';


@Component({
  selector: 'app-login',
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatIcon,
    MatIconModule,
    MatFormFieldModule, MatInputModule, RouterLink, MatCard, ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent  implements  OnInit{

  // private _route: Router = inject(Router);
  // private _auth: AuthService = inject(AuthService);
  formBuilder: FormBuilder = inject(FormBuilder);


  public loginUser!: FormGroup;
  eyeDisable: boolean;


  constructor(private _route: Router, private _auth: AuthService) {
    this.eyeDisable = true;

   

  }

  ngOnInit(): void {

     if (this._auth.isAuthenticatedStorage()) {
      console.log('askjbjksabjd')
      this._route.navigateByUrl('dashboard')
    }

    this.initFort();
  }

  login(): void {
    const data = {
      email: this.loginUser.get('email')?.value,
      password: this.loginUser.get('password')?.value,
    }
    this._auth.login(data).then((response: any) => {
      console.log(response.user.uid);
      if (response && response.user) {
        this.getDataUser(response.user.uid);
      }
    })
  }

  getDataUser(id: any): void {

    this._auth.getUserData(id, '/users').then((response: any) => {
      console.log(response)
      const data: any = {
        name: response.name,
        email: response.email,
        uid: response.uid,
        userID: response.userID,
        userName: response.userName,
        userSecret: response.userSecret
      }

      localStorage.setItem('dataUser', JSON.stringify(data));



      if (typeof window !== 'undefined') {
        const data = localStorage.getItem('token');

        if (data) {
          console.log(data)
          this._route.navigateByUrl('invitado/'+data);
          return;
        }


      }

      console.log(data)
      this._route.navigateByUrl('/dashboard')

    })
    console.log(id)

  }

  initFort(): void {
    this.loginUser = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  public registerOther(): void {
    this._route.navigateByUrl('/register');
  }
}

