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
import AdminForm from "./admin-form.js";
import Archive from "./archive.js";
import CallToAction from "./call-to-action.js";
import CheckboxField from "./checkbox-field.js";
import CollectionList from "./collection-list.js";
import ContentComponent from "./content-component.js";
import DashboardView from "./dashboard-view.js";
import FormComponent from "./form-component.js";
import HeroComponent from "./hero-component.js";
import ListField from "./list-field.js";
import LucideIcon from "./lucide-icon.js";
import MediaComponent from "./media-component.js";
import ObjectField from "./object-field.js";
import PageElement from "./page-element.js";
import RootElement from "./root-element.js";
import TabsField from "./tabs-field.js";
import TextField from "./text-field.js";

customElements.define("admin-form", AdminForm);
customElements.define("archive-component", Archive);
customElements.define("call-to-action", CallToAction);
customElements.define("checkbox-field", CheckboxField);
customElements.define("collection-list", CollectionList);
customElements.define("content-component", ContentComponent);
customElements.define("dashboard-view", DashboardView);
customElements.define("form-component", FormComponent);
customElements.define("hero-component", HeroComponent);
customElements.define("list-field", ListField);
customElements.define("lucide-icon", LucideIcon);
customElements.define("media-component", MediaComponent);
customElements.define("object-field", ObjectField);
customElements.define("page-element", PageElement);
customElements.define("root-element", RootElement);
customElements.define("tabs-field", TabsField);
customElements.define("text-field", TextField);
