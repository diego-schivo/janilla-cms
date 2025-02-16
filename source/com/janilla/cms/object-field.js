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

export default class ObjectField extends UpdatableHTMLElement {

	static get observedAttributes() {
		return ["data-key", "data-path"];
	}

	static get templateName() {
		return "object-field";
	}

	constructor() {
		super();
	}

	async updateDisplay() {
		const af = this.closest("admin-root");
		const p = this.dataset.path;
		const f = af.field(p);
		this.appendChild(this.interpolateDom({
			$template: "",
			...this.dataset,
			...f,
			items: (() => {
				const ff = Object.entries(f.properties).map(([k, v]) => ({
					$template: (() => {
						switch (v.type) {
							case "Boolean":
								return "checkbox";
							case "List":
								return "list";
							case "Long":
							case "String":
								return "text";
							default:
								return "object";
						}
					})(),
					label: k,
					path: p ? `${p}.${k}` : k,
					key: this.dataset.key
				}));
				const nn = ["hero", "layout"];
				const kk = Object.keys(f.properties);
				const ii = nn.map(x => kk.indexOf(x)).filter(x => x !== -1);
				const jj = ff.filter((_, i) => !ii.includes(i)).map(x => ({
					$template: "item",
					field: x
				}));
				if (ii.length)
					jj.splice(ii[0], 0, {
						$template: "item",
						field: {
							$template: "tabs",
							buttons: nn.map((x, i) => ({
								$template: "tabs-button",
								index: i,
								label: x
							})),
							panels: ff.filter((_, i) => ii.includes(i)).map((x, i) => ({
								$template: "tabs-panel",
								index: i,
								field: x
							}))
						}
					});
				return jj;
			})()
		}))
	}
}
