import { Component, ViewChild } from "@angular/core";
import { IonInput } from "@ionic/angular";

interface ICommuneType {
	code: string;
	title: string
	icon: string;
}

@Component({
	selector: "sneat-new-commune-page",
	templateUrl: "./new-commune-page.component.html",
})
export class NewCommunePageComponent {
	public types: ICommuneType[] = [
		{ code: "family", title: 'Family', icon: "home-outline" },
		{ code: "friends", title: 'Friends', icon: "people-circle-outline" },
	];
	public code?: string;
	public icon?: string;
	public name = "";
	@ViewChild('nameInput') nameInput?: IonInput;

	public onTypeChanged(event: Event): void {
		setTimeout(() => {
			this.nameInput?.setFocus().then(() => console.log('set focus to name'));
		}, 100);
	}
}
