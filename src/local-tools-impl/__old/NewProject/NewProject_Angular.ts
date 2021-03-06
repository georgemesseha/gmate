// import { CurrentTerminal as tr } from "decova-terminal";
// import { UnitTest } from "./UnitTest";
// import * as fs from "decova-filesystem";
import path from "path";
import ch from "chalk";
import {CurrentTerminal as Terminal} from "decova-terminal";

export class NewProject_Angular
{
    public static async TakeControl()
    {
        let prjName = await Terminal.AskForTextAsync('Project Name?');
        let prjDir = path.join(process.cwd(), prjName);
        
        console.log(ch.bgCyan.black(`An Angular app will be created @ [${prjDir}]`));
        await Terminal.AskForTextAsync(`>>> Press Enter to create [${prjName}] project`);
        Terminal.Exec(`ng new ${prjName}`);
    }
}