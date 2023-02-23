const fs = require("fs");
const MAX_TAIL_LENGTH = 10;
const buffer = Buffer.alloc(1024)
const events = require("events")



// I will use this class for the functionalities like start reading the file  and watching the file.
class FileWatcher extends events.EventEmitter{
    

    // I will be using logs to get the updated data and dataStore to get the last 10 lines of the updated file.
    constructor(logFile){
        super()
        this.logFile = logFile;
        this.dataStore = [];
        this.clientsIds=[];
    }


    // To get the logs
    getDataStore(){
        return this.dataStore;
    }

    getLogs(){
        return this.logs;
    }


    // We will use this function to watch and get the update logs

    updateLogs(curr,prev){
        var fileWatcher = this

        fs.open(this.logFile,(err,fd)=>{
            if(err) {
                console.log(err);
                   return;
            }
            // we will read the file using the fileDescripter.
            fs.read(fd,buffer,0,buffer.length,prev.length, (err, bytes)=>{
                if(err) {
                    console.log(err);
                    return;
                }
                if(bytes > 0){
                    let originalData = buffer.slice(0,bytes).toString("utf8");

                    // Spliting the lines using new line character and storing in our data store and using slice to
                    // get last 10 lines of data.
                    let data = originalData.split("\n");
                    let logs = [];
                    // appending to the updated logs
                 
                    if(data.length < MAX_TAIL_LENGTH){
                        
                            let lenghtTobeUpdated = MAX_TAIL_LENGTH - data.length;
                            for(let i =0;i<lenghtTobeUpdated;i++){
                                this.dataStore.unshift();
                            }
                            data.forEach(element=>{
                                this.dataStore.push(element);
                                logs.push(element);
                            })
                    }else{
                        data.slice(-MAX_TAIL_LENGTH).forEach(element => {
                            this.dataStore.push(element);
                            this.logs.push(element);
                        });                  
                    }
                    fileWatcher.emit("process",logs);
                       
                }
            })
        })
    }

    init(){
        var fileWatcher = this;
        // opening the file
        fs.open(this.logFile,(err,fd)=>{
            if(err) {
                console.log(err);
                return;
            }
            // we will read the file using the fileDescripter.
            fs.read(fd,buffer,0,buffer.length,0, (err, bytes)=>{
                if(err) {
                    console.log(err);
                    return;
                }
                if(bytes > 0){
                    let originalData = buffer.slice(0,bytes).toString("utf8");

                    // Spliting the lines using new line character and storing in our data store and using slice to
                    // get last 10 lines of data.
                    let data = originalData.split("\n").slice(-1*MAX_TAIL_LENGTH);

                    data.forEach(element => {
                        this.dataStore.push(element);
                    });
                    fs.close(fd);
                }
            })

            // watching the file at the interval of 1000 milliseconds
            fs.watchFile(this.logFile,{interval:1000},(curr,prev)=>{
                this.updateLogs(curr,prev);
            })

        })
    }


}



module.exports ={FileWatcher}