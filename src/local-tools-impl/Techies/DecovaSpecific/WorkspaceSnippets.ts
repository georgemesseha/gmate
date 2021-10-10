import { Json } from "decova-json";
import { Process, Environment } from "decova-environment";
import path from 'path';
import { PoykaConstants } from "../../__old/PoykaConstants";
import { PathMan } from "../PathMan";
import { inject } from "tsyringe";

export class CodeSnippet
{
    public prefix: string = '';
    public body: string[] = [];
}

export class WorkspaceSnippets
{
    constructor(@inject(PathMan) private srv_PathMan: PathMan)
    {

    }

    // [Key: string]: CodeSnippet;

    public Load(path: string): WorkspaceSnippets
    {
        return Json.Load<WorkspaceSnippets>(path);
    }

  // #region loading
    private LoadOfCurrentWorkspace(): WorkspaceSnippets
    {
        return this.Load(this.srv_PathMan.CurrentWorkspace_DecovaSnippets.FullName);
    }

    private LoadOfPoyka(): WorkspaceSnippets
    {
        return this.Load(new PoykaConstants().SnippetsFile.FullName);
    }
  // #endregion

   // #region comparing
    private GetMissingInSecond(first: WorkspaceSnippets, second: WorkspaceSnippets): string[]
    {
        const overriders = Object.getOwnPropertyNames(first)
                           .xWhere(p => (((first as any)[p] as any)['overrider'] != null));
        return Object.getOwnPropertyNames(first)
        .xExcept(Object.getOwnPropertyNames(second))
        .xUnion(overriders)
        .xDistinct();
    }
   // #endregion

    // #region syncing
    public Sync()
    {
        const ofPoyka = this.LoadOfPoyka();
        const ofWorkspace = this.LoadOfCurrentWorkspace();

        const missingSnippetsInPoyka = this.GetMissingInSecond(ofWorkspace, ofPoyka);
        const missingSnippetsInWorkspace = this.GetMissingInSecond(ofPoyka, ofWorkspace);
      
        function updatePoyka()
        {
            missingSnippetsInPoyka.xForeach(p=>(ofPoyka as any)[p] = (ofWorkspace as any)[p]);
            const targetPath = new PoykaConstants().SnippetsFile.FullName;
            Json.TrySave(targetPath, ofPoyka, true);
            console.log(`The following snippets are synced to Poyka:`, missingSnippetsInPoyka);
        }

        const updateCurrentWorkspace = () =>
        {
            missingSnippetsInWorkspace.xForeach(p=>(ofWorkspace as any)[p] = (ofWorkspace as any)[p]);
            const targetPath = this.srv_PathMan.CurrentWorkspace_DecovaSettings.FullName;
            Json.TrySave(targetPath, ofWorkspace, true);
            console.log(`The following snippets are synced to current workspace:`, missingSnippetsInPoyka);
        }

        if(missingSnippetsInPoyka.xAny())
        {
            updatePoyka();
        }
        if(missingSnippetsInWorkspace.xAny())
        {
            updateCurrentWorkspace();
        }
    }
    // #endregion
}