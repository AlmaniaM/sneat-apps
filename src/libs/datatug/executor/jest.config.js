module.exports = {
	displayName: 'datatug-executor',
	preset: '../../../jest.preset.js',
	setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
	globals: {
		'ts-jest': {
			tsConfig: '<rootDir>/tsconfig.spec.json',
			stringifyContentPathRegex: '\\.(html|svg)$',
		},
	},
	coverageDirectory: '../../../coverage/libs/datatug/executor',
	snapshotSerializers: [
		'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
		'jest-preset-angular/build/AngularSnapshotSerializer.js',
		'jest-preset-angular/build/HTMLCommentSerializer.js',
	],
	transform: {
		'^.+.(ts|mjs|js|html)$': 'jest-preset-angular',
	},
	transformIgnorePatterns: ['node_modules/(?!.*.mjs$)'],
	transformIgnorePatterns: ['node_modules/(?!.*.mjs$)'],
};
