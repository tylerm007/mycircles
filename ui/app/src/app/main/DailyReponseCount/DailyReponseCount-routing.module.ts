import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyReponseCountHomeComponent } from './home/DailyReponseCount-home.component';
import { DailyReponseCountNewComponent } from './new/DailyReponseCount-new.component';
import { DailyReponseCountDetailComponent } from './detail/DailyReponseCount-detail.component';

const routes: Routes = [
  {path: '', component: DailyReponseCountHomeComponent},
  { path: 'new', component: DailyReponseCountNewComponent },
  { path: ':user_id/:response_date', component: DailyReponseCountDetailComponent,
    data: {
      oPermission: {
        permissionId: 'DailyReponseCount-detail-permissions'
      }
    }
  },{
    path: ':user_id/Response', loadChildren: () => import('../Response/Response.module').then(m => m.ResponseModule),
    data: {
        oPermission: {
            permissionId: 'Response-detail-permissions'
        }
    }
}
];

export const DAILYREPONSECOUNT_MODULE_DECLARATIONS = [
    DailyReponseCountHomeComponent,
    DailyReponseCountNewComponent,
    DailyReponseCountDetailComponent 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyReponseCountRoutingModule { }