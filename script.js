  let questionsUsed = 0;
let mode = "normal";

// 💬 Add message
function addMessage(text, type) {
  let chatBox = document.getElementById("chat-box");
  let msg = document.createElement("div");
  msg.classList.add("message", type);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ✨ Typing effect
function typeMessage(text) {
  let chatBox = document.getElementById("chat-box");
  let botMsg = document.createElement("div");

  botMsg.classList.add("message", "bot");
  botMsg.style.whiteSpace = "pre-wrap";

  chatBox.appendChild(botMsg);

  let i = 0;
  function typing() {
    if (i < text.length) {
      botMsg.innerText += text[i];
      i++;
      setTimeout(typing, 10);
    }
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  typing();
}

// 🔥 SEARCH IN data.js
function searchData(input) {
  input = input.toLowerCase().trim();

  for (let item of data) {
    for (let keyword of item.keywords) {
      if (
        input.includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(input)
      ) {
        return item.answer;
      }
    }
  }
  return null;
}

// 👑 KING SEARCH
function searchKing(input) {
  input = input.toLowerCase().trim();

  for (let key in kingData) {
    if (input.includes(key)) {
      let k = kingData[key];
      return `👑 ${k.name}
📅 Rise: ${k.rise}
📉 Fall: ${k.fall}

📖 ${k.details}`;
    }
  }
  return null;
}

// 🕰️ TIMELINE SEARCH
function searchTimeline(input) {
  input = input.toLowerCase().trim();

  for (let key in timelineData) {
    if (input.includes(key)) {
      let events = timelineData[key];
      return `🕰️ ${key}:\n\n- ` + events.join("\n- ");
    }
  }
  return null;
}

// 🎮 TEST MODE
let testActive = false;
let testScore = 0;
let currentQuestion = "";

function startTest() {
  testActive = true;
  testScore = 0;
  askTestQuestion();
}

function askTestQuestion() {
  let topics = Object.keys(questionBank);
  let topic = topics[Math.floor(Math.random() * topics.length)];
  let questions = questionBank[topic];

  currentQuestion = questions[Math.floor(Math.random() * questions.length)];
  typeMessage("🧠 Question: " + currentQuestion);
}

function checkTestAnswer(userAnswer) {
  if (userAnswer.length > 5) {
    testScore++;
    typeMessage("✅ Good answer! Score: " + testScore);
  } else {
    typeMessage("❌ Too short! Score: " + testScore);
  }

  setTimeout(askTestQuestion, 1500);
}

// 🔥 MATH SOLVER
function solveMathOrAlgebra(input) {
  let q = input.replace(/\s/g, "");

  if (q.includes("=")) {
    let [left, right] = q.split("=");
    let f = new Function("x", `return ${left} - (${right})`);

    for (let x = -100; x <= 100; x++) {
      try {
        if (Math.abs(f(x)) < 0.001) return "x = " + x;
      } catch {}
    }
  }

  if (q.includes("x")) {
    let expr = q
      .replace(/(\d)x/g, "$1*1")
      .replace(/x/g, "1")
      .replace(/(\d)\(/g, "$1*(");

    try {
      return eval(expr) + "x";
    } catch {}
  }

  try {
    return eval(q).toString();
  } catch {}

  return null;
}

// 📘 QUESTION BANK
let questionBank = {
  light: ["What is reflection of light?", "Define refraction"],
  force: ["What is force?", "Define friction"],
  motion: ["What is motion?", "Define speed"],
  algebra: ["Solve: 2x + 3 = 7"],
};

// 🧠 MAIN FUNCTION
function getAnswer() {
  let q = document.getElementById("question").value;

  addMessage(q, "user");

  // 🎮 TEST MODE
  if (testActive) {
    checkTestAnswer(q);
    return;
  }

  // 📊 CHECK MODE
  if (mode === "check") {
    let score = Math.floor(Math.random() * 5) + 5;
    typeMessage("Score: " + score + "/10");
    return;
  }

  // 📘 EXAM MODE
  if (mode === "exam") {
    let chapter = prompt("Enter chapter:");
    generateQuestions(chapter.toLowerCase().trim());
    return;
  }

  // 👑 KING SEARCH
  let king = searchKing(q);
  if (king) {
    typeMessage(king);
    return;
  }

  // 🕰️ TIMELINE SEARCH
  let timeline = searchTimeline(q);
  if (timeline) {
    typeMessage(timeline);
    return;
  }

  // 📚 DATA.JS SEARCH (MAIN FIX)
  let dataResult = searchData(q);
  if (dataResult) {
    typeMessage(dataResult);
    return;
  }

  // 🔢 MATH
  let result = solveMathOrAlgebra(q);
  if (result) {
    typeMessage("Answer: " + result);
    return;
  }

  typeMessage("❌ Not found.");
}

// 📘 GENERATE QUESTIONS
function generateQuestions(chapter) {
  let questions = questionBank[chapter];

  if (!questions) {
    typeMessage("❌ Chapter not found");
    return;
  }

  let output = "📘 Questions:\n\n";
  questions.forEach((q, i) => {
    output += (i + 1) + ". " + q + "\n";
  });

  typeMessage(output);
}