import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { FilterItemModule, SneatPipesModule } from '@sneat/components';
import { TeamCoreComponentsModule } from '@sneat/team/components';
import { ContactServiceModule } from '../../services';
import { ContactListItemComponent } from '../../components/contact-list-item/contact-list-item.component';
import { ContactsByTypeComponent } from '../../components/contacts-by-type/contacts-by-type.component';

import { ContactsPageComponent } from './contacts-page.component';

const routes: Routes = [
	{
		path: '',
		component: ContactsPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		TeamCoreComponentsModule,
		FilterItemModule,
		ContactServiceModule,
		SneatPipesModule,
	],
	declarations: [
		ContactsPageComponent,
		ContactsByTypeComponent,
		ContactListItemComponent,
	],
	providers: [
	]
})
export class ContactsPageModule {
}
