import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a category name'],
        unique: true,
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [30, 'Name cannot be more than 30 characters']
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true
    },
}, { timestamps: true });


CategorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-');
    }
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);