# extractor
Metadata extractor for all the project Gutenberg titles

# Running module
Main file is `index.js`, and you can run it using command `node index.js [DIRECTORY] [PROCESS_MAX_OPEN_FILES]`, i.e. `node index.js ../rds 200`.

`DIRECTORY` and `PROCESS_MAX_OPEN_FILES` are optional arguments, if not specified will default to 1000 files and `../rdfs/epub` directory.
If you want to check maximum open files allowed, type in the terminal `ulimit -n`. `PROCESS_MAX_OPEN_FILES` should never exceed it.

# Mongo connection
Script will look for environment variables first to find mongo db connection url: `MONGO_URI`, and then fallback to `MONGOHQ_URL`. Otherwise it will try to connect to `mongodb://localhost/extractor`.

You can specify the directory for Gutenberg project files as first argument
The challenge is to build a metadata extractor for all the project Gutenberg titles which are available here: https://www.gutenberg.org/wiki/Gutenberg:Feeds (https://www.gutenberg.org/cache/epub/feeds/rdf-files.tar.zip) 

Each book has an RDF file which will need to be processed to extract the:
id (will be a number with 0-5 digits)
title
author/s
publisher (value will always be Gutenberg)
publication date
language
subject/s
license rights
Note: For some books all of the data won't be available.

Your tasks are:
Write a function that reads a single file in and outputs the correct output, using something like https://www.npmjs.com/package/xml2js or https://www.npmjs.com/package/xmldom will probably be useful
Store the output in a database of your choice locally for later querying, given you have experience with Mongo that makes the most sense here but feel free to use something like https://github.com/sequelize/sequelize with MySQL/PostGres as well
Write some unit tests in mocha for the code
Process all metadata for the titles for later querying