const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

require('dotenv').config(); // Load env vars

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL); // Use env variable here
  console.log("db connected");
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);
