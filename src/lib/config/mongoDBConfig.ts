export const dbOpts = { 
    databaseURI: process.env.DATABASE_URI || "",
    connectionOpts:  { 
        useCreateIndex: true,
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: false 
    }
}