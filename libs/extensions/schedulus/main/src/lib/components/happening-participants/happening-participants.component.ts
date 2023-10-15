import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import {
	ContactsChecklistComponent,
	MembersListComponent,
} from '@sneat/contactus-shared';
import { IHappeningBase } from '@sneat/dto';
import { contactContextFromBrief } from '@sneat/contactus-services';
import {
	IContactContext,
	IContactusTeamDtoWithID,
	IHappeningContext,
	ITeamContext,
	zipMapBriefsWithIDs,
} from '@sneat/team/models';
import {
	HappeningService,
	IHappeningMemberRequest,
} from '@sneat/team/services';

@Component({
	selector: 'sneat-happening-members-form',
	templateUrl: 'happening-participants.component.html',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		SneatPipesModule,
		MembersListComponent,
		ContactsChecklistComponent,
		FormsModule,
	],
})
export class HappeningParticipantsComponent {
	@Input({ required: true }) team?: ITeamContext; // TODO: Can we get rid of this?
	@Input() contactusTeam?: IContactusTeamDtoWithID;
	@Input() happening?: IHappeningContext;

	constructor(private readonly happeningService: HappeningService) {}

	public get membersTabLabel(): string {
		return this.team?.brief?.type === 'family'
			? 'Family member'
			: 'Team members';
	}

	@Output() readonly happeningChange = new EventEmitter<IHappeningContext>();

	public isToDo = false;
	public checkedMemberIDs: string[] = [];
	public contacts: number[] = [];
	public tab: 'members' | 'others' = 'members';

	public get members(): readonly IContactContext[] | undefined {
		const contactusTeam = this.contactusTeam,
			team = this.team;

		if (!team || !contactusTeam) {
			return;
		}
		return zipMapBriefsWithIDs(contactusTeam?.dto?.contacts).map((m) =>
			contactContextFromBrief(m, team),
		);
	}

	protected readonly id = (_: number, o: { id: string }) => o.id;

	public isMemberCheckChanged(args: {
		event: CustomEvent;
		id: string;
		checked: boolean;
	}): void {
		console.log('isMemberCheckChanged()', args);
		const { id, checked } = args;
		if (!checked) {
			this.checkedMemberIDs = this.checkedMemberIDs.filter((v) => v !== id);
			return;
		}
		if (!this.checkedMemberIDs.some((v) => v === id)) {
			this.checkedMemberIDs.push(id);
		}
		this.populateParticipants();
		if (!this.happening?.id) {
			return;
		}
		if (!this.team?.id) {
			return;
		}
		const request: IHappeningMemberRequest = {
			teamID: this.team.id,
			happeningID: this.happening?.id,
			contactID: id,
		};
		if (args.checked) {
			this.happeningService.addParticipant(request).subscribe({
				next: () => console.log('member added'),
			});
		} else {
			this.happeningService.removeParticipant(request).subscribe({
				next: () => console.log('member added'),
			});
		}
	}

	private readonly emitHappeningChange = () =>
		this.happeningChange.emit(this.happening);

	private populateParticipants(): void {
		if (!this.happening) {
			return;
		}
		const { brief, dto } = this.happening;
		if (!brief || !dto) {
			return;
		}
		const selectedMembers =
			this.members?.filter((m) =>
				this.checkedMemberIDs.some((v) => v === m.id),
			) || [];
		let happeningBase: IHappeningBase = {
			...brief,
			participants: {},
		};
		selectedMembers.forEach((m) => {
			if (!happeningBase.participants) {
				happeningBase = { ...happeningBase, participants: { [m.id]: {} } };
			} else {
				happeningBase.participants[m.id] = {}; // TODO: Should be readonly
			}
		});
		this.emitHappeningChange();
	}

	addContact(): void {
		this.contacts.push(1);
	}
}