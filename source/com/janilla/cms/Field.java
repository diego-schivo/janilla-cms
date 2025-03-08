package com.janilla.cms;

public sealed interface Field permits Field.Email, Field.Number, Field.Text, Field.TextArea {

	String name();

	String label();

	Integer width();

	String defaultValue();

	Boolean required();

	public record Email(String name, String label, Integer width, String defaultValue, Boolean required)
			implements Field {
	}

	public record Number(String name, String label, Integer width, String defaultValue, Boolean required)
			implements Field {
	}

	public record Text(String name, String label, Integer width, String defaultValue, Boolean required)
			implements Field {
	}

	public record TextArea(String name, String label, Integer width, String defaultValue, Boolean required)
			implements Field {
	}
}
