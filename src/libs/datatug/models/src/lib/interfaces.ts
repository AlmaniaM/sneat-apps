import {IUserRecord} from '@sneat/auth-models';
import {IStoreRef, StoreType} from "@sneat/api";
import {STORE_ID_GITHUB_COM, STORE_TYPE_GITHUB} from '@sneat/datatug/core';


// export interface IRecord<T> { // TODO: duplicate name
//   id: string;
//   state?: RecordState;
//   data?: T;
// }

export interface IDatatugUser extends IUserRecord {
	datatug?: IDatatugBriefForUser;
}

export type IDatatugStoreBriefsById = { [id: string]: IDatatugStoreBrief };

export interface IDatatugBriefForUser {
	stores?: IDatatugStoreBriefsById;
}

export interface IDatatugStoreBrief {
	id?: string
	title: string;
	type: DatatugProjStoreType;
	url?: string;
	projects?: { [id: string]: IDatatugProjectBrief };
}

export interface IProjectAndStore {
	store: IDatatugStoreBrief;
	project: IDatatugProjectBrief;
}

export const cloudStoreId = 'firestore';
export const cloudStoreTitle = 'DataTug cloud';
export const cloudStoreEmoji = '☁️';
export const cloudStoreTitleWithIcon = `${cloudStoreEmoji} ${cloudStoreTitle}`;

export function allUserStoresAsFlatList(stores?: IDatatugStoreBriefsById): IDatatugStoreBrief[] {
	const result: IDatatugStoreBrief[] = [];
	stores = stores || {};
	if (!stores[cloudStoreId]) {
		stores[cloudStoreId] = {type: cloudStoreId, title: cloudStoreTitleWithIcon};
	}
	if (!stores[STORE_ID_GITHUB_COM]) {
		stores[STORE_ID_GITHUB_COM] = {type: STORE_TYPE_GITHUB, title: 'GitHub.com'};
	}

	const hasLocalhost = Object.keys(stores).some(v => v.startsWith('http://localhost:'));
	if (!hasLocalhost) {
		stores = {
			...stores,
			'http://localhost:8989': {
				type: 'agent',
				url: 'http://localhost:8989',
				title: 'localhost:8989'
			}
		};
	}

	for (const storeId in stores) {
		let store = stores[storeId];
		store = {id: storeId, ...store, title: store.title || store.id};
		if (store.id === cloudStoreId || store.type === 'firestore') {
			store.title = cloudStoreTitleWithIcon;
		} else {
			store.title = '💻 ' + store.title;
		}
		result.push(store);
	}
	return result;
}

export function allUserProjectsAsFlatList(stores: IDatatugStoreBriefsById): IProjectAndStore[] {
	const projects: IProjectAndStore[] = [];
	for (const storeId in stores) {
		const store = {id: storeId, ...stores[storeId]};
		for (const projectId in store.projects) {
			const project = {id: projectId, ...store.projects[projectId]};
			projects.push({store, project});
		}
	}
	return projects;
}

export function projectsBriefFromDictToFlatList(projects?: { [id: string]: IDatatugProjectBrief })
	: IDatatugProjectBrief[] {
	const result: IDatatugProjectBrief[] = [];
	if (projects) {
		for (const id in projects) {
			result.push({...projects[id], id});
		}
	}
	return result;
}

export type DatatugProjStoreType = StoreType;

export interface IProjStoreRef extends IStoreRef {
	type: DatatugProjStoreType;
	url?: string;
}

export interface IDatatugProjectBrief {
	readonly id: string;
	readonly title?: string;
	readonly titleOverride?: string;
}

export interface IDatatugProjectBriefWithStoreRef extends IDatatugProjectBrief {
	readonly store: IProjStoreRef;
}

export type MetricColor = 'primary' | 'secondary' | 'tertiary' | 'success' | 'danger' | 'warning';

export interface IBoolMetricVal {
	label: string;
	color: MetricColor;
}

export interface IBoolMetric {
	true: IBoolMetricVal;
	false: IBoolMetricVal;
}


interface IInvite {
	message?: string;
}

interface IPerson {
	title: string;
	email: string;
}

export interface IPersonalInvite extends IInvite {
	channel: string;
	address: string;
	team: { id: string; title: string };
	memberId: string;
	from: IPerson;
	to: IPerson;
}

