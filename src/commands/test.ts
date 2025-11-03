import { getGeneri } from '../generi';
import { revertAll } from '../git';

export const setup = async () => {
	getGeneri().then(({ console }) => {
		console.header('generi tests');

		revertAll(console);

		// code here
	});
};
