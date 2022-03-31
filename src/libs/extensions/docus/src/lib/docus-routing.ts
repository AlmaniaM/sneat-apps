import {Route} from '@angular/router';
import {guardRoute} from '../../utils/guard-route';

export const docusRoutes: Route[] = [
	{
		path: 'documents',
		loadChildren: () => import('./pages/documents/commune-documents.module')
			.then(m => m.CommuneDocumentsPageModule),
		...guardRoute,
	},
	{
		path: 'document',
		loadChildren: () => import('./pages/document/commune-document.module')
			.then(m => m.CommuneDocumentPageModule),
		...guardRoute,
	},
	{
		path: 'new-document',
		loadChildren: () => import('./pages/document-new/document-new.module')
			.then(m => m.DocumentNewPageModule),
		...guardRoute,
	},
];
