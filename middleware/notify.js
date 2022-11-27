const sns = require('./sns_publish')

module.exports = function (options = {}) {
    return function (req, res, next) {
        console.log('middleware-nofity starts...')

        next()

        // console.log(req)
        // console.log(req.method)
        // console.log(req.url)
        // console.log(req.body)

        // console.log(res)
        // console.log(res.statusCode)

        if (req.method == "POST" && req.url == "/positions" && res.statusCode == 200) {
            var params = {
                Message: JSON.stringify(req.body),
                TopicArn: "arn:aws:sns:us-east-1:798948514593:e6156", //TOPIC_ARN
            };
            let ret = sns(params);
            console.log(ret)
        }

    }
}