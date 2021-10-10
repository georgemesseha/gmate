import { Environment } from "decova-environment";
import { DirectoryInfo, FileInfo, Path } from "decova-filesystem";
import { Json } from "decova-json";
import { inject, singleton } from "tsyringe";
import { TerminalAgent } from "../../../external-sheet/TerminalAgent";

import { PackageJson } from "../Package-General/PackageJson";
import { PathMan } from "../PathMan";

@singleton()
export class DecovaSettings
{
    constructor(@inject(PathMan) private srv_PathMan: PathMan)
    {

    }
    public nodeProjectsContainers: string[] = [];

    public LoadOfCurrentWorkspace(): DecovaSettings | null
    {
        const file = this.srv_PathMan.GotchaLocalRepo_DecovaSettingsFile

        if (file.Exists() == false)
        {
            return null;
        }
        else
        {
            try
            {
                return Json.Load<DecovaSettings>(file.FullName);
            } 
            catch (err)
            {
                TerminalAgent.ShowError(`Failed to load [${file.FullName}]`)
                return null
            }
        }
    }

    public EnsureInCurrentWorkspace()
    {
        let decovaSettings = this.LoadOfCurrentWorkspace();
        if (!decovaSettings)
        {
            // DecovaSettings.  
        }
    }
}
