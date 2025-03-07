import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  techziteId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
    trim: true
  },
  email: { // Add email field
    type: String,
    required: true,
    trim: true
  },
  attempts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserAttempt'
  }],
  lastLoginAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Static method to find or create user
userSchema.statics.findOrCreateUser = async function(userData) {
  try {
    let user = await this.findOne({ techziteId: userData.techziteId });
    
    if (!user) {
      user = new this({
        techziteId: userData.techziteId,
        name: userData.name,
        contact: userData.contact,
        email: userData.email // Add email field
      });
      await user.save();
    } else {
      // Update existing user's info
      user.name = userData.name;
      user.contact = userData.contact;
      user.email = userData.email; // Add email field
      user.lastLoginAt = new Date();
      await user.save();
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

// Instance method to check fixed password
userSchema.methods.checkPassword = function(password) {
  return password === '1234';
};

// Add attempt to user's history
userSchema.methods.addAttempt = async function(attemptId) {
  this.attempts.push(attemptId);
  await this.save();
};

export default mongoose.model('User', userSchema);
