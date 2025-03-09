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

import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.janilla.web.Bind;
import com.janilla.web.Handle;

@Handle(path = "/api/posts")
public class PostApi extends CollectionApi<Post> {

	public PostApi() {
		super(Post.class);
	}

//	protected static final Pattern HTML_TAG = Pattern.compile("<.+?>");
//
//	@Handle(method = "GET")
//	public Stream<Post> read(@Bind("slug") String slug, @Bind("query") String query) {
//		var pp = crud().read(slug != null && !slug.isBlank() ? crud().filter("slug", slug) : crud().list());
//		return query != null && !query.isBlank() ? pp.filter(x -> {
//			var s = Stream.of(x.title(), x.content() != null ? HTML_TAG.matcher(x.content()).replaceAll(" ") : null)
//					.filter(y -> y != null && !y.isBlank()).collect(Collectors.joining(" "));
//			return s.contains(query);
//		}) : pp;
//	}

	@Handle(method = "GET")
	public Stream<Post> read(@Bind("slug") String slug, @Bind("query") String query) {
		var pp = crud().read(slug != null && !slug.isBlank() ? crud().filter("slug", slug) : crud().list());
		return query != null && !query.isBlank() ? pp.filter(x -> {
			var m = x.meta();
			var s = Stream.of(m != null ? m.title() : null, m != null ? m.description() : null)
					.filter(y -> y != null && !y.isBlank()).collect(Collectors.joining(" "));
			return s.contains(query);
		}) : pp;
	}
}
