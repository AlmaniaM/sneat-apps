import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatatugHomePageComponent } from './datatug-home-page.component';

describe('HomePage', () => {
	let component: DatatugHomePageComponent;
	let fixture: ComponentFixture<DatatugHomePageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DatatugHomePageComponent],
			imports: [IonicModule.forRoot()],
		}).compileComponents();

		fixture = TestBed.createComponent(DatatugHomePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
