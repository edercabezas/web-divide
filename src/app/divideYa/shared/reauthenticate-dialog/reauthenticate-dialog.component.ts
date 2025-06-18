import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-reauthenticate-dialog',
  imports: [
MatButton,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    MatFormField
  ],
  templateUrl: './reauthenticate-dialog.component.html',
  styleUrl: './reauthenticate-dialog.component.scss'
})
export class ReauthenticateDialogComponent {
eyeDisable: boolean = true;
form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReauthenticateDialogComponent>
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required]]
    });
  }

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.password);
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }
}