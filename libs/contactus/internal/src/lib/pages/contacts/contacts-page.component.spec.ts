import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsPageComponent } from './contacts-page.component';

describe('ContactsPageComponent', () => {
	let component: ContactsPageComponent;
	let fixture: ComponentFixture<ContactsPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ContactsPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactsPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
