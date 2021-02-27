//import ch from "chalk";
// import figlet from "figlet";
//import * as cp from "child_process"
import {CurrentTerminal as Terminal} from "decova-terminal";
import { InsideExistingProject_Any } from "./InsideExistingProject/InsideExistingProject_Any";
import { NewProject_Angular } from "./NewProject/NewProject_Angular";
// import path from "path";
// import ch from "chalk";


export class InsideExistingProject
{
    
    public static async TakeControl()
    {
        // npm install --save decova-terminal
        // import { CurrentTerminal as Terminal } from "decova-terminal/CurrentTerminal";
        let ops = { whatever: 'Whatever',
                    angular: 'Angular',};
        let op = await Terminal.McqAsync('Current project type:', ops);
        switch(op)
        {
            case ops.whatever:
                InsideExistingProject_Any.TakeControl();
                break;
            case ops.angular:
                NewProject_Angular.TakeControl();
                break;
        }
    }

}