var aws = Npm.require('aws-sdk');

var region = _.get(Meteor, 'settings.public.amazon.region');
var bucket = _.get(Meteor, 'settings.public.amazon.bucket');
var accessKeyId = _.get(Meteor, 'settings.amazon.accessKeyId');
var secret = _.get(Meteor, 'settings.amazon.secretAccessKey');

var s3, getSignedUrl;

if (region && bucket && accessKeyId && secret) {
  aws.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secret,
    region: region
  });

  s3 = new aws.S3({
    signatureVersion: 'v4'
  });

  getSignedUrl = _.bind(Meteor.wrapAsync(s3.getSignedUrl), s3);
}

Meteor.methods({
  's3-put-signed-url': function(data) {
    if (!Roles.userIsInRole(this.userId, 'admin')) {
      throw new Meteor.Error(403, 'You do not have the admin access rights', 'Forbidden');
    }

    if (!(region && bucket && accessKeyId && secret)) {
      throw new Meteor.Error(403, 'Please configure your settings.json based on s3-put-signed-url documentation', 'Forbidden');
    }

    if (!(data.folder && data.fileName && data.fileType)) {
      throw new Meteor.Error(403, 'Please provide all the arguments required', 'Forbidden');
    }

    var fileName = data.fileName;

    var fileExt = fileName.split('.').pop();
    fileName = fileName.replace(/\.[^\/.]+$/, '');
    fileName = translit(fileName);
    fileName = fileName.split('-').slice(0, 5).join('-');
    fileName = [fileName, Date.now() / 1000 | 0].join('-');
    fileName = [fileName, fileExt].join('.');

    var key = [data.folder, '/', fileName].join('');

    var s3_params = {
      Bucket: bucket,
      Key: key,
      Expires: 60,
      ContentType: data.fileType,
      ACL: 'public-read'
    };

    var signedUrl = getSignedUrl('putObject', s3_params);

    return {
      key: key,
      signedUrl: signedUrl
    };
  }
});
