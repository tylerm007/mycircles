import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyResponseCountHomeComponent } from './home/DailyResponseCount-home.component';
import { DailyResponseCountNewComponent } from './new/DailyResponseCount-new.component';
import { DailyResponseCountDetailComponent } from './detail/DailyResponseCount-detail.component';

const routes: Routes = [
  {path: '', component: DailyResponseCountHomeComponent},
  { path: 'new', component: DailyResponseCountNewComponent },
  { path: ':user_id/:response_date', component: DailyResponseCountDetailComponent,
    data: {
      oPermission: {
        permissionId: 'DailyResponseCount-detail-permissions'
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

export const DAILYRESPONSECOUNT_MODULE_DECLARATIONS = [
    DailyResponseCountHomeComponent,
    DailyResponseCountNewComponent,
    DailyResponseCountDetailComponent 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyResponseCountRoutingModule { }