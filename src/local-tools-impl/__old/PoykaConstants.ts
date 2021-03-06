import { DirectoryInfo, FileInfo, Path } from "decova-filesystem";

import { PathMan } from "../Techies/PathMan";

export class PoykaConstants
{
    private _projectDir = `G:\\_MyProjects\\_MyNodeProjects\\Poyka`;  
    
    public get ProjectDir(): DirectoryInfo
    {
        return new DirectoryInfo(this._projectDir);
    }

    public get VsCodeDir(): DirectoryInfo
    {
        return PathMan.CurrentWorkspace_VsCodeDir
    }

    public get SnippetsFile(): FileInfo
    {
        return PathMan.CurrentWorkspace_DecovaSnippets
    }

    public get TasksFile(): FileInfo
    {
        return PathMan.CurrentWorkspace_Tasks
    }

    public get SettingsFile(): FileInfo
    {
        return PathMan.CurrentWorkspace_Settings
    }
}