<!-- THE CHANGES - productContext.md | 2026-06-12, Codex -->

# Product Context

## Why this project exists

The Arclight project is an interactive educational platform designed to support clinical learning in ophthalmology and related fields. It aims to address the need for accessible and effective medical education for healthcare professionals and students, providing a practical, interactive platform to enhance diagnostic skills and knowledge, especially in resource-limited settings where traditional training materials might be scarce. The platform features clinical quizzes, chat-style case studies, embedded learning tools, localized video subtitles, offline downloads, progress tracking, and a multilingual, user-friendly interface.

## Problems it solves

- Limited access to specialized medical training: provides a digital platform for learning that can be accessed anywhere.
- Lack of interactive learning tools: offers quizzes, case studies, and interactive modules to make learning engaging.
- Difficulty in visualizing medical conditions: utilizes a rich library of images and videos to demonstrate various conditions and procedures.
- Need for offline learning: the PWA capabilities ensure that much of the content is available even without internet connectivity, which is crucial for remote areas.
- Need for selective downloads: learners can choose full content, targeted content sections, or app-only/no-video content depending on bandwidth and storage.
- Need for multilingual media: app videos can expose localized subtitle tracks that follow the selected app language where subtitle coverage exists.

## How it should work

The application should function as a self-contained educational resource. Users should be able to:

- Navigate easily between different modules (for example Anterior Segment Quiz, Cataract, Mires, Morph, Fundal Reflex, Trauma, Amsler, and Diabetic Retinopathy workshop lessons).
- Interact with quizzes and receive immediate feedback.
- View high-quality images and videos related to medical conditions.
- Access core local content offline after initial loading, and download selected media/content sets for deeper offline use.
- See localized subtitles on supported app videos and Childhood Eye Screening video pages.
- See progress bars and completion ticks update consistently across lesson rows, Videos pages, workshops, case studies, and My Learning.
- Work through chat-style case studies that simulate history taking, diagnosis selection, timed attempts, and case completion.
- Follow guided Childhood Fundal Reflex scrollytelling lessons with staged animations, replay controls, caption text, and next-page navigation across the full examination sequence.
- Work through structured workshop pathways such as Childhood Eye Screening and Diabetic Retinopathy, with foldered lessons, progress rows, scroll pages, full-animation/video lessons, protocol pages, and demo quizzes.
- Move between the Diabetic Retinopathy workshop and Videos-route diabetic lessons/quizzes without losing lesson flow, folder restore state, or progress.

Some Interactive Learning tools can also be embedded from externally hosted sites when that is the fastest way to deliver a usable learning experience, while still keeping the same in-app navigation shell.

## User experience goals

- Intuitive and easy to use: the interface should be clean and straightforward, requiring minimal instruction.
- Engaging and interactive: content should keep users interested and actively participating in their learning.
- Reliable and performant: the application should load quickly and function smoothly, even with large media files.
- Educational and informative: content should be accurate, up-to-date, and clearly presented to maximize learning outcomes.
- Resilient in constrained environments: downloads should communicate size/progress/failures clearly, cached video should remain playable where browser constraints allow, and tablet/phone layouts should remain usable without overlapping controls.
