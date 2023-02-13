import nodemailer from 'nodemailer';

class NotificationService {
  private async getTransporter() {
    return nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail',
    });
  }

  public async email(message: string, theme: string): Promise<void> {
    const transporter = await this.getTransporter();

    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: 'user2@localhost',
        to: 'user2@localhost',
        subject: theme,
        text: message,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error || info.rejected) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

export default NotificationService;
