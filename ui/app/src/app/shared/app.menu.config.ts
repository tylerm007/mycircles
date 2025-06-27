import { MenuRootItem } from 'ontimize-web-ngx';

import { CardCardComponent } from './Card-card/Card-card.component';

import { CardSelectionCardComponent } from './CardSelection-card/CardSelection-card.component';

import { CardTagCardComponent } from './CardTag-card/CardTag-card.component';

import { CardtypeCardComponent } from './Cardtype-card/Cardtype-card.component';

import { CircleCardComponent } from './Circle-card/Circle-card.component';

import { DailyReponseCountCardComponent } from './DailyReponseCount-card/DailyReponseCount-card.component';

import { FellowshipCardComponent } from './Fellowship-card/Fellowship-card.component';

import { ResponseCardComponent } from './Response-card/Response-card.component';

import { TagCardComponent } from './Tag-card/Tag-card.component';

import { UserCardComponent } from './User-card/User-card.component';


export const MENU_CONFIG: MenuRootItem[] = [
    { id: 'home', name: 'HOME', icon: 'home', route: '/main/home' },
    
    {
    id: 'data', name: ' data', icon: 'remove_red_eye', opened: true,
    items: [
    
        { id: 'Card', name: 'CARD', icon: 'view_list', route: '/main/Card' }
    
        ,{ id: 'CardSelection', name: 'CARD SELECTION', icon: 'view_list', route: '/main/CardSelection' }
    
        ,{ id: 'CardTag', name: 'CARD TAG', icon: 'view_list', route: '/main/CardTag' }
    
        ,{ id: 'Cardtype', name: 'CARD TYPE', icon: 'view_list', route: '/main/Cardtype' }
    
        ,{ id: 'Circle', name: 'CIRCLE', icon: 'view_list', route: '/main/Circle' }
    
        //,{ id: 'DailyReponseCount', name: 'DAILYREPONSECOUNT', icon: 'view_list', route: '/main/DailyReponseCount' }
    
        ,{ id: 'Fellowship', name: 'FELLOWSHIP', icon: 'view_list', route: '/main/Fellowship' }
    
       // ,{ id: 'Response', name: 'RESPONSE', icon: 'view_list', route: '/main/Response' }
    
        ,{ id: 'Tag', name: 'TAG', icon: 'view_list', route: '/main/Tag' }
    
        ,{ id: 'User', name: 'USER', icon: 'view_list', route: '/main/User' }
    
    ] 
},
    
    { id: 'settings', name: 'Settings', icon: 'settings', route: '/main/settings'}
    ,{ id: 'about', name: 'About', icon: 'info', route: '/main/about'}
    ,{ id: 'logout', name: 'LOGOUT', route: '/login', icon: 'power_settings_new', confirm: 'yes' }
];

export const MENU_COMPONENTS = [

    CardCardComponent

    ,CardSelectionCardComponent

    ,CardTagCardComponent

    ,CardtypeCardComponent

    ,CircleCardComponent

    ,DailyReponseCountCardComponent

    ,FellowshipCardComponent

    ,ResponseCardComponent

    ,TagCardComponent

    ,UserCardComponent

];