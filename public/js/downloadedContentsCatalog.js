import { EAR_LESSONS, EAR_TOPICS } from "./earsContentData.js";
import {
  offlineAssetPath,
  summarizeOfflineContent,
} from "./offlineDownloadState.js";

const summarize = (urls, inventory) =>
  summarizeOfflineContent(urls, inventory, { anyVideoQuality: true });
const skinAsset = (url) =>
  /^\/subapp\/Allan\//i.test(offlineAssetPath(url)) ||
  /^\/(?:images\/learning|images\/pdf|videos|documents|scrolly|narration|subapp)\/skin(?:\/|$)/i.test(
    offlineAssetPath(url),
  );

function itemSummary(items) {
  return {
    items,
    completed: items.filter((item) => item.complete).length,
    total: items.length,
    started: items.some((item) => item.started),
  };
}

function earLessonUrls(lesson, assets) {
  if (lesson.type === "scroll")
    return lesson.sections.map((section) => section.image).filter(Boolean);
  if (lesson.type === "download") return [lesson.asset];
  if (lesson.type === "video")
    return Object.values(assets?.videos?.[lesson.asset] || {}).filter(
      (url) => typeof url === "string" && /\.mp4$/i.test(url),
    );
  if (lesson.type === "diagram") return assets?.decks?.[lesson.asset] || [];
  const document = assets?.documents?.[lesson.asset];
  if (!document) return [];
  return lesson.pages
    ? lesson.pages.map((page) => document.pages[page - 1]).filter(Boolean)
    : document.pages;
}

export function buildDownloadedContentsCatalog(
  app,
  urls,
  inventory,
  earAssets,
) {
  const available = new Set(urls.map(offlineAssetPath));
  const ears = urls.filter((url) => app.matchesOfflineCatalog(url, "ears"));
  const skin = urls.filter(skinAsset);
  const excluded = new Set([...ears, ...skin]);
  const eyes = urls.filter((url) => !excluded.has(url));
  const eyeSections = app.OFFLINE_CATALOG_GROUPS.filter(
    (group) => group.id !== "ears",
  )
    .flatMap((group) => group.sections)
    .map((id) => {
      const matching = eyes.filter((url) => app.matchesOfflineCatalog(url, id));
      return {
        id: `eyes/${id}`,
        label:
          app.OFFLINE_DOWNLOAD_OPTIONS.find((option) => option.id === id)
            ?.label || id,
        ...summarize(matching, inventory),
      };
    })
    .filter((section) => section.total);
  const assignedEyes = new Set(
    eyeSections.flatMap((section) => section.items.map((item) => item.key)),
  );
  const remainingEyes = summarize(eyes, inventory).items.filter(
    (item) => !assignedEyes.has(item.key),
  );
  if (remainingEyes.length)
    eyeSections.push({
      id: "eyes/other",
      label: "Other content",
      ...itemSummary(remainingEyes),
    });

  const assignedEars = new Set();
  const earSections = Object.entries(EAR_TOPICS)
    .map(([id, topic]) => {
      const items = topic.groups
        .flatMap((group) => group.lessons)
        .flatMap((lessonId) => {
          const lesson = EAR_LESSONS[lessonId];
          const required = earLessonUrls(lesson, earAssets).map(
            offlineAssetPath,
          );
          if (!required.some((url) => available.has(url))) return [];
          required.forEach((url) => assignedEars.add(url));
          const cached = required.filter((url) => inventory.has(url)).length;
          return [
            {
              key: lessonId,
              label: lesson.title,
              started: cached > 0,
              complete:
                lesson.type === "video"
                  ? cached > 0
                  : cached === required.length,
            },
          ];
        });
      return { id: `ears/${id}`, label: topic.title, ...itemSummary(items) };
    })
    .filter((section) => section.total);
  const remainingEars = ears.filter(
    (url) => !assignedEars.has(offlineAssetPath(url)),
  );
  if (remainingEars.length)
    earSections.push({
      id: "ears/other",
      label: "Ear learning materials",
      ...summarize(remainingEars, inventory),
    });
  const uniqueEarItems = [
    ...new Map(
      earSections
        .flatMap((section) => section.items)
        .map((item) => [item.key, item]),
    ).values(),
  ];
  const skinSummary = summarize(skin, inventory);
  const skinApps = skin.filter((url) =>
    /^\/subapp\//i.test(offlineAssetPath(url)),
  );
  const skinOther = skin.filter((url) => !skinApps.includes(url));
  return [
    {
      id: "eyes",
      label: "Eyes",
      ...summarize(eyes, inventory),
      children: eyeSections,
    },
    {
      id: "ears",
      label: "Ears",
      ...itemSummary(uniqueEarItems),
      children: earSections,
    },
    {
      id: "skin",
      label: "Skin",
      ...skinSummary,
      children: [
        ...(skinApps.length
          ? [
              {
                id: "skin/interactive-learning",
                label: "Interactive Learning",
                ...summarize(skinApps, inventory),
              },
            ]
          : []),
        ...(skinOther.length
          ? [
              {
                id: "skin/other",
                label: "Other content",
                ...summarize(skinOther, inventory),
              },
            ]
          : []),
      ],
    },
  ];
}
