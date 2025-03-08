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
import { UpdatableHTMLElement } from "./updatable-html-element.js";

export default class AdminPanel extends UpdatableHTMLElement {

	static get observedAttributes() {
		return ["data-path"];
	}

	static get templateName() {
		return "admin-panel";
	}

	constructor() {
		super();
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("click", this.handleClick);
		this.addEventListener("submit", this.handleSubmit);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener("click", this.handleClick);
		this.removeEventListener("submit", this.handleSubmit);
	}

	handleClick = async event => {
		const b = event.target.closest("button");
		if (!b)
			return;
		event.stopPropagation();
		switch (b.name) {
			case "open-menu":
				this.querySelector("dialog").showModal();
				break;
			case "close-menu":
				this.querySelector("dialog").close();
				break;
			case "logout":
				await fetch("/api/users/logout", { method: "POST" });
				//b.closest("dialog").close();
				location.href = "/admin";
				break;
		}
	}

	handleSubmit = async event => {
		event.preventDefault();
		const p = this.dataset.path;
		const nn = p ? p.split(".") : [];
		const s = this.state;
		let r;
		switch (nn[0]) {
			case "collections":
				r = `/api/${nn[1]}/${nn[2]}`;
				break;
			case "globals":
				r = `/api/${nn[1]}`;
				break;
		}
		const ee = [...new FormData(event.target).entries()];
		for (const [k, v] of ee.filter(([_, x]) => x instanceof File)) {
			const fd = new FormData();
			fd.append(k, v);
			const xhr = new XMLHttpRequest();
			xhr.open("POST", "/api/upload", true);
			xhr.send(fd);
		}
		for (const [k, v] of ee) {
			const i = k.lastIndexOf(".");
			let f = this.field(k.substring(0, i));
			f.data[k.substring(i + 1)] = v instanceof File ? { name: v.name } : v;
		}
		s.data = await (await fetch(r, {
			method: "PUT",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(s.data)
		})).json();
	}

	async updateDisplay() {
		const s = this.state;
		s.me = await (await fetch("/api/users/me")).json();
		let p = this.dataset.path;
		if (p === "account")
			p = `collections.users.${s.me.id}`;
		const nn = p ? p.split(".") : [];
		if (!s.me) {
			if (p !== "login") {
				location.href = "/admin/login";
				return;
			}
		} else {
			if (p === "login") {
				location.href = "/admin";
				return;
			}
			s.schema = await (await fetch("/api/schema")).json();
			if (nn.length === 3 && nn[0] === "collections") {
				s.t0 = s.schema["Collections"][nn[1]].elementTypes[0];
				s.data = await (await fetch(`/api/${nn[1]}/${nn[2]}`)).json();
			} else if (nn.length === 2 && nn[0] === "globals") {
				s.t0 = s.schema["Globals"][nn[1]].type;
				s.data = await (await fetch(`/api/${nn[1]}`)).json();
			}/* else if (nn.length === 0) {
				s.t0 = Object.keys(s.schema)[0];
				s.data = JSON.parse(localStorage.getItem("data")) ?? {
					collections: {
						pages: []
					},
					globals: {
						header: { $type: "Header" }
					}
				};
			}*/
		}
		this.appendChild(this.interpolateDom({
			$template: "",
			header: s.me ? {
				$template: "header",
				items: (() => {
					const xx = [];
					xx.push({
						href: "/admin",
						icon: "house"
					});
					switch (nn[0]) {
						case "collections":
							xx.push({
								href: `/admin/collections/${nn[1]}`,
								text: nn[1]
							});
							if (nn[2])
								xx.push({
									href: `/admin/collections/${nn[1]}/${nn[2]}`,
									text: this.title(s.data) ?? s.data.id
								});
							break;
						case "globals":
							xx.push({
								href: `/admin/globals/${nn[1]}`,
								text: nn[1]
							});
							break;
					}
					delete xx[xx.length - 1].href;
					return xx;
				})().map(x => ({
					$template: x.href ? "link-item" : "item",
					...x,
					content: x.icon ? {
						$template: "icon",
						name: x.icon
					} : x.text
				}))
			} : null,
			content: (() => {
				switch (nn[0]) {
					case "login":
						return { $template: "login" };
					case "collections":
						return nn.length === 2 ? {
							$template: "collection",
							name: nn[1]
						} : {
							$template: "object",
							preview: (() => {
								const h = this.preview(s.data);
								return h ? {
									$template: "preview",
									href: h
								} : null;
							})()
						};
					case "globals":
						return { $template: "object" };
					default:
						return { $template: "dashboard" };
				}
			})(),
			dialog: s.me ? {
				$template: "dialog",
				groups: Object.entries(s.schema["Data"]).map(([k, v]) => ({
					$template: "group",
					name: k,
					checked: true,
					links: Object.keys(s.schema[v.type]).map(x => ({
						$template: "link",
						href: `/admin/${k}/${x}`,
						name: x
					}))
				}))
			} : null
		}));
	}

	field(path, parent) {
		const s = this.state;
		let f = parent ?? {
			type: s.t0,
			properties: s.schema[s.t0],
			data: s.data
		};
		if (path)
			for (const n of path.split("."))
				if (f.type === "List") {
					const i = parseInt(n);
					const d = f.data[i] ??= {};
					const t = d.$type ?? f.elementTypes[0];
					f = {
						parent: f,
						index: i,
						type: t,
						properties: s.schema[t],
						data: d
					};
				} else {
					const p = f.properties[n];
					f = {
						parent: f,
						name: n,
						...p,
						properties: p.type !== "List" && p.type !== "String" ? s.schema[p.type] : null,
						/*
						data: f.data[n] ??= (() => {
							switch (p.type) {
								case "Boolean":
									return false;
								case "List":
									return [];
								case "String":
									return "";
								default:
									return {};
							}
						})()
						*/
						data: f.data[n]
					};
				}
		return f;
	}

	label(path) {
		switch (path) {
			case "hero":
			case "hero.richText":
				return null;
			default:
				return path.split(".").at(-1).split(/(?=[A-Z])/).map(x => x.toLowerCase()).join(" ");
		}
	}

	title(entity) {
		switch (entity.$type) {
			case "Media":
				return entity.file?.name;
			case "User":
				return entity.name;
			default:
				return entity.title;
		}
	}

	headers(entitySlug) {
		switch (entitySlug) {
			case "media":
				return ["file", "alt"];
			case "users":
				return ["name", "email"];
			default:
				return ["title", "slug"];
		}
	}

	controlTemplate(field) {
		switch (field.type) {
			case "Boolean":
				return "checkbox-control";
			case "File":
				return "file-control";
			case "Instant":
			case "Integer":
				return "text-control";
			case "String":
				switch (field.name) {
					case "confirmationMessage":
					case "message":
					case "richText":
						return "rich-text-control";
					case "type":
					case "appearance":
						return "select-control";
					default:
						return field.options ? "radio-group-control" : "text-control";
				}
			case "List":
				return field.referenceType ? "reference-list-control" : "list-control";
			case "Long":
				return field.referenceType ? "reference-control" : "text-control";
			default:
				return "object-control";
		}
	}

	options(field) {
		switch (field.name) {
			case "type":
				return ["none", "highImpact", "mediumImpact", "lowImpact"];
			case "appearance":
				return ["default", "outline"];
		}
		return field.options ?? [];
	}

	tabs(type) {
		switch (type) {
			case "Page":
				return {
					hero: ["hero"],
					content: ["layout"]
				};
			case "Post":
				return {
					content: ["heroImage", "content"],
					meta: ["relatedPosts", "categories"],
					seo: ["meta"]
				};
			default:
				return null;
		}
	}

	preview(entity) {
		switch (entity.$type) {
			case "Page":
				return `/${entity.slug}`;
			case "Post":
				return `/posts/${entity.slug}`;
			default:
				return null;
		}
	}
}
