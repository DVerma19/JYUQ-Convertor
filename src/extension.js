"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {

    const qiskit_to_qasm = vscode.commands.registerCommand('jyuq.qiskit_to_qasm', async() => {
        let folder_uri = await open_directory()
        console.log(folder_uri)
    })

    const conversion_circuit = vscode.commands.registerCommand('jyuq.conversions', () => {
        vscode.window.showQuickPick([
            { label: 'Qiskit to Qasm', description: 'Convert Qiskit Code to Qasm Code', command: 'jyuq.qiskit_to_qasm' },
        ]).then(selected => {
            if (selected && selected.command) {
                vscode.commands.executeCommand(selected.command);
            }
        });
    });

    context.subscriptions.push(qiskit_to_qasm, conversion_circuit);

    //Open the specific folder by the User
    function open_directory(){
        vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: 'Select folder to choose for the workspace'
        }).then((result) => {
            if(result && result.length > 0) {
                const folderUri = result[0];
                vscode.commands.executeCommand('vscode.openFolder',vscode.Uri.file(folderUri));
            }
            
        })
            

    console.log('Congratulations, your extension "jyuq-convertor" is now active!');

    let disposable = vscode.commands.registerCommand('jyuq-convertor.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from jyuq-convertor!');
    });
    context.subscriptions.push(disposable);
}
}

exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map