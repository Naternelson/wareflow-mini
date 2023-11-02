export type BasicProductSpec = {
	id: number;
	name: string;
	description: string;
	pattern: string | null; 
	defaultValue: string | null;
	createdAt: Date;
	updatedAt: Date;
};
