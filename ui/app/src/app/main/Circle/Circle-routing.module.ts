import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CircleHomeComponent } from './home/Circle-home.component';
import { CircleNewComponent } from './new/Circle-new.component';
import { CircleDetailComponent } from './detail/Circle-detail.component';

const routes: Routes = [
  {path: '', component: CircleHomeComponent},
  { path: 'new', component: CircleNewComponent },
  { path: ':circle_type', component: CircleDetailComponent,
    data: {
      oPermission: {
        permissionId: 'Circle-detail-permissions'
      }
    }
  },{
    path: ':circle_type/CardSelection', loadChildren: () => import('../CardSelection/CardSelection.module').then(m => m.CardSelectionModule),
    data: {
        oPermission: {
            permissionId: 'CardSelection-detail-permissions'
        }
    }
}
];

export const CIRCLE_MODULE_DECLARATIONS = [
    CircleHomeComponent,
    CircleNewComponent,
    CircleDetailComponent 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CircleRoutingModule { }