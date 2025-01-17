import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsPageComponent } from './documents-page.component';

describe('CommuneDocumentsPage', () => {
	let component: DocumentsPageComponent;
	let fixture: ComponentFixture<DocumentsPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DocumentsPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DocumentsPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
