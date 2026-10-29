# Local-only lesson previews

`videos/pupilsAdvancedScrollPage` is temporarily a local preview. Its dedicated
module, scrolly artwork, narration, authoring tools and lesson-specific tests are
ignored by Git and kept on the local machine. Pupils Advanced PDF remains public.

Run the normal development server at `localhost` or `127.0.0.1` to open the lesson.
The ignored HTML fragments in `public/local-only/` are inserted only for loopback
development requests. Built distributions and production mode omit the lesson and
reject its asset URLs, even if local source files exist. Its old hash link returns
to the Pupils list. Offline manifests and the worker exclude its dedicated files.

The shared engine loads the ignored configuration dynamically, so a fresh clone
builds without local lesson files. To publish it again, deliberately restore Git
tracking for the ignored files and revise the delivery policy; adding a page link
alone does not enable publication. Existing deployed versions change only after
these tracked policy changes are committed and deployed.
