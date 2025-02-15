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

import java.lang.reflect.AnnotatedParameterizedType;
import java.lang.reflect.ParameterizedType;
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.janilla.reflect.Reflection;
import com.janilla.web.Handle;
import com.janilla.web.JsonRenderer;
import com.janilla.web.Render;

public class Admin {

	@Handle(method = "GET", path = "/admin(/.*)?")
	public Foo foo(String path) {
		var m1 = new LinkedHashMap<String, Map<String, Map<String, Object>>>();
		var q = new ArrayDeque<Class<?>>();
		q.add(Data.class);
		do {
			var c = q.remove();
			var m2 = new LinkedHashMap<String, Map<String, Object>>();
			Reflection.properties(c).forEach(x -> {
				var m3 = new LinkedHashMap<String, Object>();
				m3.put("type", x.type().getSimpleName());
				List<Class<?>> cc;
				if (x.type() == List.class) {
					var apt = x.annotatedType() instanceof AnnotatedParameterizedType y ? y : null;
					var ta = apt != null ? apt.getAnnotatedActualTypeArguments()[0].getAnnotation(Types.class) : null;
					cc = ta != null ? Arrays.asList(ta.value())
							: List.of((Class<?>) ((ParameterizedType) x.genericType()).getActualTypeArguments()[0]);
					m3.put("elementTypes", cc.stream().map(Class::getSimpleName).toList());
				} else if (x.type().getPackageName().equals("java.lang"))
					cc = List.of();
				else if (!m1.containsKey(x.type().getSimpleName()))
					cc = List.of(x.type());
				else
					cc = List.of();
				m2.put(x.name(), m3);
				q.addAll(cc);
			});
			m1.put(c.getSimpleName(), m2);
		} while (!q.isEmpty());
		return new Foo(path != null ? path.substring(1).replace("/", ".") : null, m1);
	}

	@Render(template = "admin.html")
	public record Foo(String path,
			@Render(renderer = JsonRenderer.class) Map<String, Map<String, Map<String, Object>>> schema) {
	}
}
