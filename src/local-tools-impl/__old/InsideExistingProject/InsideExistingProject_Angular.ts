import { CurrentTerminal as Terminal } from "decova-terminal";
import path from "path";
import ch from "chalk";

export class InsideExistingProject_Angular
{
    private static async _NewProject()
    {
        let prjName = await Terminal.AskForTextAsync('Project Name?');
        let prjDir = path.join(process.cwd(), prjName);
        
        console.log(ch.bgCyan.black(`An Angular app will be created @ [${prjDir}]`));
        await Terminal.AskForTextAsync(`>>> Press Enter to create [${prjName}] project`);
        Terminal.Exec(`ng new ${prjName}`);
    }

    private static async _Serve()
    {
        Terminal.Exec(`ng serve`);
    }

    private static async _KillCurrentServer()
    {
        const findCurrentServerProcess = ()=>
        {
            Terminal.Exec('netstat -ano | findstr LISTENING | findstr :4200');
        }
    
        const killProcess = (pid:string) =>
        {
            Terminal.Exec(`taskkill /pid ${pid} /f`);
        }

        findCurrentServerProcess();
        let pid = await Terminal.AskForTextAsync("PID to kill?");
        killProcess(pid);
    }

    private static async _Generate()
    {
        let ops = { component:"component", 
                    service:"service", 
                    module:"module", 
                    directive:"directive"
                  };

        let op = await Terminal.McqAsync("Generate what?", ops);
        let name = await Terminal.AskForTextAsync(`${op} Name?`);
    
        await Terminal.AskForTextAsync(`>>> Press Enter to create [${name}] ${op}`);
        Terminal.Exec(`ng g ${op} ${name}`);
    }

    private static async _installBootstrap()
    {
        Terminal.Exec('ng add @ng-bootstrap/schematics');
    }

   

    public static async TakeControl()
    {
        let ops = { generate:"Generate",
                    installBootstrap: "Install Bootstrap",
                    newProject:"New Project",
                    serve: "Serve Solution",
                    killCurrentServer: "Kill current server" };
        let op = await Terminal.McqAsync('Action?', ops);
        switch(op)
        {
            case ops.generate:
                this._Generate();
                break;
            case ops.installBootstrap:
                this._installBootstrap();
                break;
            case ops.newProject:            
                this._NewProject();
                break;
            case ops.serve:
                this._Serve();
                break;
            case ops.killCurrentServer:
                this._KillCurrentServer();
                break;
        }
    }

    
}