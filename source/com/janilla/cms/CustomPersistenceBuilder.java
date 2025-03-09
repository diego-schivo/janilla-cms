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

import java.nio.file.Files;
import java.nio.file.Path;

import com.janilla.persistence.ApplicationPersistenceBuilder;
import com.janilla.persistence.Persistence;
import com.janilla.reflect.Factory;

public class CustomPersistenceBuilder extends ApplicationPersistenceBuilder {

	public CustomPersistenceBuilder(Path databaseFile, Factory factory) {
		super(databaseFile, factory);
	}

	@Override
	public Persistence build() {
		var fe = Files.exists(databaseFile);
		var p = super.build();
		if (!fe) {
			var sd = SeedData.INSTANCE;
			for (var x : sd.pages())
				p.crud(Page.class).create(x);
			for (var x : sd.posts())
				p.crud(Post.class).create(x);
			for (var x : sd.media())
				p.crud(Media.class).create(x);
			for (var x : sd.categories())
				p.crud(Category.class).create(x);
			for (var x : sd.users())
				p.crud(User.class).create(x);
			for (var x : sd.redirects())
				p.crud(Redirect.class).create(x);
			for (var x : sd.forms())
				p.crud(Form.class).create(x);
			for (var x : sd.formSubmissions())
				p.crud(FormSubmission.class).create(x);
			p.crud(Header.class).create(sd.header());
			p.crud(Footer.class).create(sd.footer());
		}
		return p;
	}
}
