import { SanitizedAddress } from "./helpers";

export type SanitizedOrganization =Partial<{
	id: number;
	name: string;
	addressId: number;
	address: SanitizedAddress;
}>
