module.exports = {
     entry: './client/app.js',
     output: {
         path: __dirname + '/public',
         filename: 'app.bundle.js'
     },
     devtool: 'source-map',
     module: {
        loaders: [
            {   
                exclude: '/node_modules',
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-2']
                }
            }

        ]
     },
 };