let currentCategory = 'all', currentMode = 'multiple', currentQuestions = [], currentIndex = 0, answers = {}, results = {};
const categoryBtns = document.querySelectorAll('.category-btn'), modeBtns = document.querySelectorAll('.mode-btn');
const questionArea = document.getElementById('question-area'), prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn'), currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsNav = document.getElementById('total-questions-nav'), totalQuestionsSpan = document.getElementById('total-questions');
const answeredSpan = document.getElementById('answered-count'), correctSpan = document.getElementById('correct-count');
const percentSpan = document.getElementById('percent'), resetBtn = document.getElementById('reset-btn');
const progressFill = document.getElementById('progress-fill'), showResultsBtn = document.getElementById('show-results');
const resultsModal = document.getElementById('results-modal'), rulesModal = document.getElementById('rules-modal');
const hintModal = document.getElementById('hint-modal');

document.addEventListener('DOMContentLoaded', () => {
    categoryBtns.forEach(btn => btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        currentIndex = 0;
        answers = {};
        results = {};
        loadQuestions();
        displayQuestion();
    }));
    modeBtns.forEach(btn => btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
        displayQuestion();
    }));
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            displayQuestion();
        }
    });
    nextBtn.addEventListener('click', () => {
        if (currentIndex < currentQuestions.length - 1) {
            currentIndex++;
            displayQuestion();
        }
    });
    resetBtn.addEventListener('click', () => {
        if (confirm('Вы уверены?')) {
            currentIndex = 0;
            answers = {};
            results = {};
            loadQuestions();
            displayQuestion();
        }
    });
    showResultsBtn.addEventListener('click', showResults);
    document.querySelectorAll('.close-modal').forEach(btn => btn.addEventListener('click', (e) => {
        e.target.closest('.modal').classList.remove('active');
    }));
    loadQuestions();
});

function loadQuestions() {
    currentQuestions = getQuestions(currentCategory);
    totalQuestionsNav.textContent = currentQuestions.length;
    totalQuestionsSpan.textContent = currentQuestions.length;
    updateStats();
}

function displayQuestion() {
    if (currentQuestions.length === 0) {
        questionArea.innerHTML = '<div class="empty-state"><p>Выберите категорию</p></div>';
        return;
    }
    const q = currentQuestions[currentIndex];
    currentQuestionSpan.textContent = currentIndex + 1;
    let html = `<div class="question active"><div class="question-header"><div class="question-title">${q.question}</div></div><div class="question-info"><strong>Правило:</strong> ${q.ruleNumber}</div>`;
    if (currentMode === 'multiple') {
        html += '<div class="answer-options">';
        q.options.forEach((opt, i) => {
            const sel = answers[q.id] === i ? 'selected' : '';
            html += `<label class="answer-option ${sel}"><input type="radio" name="answer" value="${i}" ${sel ? 'checked' : ''} onchange="selectAnswer(${q.id}, ${i})"><span>${opt}</span></label>`;
        });
        html += '</div>';
    } else if (currentMode === 'text') {
        const ans = answers[q.id] || '';
        html += `<div class="text-input-section"><input type="text" class="text-input" value="${ans}" placeholder="Введите ответ..." onchange="selectAnswer(${q.id}, this.value)"><button class="submit-btn" onclick="submitTextAnswer(${q.id})">Проверить</button></div>`;
    } else if (currentMode === 'punishment') {
        const sel = answers[q.id] || [];
        html += '<div class="punishment-section"><div class="punishment-options">';
        q.options.forEach(opt => {
            const s = sel.includes(opt) ? 'selected' : '';
            html += `<button class="punishment-btn ${s}" onclick="togglePunishment(${q.id}, '${opt}')">${opt}</button>`;
        });
        html += `</div><input type="text" class="punishment-input" placeholder="Время/дни..."><button class="submit-btn" onclick="submitPunishment(${q.id})">Проверить</button></div>`;
    }
    html += `<div class="question-actions"><button class="hint-btn" onclick="showHint(${q.id})">💡 Подсказка</button><button class="info-btn" onclick="showRuleInfo(${q.id})">ℹ️ Правило</button></div></div>`;
    questionArea.innerHTML = html;
    updateNavButtons();
}

function selectAnswer(qId, ans) {
    answers[qId] = ans;
    const q = currentQuestions.find(x => x.id === qId);
    if (q.type === 'multiple' && ans === q.correct) {
        results[qId] = true;
    } else if (q.type === 'multiple') {
        results[qId] = false;
    }
    updateStats();
}

function submitTextAnswer(qId) {
    const q = currentQuestions.find(x => x.id === qId);
    const ans = answers[qId] || '';
    const isCorrect = q.correctAnswers.some(c => ans.toLowerCase().includes(c.toLowerCase()));
    results[qId] = isCorrect;
    updateStats();
    alert(isCorrect ? '✅ Правильно!' : '❌ Неправильно');
}

function togglePunishment(qId, pun) {
    if (!answers[qId]) answers[qId] = [];
    const idx = answers[qId].indexOf(pun);
    if (idx > -1) answers[qId].splice(idx, 1);
    else answers[qId].push(pun);
    displayQuestion();
}

function submitPunishment(qId) {
    results[qId] = true;
    updateStats();
}

function updateStats() {
    const ans = Object.keys(answers).length;
    const cor = Object.values(results).filter(r => r === true).length;
    const pct = currentQuestions.length > 0 ? Math.round((cor / currentQuestions.length) * 100) : 0;
    answeredSpan.textContent = ans;
    correctSpan.textContent = cor;
    percentSpan.textContent = pct + '%';
    progressFill.style.width = pct + '%';
}

function updateNavButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === currentQuestions.length - 1;
}

function showHint(qId) {
    const q = currentQuestions.find(x => x.id === qId);
    document.getElementById('hint-content').innerHTML = `<p>${q.hint}</p>`;
    hintModal.classList.add('active');
}

function showRuleInfo(qId) {
    const q = currentQuestions.find(x => x.id === qId);
    document.getElementById('rules-content').innerHTML = `<h3>${q.ruleNumber}</h3><p>${q.ruleFull}</p><p><strong>Наказание:</strong> ${q.punishment}</p>`;
    rulesModal.classList.add('active');
}

function showResults() {
    let html = '';
    currentQuestions.forEach(q => {
        const isCor = results[q.id] === true;
        html += `<div class="result-item ${isCor ? 'correct' : 'incorrect'}"><div class="result-question">${q.question}</div><div class="result-answer">Ответ: ${answers[q.id] || 'Не ответили'}</div><div class="result-status ${isCor ? 'correct' : 'incorrect'}">${isCor ? '✅ Правильно' : '❌ Неправильно'}</div></div>`;
    });
    const cor = Object.values(results).filter(r => r === true).length;
    const pct = Math.round((cor / currentQuestions.length) * 100);
    html += `<div class="total-score"><h3>Итог</h3><div class="score-value">${cor}/${currentQuestions.length} (${pct}%)</div></div>`;
    document.getElementById('results-content').innerHTML = html;
    resultsModal.classList.add('active');
}