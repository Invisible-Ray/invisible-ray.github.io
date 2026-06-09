(function () {
  var form = document.getElementById("terminal-form");
  var input = document.getElementById("terminal-input");
  var output = document.getElementById("output");
  var screen = document.getElementById("screen");

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderResponse(command, payload) {
    var entry = document.createElement("div");
    entry.className = "entry";

    var inputLine = document.createElement("div");
    inputLine.className = "input-line";
    inputLine.textContent = "devin@profile:~$ " + command;
    entry.appendChild(inputLine);

    var response = document.createElement("div");
    response.className = "response" + (payload.className ? " " + payload.className : "");
    response.innerHTML = payload.html;
    entry.appendChild(response);

    output.appendChild(entry);
    screen.scrollTop = screen.scrollHeight;
  }

  function textPayload(text, className) {
    return {
      html: escapeHtml(text).replace(/\n/g, "<br>"),
      className: className || "",
    };
  }

  function cmdButton(label, command) {
    return '<button type="button" class="cmd cmd-button" data-run-command="' + escapeHtml(command) + '">[' + escapeHtml(label) + ']</button>';
  }

  function downloadResume() {
    var link = document.createElement("a");
    link.href = "cv.pdf";
    link.download = "Devin_Gill_Resume.pdf";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function helpPayload() {
    return {
      html:
        "Available commands:<br>" +
        cmdButton("who", "who") + " or " + cmdButton("w", "w") + "<br>" +
        cmdButton("skills", "skills") + " or " + cmdButton("s", "s") + "<br>" +
        cmdButton("projects", "projects") + " or " + cmdButton("pj", "pj") + "<br>" +
        cmdButton("shoegaze", "shoegaze") + " or " + cmdButton("shoe", "shoegaze") + "<br>" +
        cmdButton("resume", "resume") + " or " + cmdButton("cv", "cv") + "<br>" +
        cmdButton("email", "email") + " " + cmdButton("linkedin", "linkedin") + " " + cmdButton("github", "github") + "<br>" +
        cmdButton("clear", "clear") + " or " + cmdButton("c", "c"),
      className: "",
    };
  }

  var commands = {
    help: function () {
      return helpPayload();
    },
    who: function () {
      return textPayload(
        "Devin Gill\nQA Automation Engineer focused on Playwright + Python.\nBuilding reliable test systems and clean developer tooling.",
        "dim"
      );
    },
    w: function () {
      return commands.who();
    },
    skills: function () {
      return textPayload(
        "Playwright\nPython\nSelenium\npytest\nAPI Testing\nGitHub Actions\nSQL",
        "dim"
      );
    },
    s: function () {
      return commands.skills();
    },
    projects: function () {
      return textPayload(
        "- QA Automation Suite (Playwright + Python)\n- Cox Elite Gamer (Product leadership + launch)\n- VS Code snippets and workflow tooling",
        "dim"
      );
    },
    pj: function () {
      return commands.projects();
    },
    shoegaze: function () {
      return {
        html: "Also: bassist for local shoegaze band, <a href=\"https://linktr.ee/alwaysother\" target=\"_blank\" rel=\"noopener\">always other</a>.",
        className: "dim",
      };
    },
    shoe: function () {
      return commands.shoegaze();
    },
    resume: function () {
      downloadResume();
      return textPayload("Downloading resume PDF...", "dim");
    },
    cv: function () {
      return commands.resume();
    },
    email: function () {
      return {
        html: "<a href=\"mailto:devin.gill@outlook.com\">devin.gill@outlook.com</a>",
        className: "dim",
      };
    },
    linkedin: function () {
      return {
        html: "<a href=\"https://www.linkedin.com/in/devingill/\" target=\"_blank\" rel=\"noopener\">linkedin.com/in/devingill</a>",
        className: "dim",
      };
    },
    github: function () {
      return {
        html: "<a href=\"https://github.com/invisible-ray\" target=\"_blank\" rel=\"noopener\">github.com/invisible-ray</a>",
        className: "dim",
      };
    },
    clear: function () {
      output.innerHTML = "";
      return null;
    },
    c: function () {
      return commands.clear();
    },
  };

  function runCommand(raw) {
    var command = raw.trim().toLowerCase();
    if (!command) {
      return;
    }

    var action = commands[command];
    if (!action) {
      renderResponse(command, textPayload("Unknown command. Type 'help'.", "error"));
      return;
    }

    var result = action();
    if (result) {
      renderResponse(command, result);
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    runCommand(input.value);
    input.value = "";
  });

  document.addEventListener("click", function (event) {
    var target = event.target.closest(".cmd");
    if (!target) {
      return;
    }

    var command = (target.getAttribute("data-run-command") || "").trim().toLowerCase();
    if (!command) {
      command = target.textContent
        .trim()
        .toLowerCase()
        .replace(/^[\[]|[\]]$/g, "")
        .replace(/[^a-z0-9_-]/g, "");
    }

    if (!command) {
      return;
    }

    input.value = command;
    runCommand(command);
    input.value = "";
    input.focus();
  });

  renderResponse("help", commands.help());
  input.focus();
})();
