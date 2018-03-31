var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../demobotchg.zip');
var kuduApi = 'https://demobotchg.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$demobotchg';
var password = 'YXwrFtf7wyrsrFzBZDGb63XWMuicJiW4E3QwdkABymDZL4rAtDM4ff7HKBgm';

function uploadZip(callback) {
    fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
            auth: {
                username: userName,
                password: password,
                sendImmediately: true
            },
            headers: {
                "Content-Type": "applicaton/zip"
            }
        }))
        .on('response', function(resp) {
            if (resp.statusCode >= 200 && resp.statusCode < 300) {
                fs.unlink(zipPath);
                callback(null);
            } else if (resp.statusCode >= 400) {
                callback(resp);
            }
        })
        .on('error', function(err) {
            callback(err)
        });
}

function publish(callback) {
    zipFolder(rootFolder, zipPath, function(err) {
        if (!err) {
            uploadZip(callback);
        } else {
            callback(err);
        }
    })
}

publish(function(err) {
    if (!err) {
        console.log('demobotchg publish');
    } else {
        console.error('failed to publish demobotchg', err);
    }
});