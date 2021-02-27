import { List } from "decova-dotnet-developer";
import { Json } from "decova-json";
import { Process } from "decova-environment";
import { DirectoryInfo } from "decova-filesystem";
import { PackageManifest, PackMan } from "./PackMan";
import path from 'path'
import { CurrentTerminal, CurrentTerminal as trm } from "decova-terminal";

enum Command
{
    incrementPatch = "++",
    
}

function log(command: Command)
{
    console.log(`>> ggg ${command}`);
    
}



export class QuickCommands
{
   
    public static async HandleQuickCommand()
    {
        switch(Process.Current.Args.ItemAt(0).toLowerCase())
        {
            case Command.incrementPatch:
                await this.IncrementPackagePatch();
                break;

        }     
    }

    public static async IncrementPackagePatch()
    {
        await CurrentTerminal.InstructAsync('Attach your debugger:', 'Press ENTER to continue')
        function UpdateDependents()
        {
            const workSpace = Process.Current.CurrentWorkingDirectory.FullName;
            const packMan = new PackMan(workSpace);
            packMan.UpdateLeastVersionOnDependents();
        }

        log(Command.incrementPatch);
        
        const workSpace = Process.Current.CurrentWorkingDirectory.FullName;
        const packMan = new PackMan(workSpace);
        let newVersion = await packMan.IncrementVersionPatch();
        trm.DisplayInfo(`Version was elevated to ${newVersion}`);
        UpdateDependents();
    }

    
}