import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Avatar } from "flowbite-react";
import { type } from "node:os";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: [3, "First name must be more than 3 characters"],
  },
  lastName: {
    type: String,
    required: true,
    minlength: [3, "Last name must be more than 3 characters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  password: {
    type: String,
    minlength: [8, "password should be at least 8 char"],
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  avatar: {
    type: String
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
}
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export default mongoose.models.User || mongoose.model("User", UserSchema);