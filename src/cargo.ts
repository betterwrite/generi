import fs from 'fs-extra';
import path from 'pathe';
import { parse, stringify } from 'smol-toml';
import { getRoot } from './utils';

export const getCargoFullPath = (cargoPath: string) => {
	return path.join(getRoot(), cargoPath);
};

export const readCargo = (cargoPath: string): Record<string, any> | false => {
	try {
		const content = fs.readFileSync(getCargoFullPath(cargoPath), 'utf-8');
		return parse(content) as Record<string, any>;
	} catch {
		return false;
	}
};

export const getCargoVersion = (cargoPath: string): string | undefined => {
	const cargo = readCargo(cargoPath);
	if (!cargo) return undefined;

	// workspace Cargo.toml: [workspace.package]
	const workspaceVersion = (cargo?.workspace as any)?.package?.version;
	if (workspaceVersion) return workspaceVersion;

	// single-crate Cargo.toml: [package]
	return (cargo?.package as any)?.version;
};

export const setCargoVersion = (cargoPath: string, version: string): void => {
	const fullPath = getCargoFullPath(cargoPath);
	const content = fs.readFileSync(fullPath, 'utf-8');
	const cargo = parse(content) as Record<string, any>;

	const normalize = version.startsWith('v') ? version.slice(1) : version;

	if ((cargo?.workspace as any)?.package) {
		(cargo.workspace as any).package.version = normalize;
	} else if (cargo?.package) {
		(cargo.package as any).version = normalize;
	}

	fs.writeFileSync(fullPath, stringify(cargo), 'utf-8');
};
