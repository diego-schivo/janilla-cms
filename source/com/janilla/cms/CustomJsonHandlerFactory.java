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

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.janilla.http.HttpExchange;
import com.janilla.json.JsonToken;
import com.janilla.json.ReflectionJsonIterator;
import com.janilla.persistence.Persistence;
import com.janilla.web.JsonHandlerFactory;

public class CustomJsonHandlerFactory extends JsonHandlerFactory {

	public Persistence persistence;

	@Override
	protected Iterator<JsonToken<?>> buildJsonIterator(Object object, HttpExchange exchange) {
		var x = new CustomReflectionJsonIterator();
		x.setObject(object);
		x.setIncludeType(true);
		return x;
	}

	protected class CustomReflectionJsonIterator extends ReflectionJsonIterator {

		@Override
		public Iterator<JsonToken<?>> newValueIterator(Object object) {
			var o = stack().peek();
			if (o instanceof Map.Entry<?, ?> e) {
				var n = (String) e.getKey();
				if (object instanceof Long l)
					switch (n) {
					case "form":
						object = persistence.crud(Form.class).read(l);
						break;
					case "media":
						object = persistence.crud(Media.class).read(l);
						break;
					}
				switch (n) {
				case "media":
					break;
				case "relatedPosts":
					if (object instanceof List<?> l && !l.isEmpty() && l.getFirst() instanceof Long)
						object = persistence.crud(Post.class).read(l.stream().mapToLong(x -> (long) x).toArray())
								.toList();
					break;
				case "categories":
					if (object instanceof List<?> l && !l.isEmpty() && l.getFirst() instanceof Long)
						object = persistence.crud(Category.class).read(l.stream().mapToLong(x -> (long) x).toArray())
								.toList();
					break;
				}
			}
			return super.newValueIterator(object);
		}
	}
}
