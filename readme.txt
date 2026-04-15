=== Brizy Exit Redirect ===
Contributors: dustysmba
Tags: brizy, redirect, editor, dashboard, page builder
Requires at least: 5.0
Tested up to: 6.7
Requires PHP: 7.2
Stable tag: 1.0.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Redirects the Brizy editor "Go to Dashboard" button to the frontend permalink of the page being edited.

== Description ==

When using the Brizy page builder, clicking "Go to Dashboard" normally takes you back to the WordPress admin. This plugin changes that behavior so you are redirected to the frontend view of the page you were just editing instead.

This is useful when you want to quickly preview your changes without navigating through the admin.

= How it works =

* Detects when the Brizy editor is active via the `?brizy-edit` URL parameter
* Injects a small JavaScript file that watches for the "Go to Dashboard" link
* Overrides the link to point to the page's frontend permalink

= Requirements =

* WordPress 5.0+
* Brizy - Page Builder plugin

== Installation ==

1. Upload the `brizy-exit-redirect` folder to `/wp-content/plugins/`.
2. Activate the plugin through the "Plugins" menu in WordPress.
3. That's it — the redirect is automatic whenever you use the Brizy editor.

== Changelog ==

= 1.0.2 =
* Skip the redirect when editing Brizy templates (CPT `editor-template`), which have no frontend permalink.

= 1.0.0 =
* Initial release.
