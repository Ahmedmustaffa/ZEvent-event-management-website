import Ticket from "../model/ticket.js";
import Event from "../model/event.js";
import HTTPError from "../util/HTTPError.js";


export const createNewTicket = async (req, res, next) => {
    try {
        const { eventId } = req.body;
        const event = await Event.findById(eventId);

        if (!event) {
            throw new HTTPError(404, "Event not found");
        }

        if (!event.isAvailable) {
            throw new HTTPError(400, "Event is either full or has already started");
        }

        if (event.enrolledUsers.includes(req.user.userId)) {
            throw new HTTPError(400, "You are already registered for this event");
        }

        event.enrolledUsers.push(req.user.userId);
        await event.save();

        const ticket = new Ticket({ user: req.user.userId, event: eventId });
        await ticket.save();

        res.status(200).json({ success: true, message: "Successfully registered" });
    } catch (err) {
        next(err);
    }
};

export const getTicketById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ticket = await Ticket.findById(id).populate("user").populate("event");
        if (!ticket) {
            throw new HTTPError(404, "Ticket not found");
        }
        res.status(200).json(ticket);
    } catch (err) {
        next(err);
    }
}
export const getAllTickets = async (req, res, next) => {
    try {
        const tickets = await Ticket.find({ user: req.user.userId }).populate("user").populate("event");
        res.status(200).json(tickets);
    } catch (err) {
        next(err);
    }

}
export const deleteTicket = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ticket = await Ticket.findByIdAndDelete(id);
        if (!ticket) {
            throw new HTTPError(404, "Ticket not found");
        }
        const event = await Event.findById(ticket.event);
        if (event) {
            event.enrolledUsers = event.enrolledUsers.filter(userId => userId.toString() !== ticket.user.toString());
            await event.save();
        }
        res.status(200).json({ success: true, message: "Ticket deleted successfully" });
    } catch (err) {
        next(err);
    }
}
export const updateTicketToUsed = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ticket = await Ticket.findById(id).populate("event").populate("user");
        if (!ticket) {
            throw new HTTPError(404, "Ticket not found");
        }

        const { eventId } = req.body;
        const event = await Event.findById(eventId);
        if (!event) {
            throw new HTTPError(404, "Event not found");
        }
        if (event.organiser.toString() !== req.user.userId) {
            throw new HTTPError(403, "Only the event organiser can update ticket status");
        }
        if (ticket.status === "used") {
            throw new HTTPError(400, "Ticket is already marked as used");
        }
        if (ticket.status === "cancelled") {
            throw new HTTPError(400, "Ticket is already marked as cancelled");
        }
        ticket.status = "used";
        await ticket.save();
        res.status(200).json({ success: true, ticket, message: "Ticket status updated to used" });
    } catch (err) {
        next(err);
    }
}