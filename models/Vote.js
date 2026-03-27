const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    voter_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voter',
        required: true
    },
    candidate_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    }
});

module.exports = mongoose.model('Vote', voteSchema);