import { getHeader } from '../console';
import { revertAll } from '../git';

export const setup = () => {
	getHeader('generi revert');

	revertAll();
};
