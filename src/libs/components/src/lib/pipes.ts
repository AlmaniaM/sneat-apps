import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { TeamType } from '@sneat/auth-models';
import { Weekday } from '@sneat/dto';

@Pipe({name: 'teamEmoji'})
export class TeamEmojiPipe implements PipeTransform {
	// tslint:disable-next-line:prefer-function-over-method
	transform(communeType: TeamType): string | undefined {
		switch (communeType) {
			case 'family':
				return '👨‍👩‍👧‍👦';
			case 'cohabit':
				return '🤝';
			case 'sport_club':
				return '⚽';
			case 'educator':
				return '💃';
			case 'realtor':
				return '🏘️';
			case 'parish':
				return '⛪';
			case 'personal':
				return '🕶️';
			default:
				return undefined;
		}
	}
}

export function wdCodeToWeekdayName(wd?: Weekday): string {
	switch (wd) {
		case 'mo':
			return 'Monday';
		case 'tu':
			return 'Tuesday';
		case 'we':
			return 'Wednesday';
		case 'th':
			return 'Thursday';
		case 'fr':
			return 'Friday';
		case 'sa':
			return 'Saturday';
		case 'su':
			return 'Sunday';
		default:
			return '' + wd;
	}
}

@Pipe({name: 'wdToWeekday'})
export class WdToWeekdayPipe implements PipeTransform {
	// tslint:disable-next-line:prefer-function-over-method
	transform(wd?: Weekday): string {
		return wdCodeToWeekdayName(wd);
	}
}

@Pipe({name: 'longMonthName'})
export class LongMonthNamePipe implements PipeTransform {
	// tslint:disable-next-line:prefer-function-over-method
	transform(month?: number): string {
		switch (month) {
			// tslint:disable-next-line:no-magic-numbers
			case 0:
				return 'January';
			// tslint:disable-next-line:no-magic-numbers
			case 1:
				return 'February';
			// tslint:disable-next-line:no-magic-numbers
			case 2:
				return 'March';
			// tslint:disable-next-line:no-magic-numbers
			case 3:
				return 'April';
			// tslint:disable-next-line:no-magic-numbers
			case 4:
				return 'May';
			// tslint:disable-next-line:no-magic-numbers
			case 5:
				return 'June';
			// tslint:disable-next-line:no-magic-numbers
			case 6:
				return 'July';
			// tslint:disable-next-line:no-magic-numbers
			case 7:
				return 'August';
			// tslint:disable-next-line:no-magic-numbers
			case 8:
				return 'September';
			// tslint:disable-next-line:no-magic-numbers
			case 9:
				return 'October';
			// tslint:disable-next-line:no-magic-numbers
			case 10:
				return 'November';
			// tslint:disable-next-line:no-magic-numbers
			case 11:
				return 'December';
			default:
				return '' + month;
		}
	}
}

@Pipe({name: 'shortMonthName'})
export class ShortMonthNamePipe implements PipeTransform {
	// tslint:disable-next-line:prefer-function-over-method
	transform(month?: number): string {
		switch (month) {
			// tslint:disable-next-line:no-magic-numbers
			case 0:
				return 'Jan';
			// tslint:disable-next-line:no-magic-numbers
			case 1:
				return 'Feb';
			// tslint:disable-next-line:no-magic-numbers
			case 2:
				return 'Mar';
			// tslint:disable-next-line:no-magic-numbers
			case 3:
				return 'Apr';
			// tslint:disable-next-line:no-magic-numbers
			case 4:
				return 'May';
			// tslint:disable-next-line:no-magic-numbers
			case 5:
				return 'Jun';
			// tslint:disable-next-line:no-magic-numbers
			case 6:
				return 'Jul';
			// tslint:disable-next-line:no-magic-numbers
			case 7:
				return 'Aug';
			// tslint:disable-next-line:no-magic-numbers
			case 8:
				return 'Sep';
			// tslint:disable-next-line:no-magic-numbers
			case 9:
				return 'Oct';
			// tslint:disable-next-line:no-magic-numbers
			case 10:
				return 'Nov';
			// tslint:disable-next-line:no-magic-numbers
			case 11:
				return 'Dec';
			default:
				return '' + month;
		}
	}
}

const pipes: any[] = [
	TeamEmojiPipe,
	WdToWeekdayPipe,
	LongMonthNamePipe,
	ShortMonthNamePipe,
];

@NgModule({
	declarations: pipes,
	exports: pipes,
})
export  class SneatPipesModule {

}