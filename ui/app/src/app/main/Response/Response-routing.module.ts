import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResponseHomeComponent } from './home/Response-home.component';
import { ResponseNewComponent } from './new/Response-new.component';
import { ResponseDetailComponent } from './detail/Response-detail.component';

const routes: Routes = [
  {path: '', component: ResponseHomeComponent},
  { path: 'new', component: ResponseNewComponent },
  { path: ':id', component: ResponseDetailComponent,
    data: {
      oPermission: {
        permissionId: 'Response-detail-permissions'
      }
    }
  }
];

export const RESPONSE_MODULE_DECLARATIONS = [
    ResponseHomeComponent,
    ResponseNewComponent,
    ResponseDetailComponent 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponseRoutingModule { }