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

export default class ReferenceListControl extends UpdatableHTMLElement {

	static get observedAttributes() {
		return ["data-key", "data-path"];
	}

	static get templateName() {
		return "reference-list-control";
	}

	constructor() {
		super();
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("change", this.handleChange);
		this.addEventListener("click", this.handleClick);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener("change", this.handleChange);
		this.removeEventListener("click", this.handleClick);
	}

	handleChange = event => {
		event.stopPropagation();
		event.target.closest("dialog").close();
		const s = this.state;
		s.field.data.push(s.documents.find(x => x.id == event.target.value));
		this.requestUpdate();
	}

	handleClick = async event => {
		const b = event.target.closest("button");
		if (!b)
			return;
		event.stopPropagation();
		const s = this.state;
		switch (b.name) {
			case "add":
				const cc = this.closest("admin-panel").state.schema["Collections"];
				const ds = Object.entries(cc).find(([_, v]) => v.elementTypes[0] === this.dataset.type)[0];
				s.documents = await (await fetch(`/api/${ds}`)).json();
				await this.updateDisplay();
				this.querySelector("dialog").showModal();
				break;
			case "close":
				b.closest("dialog").close();
				break;
			case "remove":
				const li = b.closest("li");
				const i = Array.prototype.indexOf.call(li.parentElement.children, li);
				s.field.data.splice(i, 1);
				await this.updateDisplay();
				break;
		}
	}

	async updateDisplay() {
		const p = this.dataset.path;
		const s = this.state;
		s.field = (() => {
			const af = this.closest("admin-panel");
			return af.field(p);
		})();
		this.appendChild(this.interpolateDom({
			$template: "",
			...this.dataset,
			name: p,
			items: s.field.data.map((x, i) => ({
				$template: "item",
				name: `${p}.${i}`,
				document: x
			})),
			documents: s.documents?.map(x => ({
				$template: "document",
				...x
			}))
		}));
	}
}
