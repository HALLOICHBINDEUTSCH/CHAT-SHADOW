  // 🔐 LOGIN SYSTEM
  let users = {
    "freeuser": { password: "Shadow123", type: "free", limit: 20 },
    "prouser": { password: "Adult123", type: "pro", limit: Infinity }
  };

  let currentUser = null;
  let questionsUsed = 0;
  let mode = "normal";

  // 🔐 LOGIN FUNCTION
  function login() {
    let username = prompt("Enter Username:");
    let password = prompt("Enter Password:");

    username = username ? username.trim().toLowerCase() : "";
    password = password ? password.trim() : "";

    if (users[username] && users[username].password === password) {
      currentUser = users[username];
      alert("✅ Login successful (" + currentUser.type + " account)");
    } else {
      alert("❌ Wrong username or password. Try again.");
      login();
    }
  }

  document.addEventListener("DOMContentLoaded", login);

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
        setTimeout(typing, 15);
      }
      chatBox.scrollTop = chatBox.scrollHeight;
    }
    typing();
  }

  // 📘 QUESTION BANK (SCIENCE + MATHS)
  let questionBank = {
    light: [
      "What is reflection of light?",
      "Define refraction",
      "What is a mirror?",
      "Difference between real and virtual image",
      "What is dispersion?"
    ],
    force: [
      "What is force?",
      "Define friction",
      "What is gravity?",
      "Balanced vs unbalanced force",
      "What is pressure?"
    ],
    motion: [
      "What is motion?",
      "Define speed",
      "Define velocity",
      "What is acceleration?",
      "Uniform vs non-uniform motion"
    ],
    heat: [
      "What is heat?",
      "Difference between heat and temperature",
      "Modes of heat transfer",
      "What is conduction?",
      "What is convection?"
    ],
    sound: [
      "What is sound?",
      "Define frequency",
      "What is amplitude?",
      "How sound travels?",
      "Human hearing range"
    ],
    electricity: [
      "What is electric current?",
      "Define circuit",
      "What is resistance?",
      "Series vs parallel circuit",
      "What is voltage?"
    ],
    algebra: [
      "What is a variable?",
      "Solve: 2x + 3 = 7",
      "What is an equation?",
      "What are like terms?",
      "Simplify: 3x + 2x"
    ],
    mensuration: [
      "What is perimeter?",
      "Area of rectangle formula",
      "Area of triangle",
      "Volume of cube",
      "Surface area meaning"
    ],
    fractions: [
      "What is a fraction?",
      "Add 1/2 + 1/3",
      "What is LCM?",
      "Convert improper to mixed",
      "Multiply fractions"
    ],
    integers: [
      "What are integers?",
      "Add -3 + 5",
      "Subtract integers",
      "Rules of signs",
      "Multiply integers"
    ]
  };

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

  // 📘 RANDOM QUESTIONS (NO REPEAT)
  function generateQuestions(chapter) {
    let questions = questionBank[chapter];

    if (!questions) {
      typeMessage("❌ Chapter not found");
      return;
    }

    let pool = [...questions];
    let selected = [];

    while (selected.length < 5 && pool.length > 0) {
      let index = Math.floor(Math.random() * pool.length);
      selected.push(pool[index]);
      pool.splice(index, 1);
    }

    let output = "📘 Questions (" + chapter + "):\n\n";
    selected.forEach((q, i) => {
      output += (i + 1) + ". " + q + "\n";
    });

    typeMessage(output);
  }

  // 🧠 MAIN FUNCTION
  function getAnswer() {
    let q = document.getElementById("question").value;

    // 🚫 LIMIT
    if (currentUser && currentUser.type === "free") {
      if (questionsUsed >= currentUser.limit) {
        typeMessage("❌ Daily limit reached! Upgrade to Pro.");
        return;
      }
      questionsUsed++;
    }

    addMessage(q, "user");

    if (testActive) {
      checkTestAnswer(q);
      return;
    }

    if (mode === "check") {
      let score = Math.floor(Math.random() * 5) + 5;
      typeMessage("Score: " + score + "/10");
      return;
    }

    if (mode === "exam") {
      let chapter = prompt("Enter chapter:");

      let input = chapter.toLowerCase().trim();

      if (input.includes("light")) input = "light";
      else if (input.includes("force")) input = "force";
      else if (input.includes("motion")) input = "motion";
      else if (input.includes("heat")) input = "heat";
      else if (input.includes("sound")) input = "sound";
      else if (input.includes("electric")) input = "electricity";
      else if (input.includes("algebra")) input = "algebra";
      else if (input.includes("mensuration")) input = "mensuration";
      else if (input.includes("fraction")) input = "fractions";
      else if (input.includes("integer")) input = "integers";

      generateQuestions(input);
      return;
    }

    let result = solveMathOrAlgebra(q);
    if (result) {
      typeMessage("Answer: " + result);
      return;
    }

    typeMessage("❌ Not found.");
  }