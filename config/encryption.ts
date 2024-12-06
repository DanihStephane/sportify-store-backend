import { randomBytes, scrypt } from "crypto";

/**
 * Generates a password hash using the scrypt algorithm.
 * @param password The password to hash
 * @returns A promise that resolves to a hashed password with a salt, separated by a colon
 */
export const hashPassword = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Generate a 128-bit salt using a cryptographically secure PRNG
    const salt = randomBytes(128).toString("hex");

    // Hash the password using the scrypt algorithm
    scrypt(password, salt, 128, { N: 1024, r: 16, p: 2 }, (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        // Return the salt and derived key as a colon-separated string
        resolve(`${salt}:${derivedKey.toString("base64")}`);
      }
    });
  });
}

/**
 * Verifies a password against a hashed password.
 * @param password The password to verify
 * @param hashedPassword The hashed password and salt to compare against
 * @returns A promise that resolves to a boolean indicating if the password matches the hashed password
 */
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // Separate the salt and derived key from the hashed password
    const [salt, key] = hashedPassword.split(":");

    // Verify the derived key using the scrypt algorithm
    scrypt(password, salt, 128, { N: 1024, r: 16, p: 2 }, (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        // Compare the derived key with the hashed key
        resolve(key === derivedKey.toString("base64"));
      }
    });
  });
}

/**
 * Asynchronously changes the password of a user.
 *
 * @param {string} currentPassword - The current password of the user.
 * @param {string} newPassword - The new password to be set.
 * @param {string} storedHash - The hashed password and salt of the current password.
 * @return {Promise<string>} A promise that resolves to the hashed new password.
 * @throws {Error} If the current password is incorrect.
 * @throws {Error} If the new password is the same as the current password.
 */
export const getNewPasswordHash = async (currentPassword: string, newPassword: string, storedHash: string): Promise<string> => {
  // Verify the current password
  const isCurrentPasswordCorrect = await verifyPassword(currentPassword, storedHash);
  if (!isCurrentPasswordCorrect) {
    throw new Error("Current password is incorrect");
  }

  // Check if the new password is different from the current password
  const isNewPasswordSameAsCurrent = await verifyPassword(newPassword, storedHash);
  if (isNewPasswordSameAsCurrent) {
    throw new Error("New password must be different from the current password");
  }

  // Hash the new password
  const newHash = await hashPassword(newPassword);
  return newHash;
}