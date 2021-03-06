//import ch from "chalk";
// import figlet from "figlet";
//import * as cp from "child_process"
import {CurrentTerminal as Terminal} from "decova-terminal";

import { NewProject_Angular } from "./NewProject/NewProject_Angular";
import { NewProject_NodePackage } from "./NewProject/NewProject_NodePackage";
// import path from "path";
// import ch from "chalk";


export class NewProject
{
    public static async TakeControl()
    {
        // npm install --save decova-terminal
        // import { CurrentTerminal as Terminal } from "decova-terminal/CurrentTerminal";
        let ops = { 
                    nodePackageProject: 'Node Package project',
                    angularProject: 'Angular project'
                  };
        let op = await Terminal.McqAsync('Project Type?', ops);
        switch(op)
        {
            case ops.nodePackageProject:
                NewProject_NodePackage.TakeControl();
                break;

            case ops.angularProject:
                NewProject_Angular.TakeControl();
                break;

            default:
                throw new Error('Unplanned execution path!');
        }
    }
}