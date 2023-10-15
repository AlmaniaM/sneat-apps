import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HappeningType, WeekdayCode2 } from '@sneat/dto';
import { TeamComponentBaseParams } from '@sneat/team/components';
import {
	IHappeningContext,
	newEmptyHappeningContext,
} from '@sneat/team/models';
import { first, takeUntil } from 'rxjs';
import { HappeningFormComponent } from '../../components/happening-form/happening-form.component';
import { ScheduleBasePage } from '../schedule-base-page';

@Component({
	selector: 'sneat-happening-new',
	templateUrl: './new-happening-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class NewHappeningPageComponent extends ScheduleBasePage {
	@ViewChild('happeningPageFormComponent')
	happeningPageFormComponent?: HappeningFormComponent;

	public isToDo: boolean;
	public wd?: WeekdayCode2;
	public happening?: IHappeningContext;
	public date = '';

	constructor(route: ActivatedRoute, params: TeamComponentBaseParams) {
		super('NewHappeningPageComponent', route, params);
		this.isToDo = location.pathname.indexOf('/new-task') >= 0;
		this.date = (history.state.date as string) || '';
		console.log('date', this.date);

		const type = window.history.state.type as HappeningType;
		if (type && this.team && !this.happening) {
			this.createHappeningContext(type);
		}
		route.queryParamMap.pipe(takeUntil(this.destroyed), first()).subscribe({
			next: (queryParams) => {
				console.log(
					'NewHappeningPage.constructor() => queryParams:',
					queryParams,
				);
				const type = queryParams.get('type');
				if (type !== 'single' && type !== 'recurring') {
					console.warn('unknown happening type passed in URL: type=' + type);
					return;
				}
				if (this.team && !this.happening) {
					this.createHappeningContext(type);
				}
				this.wd = queryParams.get('wd') as WeekdayCode2;
				if (!this.date) {
					this.date = queryParams.get('date') || '';
				}
			},
			error: this.logErrorHandler('failed to get query params'),
		});
	}

	private createHappeningContext(type: HappeningType): void {
		const team = this.team;
		if (!team) {
			throw new Error('!team');
		}
		this.happening = newEmptyHappeningContext(
			team,
			type,
			'appointment',
			'active',
		);
	}

	// TODO(fix): protected onCommuneIdsChanged() {
	//     super.onCommuneIdsChanged();
	//     this.subscriptions.push(this.memberService.watchByCommuneId(this.communeRealId).subscribe(members => {
	//         this.members = members.map(m => new Member(m));
	//         this.members.sort((a, b) => a.title > b.title ? 1 : b.title > a.title ? -1 : 0); // TODO: Decouple
	//         this.adults = this.members.filter(m => m.dto.age === 'adult');
	//         this.kids = this.members.filter(m => m.dto.age === 'child');
	//     }));
	// }

	protected onHappeningChanged(happening: IHappeningContext): void {
		const happeningType = happening.brief?.type;
		const typeChange =
			happeningType && happeningType !== this.happening?.brief?.type;
		this.happening = happening;
		if (typeChange) {
			this.onHappeningTypeChanged(happeningType);
		}
	}

	private onHappeningTypeChanged(happeningType: HappeningType): void {
		console.log('onHappeningTypeChanged()', happeningType);
		let { href } = location;
		if (href.indexOf('?') < 0) {
			href += '?type=';
		}
		href = href.replace(/type=\w*/, `type=${happeningType}`);
		history.replaceState(history.state, document.title, href);
	}
}