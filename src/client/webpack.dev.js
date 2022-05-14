const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path');
const fs = require('fs');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        //host: '192.168.0.10',
        server: {
            type: 'https',
            options: {
                //minVersion: 'TLSv1.1',
                //ca: fs.readFileSync('/Users/fernandopuricelli/Documents/ARCHIVOS/localhost.pem'),
                //key: fs.readFileSync('/Users/fernandopuricelli/Documents/ARCHIVOS/localhost.key'),
                key: fs.readFileSync('/Users/fernandopuricelli/Documents/ARCHIVOS/dev.local.key'),
                cert: fs.readFileSync('/Users/fernandopuricelli/Documents/ARCHIVOS/dev.local.crt'),
                //passphrase: '12345',
                //requestCert: true,
            },
        },

        //key: fs.readFileSync('/Users/fernandopuricelli/Documents/ARCHIVOS/dev.local.key'),
        //cert: fs.readFileSync('/Users/fernandopuricelli/Documents/ARCHIVOS/dev.local.crt'),
        static: {
            directory: path.join(__dirname, '../../dist/client'),
        },
        hot: true,
        proxy: {
            '/socket.io': {
                target: 'http://127.0.0.1:3000',
                ws: true,
            },
        },
    },
})