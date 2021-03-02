import { List, XString } from "decova-dotnet-developer";
import { CurrentTerminal as Terminal } from "decova-terminal";
import * as inquirer from "inquirer"

type DlgTextRepresenter<TOption> = (option:TOption)=>string


export class Intellisense<TOption>
{
    private _plainOptions: string[] = [];

    constructor(private _options: List<TOption>, 
                private _displaySelector:DlgTextRepresenter<TOption>)
    {
        this._plainOptions = _options.Select(op => this._displaySelector(op)).Items;
    }

    private FilterOptions(options:string[], searchString: string)
    {
        if(new XString(searchString).IsNullOrWhiteSpace()) return options;
        const keys = new List<string>(searchString.split(" ")).Select(s => s.trim().toLowerCase())
        const output = new List<string>(options).Where(op => keys.All(k => op.toLowerCase().indexOf(k) >= 0)).Items;
        return output;
    }

   

    public async PromptPlain(): Promise<string>
    {
        inquirer.registerPrompt
        (
            'autocomplete',
            require('inquirer-autocomplete-prompt')
        );
        const answer = await inquirer
        .prompt
        ([
            {
                type: 'autocomplete',
                name: 'Description',
                pageSize: 10,
                message: '>>>',
                source: (answersSoFar:string[], input:string) => 
                {
                    return this.FilterOptions(this._plainOptions, input)
                }
            }
        ]);

        return answer['Description'];
    }


    public async Prompt(): Promise<TOption>
    {
        const selectedPlain = await(this.PromptPlain())
        return this._options.First(op => this._displaySelector(op) == selectedPlain)
    }
}
