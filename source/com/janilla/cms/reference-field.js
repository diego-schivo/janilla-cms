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

export default class ReferenceField extends UpdatableHTMLElement {

	static get observedAttributes() {
		return ["data-key", "data-path"];
	}

	static get templateName() {
		return "reference-field";
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
		s.field.data.id = parseInt(event.target.value);
		this.requestUpdate();
	}

	handleClick = async event => {
		if (!event.target.matches('[type="button"]'))
			return;
		event.stopPropagation();
		const s = this.state;
		s.media = await (await fetch("/api/media")).json();
		await this.updateDisplay();
		this.querySelector("dialog").showModal();
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
			label: p.substring(p.lastIndexOf(".") + 1),
			name: p,
			value: s.field.data,
			media: s.media?.map(x => ({
				$template: "media",
				...x
			}))
		}));
	}
}
