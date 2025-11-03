import { getGeneri } from '../generi';
import { revertAll } from '../git';

export const setup = () => {
	getGeneri().then(({ console }) => {
		console.header('generi revert');

		revertAll(console);
	});
};
