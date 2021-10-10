import { DirectoryInfo, FileInfo, Path } from "decova-filesystem";
import { container } from "tsyringe";

import { PathMan } from "../Techies/PathMan";

export class PoykaConstants
{
    private readonly srv_PathMan = container.resolve(PathMan);
    private _projectDir = `G:\\_MyProjects\\_MyNodeProjects\\Poyka`;  
    
    public get ProjectDir(): DirectoryInfo
    {
        return new DirectoryInfo(this._projectDir);
    }

    public get VsCodeDir(): DirectoryInfo
    {
        return this.srv_PathMan.CurrentWorkspace_VsCodeDir
    }

    public get SnippetsFile(): FileInfo
    {
        return this.srv_PathMan.CurrentWorkspace_DecovaSnippets
    }

    public get TasksFile(): FileInfo
    {
        return this.srv_PathMan.CurrentWorkspace_Tasks
    }

    public get SettingsFile(): FileInfo
    {
        return this.srv_PathMan.CurrentWorkspace_Settings
    }
}