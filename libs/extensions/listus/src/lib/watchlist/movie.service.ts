import { Injectable } from '@angular/core';
import { CommuneItemBaseService } from '../../../services/commune-item-base-service';
import { MovieKind } from '../../../models/kinds';
import { IMovieDto } from '../../../models/dto/dto-movie';
import { Observable } from 'rxjs';
import { IRxReadwriteTransaction } from 'rxstore';
import { ISneatStoreProvider } from '../../../models/db-schemas-by-app/sneat-app-schema';
import { ListusAppSchema } from '../../../models/db-schemas-by-app';
import { IMovieService } from './interfaces';

@Injectable({
	providedIn: 'root',
})
export class MovieService
	extends CommuneItemBaseService<typeof MovieKind, IMovieDto, ListusAppSchema>
	implements IMovieService
{
	constructor(rxStoreProvider: ISneatStoreProvider) {
		super(rxStoreProvider, MovieKind);
	}

	// tslint:disable-next-line:prefer-function-over-method
	addCommuneItem(
		dto: IMovieDto,
		tx?: IRxReadwriteTransaction<ListusAppSchema>,
	): Observable<IMovieDto> {
		console.log('MovieService.addCommuneItem()', dto, tx);
		throw new Error('Not implemented');
	}
}