import { sequelize } from "../db";

export const clearDB = async () => {
    let attempts = 10;
    const sync = () => {
        return sequelize.sync({force: true});
    }
    while(attempts--){
        try{
            console.log("Syncing db ....")
            await sync();
            console.log("Sync successful")
            attempts = 0;
            return;
        }catch(e){
            console.error("Failed to sync db")
            console.log("Attempting to clear each table")
            const proms:Promise<any>[] = [];
            Object.values(sequelize.models).forEach(model => {
                proms.push(model.destroy({force:true, truncate: true}));
            });
            Promise.all(proms).then(()=>{
                console.log("Cleared each table, attempting to sync again")

            }).catch(e=>{
                console.error("Failed to clear each table", e?.message);
                console.error("Attempting to sync again")
            })
            if(attempts === 0){
                console.error("Failed to sync db after 10 attempts")
                throw new Error("Failed to sync db after 10 attempts")
            }
        }
    }
}
