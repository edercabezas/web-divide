import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MatCard } from '@angular/material/card';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/suth/auth.service';
import { CrudService } from '../../core/services/crud/crud.service';
import { GeneralService } from '../../core/services/general/general.service';

@Component({
  selector: 'app-profile',
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatIcon,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCard,
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  formBuilder: FormBuilder = inject(FormBuilder);
  _crud: CrudService = inject(CrudService);
  _general: GeneralService = inject(GeneralService);
  _auth: AuthService = inject(AuthService);

  public dataUser!: FormGroup;
  eyeDisable: boolean;
  dataStorage: any;
  constructor() {
    this.eyeDisable = true;
  }
  ngOnInit(): void {
    this.setInitInput();
    this._getUserStorage();
  }

  private _getUserStorage(): any {
    this.dataStorage = this._general.getStorage();
    console.log(this.dataStorage)
    this.getUser();
  }

  getUser(): void {
    this._crud.getUserProfile(this.dataStorage.userID).then((response: any) => {
      console.log(response)
      this.dataUser.setValue(response)

      console.log(this.dataUser)
    });
  }

  public selectPhoto(): void {
    console.log('askbkjdsakjadsjk')
    const dataFile: any = document.getElementById('upload-product');
    dataFile.click();
  }

  public upload(data: any): void { }

  updateUSer(): void {
    const uid = this.dataUser.get('uid')?.value;
    const data = this.dataUser.value;

    this._auth.updateUser(uid, data).then((response: any) => {
      console.log(response);
    });

    // console.log(  this.dataUser.get('uid')?.value)



  }


  setInitInput(): void {
    this.dataUser = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      userSecret: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      photo: ['', [Validators.required]],
      password2: ['', [Validators.required, Validators.minLength(8)]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      userID: [''],
      uid: [''],

    });
  }



}
