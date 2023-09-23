import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { Gender, MemberRelationship } from '@sneat/dto';
import { MemberComponentBaseParams } from '../../member-component-base-params';
import { MemberBasePage } from '../member-base-page';
import { MemberAppsMenuComponent } from './components/member-apps-menu.component';

@Component({
	selector: 'sneat-team-member-page',
	templateUrl: './team-member-page.component.html',
	providers: [
		MemberComponentBaseParams,
	],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SneatPipesModule,
		MemberAppsMenuComponent,
	]
})
export class TeamMemberPageComponent extends MemberBasePage implements AfterViewInit {

	public relatedAs?: MemberRelationship;

	constructor(
		route: ActivatedRoute,
		params: MemberComponentBaseParams,
	) {
		super('TeamMemberPageComponent', route, params);
	}

	ngAfterViewInit(): void {
		this.preloader.preload([ // TODO: implement preloader
			'members',
			'document',
			'document-new',
			'contact',
			'contact-new',
			'sizes',
		]);
	}

	changeGender(event: Event): void {
		// tslint:disable-next-line:no-any
		const gender = (event as CustomEvent).detail.value as Gender;
		this.logger.debug(`CommuneMemberPageComponent.changeGender(${gender})`);

		// this.startCommuneReadwriteTx([CommuneKind, MemberKind], (tx, communeDto) =>
		// 	this.membersService.changeMemberPrimaryField(tx, this.memberId, { name: 'gender', value: gender }, communeDto))
		// 	.subscribe({
		// 		next: memberDto => {
		// 			this.setMemberInfo(newCommuneMemberInfo(memberDto));
		// 			this.setMemberDto(memberDto);
		// 		},
		// 		error: this.params.errorLogger.logErrorHandler('Failed to set member gender'),
		// 	});
	}

	changeRelationship(event: Event): void {
		const relatedAs = (event as CustomEvent).detail.value as MemberRelationship;
		console.log('changeRelationship', relatedAs);
		// TODO: move below to some service
		if (!this.currentUserId) {
			throw new Error('!this.currentUserId');
		}
		// this.userService.updateRecord(undefined, this.currentUserId, dto => {
		// 	const communeId = this.communeRealId;
		// 	const userCommuneInfo = dto.communes && dto.communes.find(commune => eq(commune.id, communeId));
		// 	if (!userCommuneInfo) {
		// 		alert('You are not a member of this commune');
		// 		return { dto, changed: false };
		// 	}
		// 	if (!userCommuneInfo.members) {
		// 		userCommuneInfo.members = {};
		// 	}
		// 	if (userCommuneInfo.members[this.memberId]) {
		// 		userCommuneInfo.members[this.memberId].relatedAs = relatedAs;
		// 	} else {
		// 		userCommuneInfo.members[this.memberId] = { relatedAs };
		// 	}
		// 	return { dto, changed: true };
		// })
		// 	.subscribe(user => {
		// 		this.relatedAs = relatedAs;
		// 		this.currentUserDto = user;
		// 	});
	}

	// protected setMemberId(memberId: string): void {
	// 	super.setMemberId(memberId);
	// 	if (this.currentUserDto && this.communeRealId) {
	// 		this.setRelatedAs();
	// 	}
	// }

	// protected setPageCommuneIds(source: string, communeIds: ICommuneIds, communeDto?: ICommuneDto): void {
	// 	super.setPageCommuneIds(source, communeIds, communeDto);
	// 	if (this.currentUserDto && this.memberId) {
	// 		this.setRelatedAs();
	// 	}
	// }

	// protected setCurrentUser(dto: IUserDto): void {
	// 	super.setCurrentUser(dto);
	// 	this.logger.debug('CommuneMemberPage.setCurrentUser()', dto);
	// 	if (this.memberId && this.communeRealId) {
	// 		this.setRelatedAs();
	// 	}
	// }

	public removeMember() {
		if (
			!confirm(
				`Are you sure you want to remove ${
					this.member?.brief?.title || this.member?.id
				} from ${this.team?.brief?.title}?`,
			)
		) {
			return;
		}
		if (!this.team) {
			this.errorLogger.logError(
				'Can not remove team member without team context',
			);
			return;
		}
		if (!this.member?.id) {
			this.errorLogger.logError(
				'Can not remove team member without knowing member ID',
			);
			return;
		}
		this.contactService.removeTeamMember(this.team.id, this.member?.id).subscribe({
			next: () => {
				this.navController
					.pop()
					.catch((err) =>
						this.errorLogger.logError(err, 'Failed to pop navigator state'),
					);
			},
			error: (err) => this.errorLogger.logError(err, 'Failed to remove member'),
		});
	}

	private setRelatedAs(): void {
		// this.logger.debug('CommuneMemberPage.setRelatedAs()', this.currentUserDto);
		// if (!this.currentUserDto) {
		// 	return;
		// }
		// const userCommunes = this.currentUserDto && this.currentUserDto.communes;
		// if (userCommunes) {
		// 	const userCommuneInfo = userCommunes.find(c => eq(c.id, this.communeRealId));
		// 	if (userCommuneInfo && userCommuneInfo.members) {
		// 		const memberInfo = userCommuneInfo.members[this.memberId];
		// 		if (memberInfo) {
		// 			this.relatedAs = memberInfo.relatedAs;
		// 		}
		// 	}
		// }
	}

}
