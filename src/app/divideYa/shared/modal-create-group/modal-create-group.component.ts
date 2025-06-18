import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';


@Component({
  selector: 'app-modal-create-group',
  imports: [
    MatButton,
    MatIcon,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    MatFormField,
    MatSelect,
    MatOption,
  ],
  standalone: true,
  templateUrl: './modal-create-group.component.html',
  styleUrl: './modal-create-group.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalCreateGroupComponent implements OnInit{


  readonly dialogRef = inject(MatDialogRef<ModalCreateGroupComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  formBuilder: FormBuilder = inject(FormBuilder);
  public registerGroupForm!: FormGroup;

  constructor() {
  }

  ngOnInit(): void {
        this.initForm()
    }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  public createGroup(): void {
    const group = this.registerGroupForm.get('group')?.value;
    const description = this.registerGroupForm.get('description')?.value;
    const value = this.registerGroupForm.get('value')?.value;
    const privilege = this.registerGroupForm.get('privilege')?.value;
    const typeGroup = this.registerGroupForm.get('typeGroup')?.value;

    this.dialogRef.close({group, description, value, privilege, typeGroup});
  }


  initForm(): void {
    this.registerGroupForm = this.formBuilder.group({
      group: ['', [Validators.required, Validators.minLength(8)]],
      description: [''],
      value: [''],
      privilege: ['', [Validators.required]],
      typeGroup: ['', [Validators.required]],
    });
  }

}
