import {Inject, Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentData} from '@angular/fire/firestore';
import {EMPTY, from, Observable, of, Subject, throwError} from 'rxjs';
import {map, mergeMap, shareReplay, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {getStoreUrl} from '@sneat/datatug/nav';
import {IDatatugProjRef} from '@sneat/datatug/core';
import {IDatatugProjectFull, IDatatugProjectSummary, IProjStoreRef} from '@sneat/datatug/models';
import {PrivateTokenStoreService} from '@sneat/auth';
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {SneatApiServiceFactory} from "@sneat/api";
import {GITLAB_REPO_PREFIX, STORE_ID_GITHUB_COM} from '@sneat/core';

@Injectable()
export class ProjectService {

	private projects: { [id: string]: Observable<IDatatugProjectFull> } = {};
	private projSummary: { [id: string]: Observable<IDatatugProjectSummary> } = {};
	private readonly projectsCollection: AngularFirestoreCollection;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly db: AngularFirestore,
		private readonly http: HttpClient,
		private readonly privateTokenStoreService: PrivateTokenStoreService,
		private readonly sneatApiServiceFactory: SneatApiServiceFactory,
	) {
		this.projectsCollection = db.collection<IDatatugProjectSummary>('datatug_projects');
	}

	public watchProject(id: string): Observable<IDatatugProjectSummary> {
		console.log('watchProject', id);
		if (!id) {
			return throwError('Can not watch project by empty ID parameter');
		}
		const m = id.match(/(\.|\w+)@(\w+:\d+)/);
		if (m) {
			return this.getSummary({storeId: m[2], projectId: m[1]})
				// .pipe(
				// 	map(projectFull => {
				// 		const project: IProjectSummary = {
				// 			environments: projectFull.environments.map(env => ({
				// 				id: env.id,
				// 				title: env.title,
				// 			})),
				// 		};
				//
				// 		return project;
				// 	}),
				// )
				;
		}
		console.log('watchProject: subscribing to firestore changes');
		return this.projectsCollection
			.doc(id)
			.snapshotChanges()
			.pipe(
				tap(v => console.log(`project[${id}] snapshotChange:`, v)),
				map(value => value.type === 'removed' ? undefined : value.payload.data() as IDatatugProjectSummary),
			);
	}

	public getFull(target: IDatatugProjRef): Observable<IDatatugProjectFull> {
		console.warn('The getFull() method should not be called from UI');
		if (!target) {
			throw new Error('target is a required parameter for getFull()');
		}
		let $project = this.projects[target.projectId];
		if ($project) {
			return $project;
		}
		$project = this.http
			.get<IDatatugProjectFull>(`${getStoreUrl(target.storeId)}/project-full`, {params: {id: target.projectId}})
			.pipe(
				shareReplay(1),
			)
		;
		this.projects[target.projectId] = $project;
		return $project;
	}

	public getSummary(target: IDatatugProjRef, options?: { cachedOnly?: boolean }): Observable<IDatatugProjectSummary> {
		const id = `${target.storeId}|${target.projectId}`;
		let $project = this.projSummary[id];
		if ($project) {
			return $project;
		}

		if (options?.cachedOnly) {
			return EMPTY;
		}
		$project = this.getProjectSummaryRequest(target)
			.pipe(
				shareReplay(1),
				// map(project => ({...project, id: projectId})),
			);
		this.projSummary[id] = $project;
		return $project;
	}

	private getProjectSummaryRequest(target: IDatatugProjRef): Observable<IDatatugProjectSummary> {
		if (!target) {
			throw new Error('target is required parameter');
		}
		const {storeId, projectId} = target;
		if (!storeId) {
			throw new Error('target.storeId is required parameter');
		}
		if (storeId === STORE_ID_GITHUB_COM || storeId.startsWith(GITLAB_REPO_PREFIX)) {
			interface urlAndHeaders {
				url: string;
				headers?: { [name: string]: string };
			}

			let connectTo: Observable<urlAndHeaders>;
			if (storeId === STORE_ID_GITHUB_COM) {
				const [repo, org] = projectId.split('@')
				connectTo = of({url: `https://raw.githubusercontent.com/${org}/${repo}/main/datatug/datatug-project.json`});
			} else if (storeId.startsWith(GITLAB_REPO_PREFIX)) {
				//url = 'https://gitlab.dell.com/A_Trakhimenok/dsa-datatug/-/raw/master/datatug/datatug-project.json';
				connectTo = this.privateTokenStoreService.getPrivateToken(storeId, projectId).pipe(map(accessToken => (
					{
						url: `https://gitlab.dell.com/api/v4/projects/${projectId}/repository/files/datatug%2Fdatatug-project.json/raw?ref=master`,
						headers: {"PRIVATE-TOKEN": accessToken}
					})));
			}
			return connectTo.pipe(
				mergeMap(request => this.http
					.get<IDatatugProjectSummary>(request.url, {headers: request.headers})
					.pipe(map(p => {
						if (p.id === projectId) {
							return p;
						}
						if (p.id) {
							console.warn(`Request project info with projectId=${projectId} but response JSON have id=${p.id}`);
						}
						return {...p, id: projectId};
					}))),
			);
		}
		const agentUrl = getStoreUrl(storeId);
		return this.http.get<IDatatugProjectSummary>(`${agentUrl}/project-summary`, {params: {id: projectId}});
	}

	public createNewProject(
		projStoreRef: IProjStoreRef,
		projData: ICreateProjectData,
	): Observable<string> {
		const sneatApiService = this.sneatApiServiceFactory.getSneatApiService(projStoreRef);
		return sneatApiService.post<ICreateProjectData, { id: string }>('/datatug/project/create_project', projData)
			.pipe(
				map(response => response.id)
			);
	}
}

export interface ICreateProjectData {
	title: string;
	userIds: string[];
	teamId?: string;
}

