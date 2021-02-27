import { DirectoryInfo, FileInfo } from "decova-filesystem";
import { CommonDirName, CommonFileName } from "./PackMan";
import path from 'path';

export class PoykaConstants
{
    private _projectDir = `G:\\_MyProjects\\_MyNodeProjects\\Poyka`;  
    
    public get ProjectDir(): DirectoryInfo
    {
        return new DirectoryInfo(this._projectDir);
    }

    public get VsCodeDir(): DirectoryInfo
    {
        return new DirectoryInfo(path.join(this._projectDir, CommonDirName.vscode));
    }

    public get SnippetsFile(): FileInfo
    {
        return new FileInfo(path.join(this.VsCodeDir.FullName, CommonFileName.decovaSnippets));
    }

    public get TasksFile(): FileInfo
    {
        return new FileInfo(path.join(this.VsCodeDir.FullName, CommonFileName.tasksJson));
    }

    public get SettingsFile(): FileInfo
    {
        return new FileInfo(path.join(this.VsCodeDir.FullName, CommonFileName.settings));
    }
}