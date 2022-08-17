import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactRole, ContactType } from '@sneat/dto';
import { IContactContext } from '@sneat/team/models';
import { IExpressOrderContext } from '../../dto';

@Component({
	selector: 'sneat-contact-with-ref-num',
	templateUrl: './contact-with-ref-num.component.html',
})
export class ContactWithRefNumComponent {
	@Input() readonly = false;
	@Input() contactColSize = 8;
	@Input() order?: IExpressOrderContext;
	@Input() contactType?: ContactType;
	@Input() contactRole?: ContactRole;

	@Input() contact?: IContactContext;
	@Output() readonly contactChange = new EventEmitter<IContactContext>();

	@Input() refNumber = '';
	@Output() readonly refNumberChange = new EventEmitter<string>();

	get refNumberColSize(): number {
		return 12 - this.contactColSize;
	}

	onRefNumberChange(): void {
		this.refNumberChange.emit(this.refNumber);
	}
}