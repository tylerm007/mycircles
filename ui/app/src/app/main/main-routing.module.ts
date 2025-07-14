import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main.component';

export const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule) },
        { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
        { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
      
    
        { path: 'Card', loadChildren: () => import('./Card/Card.module').then(m => m.CardModule) },
    
        { path: 'CardSelection', loadChildren: () => import('./CardSelection/CardSelection.module').then(m => m.CardSelectionModule) },
    
        { path: 'CardTag', loadChildren: () => import('./CardTag/CardTag.module').then(m => m.CardTagModule) },
    
        { path: 'Cardtype', loadChildren: () => import('./Cardtype/Cardtype.module').then(m => m.CardtypeModule) },
    
        { path: 'Circle', loadChildren: () => import('./Circle/Circle.module').then(m => m.CircleModule) },
    
        { path: 'DailyResponseCount', loadChildren: () => import('./DailyResponseCount/DailyResponseCount.module').then(m => m.DailyResponseCountModule) },
    
        { path: 'Fellowship', loadChildren: () => import('./Fellowship/Fellowship.module').then(m => m.FellowshipModule) },
    
        { path: 'Response', loadChildren: () => import('./Response/Response.module').then(m => m.ResponseModule) },
    
        { path: 'Tag', loadChildren: () => import('./Tag/Tag.module').then(m => m.TagModule) },
    
        { path: 'User', loadChildren: () => import('./User/User.module').then(m => m.UserModule) },
    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }