"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const quantum_circuit = require('quantum-circuit');


function activate(context) {

    // Base Extension to convert Qiskit to Qasm Code
    async  function base_qiskit_qasm(){
        let current_directory =  vscode.workspace.workspaceFolders[0].uri.fsPath;

        let current_file_name = path.basename(vscode.window.activeTextEditor.document.fileName);
        let temp_file_path = path.join(current_directory, '/temp.py')
        let temp_qasm_file_name = 'new.qasm';
        let temp_file_code = `from ${path.parse(current_file_name).name} import circuit\nfrom qiskit.compiler import transpile\nwith open('` + temp_qasm_file_name + `','w') as f:\n\tf.write(circuit.qasm())`;
        let temp_qasm_file_path = path.join(current_directory, temp_qasm_file_name);
        
        async function exec_temp_file() {
            const pythonProcess = spawn('python', [temp_file_path], { cwd: current_directory });
            pythonProcess.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
                });
        
                pythonProcess.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
                });
        
                pythonProcess.on('close', (code) => {
                console.log(`Python process exited with code ${code}`);
                });
        }

        async function write_file() {
            fs.writeFile(temp_file_path, temp_file_code, (err) => {
                if(err) console.log(err);
                console.log("File Saved");

            })
            await exec_temp_file();
            return temp_qasm_file_path;
        }

       let temp_path = await write_file()
       return temp_path
    }

    // Convert Qiskit to Qasm Function
    const qiskit_to_qasm = vscode.commands.registerCommand('jyuq.qiskit_to_qasm', async() => {
        let file_path = await base_qiskit_qasm()
        setTimeout(() => {
            vscode.workspace.openTextDocument(file_path).then((document) => {
                vscode.window.showTextDocument(document)
                let current_directory =  vscode.workspace.workspaceFolders[0].uri.fsPath;
                let temp_file_path = path.join(current_directory, '/temp.py')
                fs.unlinkSync(temp_file_path)
            })
        }, 3000)
       
    })

    const qiskit_to_cirq = vscode.commands.registerCommand('jyuq.qiskit_to_cirq', async() => {
        let file_path = await base_qiskit_qasm()
        setTimeout(() => {
            console.log(file_path)
            
            let file_contents = fs.readFileSync(file_path, 'utf-8');
            let qasm_circuit = new quantum_circuit()
            qasm_circuit.importQASM(file_contents)
            let output = qasm_circuit.exportCirq("", false, null, null)

            let current_directory =  vscode.workspace.workspaceFolders[0].uri.fsPath;
            let temp_file_path = path.join(current_directory, '/new.qasm')
            let circ_path = path.join(current_directory, '/new.js')
            console.log(output)
            
            fs.writeFileSync(circ_path, output, 'utf-8');
            
            vscode.workspace.openTextDocument(circ_path).then((document) => {
                 vscode.window.showTextDocument(document)
                 fs.unlinkSync(temp_file_path)
             })
        }, 3000)
    })
    const qiskit_to_q_sharp = vscode.commands.registerCommand('jyuq.qiskit_to_q_sharp', async() => {
        let file_path = await base_qiskit_qasm()
        setTimeout(() => {
            console.log(file_path)
            
            let file_contents = fs.readFileSync(file_path, 'utf-8');
            let qasm_circuit = new quantum_circuit()
            qasm_circuit.importQASM(file_contents)
            let output = qasm_circuit.exportQSharp("", false, null, null)

            let current_directory =  vscode.workspace.workspaceFolders[0].uri.fsPath;
            let temp_file_path = path.join(current_directory, '/new.qasm')
            let circ_path = path.join(current_directory, '/new.qs')
            console.log(output)
            
            fs.writeFileSync(circ_path, output, 'utf-8');
            
            vscode.workspace.openTextDocument(circ_path).then((document) => {
                 vscode.window.showTextDocument(document)
                 fs.unlinkSync(temp_file_path)
             })
        }, 3000)
    })

    // Qasm to Qiskit
    async  function base_qasm_qiskit(){
        let current_directory =  vscode.workspace.workspaceFolders[0].uri.fsPath;
        let current_file_name = path.join(current_directory, path.basename(vscode.window.activeTextEditor.document.fileName));

        let file_contents = fs.readFileSync(current_file_name, 'utf-8');
        let circuit = new quantum_circuit()
        circuit.importQASM(file_contents)
        let output = circuit.exportQiskit("", false, null, null, null, null, null, null, null, null, null)
        
        let new_file_path = path.join(current_directory, 'new.py');
        fs.writeFileSync(new_file_path, output, 'utf-8');
        
        return new_file_path
    }

    //Qasm to Cirq
    async  function base_qasm_cirq(){
        let current_directory =  vscode.workspace.workspaceFolders[0].uri.fsPath;
        let current_file_name = path.join(current_directory, path.basename(vscode.window.activeTextEditor.document.fileName));

        let file_contents = fs.readFileSync(current_file_name, 'utf-8');
        let circuit = new quantum_circuit()
        circuit.importQASM(file_contents)
        let output = circuit.exportCirq("", false, null, null, null, null, null)
        
        let new_file_path = path.join(current_directory, 'new.js');
        fs.writeFileSync(new_file_path, output, 'utf-8');
        
        return new_file_path
    }
     
    //Qasm to Q#
     async  function base_qasm_qsharp(){
        let current_directory =  vscode.workspace.workspaceFolders[0].uri.fsPath;
        let current_file_name = path.join(current_directory, path.basename(vscode.window.activeTextEditor.document.fileName));

        let file_contents = fs.readFileSync(current_file_name, 'utf-8');
        let circuit = new quantum_circuit()
        circuit.importQASM(file_contents)
        let output = circuit.exportQSharp("", false, null, null, null, null, null)
        
        let new_file_path = path.join(current_directory, 'new.qs');
        fs.writeFileSync(new_file_path, output, 'utf-8');
        
        return new_file_path
    }

    // Convert Qasm to Qiskit Function
    const qasm_to_qiskit = vscode.commands.registerCommand('jyuq.qasm_to_qiskit', async() => {
        let file_path = await base_qasm_qiskit()
        setTimeout(() => {
            vscode.workspace.openTextDocument(file_path).then((document) => {
                vscode.window.showTextDocument(document)
            })
        }, 3000)
       
    })

    // Convert Qasm to Cirq Function
    const qasm_to_cirq = vscode.commands.registerCommand('jyuq.qasm_to_cirq', async() => {
        let file_path = await base_qasm_cirq()
        setTimeout(() => {
            vscode.workspace.openTextDocument(file_path).then((document) => {
                vscode.window.showTextDocument(document)
            })
        }, 3000)
       
    })
    
    // Convert Qasm to Q Sharp Function
    const qasm_to_q_sharp= vscode.commands.registerCommand('jyuq.qasm_to_q_sharp', async() => {
        let file_path = await base_qasm_qsharp()
        setTimeout(() => {
            vscode.workspace.openTextDocument(file_path).then((document) => {
                vscode.window.showTextDocument(document)
            })
        }, 3000)
       
    })

    const conversion_circuit = vscode.commands.registerCommand('jyuq.conversions', () => {
        vscode.window.showQuickPick([
            { label: 'Qiskit to Qasm', description: 'Convert Qiskit Code to Qasm Code', command: 'jyuq.qiskit_to_qasm' },
            { label: 'Qiskit to Cirq', description: 'Convert Qiskit Code to Cirq Code', command: 'jyuq.qiskit_to_cirq' },
            { label: 'Qiskit to Q Sharp', description: 'Convert Qiskit Code to Cirq Code', command: 'jyuq.qiskit_to_q_sharp'},
            { label: 'Qasm to Qiskit', description: 'Convert Qasm Code to Qiskit Code', command: 'jyuq.qasm_to_qiskit'},
            { label: 'Qasm to Cirq', description: 'Convert Qasm Code to Cirq Code', command: 'jyuq.qasm_to_cirq'},
            { label: 'Qasm to Q Sharp', description: 'Convert Qasm Code to Q# Code', command: 'jyuq.qasm_to_q_sharp'}

        ]).then(selected => {
            if (selected && selected.command) {
                vscode.commands.executeCommand(selected.command);
            }
        });
    });

    context.subscriptions.push(qiskit_to_qasm, qiskit_to_cirq, qiskit_to_q_sharp, qasm_to_qiskit, qasm_to_cirq, conversion_circuit);

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
                
                vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(folderUri.path));
  

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