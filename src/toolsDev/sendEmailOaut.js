const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const plantilla = require("./plantillaEmailOaut");

// variables de entorno
const CLIENT_ID = process.env.CLIENT_ID || "146051961420-mm289a4uoakel3n6uvp5o33im0vh45u0.apps.googleusercontent.com";
const REDIRECT_URL = process.env.REDIRECT_URL || "https://developers.google.com/oauthplayground";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "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";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN || "1//04drOOAq9Kp8KCgYIARAAGAQSNwF-L9IriCuRkzH570rhKaLHhN7iXRa2n-Q5q_9msXISofpjgcpgIwwUruGTKTsidiEhkULawhA";

// config google
const oauth2Client = new google.auth.OAuth2({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URL

});

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async (email, nombre) => {
  try {
    const accessToken1 = await oauth2Client.getAccessToken();
    const transportador = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "foft.tec@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken1
      }
    });
    const emailOptions = {
      from: "sistema de gestion villa <foft.tec@gmail.com>",
      to: email,
      subject: "recupera la contraseña",
      html: plantilla(nombre)
    };

    const result = await transportador.sendMail(emailOptions);
    return result;
  } catch (err) {
    console.log("hay un error");
  }
};

module.exports = sendEmail;
