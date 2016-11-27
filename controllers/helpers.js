var ObjectId = require('mongoose').Types.ObjectId;

exports.setTimestamps = function(obj)
{
    if (typeof obj.createdAt == "undefined")
    {
        obj.createdAt = new Date();
    }
    obj.updatedAt = new Date();
    return obj;
}

exports.make_error = function(res, type, text)
{
    var error_object = {
        error_type: type,
        error_body: text
    }
    res.status(500).send(JSON.stringify(error_object));
}

exports.getID = function(item)
{
    var id;
    if (item._id)
        id = item._id = new ObjectId(item._id);
    else
        id = new ObjectId();

    return id;
}

