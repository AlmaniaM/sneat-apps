import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddressFormModule, SneatPipesModule } from '@sneat/components';
import { ContactsListModule, ContactRolesInputModule } from '../../components';
import { ContactPageComponent } from './contact-page.component';

const routes: Routes = [
	{
		path: '',
		component: ContactPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		SneatPipesModule,
		ContactsListModule,
		AddressFormModule,
		ContactRolesInputModule,
	],
	declarations: [
		ContactPageComponent,
	],
})
export class ContactPageModule {
}
