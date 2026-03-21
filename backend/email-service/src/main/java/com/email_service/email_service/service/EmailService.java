package com.email_service.email_service.service;

import com.email_service.email_service.dto.EmailDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public void sendReservationConfirmation(EmailDto.ReservationEmailRequest req) {
        try {
            Context ctx = new Context();
            ctx.setVariable("guestName", req.getGuestName());
            ctx.setVariable("reservationId", req.getReservationId());
            String html = templateEngine.process("reservation-confirmation", ctx);
            sendHtmlEmail(req.getTo(), "Reservation Confirmed - " + req.getReservationId(), html);
        } catch (Exception e) {
            log.error("Failed to send reservation email: {}", e.getMessage());
        }
    }

    public void sendInvoice(EmailDto.InvoiceEmailRequest req) {
        try {
            Context ctx = new Context();
            ctx.setVariable("reservationId", req.getReservationId());
            ctx.setVariable("billId", req.getBillId());
            ctx.setVariable("amount", req.getAmount());
            String html = templateEngine.process("invoice", ctx);
            sendHtmlEmail(req.getTo(), "Invoice - Bill #" + req.getBillId(), html);
        } catch (Exception e) {
            log.error("Failed to send invoice email: {}", e.getMessage());
        }
    }

    private void sendHtmlEmail(String to, String subject, String html) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(html, true);
        mailSender.send(message);
    }
}
