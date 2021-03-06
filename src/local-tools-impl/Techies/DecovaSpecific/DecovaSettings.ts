import { Environment } from "decova-environment";
import { DirectoryInfo, FileInfo, Path } from "decova-filesystem";
import { Json } from "decova-json";

import { PackageJson } from "../Package-General/PackageJson";
import { PathMan } from "../PathMan";

export class DecovaSettings
{
    public nodeProjectsContainers: string[] = [];

    public static LoadOfCurrentWorkspace(): DecovaSettings|null
    {
        const file = PathMan.GotchaLocalRepo_DecovaSettingsFile

        if(file.Exists() == false)
        {
            return null;
        }
        else
        {
            return Json.Load<DecovaSettings>(file.FullName);
        }
    }

    
}
