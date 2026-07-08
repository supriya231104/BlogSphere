import mongoose from "mongoose"

function valiDateId(id) {
    return mongoose.Types.ObjectId.isValid(id)
}

export default valiDateId