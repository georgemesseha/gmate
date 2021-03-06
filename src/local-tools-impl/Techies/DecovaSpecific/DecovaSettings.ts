import { Environment } from "decova-environment";
import { DirectoryInfo, FileInfo, Path } from "decova-filesystem";
import { Json } from "decova-json";
import { TerminalAgent } from "../../../external-sheet/TerminalAgent";

import { PackageJson } from "../Package-General/PackageJson";
import { PathMan } from "../PathMan";

export class DecovaSettings
{
    public nodeProjectsContainers: string[] = [];

    public static LoadOfCurrentWorkspace(): DecovaSettings | null
    {
        const file = PathMan.GotchaLocalRepo_DecovaSettingsFile

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

    public static EnsureInCurrentWorkspace()
    {
        let decovaSettings = DecovaSettings.LoadOfCurrentWorkspace();
        if (!decovaSettings)
        {
            // DecovaSettings.  
        }
    }
}
