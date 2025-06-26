import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { AuthService } from '../../core/services/suth/auth.service';
import { SpinerComponent } from '../spiner/spiner.component';
import { Router } from '@angular/router';
import { OptionAdvertisementComponent } from '../option-advertisement/option-advertisement.component';
import { MatDialog } from '@angular/material/dialog';
import { GeneralService } from '../../core/services/general/general.service';
import { GroupService } from '../../core/services/group/group.service';


@Component({
  selector: 'app-header',
  imports: [
    MatToolbar,
    MatMenuTrigger,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatIconModule,
    SpinerComponent
  ],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {



  @Output() returnInformation = new EventEmitter<any>();

  dialog: MatDialog = inject(MatDialog);
  _general: GeneralService = inject(GeneralService);
  _groupService: GroupService = inject(GroupService);

  private _auth: AuthService = inject(AuthService);
  private _router: Router = inject(Router);
  countRegisterGroup: number = 0;
  status: boolean = false;
  public dataStorage: any;
  public spinnerShow: boolean = false;
  colectionRegisterGroup: string = '';


  ngOnInit(): void {
    this.dataStorage = this._general.getStorage();
    this.getCountGroup()
  }


  setDataFather() {
    this.returnInformation.emit();
  }



  public logoutSection(): void {
    this.spinnerShow = true;
    localStorage.removeItem('dataUser');
    setTimeout(() => {
      this._auth.logout();
      this.spinnerShow = false;
    }, 1000)

  }

  public setNotification(): void {
    this._router.navigateByUrl('dashboard/notification');
  }

  profileUser(): void {
    this._router.navigateByUrl('/dashboard/perfil');
  }

  public statistics(): void {
    if (this.countRegisterGroup >= 2) {
      this.modalAnuncioGroup();
      return;
    }

    this._router.navigateByUrl('dashboard/estadistica');
  }

  modalAnuncioGroup(): void {
    const dialogRef = this.dialog.open(OptionAdvertisementComponent, {
      width: '400px',
      disableClose: true,
      data: 'Has alcanzado el límite de grupos gratuitos. Para seguir creando más grupos, puedes ver anuncios.'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.countRegisterGroup = 0;
        this.countGroupCreate();
      }
    });
  }

  countGroupCreate(): void {
    const data = {
      userID: this.dataStorage.userID,
      muduloName: 'Graphics',
      amountRegister: this.countRegisterGroup ? this.countRegisterGroup + 1 : 1,
      groupMessaID: this._general.generateId()
    };
    this._groupService.countGroupMessageCreate(data).then((response: any) => {
    });
  }

  getCountGroup(): void {
    this._groupService.readGroupMessage(this.dataStorage.userID, 'Graphics',).then((response) => {
      this.countRegisterGroup = response?.groupDoc?.amountRegister;
      this.colectionRegisterGroup = response?.groupId;
    })
  }

}
