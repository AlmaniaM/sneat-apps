import { AgeGroup, Gender } from './types';

export interface IName {
	readonly first?: string;
	readonly last?: string;
	readonly middle?: string;
	readonly full?: string;
}

export interface IPerson {
	readonly userID?: string;
	readonly name?: IName;
	readonly gender?: Gender;
	readonly ageGroup?: AgeGroup;
	readonly email?: string;
	readonly phone?: string;
	readonly website?: string;
	readonly dob?: string;  // Date of birth
}

export interface IMyPerson extends IPerson {
	relationship?: string;
}
