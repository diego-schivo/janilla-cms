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
import AdminPanel from "./admin-panel.js";
import Archive from "./archive.js";
import CallToAction from "./call-to-action.js";
import CheckboxField from "./checkbox-field.js";
import CollectionList from "./collection-list.js";
import Content from "./content.js";
import DashboardView from "./dashboard-view.js";
import FileField from "./file-field.js";
import Form from "./form.js";
import Hero from "./hero.js";
import ListField from "./list-field.js";
import Login from "./login.js";
import LucideIcon from "./lucide-icon.js";
import MediaBlock from "./media-block.js";
import ObjectField from "./object-field.js";
import Page from "./page.js";
import Post from "./post.js";
import PostList from "./post-list.js";
import ReferenceField from "./reference-field.js";
import ReferenceListField from "./reference-list-field.js";
import RelatedPosts from "./related-posts.js";
import Root from "./root.js";
import TabsField from "./tabs-field.js";
import TextField from "./text-field.js";

customElements.define("admin-panel", AdminPanel);
customElements.define("archive-component", Archive);
customElements.define("call-to-action", CallToAction);
customElements.define("checkbox-field", CheckboxField);
customElements.define("collection-list", CollectionList);
customElements.define("content-component", Content);
customElements.define("dashboard-view", DashboardView);
customElements.define("file-field", FileField);
customElements.define("form-component", Form);
customElements.define("hero-component", Hero);
customElements.define("list-field", ListField);
customElements.define("login-element", Login);
customElements.define("lucide-icon", LucideIcon);
customElements.define("media-block", MediaBlock);
customElements.define("object-field", ObjectField);
customElements.define("page-element", Page);
customElements.define("post-element", Post);
customElements.define("post-list", PostList);
customElements.define("reference-field", ReferenceField);
customElements.define("reference-list-field", ReferenceListField);
customElements.define("related-posts", RelatedPosts);
customElements.define("root-element", Root);
customElements.define("tabs-field", TabsField);
customElements.define("text-field", TextField);
