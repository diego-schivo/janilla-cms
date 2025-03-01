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

export default class CollectionList extends UpdatableHTMLElement {

	static get templateName() {
		return "collection-list";
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
		event.stopPropagation();
		const af = this.closest("admin-panel");
		const p = af.dataset.path;
		const nn = p.split(".");
		const e = await (await fetch(`/api/${nn[1]}`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({})
		})).json();
		location.href = `/admin/${nn.join("/")}/${e.id}`;
	}

	async updateDisplay() {
		const ap = this.closest("admin-panel");
		const p = ap.dataset.path;
		const nn = p.split(".");
		const d = await (await fetch(`/api/${nn[1]}`)).json();
		const hh = ap.headers(nn[1]);
		this.appendChild(this.interpolateDom({
			$template: "",
			label: nn[1],
			headers: hh.map(x => ({
				$template: "header",
				text: x
			})),
			rows: d.map(x => ({
				$template: "row",
				cells: (() => {
					const cc = hh.map(y => ({ text: x[y] }));
					cc[0].href = `/admin/${p.replaceAll(".", "/")}/${x.id}`;
					return cc;
				})().map(y => ({
					$template: y.href ? "link-cell" : "cell",
					...y
				}))
			}))
		}));
	}
}
