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

export default class AdminForm extends UpdatableHTMLElement {

	static get templateName() {
		return "admin-form";
	}

	constructor() {
		super();
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("submit", this.handleSubmit);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener("submit", this.handleSubmit);
	}

	handleSubmit = async event => {
		event.preventDefault();
		const p = this.dataset.path;
		const nn = p ? p.split(".") : [];
		const s = this.state;
		/*
		localStorage.setItem("data", JSON.stringify([...new FormData(event.target).entries()].reduce((data, [k, v]) => {
			const i = k.lastIndexOf(".");
			let f = this.field(k.substring(0, i), data);
			f.data[k.substring(i + 1)] = v;
			return data;
		}, s.data)));
		*/
		let r;
		switch (nn[0]) {
			case "collections":
				r = `/api/${nn[1]}/${nn[2]}`;
				break;
			case "globals":
				r = `/api/${nn[1]}`;
				break;
		}
		await (await fetch(r, {
			method: "PUT",
			headers: { "content-type": "application/json" },
			body: JSON.stringify([...new FormData(event.target).entries()].reduce((data, [k, v]) => {
				const i = k.lastIndexOf(".");
				let f = this.field(k.substring(0, i), data);
				f.data[k.substring(i + 1)] = v;
				return data;
			}, s.data))
		})).json();
	}

	async updateDisplay() {
		const s = this.state;
		s.schema = JSON.parse(document.getElementById("schema").text);
		const p = this.dataset.path;
		const nn = p ? p.split(".") : [];
		if (nn.length === 3 && nn[0] === "collections") {
			s.t0 = s.schema["Collections"][nn[1]].elementTypes[0];
			s.data = await (await fetch(`/api/${nn[1]}/${nn[2]}`)).json();
		} else if (nn.length === 2 && nn[0] === "globals") {
			s.t0 = s.schema["Globals"][nn[1]].type;
			s.data = await (await fetch(`/api/${nn[1]}`)).json();
		} else if (nn.length === 0) {
			s.t0 = Object.keys(s.schema)[0];
			s.data = JSON.parse(localStorage.getItem("data")) ?? {
				collections: {
					pages: []
				},
				globals: {
					header: { $type: "Header" }
				}
			};
		}
		this.appendChild(this.interpolateDom({
			$template: "",
			content: (() => {
				return nn.length === 0 ? { $template: "dashboard" } : {
					$template: nn.length === 2 && nn[0] === "collections" ? "collection" : "object"
				};
			})()
		}));
	}

	field(path, data) {
		const s = this.state;
		let f = {
			type: s.t0,
			properties: s.schema[s.t0],
			data: data ?? s.data
		};
		if (path)
			for (const n of path.split("."))
				if (f.type === "List") {
					const d = f.data[parseInt(n)] ??= {};
					const t = d.$type ?? f.elementTypes[0];
					f = {
						type: t,
						properties: s.schema[t],
						data: d
					};
				} else {
					const p = f.properties[n];
					f = {
						...p,
						properties: p.type !== "List" && p.type !== "String" ? s.schema[p.type] : null,
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
					};
				}
		return f;
	}
}
