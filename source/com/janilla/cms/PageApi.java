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

import java.util.Set;
import java.util.stream.Stream;

import com.janilla.persistence.Persistence;
import com.janilla.reflect.Reflection;
import com.janilla.web.Bind;
import com.janilla.web.Handle;
import com.janilla.web.NotFoundException;

public class PageApi {

	public Persistence persistence;

	@Handle(method = "POST", path = "/api/pages")
	public Page create(@Bind(resolver = SeedData.TypeResolver.class) Page page) {
		return persistence.crud(Page.class).create(page);
	}

	@Handle(method = "GET", path = "/api/pages")
	public Stream<Page> read(@Bind("slug") String slug) {
		var pc = persistence.crud(Page.class);
		return pc.read(slug != null && !slug.isBlank() ? pc.filter("slug", slug) : pc.list());
	}

	@Handle(method = "GET", path = "/api/pages/(\\d+)")
	public Page read(long id) {
		var p = persistence.crud(Page.class).read(id);
		if (p == null)
			throw new NotFoundException("page " + id);
		return p;
	}

	@Handle(method = "PUT", path = "/api/pages/(\\d+)")
	public Page update(long id, @Bind(resolver = SeedData.TypeResolver.class) Page page) {
		var p = persistence.crud(Page.class).update(id, x -> Reflection.copy(page, x, y -> !Set.of("id").contains(y)));
		if (p == null)
			throw new NotFoundException("page " + id);
		return p;
	}

	@Handle(method = "DELETE", path = "/api/pages/(\\d+)")
	public Page delete(long id) {
		var p = persistence.crud(Page.class).delete(id);
		if (p == null)
			throw new NotFoundException("page " + id);
		return p;
	}
}
