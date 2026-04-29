import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["active", "cancelled", "used"],
        default: "active"
    }
}, { timestamps: true });

TicketSchema.index({ event: 1, user: 1 }, { unique: true });

export default mongoose.model("Ticket", TicketSchema);