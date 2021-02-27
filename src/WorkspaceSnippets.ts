import { List } from "decova-dotnet-developer";
import { CommonDirName, CommonFileName } from "./PackMan";
import { Json } from "decova-json";
import { Process, Environment } from "decova-environment";
import path from 'path';
import { PoykaConstants } from "./PoykaConstants";

export class CodeSnippet
{
    public prefix: string = '';
    public body: string[] = [];
}

export class WorkspaceSnippets
{
    [Key: string]: CodeSnippet;

    public static Load(path: string): WorkspaceSnippets
    {
        return Json.Load<WorkspaceSnippets>(path);
    }

  // #region loading
    private static LoadOfCurrentWorkspace(): WorkspaceSnippets
    {
        return this.Load(path.join(Process.Current.CurrentWorkingDirectory.FullName, 
                                    CommonDirName.vscode, 
                                    CommonFileName.decovaSnippets));
    }

    private static LoadOfPoyka(): WorkspaceSnippets
    {
        return this.Load(new PoykaConstants().SnippetsFile.FullName);
    }
  // #endregion

   // #region comparing
    private static GetMissingInSecond(first: WorkspaceSnippets, second: WorkspaceSnippets): List<string>
    {
        const overriders = new List<string>(Object.getOwnPropertyNames(first))
                           .Where(p => ((first[p] as any)['overrider'] != null));
        return new List<string>(Object.getOwnPropertyNames(first))
        .Except(new List<string>(Object.getOwnPropertyNames(second)))
        .Union(overriders)
        .Distinct();
    }
   // #endregion

    // #region syncing
    public static Sync()
    {
        const ofPoyka = this.LoadOfPoyka();
        const ofWorkspace = this.LoadOfCurrentWorkspace();

        const missingSnippetsInPoyka = this.GetMissingInSecond(ofWorkspace, ofPoyka);
        const missingSnippetsInWorkspace = this.GetMissingInSecond(ofPoyka, ofWorkspace);
      
        function updatePoyka()
        {
            missingSnippetsInPoyka.Foreach(p=>ofPoyka[p] = ofWorkspace[p]);
            const targetPath = new PoykaConstants().SnippetsFile.FullName;
            Json.TrySave(targetPath, ofPoyka, true);
            console.log(`The following snippets are synced to Poyka:`, missingSnippetsInPoyka.Items);
        }

        function updateCurrentWorkspace()
        {
            missingSnippetsInWorkspace.Foreach(p=>ofWorkspace[p] = ofWorkspace[p]);
            const targetPath = path.join(Process.Current.CurrentWorkingDirectory.FullName, 
                                         CommonDirName.vscode, 
                                         CommonFileName.decovaSettings);
            Json.TrySave(targetPath, ofWorkspace, true);
            console.log(`The following snippets are synced to current workspace:`, missingSnippetsInPoyka.Items);
        }

        if(missingSnippetsInPoyka.Any())
        {
            updatePoyka();
        }
        if(missingSnippetsInWorkspace.Any())
        {
            updateCurrentWorkspace();
        }
    }
    // #endregion
}