// * controller for executing code

// importing packages
const { exec } = require('child_process');
// const {generateFile} = require('../helpers/generatorFunctions')
const generateFile = require('../helpers/generatorFuctions.js');
const { fileRemover, folderRemover } = require('../helpers/removerFunctions.js');
const path = require('path');

const pythonCompiler = async (req, res) => {
	try {
		const { code, args, language } = req.body;
		
		let codeArgs;

		if (!code || !language) {
			return res.status(400).json({ error: 'Code or language cannot be empty.' });
		}
		if (!args) {
			codeArgs = [];
		} else {
			codeArgs = [...args];
		}

		const { filePath, langDir, statusCode } = await generateFile(language, code);
		statusCode ? console.info('temp file created') : console.warn('failed creating temp file');

		if (statusCode !== true) throw new Error('Error while file creation and code execution.');
		else {
			// Execute the Python code
			exec(`python3 -m py_compile ${filePath}`, (syntaxError, stdout, stderr) => {
				if (syntaxError) {
					console.error(syntaxError);

					fileRemover(filePath);

					res.status(400).json({ error: 'Syntax error in the code.' });
				} else {
					exec(`python3 ${filePath}`, async (executeError, executeStdout, executeStderr) => {
						let status;
						if (executeError) {
							console.error(executeError);
							status = true;

							res.status(500).json({ error: 'An error occurred while executing the code.' });
						} else {
							const output = executeStderr || executeStdout;
							console.log('output is: ', output);
							status = true;

							res.status(200).json({ output });
						}
						if (status) {
							fileRemover(filePath);
							// to delete .pyc file created by python3.
							fileRemover(path.join(langDir, `./__pycache__/${filePath.slice(filePath.lastIndexOf('\\'), filePath.lastIndexOf('.'))}.cpython-311.pyc`));
						}
					});
				}
			});
		}
	} catch (error) {
		console.error('Error while processing the request:', error);
		res.status(500).json({ error: 'An error occurred while processing the request.' });
	}
};

module.exports = pythonCompiler;
