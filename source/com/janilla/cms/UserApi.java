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

import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.stream.Stream;

import com.janilla.json.Jwt;
import com.janilla.persistence.Persistence;
import com.janilla.reflect.Reflection;
import com.janilla.web.Handle;
import com.janilla.web.NotFoundException;

public class UserApi {

	public Properties configuration;

	public Persistence persistence;

	@Handle(method = "POST", path = "/api/users")
	public User create(User user) {
		return persistence.crud(User.class).create(user);
	}

	@Handle(method = "GET", path = "/api/users")
	public Stream<User> read() {
		var pc = persistence.crud(User.class);
		return pc.read(pc.list());
	}

	@Handle(method = "GET", path = "/api/users/(\\d+)")
	public User read(long id) {
		var p = persistence.crud(User.class).read(id);
		if (p == null)
			throw new NotFoundException("user " + id);
		return p;
	}

	@Handle(method = "PUT", path = "/api/users/(\\d+)")
	public User update(long id, User user) {
		var p = persistence.crud(User.class).update(id, x -> Reflection.copy(user, x, y -> !Set.of("id").contains(y)));
		if (p == null)
			throw new NotFoundException("user " + id);
		return p;
	}

	@Handle(method = "DELETE", path = "/api/users/(\\d+)")
	public User delete(long id) {
		var p = persistence.crud(User.class).delete(id);
		if (p == null)
			throw new NotFoundException("user " + id);
		return p;
	}

	@Handle(method = "POST", path = "/api/users/login")
	public User login(User user, CustomHttpExchange exchange) {
		var uc = persistence.crud(User.class);
		var u = uc.read(uc.find("email", user.email()));
		if (u == null || !u.password().equals(user.password()))
			return null;
		var h = Map.of("alg", "HS256", "typ", "JWT");
		var p = Map.of("loggedInAs", u.email());
		var t = Jwt.generateToken(h, p, configuration.getProperty("janilla-cms.jwt.key"));
		exchange.setSessionCookie(t);
		return u;
	}

	@Handle(method = "POST", path = "/api/users/logout")
	public void logout(User user, CustomHttpExchange exchange) {
		exchange.setSessionCookie(null);
	}

	@Handle(method = "GET", path = "/api/users/me")
	public User me(CustomHttpExchange exchange) {
		return exchange.sessionUser();
	}
}
