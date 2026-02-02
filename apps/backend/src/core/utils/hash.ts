import argon2 from "@node-rs/argon2";

export const hashPassword = async (password: string): Promise<string> => {
	try {
		const hash = await argon2.hash(password);
		return hash;
	} catch (error) {
		console.error(error);
		throw new Error("Error hashing password");
	}
};
export const verifyPassword = async (
	hash: string,
	password: string
): Promise<boolean> => {
	try {
		const isValid = await argon2.verify(hash, password);
		return isValid;
	} catch (error) {
		console.error("Error verifying password", error);
		return false;
	}
};