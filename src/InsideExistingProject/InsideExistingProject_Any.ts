import { CurrentTerminal as tr } from "decova-terminal";
// import path from "path";
// import ch from "chalk";

export class InsideExistingProject_Any
{
    public static async _AddUnitTest()
    {
        await tr.HintBeforeLaunchAsync("Press Enter to ensure tsconfig.json");
        tr.Exec("npx tsconfig.json");
        await tr.InstructAsync("@File tsconfig.json ...");
        await tr.InstructAsync("... outDir = ./dist");
        await tr.InstructAsync("...@Just under outDir prop ...");
        await tr.InstructAsync("... declaration : true");
        await tr.InstructAsync("... declarationMap : true");
        await tr.InstructAsync("... declarationDir : ./dist");
        await tr.InstructAsync("Make sure [Jasmine Test Explorer] extension is installed.");
        await tr.HintBeforeLaunchAsync("Press Enter to install Jasmine and its types");
        tr.Exec("npm i --save-dev jasmine");
        tr.Exec("npm i @types/jasmine");        
        await tr.InstructAsync("@File tsconfig.json ...");
        await tr.InstructAsync("... @include [] property ...");
        await tr.InstructAsync("... add ./spec/**/*.ts");
        await tr.HintBeforeLaunchAsync("Press Enter to create jasmine configuration");
        tr.Exec("jasmine init");
        await tr.InstructAsync("@File /spec/support/jasmine.json ...");
        await tr.InstructAsync("... spec_dir : ./dist/spec");
        await tr.InstructAsync("@Dir /spec ...");
        await tr.InstructAsync("... Ensure at least somefile.spec.ts");
        await tr.InstructAsync("@File /spec/someFile.spec.ts ...");
        await tr.InstructAsync("... write a test code sample {describe-it lablablah}")
        await tr.InstructAsync("@src dir");
        await tr.InstructAsync("... Make sure you have at least one .ts file there.");
        await tr.HintBeforeLaunchAsync("Press Enter to transpile");
        tr.Exec("tsc");
        tr.Exec("start \"G:\\GGGBrain\\OneDrive\\GGGHowTo\\ggg VSCode open jasmine test explorer@gui-jasmine.gif\"");
        await tr.InstructAsync("If no gif opened: ggg Open Jasmine Test Explorer and make sure you can see your sample test");

    }

    public static async TakeControl()
    {
        // npm install --save decova-terminal
        // import { CurrentTerminal as Terminal } from "decova-terminal/CurrentTerminal";
        let ops = { addUnitTest: 'Add Unit Test'};
        let op = await tr.McqAsync('To do with current project:', ops);
        switch(op)
        {
            case ops.addUnitTest:
                this._AddUnitTest();
                break;
        }
    }
}