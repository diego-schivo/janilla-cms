package com.janilla.cms;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.ByteBuffer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Properties;

import com.janilla.http.HeaderField;
import com.janilla.http.HttpExchange;
import com.janilla.http.HttpHandler;
import com.janilla.http.HttpRequest;
import com.janilla.http.HttpWritableByteChannel;
import com.janilla.web.WebHandlerFactory;

public class FooHandlerFactory implements WebHandlerFactory {

	public Properties configuration;

	@Override
	public HttpHandler createHandler(Object object, HttpExchange exchange) {
		var p = object instanceof HttpRequest x ? x.getPath() : null;
		var n = p != null && p.startsWith("/images/") ? p.substring("/images/".length()) : null;
		if (n == null)
			return null;

		var ud = configuration.getProperty("janilla-cms.upload.directory");
		if (ud.startsWith("~"))
			ud = System.getProperty("user.home") + ud.substring(1);
		var f = Path.of(ud).resolve(n);
		return Files.exists(f) ? ex -> {
			handle(f, (HttpExchange) ex);
			return true;
		} : null;
	}

	protected void handle(Path file, HttpExchange exchange) {
		var rs = exchange.getResponse();
		rs.setStatus(200);

		var hh = rs.getHeaders();
		hh.add(new HeaderField("cache-control", "max-age=3600"));
		var n = file.getFileName().toString();
		switch (n.substring(n.lastIndexOf('.') + 1)) {
		case "ico":
			hh.add(new HeaderField("content-type", "image/x-icon"));
			break;
		case "svg":
			hh.add(new HeaderField("content-type", "image/svg+xml"));
			break;
		}
		try {
			hh.add(new HeaderField("content-length", String.valueOf(Files.size(file))));
		} catch (IOException e) {
			throw new UncheckedIOException(e);
		}

		try (var is = Files.newInputStream(file)) {
			((HttpWritableByteChannel) rs.getBody()).write(ByteBuffer.wrap(is.readAllBytes()), true);
		} catch (IOException e) {
			throw new UncheckedIOException(e);
		}
	}
}
