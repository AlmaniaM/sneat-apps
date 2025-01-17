import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioGroupToSelectComponent } from './radio-group-to-select.component';

describe('RadioGroupToSelectComponent', () => {
	let component: RadioGroupToSelectComponent;
	let fixture: ComponentFixture<RadioGroupToSelectComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [RadioGroupToSelectComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RadioGroupToSelectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
