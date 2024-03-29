//import ch from "chalk";
// import figlet from "figlet";
//import * as cp from "child_process"
import { CurrentTerminal as Terminal } from "decova-terminal";
import { container, singleton } from "tsyringe";
import { DevelopMyTools_Poyka } from "./DevelopMyTools/DevelopMyTools_Poyka";

@singleton()
export class DevelopMyTools
{
    private readonly srv_DevelopMyTools_Poyka = container.resolve(DevelopMyTools_Poyka);

    private _decova_terminal_project_dir = "G:\\_MyProjects\\_MyNodeProjects\\decova-terminal";
    private async _DevelopDecovaTerminal()
    {
        await Terminal.HintBeforeLaunchAsync("Press Enter to launch Decova.Terminal project");
        Terminal.Exec(`code "${this._decova_terminal_project_dir}"`);
    }

    private projectDir = "G:\\_MyProjects\\_VSCode Extensions\\decova-snippets";
    public async _DevelopDecovaSnippetsAddon()
    {
        let ops = { edit: 'Edit' };
        let selected = await Terminal.McqAsync('>>:', ops);
        switch (selected)
        {
            case ops.edit:
                await Terminal.AskForTextAsync("Press Enter to open your snippets extension project.");
                await Terminal.Exec(`code \"${this.projectDir}\".`);
                await Terminal.InstructAsync("Pick your target file from /snippets dir and make your modifications to.");
                await Terminal.InstructAsync("Update your package version.");
                await Terminal.InstructAsync("@your project dir >> vsce package.");
                await Terminal.InstructAsync("Browse to the generate vsix.");
                await Terminal.AskForTextAsync("Press Enter to open your publish page.");
                Terminal.Exec("start https://marketplace.visualstudio.com/manage/publishers/georgemesseha");
                await Terminal.InstructAsync("Publish your vsix to the page.");
                break;

        }

        
    }

    private async _EditPoykaCodeSnippets()
    {
        // cursor here
    }

    public async TakeControl()
    {
        // npm install --save decova-terminal
        // import { CurrentTerminal as Terminal } from "decova-terminal/CurrentTerminal";
        let ops = {
            newPoykaCodeSnippet: 'Code Snippets',
            developPoyka: "Poyka",
            decovaTerminal: "Develop Decova Terminal",
            decovaSnippets: "Decova Snippets Extension"
        };
        let op = await Terminal.McqAsync('question', ops);
        switch (op)
        {
            case ops.newPoykaCodeSnippet:
                this._EditPoykaCodeSnippets();
                break;

            case ops.developPoyka:
                await this.srv_DevelopMyTools_Poyka.TakeControl();
                break;

            case ops.decovaTerminal:
                await this._DevelopDecovaTerminal();
                break;

            case ops.decovaSnippets:
                await this._DevelopDecovaSnippetsAddon();
                break;

            default:
                throw new Error('')
        }
    }

}