import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardTagHomeComponent } from './home/CardTag-home.component';
import { CardTagNewComponent } from './new/CardTag-new.component';
import { CardTagDetailComponent } from './detail/CardTag-detail.component';

const routes: Routes = [
  {path: '', component: CardTagHomeComponent},
  { path: 'new', component: CardTagNewComponent },
  { path: ':id', component: CardTagDetailComponent,
    data: {
      oPermission: {
        permissionId: 'CardTag-detail-permissions'
      }
    }
  }
];

export const CARDTAG_MODULE_DECLARATIONS = [
    CardTagHomeComponent,
    CardTagNewComponent,
    CardTagDetailComponent 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardTagRoutingModule { }