import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {SchedulePageComponent} from './schedule-page.component';
import {ActivityItemComponent} from '../components/regular-item/activity-item.component';
import {ScheduleDayComponent} from '../components/schedule-day/schedule-day.component';
import {ScheduleWeekComponent} from '../components/schedule-week/schedule-week.component';
import {ScheduleWeekdayComponent} from '../components/schedule-weekday/schedule-weekday.component';
import {SharedComponentsModule} from '../../../components/shared-components.module';

const routes: Routes = [
	{
		path: '',
		component: SchedulePageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SharedComponentsModule,
		RouterModule.forChild(routes)
	],
	declarations: [
		SchedulePageComponent,
		ActivityItemComponent,
		ScheduleDayComponent,
		ScheduleWeekComponent,
		ScheduleWeekdayComponent,
	],
	// providers: [
	// ]
})
export class SchedulePageModule {
}