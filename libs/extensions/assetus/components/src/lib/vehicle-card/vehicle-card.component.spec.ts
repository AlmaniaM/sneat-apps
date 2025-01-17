import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCardComponent } from './vehicle-card.component';

describe('MakeModelEngineComponent', () => {
	let component: VehicleCardComponent;
	let fixture: ComponentFixture<VehicleCardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [VehicleCardComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(VehicleCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
