import {
	Component,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges,
} from '@angular/core';
import { ISlotItem } from '@sneat/extensions/schedulus/shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IHappeningContext } from '@sneat/mod-schedulus-core';
import { ITeamContext } from '@sneat/team-models';
import { HappeningService } from '@sneat/team-services';
import { Subject, Subscription } from 'rxjs';
import { ScheduleFilterService } from '../../../schedule-filter.service';
import {
	IScheduleFilter,
	isMatchingScheduleFilter,
} from '../schedule-filter/schedule-filter';

@Component({
	selector: 'sneat-singles-tab',
	templateUrl: 'singles-tab.component.html',
})
export class SinglesTabComponent implements OnChanges, OnDestroy {
	private readonly destroyed = new Subject<void>();
	private singlesSubscription?: Subscription;
	public allUpcomingSingles?: IHappeningContext[];
	public upcomingSingles?: IHappeningContext[];

	public tab: 'upcoming' | 'past' = 'upcoming';

	@Input() team: ITeamContext = { id: '' };
	@Input() onSlotClicked?: (args: { slot: ISlotItem; event: Event }) => void;
	@Input() onDateSelected?: (date: Date) => void;

	private filter?: IScheduleFilter;

	// readonly trackByDate = (i: number, item: Weekday): number | undefined => item.day?.date.getTime();
	protected readonly happeningID = (_: number, h: IHappeningContext) => h.id;

	get numberOfHidden(): number {
		return (
			(this.allUpcomingSingles?.length || 0) -
			(this.upcomingSingles?.length || 0)
		);
	}

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly filterService: ScheduleFilterService,
		private readonly happeningService: HappeningService,
	) {
		filterService.filter.subscribe((filter) => {
			this.filter = filter;
			this.applyFilter();
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		const teamChange = changes['team'];
		if (teamChange) {
			if (this.team?.id !== teamChange.previousValue?.id) {
				this.watchUpcomingSingles();
			}
		}
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
		this.singlesSubscription?.unsubscribe();
	}

	public onHappeningRemoved(id: string): void {
		this.allUpcomingSingles = this.allUpcomingSingles?.filter(
			(h) => h.id !== id,
		);
		this.applyFilter();
	}

	public clearFilter(): void {
		this.filterService.resetScheduleFilter();
	}

	watchUpcomingSingles(): void {
		if (this.singlesSubscription) {
			this.singlesSubscription?.unsubscribe();
		}
		if (this.team) {
			this.singlesSubscription = this.happeningService
				.watchUpcomingSingles(this.team)
				.subscribe({
					next: (singles) => {
						this.allUpcomingSingles = singles;
						this.applyFilter();
						console.log('upcoming single:', singles);
					},
					error: this.errorLogger.logErrorHandler(
						'Failed to load upcoming happenings',
					),
				});
		}
	}

	private applyFilter(): void {
		const f = this.filter;
		console.log('applyFilter()', f);
		this.upcomingSingles = this.allUpcomingSingles?.filter((h) =>
			isMatchingScheduleFilter(h, f),
		);
	}
}
