import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OrderFormModule } from '../../components/order-form.module';
import { OrdersListModule } from '../../components/orders-list/orders-list.module';
import { OrderPageComponent } from './order-page.component';

const routes: Routes = [
	{
		path: '',
		component: OrderPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
		FormsModule,
		OrderFormModule,
	],
	declarations: [
		OrderPageComponent,
	],
})
export class OrderPageModule {
}
