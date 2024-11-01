import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "comicfixteam@f5.si",
    pass: "hZ@Mn4yNqbr+"
  }
});

export async function POST(req: Request) {
  try {
    const { feedback } = await req.json();

    await transporter.sendMail({
      from: '"ComicForge Feedback" <comicfixteam@f5.si>',
      to: "comicfixteam@f5.si",
      subject: "New Feedback from ComicForge",
      text: feedback,
      html: `<p>${feedback}</p>`,
    });

    return new Response(JSON.stringify({ message: "Feedback sent successfully" }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    return new Response(JSON.stringify({ error: "Failed to send feedback" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}