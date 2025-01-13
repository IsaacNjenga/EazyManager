//nodemailer
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: "../config/.env" });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

const sendEmail = async (req, res) => {
  const { to, subject, text, imageUrl } = req.body;
  //console.log(req.body);

  let saleData;

  try {
    saleData = JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse sale data:", error);
    return res
      .status(400)
      .json({ success: false, message: "Invalid sale data format." });
  }

  const saleDetailsTable = `
  <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
  <thead>
    <tr style="background-color: #f4f4f4; color: #333; text-align: left;">
      <th style="padding: 12px; border-bottom: 2px solid #ddd;">Field</th>
      <th style="padding: 12px; border-bottom: 2px solid #ddd;">Value</th>
    </tr>
  </thead>
  <tbody>
    ${Object.entries(saleData)
      .map(
        ([key, value]) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; background-color: #f9f9f9;">${key}</td>
        <td style="padding: 10px; background-color: #fff;">${value}</td>
      </tr>`
      )
      .join("")}
    <tr style="border-bottom: 1px solid #ddd;">
      <td style="padding: 10px; background-color: #f9f9f9;">Image</td>
      <td style="padding: 10px; background-color: #fff;">
        <a href="${imageUrl}" target="_blank">
          <img src="${imageUrl}" alt="Sale Image" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px;"/>
        </a>
      </td>
    </tr>
  </tbody>
</table>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    // attachments: [
    //   {
    //     filename: "image.jpg",
    //     path: imageUrl, // URL or local file path
    //   },
    // ],
    html: `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
      <h2 style="color: #0056b3; text-align: center;">New Sale Details</h2>
      <p style="margin: 20px 0; text-align: center;">A new sale has been made! Below are the details:</p>
      ${saleDetailsTable}
      <p style="margin-top: 20px; text-align: center;"></p>
    </div>
  `,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    res.status(200).json({ success: true, message: "Email Sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
};

export { sendEmail };
