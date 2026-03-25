import { UserModel } from "../models/user.model.js";

export class UserDAO {
  async findByEmail(email) {
    return UserModel.findOne({ email });
  }

  async findByResetTokenHash(tokenHash, now) {
    return UserModel.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: now },
    });
  }

  async setPasswordResetToken(userId, tokenHash, expiresAt) {
    return UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          passwordResetTokenHash: tokenHash,
          passwordResetExpiresAt: expiresAt,
        },
      }
    );
  }

  async resetPasswordAndInvalidateToken({
    userId,
    newPasswordHash,
    previousPasswordHash,
  }) {
    return UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          password: newPasswordHash,
          previousPasswordHash,
          passwordResetTokenHash: null,
          passwordResetExpiresAt: null,
        },
      }
    );
  }
}

