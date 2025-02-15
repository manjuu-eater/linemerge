const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('extension "line-merge" is now active');

	const command = 'extension.linemerge.linemerge';

	let disposable = vscode.commands.registerCommand(command, () => {
		const { document, selection } = vscode.window.activeTextEditor;
		const txt = document.getText().split(/\r?\n/);
		const eol = document.eol === 1 ? '\r\n' : '\n';
		if (selection.isEmpty || selection.isSingleLine) {
			return;
		}
		const st = selection.start.line,
			en = selection.end.line;
		const st_r = document.lineAt(st).range,
			en_r = document.lineAt(en).range;

		vscode.window.activeTextEditor.edit(e => {
			const range = new vscode.Range(
				new vscode.Position(st_r.start.line, st_r.start.character),
				new vscode.Position(en_r.start.line, en_r.end.character)
			);

			const originalLines = txt.slice(st, en - st + 1);
			const replacedLines = originalLines.filter((v, i, a) => a.indexOf(v) === i);

			// replace text only if any lines are merged
			if (originalLines.length != replacedLines.length) {
				e.replace(range, replacedLines.join(eol));
			}

			const cnt = originalLines.length - replacedLines.length;
			vscode.window.showInformationMessage(
				cnt > 0
					? `Merged ${cnt} lines`
					: "No lines are merged");
		}, {});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

// eslint-disable-next-line no-undef
module.exports = {
	activate,
	deactivate
}
