import mongoose from "mongoose";

const SubEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { _id: false },
);

SubEventSchema.virtual("completed").get(function () {
  return new Date() > new Date(this.endDate);
});

SubEventSchema.set("toJSON", { virtuals: true });
SubEventSchema.set("toObject", { virtuals: true });

const EventSchema = new mongoose.Schema({
  mainTitle: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  organiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  capacity: { type: Number, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },

  enrolledUsers: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    validate: [
      function (v) { return v.length <= this.capacity; },
      "Event is full",
    ]
  },
  subEvents: {
    type: [SubEventSchema],
    validate: [
      (v) => v.length > 0,
      "Event must have at least one sub-event",
    ],
  },

  startingDate: { type: Date },
  endingDate: { type: Date },

  eventLocation: {
    type: String,
    required: true
  },
  locationDescription: {
    type: String,
  },
  eventImagesSrc: {
    type: [String],
    default: []
  }

}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
});

EventSchema.virtual("remainingCapacity").get(function () {
  return this.capacity - this.enrolledUsers.length;
});


EventSchema.virtual("eventStatus").get(function () {
  if (new Date() < new Date(this.startingDate)) {
    return 0;//event not started
  }
  else if (new Date() > new Date(this.startingDate) && new Date() < new Date(this.endingDate)) {
    return 1;//event in progress
  }
  else if (new Date() > new Date(this.endingDate)) {
    return 2;//event ended
  }
});

EventSchema.virtual("isAvailable").get(function () {
  if ((new Date() < new Date(this.startingDate)) && (this.enrolledUsers.length < this.capacity)) {
    return true;
  }
  else {
    return false;
  }
});



EventSchema.pre('save', function (next) {
  if (this.subEvents && this.subEvents.length > 0) {
    const startDates = this.subEvents.map(sub => new Date(sub.startDate).getTime());
    const endDates = this.subEvents.map(sub => new Date(sub.endDate).getTime());
    const minDate = Math.min(...startDates);
    const maxDate = Math.max(...endDates);
    this.endingDate = new Date(maxDate);
    this.startingDate = new Date(minDate);
  }
});


export default mongoose.model("Event", EventSchema);
