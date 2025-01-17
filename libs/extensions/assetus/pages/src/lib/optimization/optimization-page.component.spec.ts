import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizationPageComponent } from './optimization-page.component';

describe('OptimizationPage', () => {
	let component: OptimizationPageComponent;
	let fixture: ComponentFixture<OptimizationPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OptimizationPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OptimizationPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
