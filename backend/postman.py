import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.header import Header
import lxml.html
from settings import GMAIL_NAME, GMAIL_ADDRESS, GMAIL_APP_PASSWORD


def send_mail(
    recipient: str,
    subject: str,
    message: str,
    sender_name=GMAIL_NAME,
    sender_address=GMAIL_ADDRESS,
    password=GMAIL_APP_PASSWORD,
):
    msg = MIMEMultipart("related")
    msg["Subject"] = subject
    msg["From"] = str(Header(f"{sender_name} <{sender_address}>"))
    msg["To"] = recipient
    msg.preamble = "This is a multi-part message in MIME format."
    msg_alternative = MIMEMultipart("alternative")
    msg.attach(msg_alternative)
    part_text = MIMEText(lxml.html.fromstring(message).text_content().encode("utf-8"), "plain", _charset="utf-8")
    part_html = MIMEText(message.encode("utf-8"), "html", _charset="utf-8")
    msg_alternative.attach(part_text)
    msg_alternative.attach(part_html)
    smtp_server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
    smtp_server.login(sender_address, password)
    smtp_server.sendmail(sender_address, recipient, msg.as_string())
    smtp_server.quit()
