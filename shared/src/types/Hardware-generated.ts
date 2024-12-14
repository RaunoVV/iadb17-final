// import type { Quantity } from "some-resource-library"; // Replace with actual resource library
//
// interface HardwareList {
// 	apiVersion: string;
// 	kind: string;
// 	metadata?: {
// 		name?: string;
// 		namespace?: string;
// 		[key: string]: any;
// 	};
// 	items: Hardware[];
// }
//
// interface Hardware {
// 	apiVersion: string;
// 	kind: string;
// 	metadata?: {
// 		name?: string;
// 		namespace?: string;
// 		[key: string]: any;
// 	};
// 	spec?: HardwareSpec;
// 	status?: HardwareStatus;
// }
//
// interface HardwareSpec {
// 	bmcRef?: TypedLocalObjectReference;
// 	interfaces?: Interface[];
// 	metadata?: HardwareMetadata;
// 	tinkVersion?: number;
// 	disks?: Disk[];
// 	resources?: { [key: string]: Quantity };
// 	userData?: string;
// 	vendorData?: string;
// }
//
// interface Interface {
// 	netboot?: Netboot;
// 	dhcp?: DHCP;
// }
//
// interface Netboot {
// 	allowPXE?: boolean;
// 	allowWorkflow?: boolean;
// 	ipxe?: IPXE;
// 	osie?: OSIE;
// }
//
// interface IPXE {
// 	url?: string;
// 	contents?: string;
// }
//
// interface OSIE {
// 	baseURL?: string;
// 	kernel?: string;
// 	initrd?: string;
// }
//
// interface DHCP {
// 	mac?: string;
// 	hostname?: string;
// 	leaseTime?: number;
// 	nameServers?: string[];
// 	timeServers?: string[];
// 	arch?: string;
// 	uefi?: boolean;
// 	ifaceName?: string;
// 	ip?: IP;
// 	vlanID?: string;
// }
//
// interface IP {
// 	address?: string;
// 	netmask?: string;
// 	gateway?: string;
// 	family?: number;
// }
//
// interface HardwareMetadata {
// 	state?: string;
// 	bondingMode?: number;
// 	manufacturer?: MetadataManufacturer;
// 	instance?: MetadataInstance;
// 	custom?: MetadataCustom;
// 	facility?: MetadataFacility;
// }
//
// interface MetadataManufacturer {
// 	id?: string;
// 	slug?: string;
// }
//
// interface MetadataInstance {
// 	id?: string;
// 	state?: string;
// 	hostname?: string;
// 	allowPxe?: boolean;
// 	rescue?: boolean;
// 	operatingSystem?: MetadataInstanceOperatingSystem;
// 	alwaysPxe?: boolean;
// 	ipxeScriptURL?: string;
// 	ips?: MetadataInstanceIP[];
// 	userdata?: string;
// 	cryptedRootPassword?: string;
// 	tags?: string[];
// 	storage?: MetadataInstanceStorage;
// 	sshKeys?: string[];
// 	networkReady?: boolean;
// }
//
// interface MetadataInstanceOperatingSystem {
// 	slug?: string;
// 	distro?: string;
// 	version?: string;
// 	imageTag?: string;
// 	osSlug?: string;
// }
//
// interface MetadataInstanceIP {
// 	address?: string;
// 	netmask?: string;
// 	gateway?: string;
// 	family?: number;
// 	public?: boolean;
// 	management?: boolean;
// }
//
// interface MetadataInstanceStorage {
// 	disks?: MetadataInstanceStorageDisk[];
// 	raid?: MetadataInstanceStorageRAID[];
// 	filesystems?: MetadataInstanceStorageFilesystem[];
// }
//
// interface MetadataInstanceStorageDisk {
// 	device?: string;
// 	wipeTable?: boolean;
// 	partitions?: MetadataInstanceStorageDiskPartition[];
// }
//
// interface MetadataInstanceStorageDiskPartition {
// 	label?: string;
// 	number?: number;
// 	size?: number;
// 	start?: number;
// 	typeGUID?: string;
// }
//
// interface MetadataInstanceStorageRAID {
// 	name?: string;
// 	level?: string;
// 	devices?: string[];
// 	spare?: number;
// }
//
// interface MetadataInstanceStorageFilesystem {
// 	mount?: MetadataInstanceStorageMount;
// }
//
// interface MetadataInstanceStorageMount {
// 	device?: string;
// 	format?: string;
// 	files?: MetadataInstanceStorageFile[];
// 	create?: MetadataInstanceStorageMountFilesystemOptions;
// 	point?: string;
// }
//
// interface MetadataInstanceStorageFile {
// 	path?: string;
// 	contents?: string;
// 	mode?: number;
// 	uid?: number;
// 	gid?: number;
// }
//
// interface MetadataInstanceStorageMountFilesystemOptions {
// 	force?: boolean;
// 	options?: string[];
// }
//
// interface MetadataCustom {
// 	preinstalledOperatingSystemVersion?: MetadataInstanceOperatingSystem;
// 	privateSubnets?: string[];
// }
//
// interface MetadataFacility {
// 	planSlug?: string;
// 	planVersionSlug?: string;
// 	facilityCode?: string;
// }
//
// interface Disk {
// 	device?: string;
// }
//
// interface HardwareStatus {
// 	state?: HardwareState;
// }
//
// type HardwareState = string; // Define as needed
// type TypedLocalObjectReference = any; // Define as needed
