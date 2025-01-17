import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTasksComponent } from './day-tasks.component';

describe('DayTasksComponent', () => {
	let component: DayTasksComponent;
	let fixture: ComponentFixture<DayTasksComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DayTasksComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DayTasksComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
