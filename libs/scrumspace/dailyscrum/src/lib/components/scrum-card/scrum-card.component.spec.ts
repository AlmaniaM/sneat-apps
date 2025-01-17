import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScrumCardComponent } from './scrum-card.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ScrumCardComponent', () => {
	let component: ScrumCardComponent;
	let fixture: ComponentFixture<ScrumCardComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ScrumCardComponent],
			imports: [IonicModule.forRoot(), RouterTestingModule],
		}).compileComponents();

		fixture = TestBed.createComponent(ScrumCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
