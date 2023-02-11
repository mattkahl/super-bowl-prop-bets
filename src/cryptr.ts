import assert from "assert";
import { default as Crypter } from "cryptr";

assert(process.env.ENCRYPTION_SECRET);

const cryptr = new Crypter(process.env.ENCRYPTION_SECRET as string);

export const encrypt = (input: string): string => cryptr.encrypt(input);

export const decrypt = (input: string): string => cryptr.decrypt(input);
