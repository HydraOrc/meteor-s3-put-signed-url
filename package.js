Package.describe({
  name: 'hydraorc:s3-put-signed-url',
  summary: 'Meteor method that helps you to generate a signed url to PUT a file to amazon aws s3',
  version: '1.0.1',
  git: 'https://github.com/hydraorc/meteor-s3-put-signed-url.git'
});

Npm.depends({ 'aws-sdk': '2.54.0' });

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use([
    'alanning:roles@1.2.16',
    'stevezhu:lodash@4.17.2',
    'hydraorc:translit@2.0.0'
  ], 'server');

  api.addFiles([
    'server/s3-put-signed-url.js'
  ], 'server');
});
