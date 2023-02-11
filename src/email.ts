import formData from "form-data";
import Mailgun from "mailgun.js";
import { generateMagicLink } from "./state";
import { User } from "./types";
import { encrypt } from "./cryptr";
import assert from "assert";

assert(process.env.MAILGUN_API_KEY);

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY as string,
});

export const sendLoginEmail = async (user: User) => {
  console.log("Sending login email");

  const magicLink = await generateMagicLink(user);
  const encryptedMagicLinkId = encrypt(magicLink.id);
  const magicLinkUrl = `${process.env.HOST}/api/magicLink/${encryptedMagicLinkId}`;

  console.log("Magic link URL", magicLinkUrl);

  const message = await mg.messages.create("mattkahl.com", {
    from: "Kahl Super Bowl Prop Bets <sb2023@mattkahl.com>",
    to: [user.email],
    subject: "Welcome to Kahl Super Bowl Props 2023!",
    text: `Here is your login link: ${magicLinkUrl}`,
  });

  console.log("Mailgun response", message);
};
