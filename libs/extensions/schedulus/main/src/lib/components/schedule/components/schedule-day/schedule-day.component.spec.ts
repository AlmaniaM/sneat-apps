import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDayComponent } from './schedule-day.component';

describe('ScheduleDayComponent', () => {
	let component: ScheduleDayComponent;
	let fixture: ComponentFixture<ScheduleDayComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ScheduleDayComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ScheduleDayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
