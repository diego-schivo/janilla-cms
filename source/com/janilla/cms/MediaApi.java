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
import com.janilla.web.Handle;
import com.janilla.web.NotFoundException;

public class MediaApi {

	public Persistence persistence;

	@Handle(method = "POST", path = "/api/media")
	public Media create(Media media) {
		return persistence.crud(Media.class).create(media);
	}

	@Handle(method = "GET", path = "/api/media")
	public Stream<Media> read() {
		var pc = persistence.crud(Media.class);
		return pc.read(pc.list());
	}

	@Handle(method = "GET", path = "/api/media/(\\d+)")
	public Media read(long id) {
		var p = persistence.crud(Media.class).read(id);
		if (p == null)
			throw new NotFoundException("media " + id);
		return p;
	}

	@Handle(method = "PUT", path = "/api/media/(\\d+)")
	public Media update(long id, Media media) {
		var p = persistence.crud(Media.class).update(id,
				x -> Reflection.copy(media, x, y -> !Set.of("id").contains(y)));
		if (p == null)
			throw new NotFoundException("media " + id);
		return p;
	}

	@Handle(method = "DELETE", path = "/api/media/(\\d+)")
	public Media delete(long id) {
		var p = persistence.crud(Media.class).delete(id);
		if (p == null)
			throw new NotFoundException("media " + id);
		return p;
	}
}
