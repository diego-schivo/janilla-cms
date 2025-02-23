/*
 * MIT License
 *
 * Copyright (c) 2024-2025 Diego Schivo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
package com.janilla.cms;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.List;
import java.util.function.UnaryOperator;

import com.janilla.json.Converter;
import com.janilla.json.Json;

public record SeedData(List<Page> pages, List<Post> posts, List<Media> media, List<Category> categories,
		List<User> users, Header header) {

	public static SeedData INSTANCE;

	static {
		try (var is = SeedData.class.getResourceAsStream("seed-data.json")) {
			var c = new Converter();
			c.setResolver(new TypeResolver());
			INSTANCE = (SeedData) c.convert(Json.parse(new String(is.readAllBytes())), SeedData.class);
		} catch (IOException e) {
			throw new UncheckedIOException(e);
		}
	}

	public static class TypeResolver implements UnaryOperator<Converter.MapType> {

		@Override
		public Converter.MapType apply(Converter.MapType mt) {
			try {
				return mt.map().containsKey("$type") ? new Converter.MapType(mt.map(), Class.forName(
						SeedData.class.getPackageName() + "." + ((String) mt.map().get("$type")).replace(".", "$")))
						: null;
			} catch (ClassNotFoundException e) {
				throw new RuntimeException(e);
			}
		}
	}
}
