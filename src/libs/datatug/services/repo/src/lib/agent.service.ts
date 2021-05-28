import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {IExecuteResponse, ISelectRequest} from "@sneat/datatug/dto";
import {Observable, throwError} from "rxjs";
import {getStoreUrl} from "@sneat/datatug/nav";
import {IExecuteRequest, ISqlCommandRequest} from "@sneat/datatug/models";

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

@Injectable()
export class AgentService {
	constructor(
		private readonly http: HttpClient,
	) {
	}

	public select(repoId: string, request: ISelectRequest): Observable<IExecuteResponse> {
		console.log(`AgentService.select(${repoId})`, request);
		if (!request.proj) {
			return throwError('Client side check failed: !request.proj');
		} else if (request.proj.indexOf('@') >= 0) {
			return throwError('Client side check failed: "@" character in project ID, repo is supposed to be passed independently');
		}
		let params = new HttpParams()
			.append('db', request.db)
			.append('env', request.env)
			.append('proj', request.proj)
		;
		if (request.from) {
			params = params.append('from', request.from)
		} else if (request.sql) {
			params = params.append('sql', request.sql)
		}
		if (request.where) {
			params = params.append('where', request.where);
		}
		if (request.limit) {
			params = params.append('limit', '' + request.limit);
		}
		if (request.namedParams) {
			Object.entries(request.namedParams).forEach(
				([id, p]) => {
					params = params.append(`p:${id}:${p.type}`, '' + p.value);
				}
			);
		}
		// eslint-disable-next-line object-shorthand
		const agentUrl = getStoreUrl(repoId);
		return this.http.get<IExecuteResponse>(agentUrl + '/exec/select', {params});
	}

	public execute(repoId: string, request: IExecuteRequest): Observable<IExecuteResponse> {
		console.log(`AgentService.execute(${repoId})`, request);
		if (request.commands?.length === 1 && !!request.commands[0].namedParams) {
			const cmd = request.commands[0] as ISqlCommandRequest;
			return this.select(repoId, {
				db: cmd.db,
				env: cmd.env,
				sql: cmd.text,
				proj: request.projectId,
				namedParams: cmd.namedParams,
			});
		}
		if (!request.projectId) {
			return throwError('Client side check failed: !request.proj');
		} else if (request.projectId.indexOf('@') >= 0) {
			return throwError('Client side check failed: "@" character in project ID, repo is supposed to be passed independently');
		}
		const params = new HttpParams()
			.append('project', request.projectId)
		;
		const body: Writeable<IExecuteRequest> = {...request};
		delete body.projectId;
		const agentUrl = getStoreUrl(repoId);
		return this.http.post<IExecuteResponse>(agentUrl + `/exec/execute_commands`, body, {params});
	}
}
