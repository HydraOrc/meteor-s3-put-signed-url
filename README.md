# s3-put-signed-url

Meteor method that helps you to generate a signed url to PUT a file to amazon aws s3. Requires admin access rights with alanning:roles atmosphere package.

### S3 Configuration

You need to add at the following CORS configuration to your S3 bucket (make sure that you know what they mean if you want to change something):

```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <AllowedHeader>*</AllowedHeader>
  </CORSRule>
</CORSConfiguration>
```

### Meteor.settings

You need to add at the following settings to your settings.json file (with your own values, of course):

```
{
  "public": {
    "amazon": {
      "region": "region",
      "bucket": "bucket"
    }
  },
  "amazon": {
    "accessKeyId": "accessKeyId",
    "secretAccessKey": "secretAccessKey"
  }
}
```

### Usage

Let's say you have a file called "dfdf.jpg", it's file type is "image/jpeg" and you want to get the signed url to put it to amazon s3 storage to the folder called "images".

```
Meteor.call(
  's3-put-signed-url',
  {
    folder: 'images',
    fileName: 'dfdf.jpg',
    fileType: 'image/jpeg'
  },
  function(err, data) {

  }
);
```

The resulting data would be an error or an object with the newly generated timestamped key for your file and the signed url to use later on, for example, in a PUT XMLHttpRequest.

```
{
  key: 'images/dfdf_1466601882.jpg',
  signedUrl: 'https://bucket.s3.region.amazonaws.com/images/dfdf_1466601882.jpg?Content-Type=image%2Fjpeg&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...&X-Amz-Date=...&X-Amz-Expires=60&X-Amz-Signature=...&X-Amz-SignedHeaders=host%3Bx-amz-acl&x-amz-acl=public-read'
}
```

### Packages used

It uses npm's package aws-sdk@2.4.1 (signatureVersion v4) and relies on the following atmosphere packages:

 - alanning:roles
 - stevezhu:lodash
 - hydraorc:translit
