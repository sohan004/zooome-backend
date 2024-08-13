const cors = require('cors');
const fileUpload = require('express-fileupload');
const express = require('express');
const { getCountries } = require('node-countries');
const geoip = require('geoip-lite');

const rootMiddleware = (app) => {
    app.use(cors());
    app.use(express.json());

    //file upload middleware
    app.use(fileUpload(
        {
            useTempFiles: true,
            tempFileDir: './temp/'
        }
    ));


    //ip middleware
    app.use('/', (req, res, next) => {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
        const geo = geoip.lookup(ip)?.country || 'BD'
        const country = getCountries().find(c => {
            if (c?.alpha2?.toLowerCase() === geo?.toLowerCase()) return c;
            else if (c?.alpha3?.toLowerCase() === geo?.toLowerCase()) return c;
            else if (c?.name?.toLowerCase() === geo?.toLowerCase()) return c;
        })
        const countryName = country?.name?.toLowerCase()
        req.country = countryName;
        next();
    });
}


module.exports = rootMiddleware;