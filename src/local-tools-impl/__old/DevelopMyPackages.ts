//import ch from "chalk";
// import figlet from "figlet";
//import * as cp from "child_process"
import {CurrentTerminal as Terminal} from "decova-terminal";
import { singleton } from "tsyringe";


@singleton()
export class DevelopMyPackages
{
    public async TakeControl()
    {
        // npm install --save decova-terminal
        // import { CurrentTerminal as Terminal } from "decova-terminal/CurrentTerminal";
        let ops = { decova_dotnet: 'decova-dotnet',
                    decova_FileSystem: 'decova-filesystem',
                    decova_Terminal: 'decova-terminal',
                    };
        let op = await Terminal.McqAsync('question', ops);
        switch(op)
        {
            case ops.decova_dotnet:
                Terminal.Exec(`code "G:\\_MyProjects\\_MyNodeProjects\\decova-dotnet"`);
                break;
            case ops.decova_FileSystem:
                Terminal.Exec(`code "G:\\_MyProjects\\_MyNodeProjects\\decova-filesystem"`);
                break;
            case ops.decova_Terminal:
                Terminal.Exec(`code "G:\\_MyProjects\\_MyNodeProjects\\decova-terminal"`);
                break;
        }
    }
}