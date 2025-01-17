import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstatePageComponent } from './real-estate-page.component';

describe('RealEstatePage', () => {
	let component: RealEstatePageComponent;
	let fixture: ComponentFixture<RealEstatePageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RealEstatePageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RealEstatePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
