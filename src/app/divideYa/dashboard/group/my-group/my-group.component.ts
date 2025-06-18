import { ChangeDetectionStrategy, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatButton } from "@angular/material/button";
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { AddGroupComponent } from '../../../shared/add-group/add-group.component';
import { CrudService } from '../../../core/services/crud/crud.service';
import { ModalCreateGroupComponent } from '../../../shared/modal-create-group/modal-create-group.component';
import { Router } from '@angular/router';
import { SpinerComponent } from '../../../shared/spiner/spiner.component';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { GeneralService } from '../../../core/services/general/general.service';
import { GroupService } from '../../../core/services/group/group.service';
import { OptionAdvertisementComponent } from '../../../shared/option-advertisement/option-advertisement.component';
import { GoogleAdsenseComponent } from '../../../shared/google-adsense/google-adsense.component';
import { PremiumPlansDialogComponent } from '../../../shared/premium-plans-dialog/premium-plans-dialog.component';


@Component({
  selector: 'app-my-group',
  imports: [
    MatButton,
    MatIcon,
    MatCard,
    CurrencyPipe,
    SpinerComponent,
    MatFormField,
    MatInput,
    FormsModule,
    MatLabel
  ],
  standalone: true,
  templateUrl: './my-group.component.html',
  styleUrl: './my-group.component.scss',
  providers: [DatePipe],
})
export default class MyGroupComponent implements OnInit, OnChanges {
  dialog: MatDialog = inject(MatDialog);
  _groupService: GroupService = inject(GroupService);
  _general: GeneralService = inject(GeneralService);
  _datePipe: DatePipe = inject(DatePipe);
  private _route: Router = inject(Router);
  spinnerShow: boolean = false;
  dataStorage: any;
  groupList: any[];
  dataFilter: string = '';
  countRegisterGroup: number = 0;
  colectionRegisterGroup: string = '';
  dataListGroup: any;

  constructor() {
    this.groupList = []
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('as,db,dsamsd')
  }

  ngOnInit(): void {
    console.log('as,db,dsamsd')
    this._getUserStorage();
  }

  openDialogPass(): void {

    if (this.countRegisterGroup >= 2) {
      // this.modalAnuncioGroup();
      // this.openPremiumDialog();
      //Aqui va el modal de premium 
      // return;
    }

    const dialogRef = this.dialog.open(ModalCreateGroupComponent, {
      height: '520px',
      width: '430px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null && result !== undefined) {
        this.updateCreateRegister();
        this.setGroup(result)
      }
    });


  }
  setGroup(data: any): void {
    const dateNow = new Date();
    const myDate = this._datePipe.transform(dateNow, 'dd-MM-yyyy');

    const groupData: any = {
      group: data.group,
      description: data.description,
      totalAmount: data.value,
      privilege: data.privilege,
      createdAt: myDate,
      createdBy: this.dataStorage.userID,
      inviteToken: this._general.generarToken(),
      groupID: this._general.generateId(),
      status: true,
      type: 'Group',
      typeGroup: data.typeGroup
    };

    this._groupService.createdGroup('/group', groupData).then((response: any) => {
      this.getGroup();
    })

    console.log(groupData);

  }

  getGroup(): void {
    this.spinnerShow = true
    this._groupService.readGroup(this.dataStorage?.userID).then((response: any) => {
      this.spinnerShow = false
      this.groupList = response;
      this.dataListGroup = response;
    }).catch(() => this.spinnerShow = false)
      .finally(() => {
        this.spinnerShow = false
      });
  }

  private _getUserStorage(): any {
    this.dataStorage = this._general.getStorage();
    this.getCountGroup();
    this.getGroup();
  }


  public shareGroup(group: any): void {
    this._general.sharedLink(group)
  }

  public showExpense(data: any): void {
    this._route.navigate(['dashboard/gasto', data.groupID]).then();
  }

  public showChat(data: any): void {
    this._route.navigate(['dashboard/chats', data.id]).then();
  }

  filterDataGroup(): void {
    const resulFilter = this.dataFilter.toLowerCase().trim();
    console.log(resulFilter.length)

    if (resulFilter && resulFilter.length > 2) {

      this.groupList = this.groupList.filter((data: any) =>
        data.name.toLowerCase().includes(resulFilter)
      );

      if (this.groupList.length === 0) {
        this.groupList = this.dataListGroup.filter((data: any) =>
          data.name.toLowerCase().includes(resulFilter)
        );
      }

    } else {
      this.groupList = this.dataListGroup;
    }
  }

  getCountGroup(): void {
    this._groupService.readGroupMessage(this.dataStorage.userID, 'Group',).then((response) => {
      this.countRegisterGroup = response?.groupDoc?.amountRegister;
      this.colectionRegisterGroup = response?.groupId;
    })
  }

  updateCreateRegister(): void {
    if (this.countRegisterGroup) {
      this.countGroupUpdate();
      return;
    }
    this.countGroupCreate();
  }

  countGroupCreate(): void {
    const data = {
      userID: this.dataStorage.userID,
      muduloName: 'Group',
      amountRegister: this.countRegisterGroup ? this.countRegisterGroup + 1 : 1,
      groupMessaID: this._general.generateId()
    };
    this._groupService.countGroupMessageCreate(data).then((response: any) => {
      this.getCountGroup();
    });
  }

  countGroupUpdate(): void {
    const registerNumber = this.countRegisterGroup ? this.countRegisterGroup + 1 : 1;
    this._groupService.updateCountRegister(registerNumber, this.colectionRegisterGroup).then((response: any) => {
      this.getCountGroup();
    })
  }

  modalAnuncioGroup(): void {
    const dialogRef = this.dialog.open(OptionAdvertisementComponent, {
      width: '400px',
      disableClose: true,
      data: 'Has alcanzado el límite de grupos gratuitos. Para seguir creando más grupos, por favor mira este anuncio.'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí puedes redirigir a un video o mostrar el anuncio
        // this.irAVerElAnuncio();
      }
    });
  }


  openPremiumDialog() {
    const dialogRef = this.dialog.open(PremiumPlansDialogComponent, {
      width: '95%',
      maxWidth: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((selectedPlan) => {
      if (selectedPlan) {
        console.log('Plan seleccionado:', selectedPlan);
        // Aquí haces la lógica de pago o anuncio según el plan
      }
    });
  }

}
