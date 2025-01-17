import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectServiceProviderPageComponent } from './select-service-provider-page.component';

describe('SelectServiceProviderPage', () => {
	let component: SelectServiceProviderPageComponent;
	let fixture: ComponentFixture<SelectServiceProviderPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SelectServiceProviderPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SelectServiceProviderPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
