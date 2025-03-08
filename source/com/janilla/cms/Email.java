package com.janilla.cms;

public record Email(String emailTo, String cc, String bcc, String replyTo, String emailFrom, String subject,
		String message) {
}