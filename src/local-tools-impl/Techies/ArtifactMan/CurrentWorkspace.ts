import { Process } from "decova-environment";
import { DirectoryInfo, FileInfo } from "decova-filesystem";
import path from "path";
import { PathMan } from "../PathMan";



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
        return PathMan.CurrentWorkspace_Tasks
    }

    public get SettingsFile(): FileInfo
    {
        return PathMan.CurrentWorkspace_Settings
    }

    public get DecovaSettingsFile(): FileInfo
    {
        return PathMan.GotchaLocalRepo_DecovaSettingsFile
    }

    public get LaunchFile(): FileInfo
    {
        return PathMan.CurrentWorkspace_Lanuch;
    }
}