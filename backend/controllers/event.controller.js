import Event from "../model/event.js";
import HTTPError from '../util/HTTPError.js';


export const getAllEvents = async (req, res, next) => {
    try {
        const { limit = 5, offset = 0, categories, organiser, search } = req.query;
        const filter = {};


        if (categories) {
            filter.category = { $in: categories.split(",") };
        }

        if (organiser) {
            filter.organiser = organiser;
        }

        if (search) {
            filter.mainTitle = { $regex: search, $options: "i" };
        }

        const [events, totalRecords] = await Promise.all([
            Event.find(filter)
                .limit(Number(limit))
                .skip(Number(offset))
                .populate("organiser", "fullName")
                .populate("category", "name")
                .populate("enrolledUsers", "firstName lastName email"),
            Event.countDocuments(filter)
        ]);

        res.status(200).json({
            data: events,
            meta: {
                totalRecords,
                totalPages: Math.ceil(totalRecords / limit),
                currentPage: Math.floor(offset / limit) + 1
            }
        });
    } catch (err) {
        next(err);
    }
}

export const getEventById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id)
            .populate("organiser", "fullName firstName lastName")
            .populate("category", "name");
        if (!event) {
            throw new HTTPError(404, "Event not found");
        }
        res.status(200).json(event);
    } catch (err) {
        next(err);
    }
}

export const createNewEvent = async (req, res, next) => {
    try {
        if (!req.user || !req.user.userId) {
            throw new HTTPError(401, "User session not found");
        }

        const eventData = {
            ...req.body,
            organiser: req.user.userId,
        };

        const newEvent = await Event.create(eventData);

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: newEvent
        });
    } catch (err) {
        next(err);
    }
};


export const deleteEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) {
            throw new HTTPError(404, "Event not found");
        }
        if (event.organiser.toString() !== req.user.userId && req.user.role !== "admin") {
            throw new HTTPError(403, "You are not the owner of this event");
        }
        await Event.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Event deleted",
            event,
        });
    } catch (err) {
        next(err);
    }
}

export const updateEvent = async (req, res, next) => {
    const { id } = req.params;
    const eventData = req.body;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return next(new HTTPError(404, "Event not found"));
        }

        if (event.organiser.toString() !== req.user.userId && req.user.role !== "admin") {
            return next(new HTTPError(403, "You are not authorized to update this event"));
        }

        event.set(eventData);

        await event.save();

        res.status(200).json({ success: true, data: event });
    } catch (err) {
        next(err);
    }
};