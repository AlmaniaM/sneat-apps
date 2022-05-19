import {
	AfterViewInit, Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, SimpleChanges,
	ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { RoutingState } from '@sneat/core';
import { HappeningType, IHappeningDto, IHappeningSlot, ITiming, SlotParticipant, WeekdayCode2 } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { IHappeningContext, IMemberContext, ITeamContext } from '@sneat/team/models';
import { memberContextFromBrief } from '@sneat/team/services';
import { Subject, takeUntil } from 'rxjs';
import { ScheduleService } from '../../services/schedule.service';
import { HappeningSlotsComponent } from '../happening-slots/happening-slots.component';

@Component({
	selector: 'sneat-happening-page-form',
	templateUrl: 'happening-page-form.component.html',
})
export class HappeningPageFormComponent implements OnChanges, AfterViewInit, OnDestroy {

	private readonly destroyed = new Subject<void>();

	public readonly changed = new EventEmitter<IHappeningContext>();

	date = '';
	public contacts: number[] = [];
	public isToDo = false;

	isCreating = false;

	@Input() public team?: ITeamContext;
	@Input() public happening?: IHappeningContext;
	@Input() public wd?: WeekdayCode2;

	@ViewChild('titleInput', { static: true }) titleInput?: IonInput;
	@ViewChild('happeningSlotsComponent', { static: false }) happeningSlotsComponent?: HappeningSlotsComponent;

	@Input() happeningType?: HappeningType;

	public slots: IHappeningSlot[] = [];

	public happeningTitle = new FormControl('', Validators.required);
	public happeningForm = new FormGroup({
		title: this.happeningTitle,
	});

	public checkedMemberIDs: string[] = [];
	public singleTiming?: ITiming;

	private readonly logErrorHandler = this.errorLogger.logErrorHandler;
	private readonly logError = this.errorLogger.logError;
	private readonly hasNavHistory: boolean;

	public participantsTab: 'members' | 'others' = 'members';

	public readonly id = (i: number, v: { id: string }) => v.id;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		routingState: RoutingState,
		private readonly scheduleService: ScheduleService,
		private readonly params: TeamComponentBaseParams,
	) {
		this.hasNavHistory = routingState.hasHistory();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['happening']) {
			if (this.happening?.brief?.title) {
				this.happeningTitle.setValue(this.happening?.brief?.title);
				this.happeningType = this?.happening?.brief?.type;
				this.slots = this?.happening?.brief?.slots || [];
			}
		}
	}

	ngAfterViewInit(): void {
		if (this.happeningType === 'recurring' && !this.slots?.length) {
			if (this.happeningSlotsComponent) {
				this.happeningSlotsComponent?.showAddSlot({ wd: this.wd });
			} else {
				console.warn('happeningSlotsComponent is not found');
			}
		}
	}


	onTitleEnter(): void {
		//
	}

	ionViewDidEnter(): void {
		if (!this.titleInput) {
			this.logError(new Error('titleInput is not initialized'));
			return;
		}
		this.titleInput.setFocus()
			.catch(this.logErrorHandler('failed to set focus to title input'));
	}

	onAddSlotModalDismissed(): void {
		console.log('NewHappeningPage.onAddSlotModalDismissed()');
		if (!this.titleInput?.value) {
			if (this.titleInput) {
				setTimeout(() => {
					this.titleInput?.setFocus().catch(this.logErrorHandler('failed to set focus to title input'));
				}, 50);
			} else {
				console.warn('View child #titleInput is not initialized');
			}
		}
	}

	addContact(): void {
		this.contacts.push(1);
	}

	onSlotRemoved(slots: IHappeningSlot[]): void {
		console.log('NewHappeningPage.onSlotRemoved() => slots.length:', slots.length);
		this.slots = slots;
	}

	onTimingChanged(timing: ITiming): void {
		console.log('NewHappeningPageComponent.onTimingChanged()', timing);
		this.singleTiming = timing;
	}


	formIsValid(): boolean {
		if (!this.happeningForm.valid) {
			return false;
		}
		switch (this.happeningType) {
			case 'recurring':
				return !!this.slots.length;
			case 'single':
				return !!this.singleTiming;
			default:
				return false;
		}
	}


	private makeHappeningDto(): IHappeningDto {
		if (!this.team) {
			throw new Error('!this.team');
		}
		if (!this.happeningType) {
			throw new Error('!this.happeningType');
		}
		const activityFormValue = this.happeningForm.value;
		const dto: IHappeningDto = {
			type: this.happeningType,
			kind: 'activity',
			teamIDs: [this.team.id],
			title: activityFormValue.title,
		};
		switch (dto.type) {
			case 'recurring':
				dto.slots = this.slots;
				break;
			case 'single':
				if (!this.singleTiming) {
					throw new Error('timing is not set');
				}
				dto.slots = [{
					id: 'once',
					repeats: 'once',
					...this.singleTiming,
				}];
				break;
			default:
				throw new Error('unknown happening type: ' + dto.type);
		}
		{ // Populate selected members
			const selectedMembers = this.members?.filter(m => this.checkedMemberIDs.some(v => v === m.id));
			if (selectedMembers?.length) {
				dto.memberIDs = selectedMembers.map(m => m.id)
					.filter(v => !!v) as string[];
				dto.participants = selectedMembers.map(m => {
					const s: SlotParticipant = { type: 'member', id: m.id, title: m.brief?.title || m.id };
					return s;
				});
			}
		}
		return dto;
	}

	public get members(): IMemberContext[] | undefined {
		const members = this.team?.dto?.members;
		if (!members) {
			return undefined;
		}
		return members.map(memberContextFromBrief);
	}


	public isMemberChecked(member: IMemberContext): boolean {
		const { id } = member;
		return this.checkedMemberIDs.some(v => v === id);
	}

	public isMemberCheckChanged(member: IMemberContext, event: Event): void {
		const ce = event as CustomEvent;
		console.log('isMemberCheckChanged()', ce);
		const checked = ce.detail.value === 'on';
		const { id } = member;
		if (!checked) {
			this.checkedMemberIDs = this.checkedMemberIDs.filter(v => v !== id);
			return;
		}
		if (!this.checkedMemberIDs.some(v => v === id)) {
			this.checkedMemberIDs.push(id);
		}
	}

	submit(event: Event): void {
		if (this.happening?.id) {
			// Update happening
		} else {
			//Create happening
			this.createHappening();
		}
	}

	createHappening(): void {
		console.log('NewHappeningPageComponent.createHappening()');
		if (!this.team) {
			return;
		}
		try {
			// this.happeningForm.markAsTouched();
			// if (!this.happeningForm.valid) {
			// 	alert('title is a required field');
			// 	// if (!this.happeningForm.controls['title'].valid) {
			// 	// 	this.titleInput?.setFocus()
			// 	// 		.catch(this.logErrorHandler('failed to set focus to title input after happening found to be not valid'));
			// 	// }
			// 	return;
			// }
			const team = this.team;

			if (!team) {
				this.logError(new Error('!team context'));
				return;
			}

			this.isCreating = true;

			const dto = this.makeHappeningDto();

			this.scheduleService
				.createHappening({ teamID: team.id, dto })
				.pipe(
					takeUntil(this.destroyed),
				)
				.subscribe({
					next: () => {
						console.log('new happening created');
						if (this.hasNavHistory) {
							this.params.navController.pop()
								.catch(this.logErrorHandler('failed to pop back after creating a happening'));
						} else {
							this.params.teamNavService.navigateBackToTeamPage(team, 'schedule')
								.catch(this.logErrorHandler('failed to team schedule after creating a happening'));
						}
					},
					error: err => {
						this.isCreating = false;
						this.logError(err, 'failed to create new happening');
					},
					complete: () => {
						this.isCreating = false;
					},
				});
		} catch (e) {
			this.isCreating = false;
			this.errorLogger.logError(e, 'failed to create new happening');
		}
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

}