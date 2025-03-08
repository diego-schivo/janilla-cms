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

export default class RadioGroupControl extends UpdatableHTMLElement {

	static get observedAttributes() {
		return ["data-key", "data-path"];
	}

	static get templateName() {
		return "radio-group-control";
	}

	constructor() {
		super();
	}

	async updateDisplay() {
		const ap = this.closest("admin-panel");
		const p = this.dataset.path;
		const f = ap.field(p);
		this.appendChild(this.interpolateDom({
			$template: "",
			options: ap.options(f).map(x => ({
				$template: "option",
				name: p,
				value: x,
				checked: x == f.data,
				text: x
			}))
		}));
	}
}
