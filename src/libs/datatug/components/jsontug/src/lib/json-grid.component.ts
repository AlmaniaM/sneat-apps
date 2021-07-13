import {Component, Input} from '@angular/core';
import {IJsonGridData} from './array-to-grid';

@Component({
	selector: 'datatug-json-grid',
	templateUrl: 'json-grid.component.html',
	styleUrls: ['json-component.scss'],
})
export class JsonGridComponent {
	@Input() jsonGrid?: IJsonGridData;
}
