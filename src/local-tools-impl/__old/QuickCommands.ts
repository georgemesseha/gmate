import { List } from "decova-dotnet-developer";
import { Json } from "decova-json";
import { Process } from "decova-environment";
import { DirectoryInfo } from "decova-filesystem";
import { PackMan } from "../Techies/ArtifactMan/PackMan";
import { PackageJson } from "../Techies/Package-General/PackageJson";
import path from 'path'
import { CurrentTerminal, CurrentTerminal as trm } from "decova-terminal";

enum Command
{
    incrementPatch = "++",
    
}

function log(command: Command)
{
    console.log(`>> g ${command}`);
    
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
        
    }

    
}