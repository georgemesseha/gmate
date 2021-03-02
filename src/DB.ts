// Find db online at
// https://cloud.mongodb.com/v2/6027652f52563e2c207313ca#metrics/replicaSet/6027667f50dca2446f8fbf4c/explorer/CommandSheet/Poyka/find
import { List } from "decova-dotnet-developer";
import { CurrentTerminal } from "decova-terminal";
import mongoose from "mongoose";

// const uri = `mongodb+srv://aipianist:poykaIsGreat@poykacommandsheet.yw0ri.mongodb.net/CommandSheet?retryWrites=true&w=majority`;
const uri = "mongodb+srv://aipianist:poykaIsGreat@cluster0.bdjm4.mongodb.net/GMate?retryWrites=true&w=majority";
export enum InstructionType
{
    Command,
    Instruction,
}


export class DB
{
    public static async GetAllCommands(): Promise<List<ICmd>>
    {
        try
        {
            await mongoose.connect(uri,
                {
                    useUnifiedTopology: true,
                    useNewUrlParser: true,

                });
        } 
        catch (err)
        {
            CurrentTerminal.DisplayErrorAsync("Couldn't connect to Mongo!")
            return new List<ICmd>();
        }

        const query = mongoose.connection.db.collection('CommandSheet').find({});
        return new List<ICmd>(await query.toArray());
    }
}