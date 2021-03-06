//import { CurrentTerminal as Terminal } from "decova-terminal";
//import ch from 'chalk';
import {CurrentTerminal as Terminal} from "decova-terminal";
import path from 'path'
import { PathMan } from "../../../local-tools-impl/Techies/PathMan";


export class DevelopMyTools_Poyka
{
    private static _projectDir =  "G:\\_MyProjects\\_MyNodeProjects\\Poyka";

    private static async _NewBranch()
    {
        await Terminal.InstructAsync("Create [/src/MyBranch/MyBranch.ts]", 'Press ENTER when done.');
        await Terminal.InstructAsync("Create public static TakeControl() method and use it in the designed place.", 'Press ENTER when done');
    }

    private static async _EditCodeSnippets()
    {
        Terminal.Exec(`cd "${this._projectDir}"`);
        await Terminal.HintBeforeLaunchAsync('Press ENTER to take you to Poyka/snippets');
        Terminal.Exec(`code ${this._projectDir}`);
        Terminal.Exec(`code ` + PathMan.CurrentWorkspace_DecovaSnippets.FullName);
        await Terminal.InstructAsync(`Make your edits!`, `$$$Press ENTER when done!`);
        await Terminal.ConfirmAsync(`Ready for publishing Poyka?`);
        Terminal.Exec('ggg "++"');
        await Terminal.InstructAsync('Ctrl + Shift + B >> Build & Publish', `VOILA`);
    }

    public static async TakeControl()
    {
       //#region open project directory
       //await Terminal.AskForTextAsync(`>>> Press Enter to open Poyka project`);
       //Terminal.Exec(`code \"${this._projectDir}\"`);
       //#endregion

       //#region pick your common action
       let ops = { newBranch: 'New branch',
                   editCodeSnippets: 'Edit code snippets'
                };
       let selected = await Terminal.McqAsync('To do in Poyka:', ops);
       switch(selected)
       {
           case ops.newBranch:
               this._NewBranch();
               break;

            case ops.editCodeSnippets:
                this._EditCodeSnippets();
                break;
            
            default:
                throw new Error('Unplanned execution path!');
       }
       //#endregion
    }
}