
import chalk from "chalk";
import { Process } from "decova-environment";

import figlet from "figlet";
import Main from './Main'
import { QuickCommands } from "./QuickCommands";
import { WorkspaceAugmenter } from "./WorkspaceAugmenter";


const pjson = require('../package.json');
console.log
(
    chalk.cyanBright
    (
        figlet.textSync("Poyka", { horizontalLayout: "default" })
    )
);

console.log(pjson.version);
console.log(`PID: ${process.pid}`)

WorkspaceAugmenter.EnsureWorkspaceAugmented();

if(Process.Current.Args.Count === 0)
{
    Main.TakeControl();
}
else
{
    QuickCommands.HandleQuickCommand();
}
