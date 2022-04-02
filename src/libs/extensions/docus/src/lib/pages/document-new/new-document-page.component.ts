//tslint:disable:no-unsafe-any
import {Component} from '@angular/core';
import { IDocument } from '@sneat/dto';
import { TeamBasePage } from '@sneat/team/components';
import { IMemberContext } from '@sneat/team/models';
import {CommuneBasePageParams} from 'sneat-shared/services/params';
import {CommuneBasePage} from 'sneat-shared/pages/commune-base-page';
import {IAssetDto} from 'sneat-shared/models/dto/dto-asset';
import {IAssetService, IMemberService} from 'sneat-shared/services/interfaces';
import {IMemberDto} from 'sneat-shared/models/dto/dto-member';

@Component({
	selector: 'sneat-new-document',
	templateUrl: './new-document-page.component.html',
	providers: [CommuneBasePageParams],
})
export class NewDocumentPageComponent extends TeamBasePage {

	belongsTo: 'member' | 'commune' = 'commune';

	public member?: IMemberContext;

	public isMissingRequiredParams: boolean;

	public country: string;
	public docTitle: string;
	public docType: string;
	public docNumber: string;

	constructor(
		params: CommuneBasePageParams,
		membersService: IMemberService,
		private readonly assetService: IAssetService,
	) {
		super('documents', params);
		this.route.queryParams.subscribe(qp => {
			console.log('queryParams', qp);
			this.memberId = qp.member;
			this.docType = qp.type;
			if (this.memberId) {
				this.belongsTo = 'member';
				this.subscriptions.push(membersService.watchById(this.memberId)
					.subscribe(
						member => {
							this.member = member;
							if (member) {
								if (!this.communeRealId) {
									this.setPageCommuneIds('DocumentNewPage.memberFromObservable', {real: member.communeId});
								}
							}
						},
						this.errorLogger.logError,
					));
			}
		});
	}

	public submit(): void {
		const dto: IDocument = {
			title: this.docTitle,
			type: this.docType,
			number: this.docNumber,
			memberIDs: this.memberId ? [this.memberId] : undefined,
			communeId: this.communeRealId,
		};
		this.assetService.addCommuneItem(dto)
			.subscribe(
				dtoAsset => {
					this.navCtrl.navigateForward(['document', dtoAsset.id])
						.catch(this.errorLogger.logError);
				},
				this.errorLogger.logError
			);
	}
}