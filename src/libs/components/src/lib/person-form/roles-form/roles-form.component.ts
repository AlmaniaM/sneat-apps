import { Component, EventEmitter, Input, Output } from '@angular/core';
import { formNexInAnimation } from '@sneat/animations';
import { ITeamContext } from '@sneat/team/models';
import { TeamRelatedFormComponent } from '../team-related-form.component';

interface Role {
	checked?: boolean;
	id: string;
	title: string;
	icon: string;
}

@Component({
	selector: 'sneat-roles-form',
	templateUrl: 'roles-form.component.html',
	animations: [
		formNexInAnimation,
	]
})
export class RolesFormComponent extends TeamRelatedFormComponent {
	@Input() team?: ITeamContext;
	roles?: Role[];

	@Output() readonly rolesChange = new EventEmitter<string[]>();

	override onTeamTypeChanged(team?: ITeamContext): void {
		switch (team?.type) {
			case 'educator':
				if (location.pathname.indexOf('staff') >= 0) {
					this.roles = [
						{ id: 'teacher', title: 'Teacher', icon: 'person' },
						{ id: 'administrator', title: 'Administrator', icon: 'robot' },
					];
				}
				break;
			default:
				break;
		}
	}

	roleChecked(event: Event): void {
		event.stopPropagation();
		const roles = this.roles?.filter(role => role.checked).map(role => role.id);
		this.rolesChange.emit(roles);
	}
}