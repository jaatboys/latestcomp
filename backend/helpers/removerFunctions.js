const { unlink, rm } = require('fs');

const fileRemover = (filePath) => {
	unlink(filePath, async (err) => {
		try {
			if (err) throw new Error(err);
			console.log('successfully deleted: ', filePath.slice(filePath.lastIndexOf('.')), 'file');
		} catch (error) {
			console.log(err);
		}
	});
};

const folderRemover = (filePath) => {
	rm(filePath, { recursive: true, force: true }, async (err) => {
		try {
			if (err) throw new Error(err);
			console.log('successfully deleted: ', filePath.slice(filePath.lastIndexOf('.')), 'file');
		} catch (error) {
			console.log(err);
		}
	});
};
module.exports = { fileRemover, folderRemover };
