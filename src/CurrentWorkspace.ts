import { Process } from "decova-environment";
import { DirectoryInfo, FileInfo } from "decova-filesystem";
import path from "path";
import { CommonDirName, CommonFileName } from "./PackMan";


export class CurrentWorkspace
{
    public get MainDir(): DirectoryInfo|null
    {
        const currentDir = Process.Current.CurrentWorkingDirectory;
        if(currentDir.GetFiles().Any(f=>f.Name.toLowerCase() == 'package.json'))
        {
            return currentDir;
        }
        else
        {
            return currentDir.FindAncestor(a=>a.GetFiles().Any(f=>f.Name == 'package.json'));
        }
       
    }

    public get VsCodeDir(): DirectoryInfo|null
    {
        return this.MainDir!.GetDirectories().FirstOrDefault(d=>d.Name == '.vscode');
    }

    public get TasksFile(): FileInfo
    {
        return new FileInfo(path.join(this.VsCodeDir!.FullName, CommonFileName.tasksJson));
    }

    public get SettingsFile(): FileInfo
    {
        return new FileInfo(path.join(this.VsCodeDir!.FullName, CommonFileName.settings));
    }

    public get DecovaSettingsFile(): FileInfo
    {
        return new FileInfo(path.join(this.VsCodeDir!.FullName, CommonFileName.decovaSettings));
    }

    public get LaunchFile(): FileInfo
    {
        return new FileInfo(path.join(this.VsCodeDir!.FullName, CommonFileName.launch));
    }
}