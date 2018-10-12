const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const PostSchema = new Schema({


    title:{
        type: String,
        required: true,

    },
    status:{
        type: String,
        default: 'public',

    },
    allowComments:{
        type: Boolean,
        required: true,

    },
    body:{
        type: String,
        required : true,

    },

    file:{
        type: String,
        required : true,

    },
    date:{
        type: Date,
        default: Date.now()
    }


})

//posts below is an optinal name you give:

module.exports = mongoose.model('posts', PostSchema);