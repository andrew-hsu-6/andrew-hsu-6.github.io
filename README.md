# andrewhsu.me

A single-page personal website written in plain HTML and CSS, inspired by [Jae's COMS 3157 course website](https://cs3157.github.io/www/2026-9/).

## Editing

- `public/index.html` contains all content and section navigation.
- `public/styles.css` contains all styling.
- `public/` also holds the images, favicon files, and custom domain configuration.
- `public/about/`, `public/projects/`, and `public/contact/` redirect old URLs to their sections.

There are no JavaScript dependencies, package installs, or build steps. You can open `public/index.html` directly in a browser.

## Local preview

From the repository root, use Python's built-in static file server:

```shell
python3 -m http.server 4321 --bind 127.0.0.1 --directory public
```

Open <http://127.0.0.1:4321/>. Refresh after editing a file. Stop the server with Ctrl+C.

## Deployment

GitHub Actions uploads `public/` directly to GitHub Pages on pushes to `main` or `master`. The workflow can also be run manually. Only files in `public/` are published; no build tool or Jekyll processing is needed. The domain is configured in `public/CNAME`.

## License

This work is published under the [MIT License](LICENSE).
