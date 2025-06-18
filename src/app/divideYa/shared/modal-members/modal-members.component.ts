import { Component, inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { GeneralService } from '../../core/services/general/general.service';

@Component({
  selector: 'app-modal-members',
  imports: [
    MatIcon,
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './modal-members.component.html',
  styleUrl: './modal-members.component.scss'
})
export class ModalMembersComponent implements OnInit {

  userStorage: any;
  isCurrentUserAdmin: any;
  readonly dialogRef = inject(MatDialogRef<ModalMembersComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  _general: GeneralService = inject(GeneralService)



  constructor() { }

  ngOnInit(): void {
    console.log(this.data)
    this.userStorage = this._general.getStorage()?.userID;
    this.isCurrentUserAdmin = this.data.find((m: any) => this.userStorage === m.userID)?.role === 'Admin';
    console.log(this.isCurrentUserAdmin)


  }

  confirmRemove(member: any): void {
    this.dialogRef.close(member);
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }
  removeMember(member: any): void {
    // Aquí llamas al servicio que elimina al miembro del grupo
  }
}