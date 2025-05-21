import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from '@angular/material/form-field';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../core/services/suth/auth.service';
import {DatePipe} from '@angular/common';
import { GeneralService } from '../../core/services/general/general.service';

@Component({
  selector: 'app-register',
    imports: [
        MatButton,
        MatFormField,
        MatInput,
        MatLabel,
        MatIcon,
        MatIconModule,
        MatFormFieldModule, MatInputModule, ReactiveFormsModule
    ],
  standalone: true,
  templateUrl: './registerComponent.html',
  styleUrl: './registerComponent.scss',
  providers: [provideNativeDateAdapter(), DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,


})
export default class RegisterComponent implements  OnInit{

  private _route: Router = inject(Router);
  public registerUser!: FormGroup;
  private _auth: AuthService = inject(AuthService);
  private _general: GeneralService = inject(GeneralService);
  _datePipe: DatePipe = inject(DatePipe);

  formBuilder: FormBuilder = inject(FormBuilder);

  eyeDisable: boolean;

  constructor() {
    this.eyeDisable = true;
  }

  ngOnInit(): void {
    this.initFort();
    }

  public register(): void {
    const dateNow = new Date();
    const myDate = this._datePipe.transform(dateNow, 'dd-MM-yyyy');

      const data: any = {
        userName: this.registerUser.get('userName')?.value,
        password: this.registerUser.get('password')?.value,
        password2: this.registerUser.get('password2')?.value,
        email: this.registerUser.get('email')?.value,
        userSecret: this.registerUser.get('userSecret')?.value,
        userID: this._general.generateId(),
        createdAt: myDate,
      };

      ;
      this._auth.createUser('/users', data).then((response: any)  => {
        console.log(response)
      })
  }


  public iniciar(): void {
    this._route.navigate(['/'])
  }

  public registerGoogle(): void {}

  initFort(): void {
    this.registerUser = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      userSecret: ['', [Validators.required]],
      country: [''],
      city: [''],
      birthDate: [''],
      phone: [''],
    });
  }
}


