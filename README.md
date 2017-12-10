# extractor
Metadata extractor for all the project Gutenberg titles

# Running module
Start by installing all required modules by running `npm install`.

The main file is `index.js`, and you can run it using command `node index.js [DIRECTORY] [PROCESS_MAX_OPEN_FILES]`, i.e. `node index.js ../rds 200`.

To see debugging info, run `npm run debug`. This will print all debugging info to the console. Not recommended with processing all data.

`DIRECTORY` and `PROCESS_MAX_OPEN_FILES` are optional arguments, if not specified will default to 1000 files and `../rdfs/epub` directory.
If you want to check maximum open files allowed, type in the terminal `ulimit -n`. `PROCESS_MAX_OPEN_FILES` should never exceed it.

# Mongo connection
Script will look for environment variables first to find mongo db connection url: `MONGO_URI`, and then fallback to `MONGOHQ_URL`. Otherwise it will try to connect to `mongodb://localhost/extractor`.

Book metadata will be saved to `books` collection. 

Any errors occured during processing will be saved to `logs` collection. It will save information on the error and related file path.

# Performance statistics

`Cluster` module was used to speed up the processing. Limits per files open are set by the process, so using all available threads will enable more files to be open and processed at the same time.

For 4 CPUs, using cluster and arbitrarily set number of files being processed at the same time (`PROCESS_MAX_OPEN_FILES`) by each process, I got results.

On average, for processing 500-2000 files at a time, the whole process took 129831ms.

For comparison, without using cluster module, process took 210894ms.

# Schema
Mongoose schemas used in the module.
## Books schema
````
{
  id: {
    type: Number
    , validate: [validate.id, 'Invalid id']
    , required: true
    , unique: true
  }
  , title: {
    type: String
  }
  , creator: [{
    type: String
  }]
  , publisher: {
    type: String
    , default: 'Project Gutenberg'
  }
  , language: {
    type: String
    , enum: constants.languages
  }
  , subject: [{
    type: String
  }]
  , license: {
    type: String
    , validate: [validate.url, 'Invalid license url']
  }
}, {
  timestamps: true
}
````

## Logs schema

````
{
  file: {type: String}
  , error: {}
}, {
  timestamps: true
}
````

# Eslint

Eslint config file is specified in a directory. 

To run it, use `eslint --quiet .` to see only errors (there should be no errors).

To see also any warnings run `eslint .`.

# Testing

To run all the tests use `npm run test` command.

To run all the tests with coverage report, run `npm run testcov` command. It will create `coverage` directory with detailed coverage info.

