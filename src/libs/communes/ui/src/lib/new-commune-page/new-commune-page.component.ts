import { Component, ViewChild } from "@angular/core";
import { IonInput } from "@ionic/angular";

interface ICommuneType {
	code: string;
	title: string;
	emoji: string;
}

@Component({
	selector: "sneat-new-commune-page",
	templateUrl: "./new-commune-page.component.html",
})
export class NewCommunePageComponent {
	public types: ICommuneType[] = [
		{ code: "family", title: "Family", emoji: "👨‍👩‍👧‍👦" },
		{ code: "friends", title: "Friends", emoji: "🤝" },
	];
	public code?: string;
	public icon?: string;
	public name = "";
	@ViewChild("nameInput") nameInput?: IonInput;

	range0to7 = '01234567'.split('');

	partnerStatus?: string;
	numberOfKids?: string;

	public onTypeChanged(event: Event): void {
		setTimeout(() => {
			this.nameInput?.setFocus().then(() => console.log("set focus to name"));
		}, 100);
	}
}
