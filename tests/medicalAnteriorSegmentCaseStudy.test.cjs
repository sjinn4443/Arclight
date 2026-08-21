describe("Medical Students anterior segment case study", () => {
  let initializeMedicalAnteriorSegmentCaseStudy;
  let cases;
  let scrollIntoView;
  let scrollTo;

  beforeAll(async () => {
    ({
      MEDICAL_ANTERIOR_CASES: cases,
      initializeMedicalAnteriorSegmentCaseStudy,
    } = await import("../public/js/medicalAnteriorSegmentCaseStudy.js"));
  });

  beforeEach(() => {
    scrollIntoView = jest.fn();
    scrollTo = jest.fn();
    globalThis.window.scrollTo = scrollTo;
    globalThis.window.requestAnimationFrame = (callback) => {
      callback();
      return 1;
    };
    Object.defineProperty(globalThis.Element.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });
    globalThis.document.body.innerHTML = `
      <div id="medicalAnteriorSegmentPage">
        <div id="medicalAnteriorCaseChatLog" class="casechat-log"></div>
        <button data-medical-answer-section="signs" type="button">Signs</button>
        <button data-medical-answer-section="diagnosis" type="button">Diagnosis</button>
        <button data-medical-answer-section="action" type="button">Action</button>
        <button id="medicalAnteriorAnswerBtn" type="button">See all</button>
      </div>
    `;
  });

  test("defines all 12 cases in numerical order", () => {
    expect(cases).toHaveLength(12);
    expect(cases.map(({ id }) => id)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
    expect(cases[0].patient).toEqual([
      "6 month old baby",
      "Mum says right eye ‘looks funny’",
    ]);
    expect(cases[2].patient).toEqual([
      "2 week old baby",
      "Mum says eye sticky and red",
      "First one eye, now both",
    ]);
    expect(cases[7]).toMatchObject({
      signs: ["Pink fleshy lesion", "Extends from conjunctiva to cornea"],
      diagnosis: ["Pterygium"],
      action: ["Lubricants"],
    });
    expect(cases[11]).toMatchObject({
      patient: [
        "12 year old boy",
        "Loss of Vision",
        "Pain",
        "",
        "Playing with friends: ‘sticks and stones’",
      ],
      signs: ["White Pupil", "Corneal line"],
      diagnosis: [
        "Penetrating injury",
        "Corneal Laceration",
        "Traumatic Cataract",
      ],
      action: ["Analgesia, shield, refer"],
    });
  });

  test("shows each patient line in its own bot bubble", () => {
    initializeMedicalAnteriorSegmentCaseStudy();

    const page = globalThis.document.getElementById(
      "medicalAnteriorSegmentPage",
    );
    const log = globalThis.document.getElementById(
      "medicalAnteriorCaseChatLog",
    );
    expect(page.dataset.currentCase).toBe("1");
    const prompt = log.querySelector(".casechat-learning-prompt");
    expect(
      Array.from(
        prompt.querySelectorAll(".medical-anterior-prompt-line"),
        ({ textContent }) => textContent,
      ),
    ).toEqual([
      "SIGNS: Look for signs",
      "DIAGNOSIS: Make a differential diagnosis",
      "ACTION: Decide on an action plan",
    ]);
    expect(
      Array.from(prompt.querySelectorAll("strong"), ({ textContent }) =>
        textContent.trim(),
      ),
    ).toEqual(["signs", "diagnosis", "action"]);
    expect(log.querySelector(".casechat-img")?.getAttribute("src")).toBe(
      "/images/casestudy/case1_eye.webp",
    );
    expect(log.querySelector(".casechat-imgwrap")?.classList).toContain(
      "is-revealed",
    );
    expect(
      Array.from(
        log.querySelectorAll(".casechat-bubble--bot .casechat-text"),
        ({ textContent }) => textContent.trim(),
      ),
    ).toEqual(["6 month old baby", "Mum says right eye ‘looks funny’"]);
  });

  test("reveals individual answer sections with their matching buttons", () => {
    initializeMedicalAnteriorSegmentCaseStudy();

    const log = globalThis.document.getElementById(
      "medicalAnteriorCaseChatLog",
    );
    const answerButton = globalThis.document.getElementById(
      "medicalAnteriorAnswerBtn",
    );
    const signsButton = globalThis.document.querySelector(
      '[data-medical-answer-section="signs"]',
    );

    signsButton.click();

    const signsAnswer = log.querySelector(".casechat-bubble--user");
    expect(signsAnswer.querySelector("strong")?.textContent).toBe("Sign");
    expect(signsAnswer.textContent).toContain("White Pupil");
    expect(signsAnswer.textContent).not.toContain("Cataract");
    expect(signsButton.disabled).toBe(true);
    expect(signsButton.getAttribute("aria-pressed")).toBe("true");
    expect(answerButton.textContent).toBe("See all");
    expect(scrollIntoView).toHaveBeenLastCalledWith({
      block: "end",
      behavior: "smooth",
    });
  });

  test("See all reveals the structured answer before advancing", () => {
    initializeMedicalAnteriorSegmentCaseStudy();

    const page = globalThis.document.getElementById(
      "medicalAnteriorSegmentPage",
    );
    const log = globalThis.document.getElementById(
      "medicalAnteriorCaseChatLog",
    );
    const button = globalThis.document.getElementById(
      "medicalAnteriorAnswerBtn",
    );

    expect(button.textContent).toBe("See all");
    expect(button.getAttribute("aria-label")).toBe(
      "Show all answers for case 1",
    );

    button.click();

    const answer = log.querySelector(".casechat-bubble--user");
    expect(
      Array.from(answer.querySelectorAll("strong"), ({ textContent }) =>
        textContent.trim(),
      ),
    ).toEqual(["Sign", "Diagnosis", "Action"]);
    expect(answer.textContent).toContain("White Pupil");
    expect(answer.textContent).toContain("Cataract");
    expect(answer.textContent).toContain("Refer Investigations and Surgery");
    expect(button.textContent).toBe("Next case >");

    button.click();

    expect(page.dataset.currentCase).toBe("2");
    expect(log.querySelector(".casechat-img")?.getAttribute("src")).toBe(
      "/images/casestudy/case2_eye.webp",
    );
    expect(button.textContent).toBe("See all");
    expect(log.querySelector(".casechat-bubble--user")).toBeNull();
    expect(scrollTo).toHaveBeenLastCalledWith({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });
});
