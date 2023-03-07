import { INavContext } from '@sneat/core';
import { IAddress } from '@sneat/dto';
import { ITeamRequest } from '@sneat/team/models';

export type CounterpartyRole =
	'buyer' | 'consignee' | 'notify' // TODO: Which one to use/keep?
	| 'agent'
	| 'carrier'
	| 'shipper'
	| 'ship'
	| 'dispatcher'
	| 'dispatch-point'
	| 'trucker'
	| 'port_from'
	| 'port_to'
	;

export interface ILogistTeamDto {
	readonly contactID: string;
}

export interface ILogistTeamBrief extends ILogistTeamDto {
	readonly id: string;
}

export type ILogistTeamContext = INavContext<ILogistTeamBrief, ILogistTeamDto>;


export interface ISetLogistTeamSettingsRequest extends ITeamRequest {
	address: IAddress;
	vatNumber?: string;
	orderNumberPrefix?: string;
}