import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataboardsPageRoutingModule } from './boards-routing.module';

import { BoardsPageComponent } from './boards-page.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		DataboardsPageRoutingModule,
		SneatCardListComponent,
	],
	declarations: [BoardsPageComponent],
})
export class BoardsPageModule {}
