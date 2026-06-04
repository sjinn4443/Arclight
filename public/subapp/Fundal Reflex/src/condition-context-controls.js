import { getTestConditionContext } from "./test-condition-context.js?v=20260308-182";

function createContextSwitch({ checked, context, disabled, label, title }) {
  const switchLabel = document.createElement("label");
  switchLabel.className =
    "advanced-switch advanced-toolbar-switch modifier-context-switch";
  switchLabel.title = title;

  const input = document.createElement("input");
  input.type = "checkbox";
  input.dataset.contextSwitch = context;
  input.checked = checked;
  input.disabled = disabled;

  const track = document.createElement("span");
  track.className = "advanced-switch-track";
  track.setAttribute("aria-hidden", "true");

  const text = document.createElement("span");
  text.className = "advanced-toolbar-switch-text modifier-context-switch-text";
  text.textContent = label;

  switchLabel.append(input, track, text);
  return switchLabel;
}

export function createConditionContextController({
  container,
  onChange,
  state,
}) {
  function applyDefaults(conditionValue) {
    const [onset = "Incidental", symptoms = "No symptoms"] =
      getTestConditionContext(conditionValue);
    state.contextOnsetMode = /^sudden$/i.test(onset) ? "sudden" : "gradual";
    state.contextGlareOn = /glare/i.test(symptoms);
  }

  function render() {
    if (!container) {
      return;
    }

    container.replaceChildren();

    const onsetSwitch = createContextSwitch({
      checked: state.contextOnsetMode === "sudden",
      context: "onset",
      disabled: state.isTestMode,
      label: state.contextOnsetMode === "sudden" ? "Sudden" : "Gradual",
      title: "Switch onset between gradual and sudden",
    });

    const glareSwitch = createContextSwitch({
      checked: state.contextGlareOn,
      context: "glare",
      disabled: state.isTestMode,
      label: state.contextGlareOn ? "Glare on" : "Glare",
      title: "Switch glare on or off",
    });

    container.append(onsetSwitch, glareSwitch);
  }

  function init() {
    if (!container) {
      return;
    }

    container.addEventListener("change", (event) => {
      const toggleInput =
        event.target instanceof Element
          ? event.target.closest("[data-context-switch]")
          : null;
      if (!toggleInput) {
        return;
      }

      const toggleKey = toggleInput.dataset.contextSwitch;
      if (toggleKey === "onset") {
        state.contextOnsetMode = toggleInput.checked ? "sudden" : "gradual";
      } else if (toggleKey === "glare") {
        state.contextGlareOn = toggleInput.checked;
      }

      render();
      onChange?.();
    });
  }

  return {
    applyDefaults,
    init,
    render,
  };
}
