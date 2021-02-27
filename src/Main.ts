//import ch from "chalk";
// import figlet from "figlet";
//import * as cp from "child_process"
import {CurrentTerminal as Terminal} from "decova-terminal";
import { DevelopMyPackages } from "./DevelopMyPackages";
import { DevelopMyTools } from "./DevelopMyTools";
import { InsideExistingProject as InsideCurrentProject } from "./InsideExistingProject";
import { NewProject } from "./NewProject";
import { DirectoryInfo, FileInfo } from "decova-filesystem";


import path from "path";
import { WorkspaceAugmenter as WorkspaceAugmenter } from "./WorkspaceAugmenter";

export default class Main
{
    private static DisplayCurrentDirectory()
    {
        console.log('........................................');
        console.log('@' + DirectoryInfo.Current.FullName);
        console.log('........................................');
    }
 
    public static async TakeControl()
    {
        this.DisplayCurrentDirectory();
        

        let ops = {  
                    developCurrentProject: "Develop current project",
                    developYourTools: 'Develop your tools',
                    developYourPackages: 'Develop your packages',
                    createProject: 'New Project',
                };
                     
        let selected = await Terminal.McqAsync(">>:", ops);
        switch (selected)
        {         
            case ops.developCurrentProject:
                await InsideCurrentProject.TakeControl();
                break;    
            
            case ops.developYourTools:
                await DevelopMyTools.TakeControl();
                break;      

            case ops.developYourPackages:
                await DevelopMyPackages.TakeControl();
                break;

            case ops.createProject:
                await NewProject.TakeControl();
                break;

            default:
                throw new Error("Unplanned execution path.");
        }
        return;

    }
}  