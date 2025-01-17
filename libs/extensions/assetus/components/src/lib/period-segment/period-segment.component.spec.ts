import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodSegmentComponent } from './period-segment.component';

describe('PeriodSegmentComponent', () => {
	let component: PeriodSegmentComponent;
	let fixture: ComponentFixture<PeriodSegmentComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PeriodSegmentComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PeriodSegmentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
