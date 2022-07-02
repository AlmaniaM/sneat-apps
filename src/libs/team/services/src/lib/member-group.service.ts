import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatApiService, SneatFirestoreService } from '@sneat/api';
import { IMemberGroupBrief, IMemberGroupDto } from '@sneat/dto';
import { IMemberGroupContext, ITeamContext } from '@sneat/team/models';
import { TeamItemService } from './team-item.service';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class MemberGroupService {

	private readonly teamItemService: TeamItemService<IMemberGroupBrief, IMemberGroupDto>;

	constructor(
		afs: AngularFirestore,
		sneatApiService: SneatApiService,
	) {
		this.teamItemService = new TeamItemService<IMemberGroupBrief, IMemberGroupDto>(
			'team_member_groups', afs, sneatApiService);
	}

	watchMemberGroupsByTeam<IMemberGroupDto>(team: ITeamContext, status: 'active' | 'archived' = 'active'): Observable<IMemberGroupContext[]> {
		// console.log('watchMemberGroupsByTeamID()', teamID);
		return this.teamItemService.watchTeamItems(team, [{ field: 'status', operator: '==', value: status }]);
	}
}
