import { List, Dictionary, SemVersion } from "decova-dotnet-developer";
import { Json } from "decova-json";

// interface LooseObject {
//     [key: string]: any
// }

export class PackageJson
{
    constructor(public FilePath: string)
    {
        Json.Populate(this, this.FilePath);
    }

    public name: string = '';
    public version: string = '';
    public liscense: string = '';
    public main: string = '';
    public module: string = '';
    public description: string = '';
    public sourceMap: boolean = true;
    public inlineSourceMap: boolean = false;
    public outDir: string = '';
    public scripts: string[] = [];
    public get Scripts(): List<String>
    {
        return new List<string>(this.scripts);
    }
    public files: string[] = [];
    public get Files(): List<String>
    {
        return new List<string>(this.files);
    }
    public keywords: string[] = [];
    public get Keywords(): List<String>
    {
        return new List<string>(this.keywords);
    }
    public dependencies: object = new Object();
    public get Dependencies(): Dictionary<string, string>
    {
        return Dictionary.FromObjectProps<string>(this.dependencies);
    }
    public bin: object = new Object();
    public get Bin(): Dictionary<string, string>
    {
        return Dictionary.FromObjectProps<string>(this.bin);
    }
    public devDependencies: object = new Object();
    public get DevDependencies(): Dictionary<string, string>
    {
        return Dictionary.FromObjectProps<string>(this.devDependencies);
    }

    public SaveAs(filePath: string)
    {
        const objToSave = { ...this };
        delete (objToSave as any).FilePath;
        Json.TrySave(filePath, objToSave, true, true);
    }

    public Save()
    {
        this.SaveAs(this.FilePath);
    }

    public IncrementVersionPatch(autoSave: boolean = false)
    {
        try 
        {
            const version = new SemVersion(this.version);
            version.Patch ++;
            this.version = version.Text;

            if(autoSave)
            {
                this.Save();
            }
        } 
        catch (err) 
        {
            console.log(err);
            throw err;
        }
    }
}
