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
import CheckboxControl from "./checkbox-control.js";
import CollectionList from "./collection-list.js";
import Content from "./content.js";
import DashboardView from "./dashboard-view.js";
import FileControl from "./file-control.js";
import FormBlock from "./form-block.js";
import Hero from "./hero.js";
import ListControl from "./list-control.js";
import Login from "./login.js";
import LucideIcon from "./lucide-icon.js";
import MediaBlock from "./media-block.js";
import ObjectControl from "./object-control.js";
import Page from "./page.js";
import Post from "./post.js";
import Posts from "./posts.js";
import RadioGroupControl from "./radio-group-control.js";
import ReferenceControl from "./reference-control.js";
import ReferenceListControl from "./reference-list-control.js";
import RelatedPosts from "./related-posts.js";
import RichTextControl from "./rich-text-control.js";
import Root from "./root.js";
import Search from "./search.js";
import SelectControl from "./select-control.js";
import TabsField from "./tabs-field.js";
import TextareaControl from "./textarea-control.js";
import TextControl from "./text-control.js";

customElements.define("admin-panel", AdminPanel);
customElements.define("archive-component", Archive);
customElements.define("call-to-action", CallToAction);
customElements.define("checkbox-control", CheckboxControl);
customElements.define("collection-list", CollectionList);
customElements.define("content-component", Content);
customElements.define("dashboard-view", DashboardView);
customElements.define("file-control", FileControl);
customElements.define("form-block", FormBlock);
customElements.define("hero-component", Hero);
customElements.define("list-control", ListControl);
customElements.define("login-element", Login);
customElements.define("lucide-icon", LucideIcon);
customElements.define("media-block", MediaBlock);
customElements.define("object-control", ObjectControl);
customElements.define("page-element", Page);
customElements.define("post-element", Post);
customElements.define("posts-element", Posts);
customElements.define("radio-group-control", RadioGroupControl);
customElements.define("reference-control", ReferenceControl);
customElements.define("reference-list-control", ReferenceListControl);
customElements.define("related-posts", RelatedPosts);
customElements.define("rich-text-control", RichTextControl);
customElements.define("root-element", Root);
customElements.define("search-element", Search);
customElements.define("select-control", SelectControl);
customElements.define("tabs-field", TabsField);
customElements.define("textarea-control", TextareaControl);
customElements.define("text-control", TextControl);
