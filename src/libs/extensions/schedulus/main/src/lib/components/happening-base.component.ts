import {
	ChangeDetectorRef,
	Directive,
	EventEmitter,
	Inject,
	Injectable,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { isoStringsToDate } from '@sneat/core';
import { emptyHappeningSlot, WeekdayCode2 } from '@sneat/dto';
import { getWd2 } from '@sneat/extensions/schedulus/shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { MembersSelectorService } from '@sneat/team/components';
import { IHappeningContext, IMemberContext, ITeamContext } from '@sneat/team/models';
import { TeamNavService } from '@sneat/team/services';
import { NEVER, Observable, takeUntil } from 'rxjs';
import { HappeningService } from '../services/happening.service';
import { SingleSlotFormComponent } from './single-slot-form/single-slot-form.component';

@Injectable()
export class HappeningBaseComponentParams {
	constructor(
		@Inject(ErrorLogger) public readonly errorLogger: IErrorLogger,
		public readonly happeningService: HappeningService,
		public readonly teamNavService: TeamNavService,
		public readonly membersSelectorService: MembersSelectorService,
		public readonly modalController: ModalController,
	) {
	}
}


@Directive()
/* The meatadata should be passed to component declaration as:

	```
	@Component({
		selector: 'some-component',

		// Next 2 rows allow to inherit metadata
		providers: [...HappeningBaseComponent.providers],
		...BaseComponent.metadata
	})
	class SomeComponent extends BaseComponent
	```
 */
export abstract class HappeningBaseComponent implements OnChanges, OnDestroy {

	static providers = [HappeningBaseComponentParams];

	static metadata = {
		inputs: ['team', 'happening'],
		outputs: ['deleted'],
	};

	protected readonly destroyed = new EventEmitter<void>();

	@Input() team?: ITeamContext;
	@Input() happening?: IHappeningContext;

	@Output() readonly deleted = new EventEmitter<string>();

	get date(): Date | undefined {
		if (!this.happening?.dto?.date) {
			return undefined;
		}
		return isoStringsToDate(this.happening.dto.date);
	}

	get wd(): WeekdayCode2 | undefined {
		const date = this.date;
		return date && getWd2(date);
	}

	public deleting = false;

	readonly id = (i: number, v: { id: string }): string => v.id;
	readonly index = (i: number): number => i;

	get errorLogger() {
		return this.happeningBaseComponentParams.errorLogger;
	}

	get happeningService() {
		return this.happeningBaseComponentParams.happeningService;
	}

	get membersSelectorService() {
		return this.happeningBaseComponentParams.membersSelectorService;
	}

	get teamNavService() {
		return this.happeningBaseComponentParams.teamNavService;
	}

	protected constructor(
		private readonly happeningBaseComponentParams: HappeningBaseComponentParams,
		protected changeDetectorRef: ChangeDetectorRef,
	) {
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	public notImplemented(): void {
		alert('Sorry, not implemented yet.');
	}

	goHappening(event: Event): void {
		event.stopPropagation();
		if (!this.team) {
			this.errorLogger.logErrorHandler('not able to navigate to happening without team context');
			return;
		}
		this.teamNavService.navigateForwardToTeamPage(this.team, `happening/${this.happening?.id}`, {
			state: { happening: this.happening },
		}).catch(this.errorLogger.logErrorHandler('failed to navigate to happening page'));
		// this.navigateForward('regular-activity', { id: activity.id }, { happeningDto: activity }, { excludeCommuneId: true });
	}

	delete(event: Event): void {
		console.log('HappeningCardComponent.delete()');
		event.stopPropagation();
		if (!this.happening) {
			this.errorLogger.logError(new Error('Single happening card has no happening context at moment of delete attempt'));
			return;
		}
		if (!confirm(`
DELETING: ${this.happening?.brief?.title}

Are you sure you want to delete this happening?

This operation can NOT be undone.`)) {
			return;
		}
		this.deleting = true;

		const happening: IHappeningContext = this.happening.team ? this.happening : { ...this.happening, team: this.team };

		this.happeningService
			.deleteHappening(happening)
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: () => this.deleted.emit(),
				error: e => {
					this.errorLogger.logError(e, 'Failed to delete happening');
					this.deleting = false;
				},
			});
	}

	selectMembers(event: Event): void {
		event.stopPropagation();
		const teamID = this.team?.id;
		if (!teamID) {
			return;
		}
		this.membersSelectorService.selectMembers({
			teamIDs: this.happening?.dto?.teamIDs || [teamID],
			selectedMemberIDs: this.happening?.brief?.memberIDs || [],
			members: this.team?.dto?.members,
			onAdded: this.onMemberAdded,
			onRemoved: this.onMemberRemoved,
		}).catch(err => {
			this.errorLogger.logError(err, 'Failed to select members');
		});
	}

	async editSingleHappeningSlot(event: Event): Promise<void> {
		const slots = this.happening?.brief?.slots;
		const modal = await this.happeningBaseComponentParams.modalController.create({
			component: SingleSlotFormComponent,
			componentProps: {
				team: this.team,
				happening: this.happening,
				happeningSlot: slots && slots[0] || emptyHappeningSlot,
				isModal: true,
			},
		});
		await modal.present();
	}

	private readonly onMemberAdded = (teamID: string, memberID: string): Observable<void> => {
		if (!this.happening) {
			return NEVER;
		}
		if (!this.team) {
			return NEVER;
		}
		const result = this.happeningService.addMember(this.team.id, this.happening, memberID);
		// result
		// 	.pipe(takeUntil(this.destroyed))
		// 	.subscribe({
		// 		next: () => {
		// 			this.changeDetectorRef.markForCheck();
		// 		},
		// 	});
		return result;
	};

	private readonly onMemberRemoved = (teamID: string, memberID: string): Observable<void> => {
		if (!this.happening) {
			return NEVER;
		}
		if (!this.team) {
			return NEVER;
		}
		return this.happeningService.removeMember(this.team?.id, this.happening, memberID);
	};

	ngOnChanges(changes: SimpleChanges): void {
		console.log('HappeningCardComponent.ngOnChanges()', this.happening?.id, changes);
	}

	removeMember(member: IMemberContext): void {
		console.log('removeMember', member);
		if (!this.happening) {
			return;
		}
		if (!this.team) {
			return;
		}
		this.happeningService.removeMember(this.team.id, this.happening, member.id).subscribe({
			next: () => {
				if (this.happening?.brief?.memberIDs) {
					this.happening.brief.memberIDs = this.happening.brief.memberIDs.filter(id => id !== member.id);
				}
				if (this.happening?.dto?.memberIDs) {
					this.happening.dto.memberIDs = this.happening.dto.memberIDs.filter(id => id !== member.id);
				}
				this.changeDetectorRef.markForCheck();
			},
			error: this.errorLogger.logErrorHandler('Failed to remove member from happening'),
		});
	}
}

@Directive()
export class HappeningComponent extends HappeningBaseComponent {

	constructor(
		happeningBaseComponentParams: HappeningBaseComponentParams,
		changeDetectorRef: ChangeDetectorRef,
	) {
		super(happeningBaseComponentParams, changeDetectorRef);
	}
}