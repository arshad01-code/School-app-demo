const pages = [...document.querySelectorAll('.page')];
const navItems = [...document.querySelectorAll('[data-page]')];

function showPage(id) {
  const target = document.getElementById(id);
  if (!target) return;
  pages.forEach(page => page.classList.toggle('active-page', page === target));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.page === id));
  document.querySelector('.sidebar')?.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', `#${id}`);
}

navItems.forEach(item => item.addEventListener('click', () => showPage(item.dataset.page)));
const initialPage = window.location.hash.slice(1);
if (initialPage && document.getElementById(initialPage)) showPage(initialPage);

document.querySelector('.mobile-menu')?.addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));

document.querySelector('#cyclePlay')?.addEventListener('click', event => {
  const stage = document.querySelector('.cycle-stage');
  stage.classList.toggle('is-playing');
  event.currentTarget.innerHTML = stage.classList.contains('is-playing') ? '■ <span>Pause cycle</span>' : '▶ <span>Play cycle</span>';
});

document.querySelector('#nextLessonStep')?.addEventListener('click', event => {
  const step = document.querySelector('.step-count');
  const title = document.querySelector('.lesson-copy h2');
  const copy = document.querySelector('.lesson-copy p');
  const current = Number(step.textContent.slice(0, 2));
  const content = [
    ['02 / 03', 'Now the vapor gathers', 'As water vapor rises, it cools. Tiny droplets gather around particles in the air, forming clouds we can see.', 'Next concept'],
    ['03 / 03', 'Every drop finds its way home', 'When droplets grow heavy enough, they fall as precipitation. The cycle begins again in rivers, lakes, and oceans.', 'Take the quick check'],
    ['01 / 03', 'Water is always on the move', 'The sun warms rivers, lakes, and oceans. Some of that liquid water turns into an invisible gas called water vapor and rises into the atmosphere.', 'Next concept']
  ][current - 1] || [];
  step.textContent = content[0];
  title.textContent = content[1];
  copy.textContent = content[2];
  event.currentTarget.innerHTML = `${content[3]} <span>→</span>`;
  if (current === 3) event.currentTarget.onclick = () => showPage('quiz');
});

const chatForm = document.querySelector('#chatForm');
const chatInput = document.querySelector('#chatInput');
const chatMessages = document.querySelector('#chatMessages');
const tutorReplies = {
  'quiz me on this concept': 'Absolutely. Which process happens when water vapor cools into tiny droplets: evaporation, condensation, or precipitation?',
  'explain it more simply': 'Sure: evaporation is water going up; condensation is water coming together. They are opposite steps in the same cycle.',
  'can you give me a real-world example?': 'You see condensation on a cold glass. Water vapor in the air cools against the glass and turns into tiny liquid drops.'
};
function addMessage(text, type) {
  const message = document.createElement('div');
  message.className = `message ${type === 'user' ? 'user-message' : 'ai-message'}`;
  message.innerHTML = type === 'user' ? `<div><p>${text}</p><small>Now</small></div>` : `<span class="message-avatar">✦</span><div><p>${text}</p><small>Now</small></div>`;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function askTutor(text) {
  if (!text.trim()) return;
  addMessage(text, 'user');
  chatInput.value = '';
  setTimeout(() => addMessage(tutorReplies[text.toLowerCase()] || 'That is a thoughtful question. Start by connecting it to the three water cycle steps, then I can help you test your explanation.', 'ai'), 350);
}
chatForm?.addEventListener('submit', event => { event.preventDefault(); askTutor(chatInput.value); });
document.querySelectorAll('[data-prompt]').forEach(button => button.addEventListener('click', () => askTutor(button.dataset.prompt)));

const quizQuestions = [
  { question: 'What happens during condensation?', options: ['Water turns into vapor and rises.', 'Water vapor cools and forms droplets.', 'Droplets fall from clouds as rain.'], answer: 1 },
  { question: 'What is the main energy source that drives evaporation?', options: ['The moon', 'Wind alone', 'The sun'], answer: 2 },
  { question: 'What do we call water falling from clouds?', options: ['Precipitation', 'Collection', 'Transpiration'], answer: 0 }
];
let quizIndex = 0;
let selectedAnswer = null;
const quizQuestion = document.querySelector('#quizQuestion');
const answerOptions = document.querySelector('#answerOptions');
const quizFeedback = document.querySelector('#quizFeedback');
const quizNext = document.querySelector('#quizNext');
function renderQuiz() {
  const item = quizQuestions[quizIndex];
  document.querySelector('#questionNumber').textContent = quizIndex + 1;
  quizQuestion.textContent = item.question;
  answerOptions.innerHTML = item.options.map((option, index) => `<button data-index="${index}">${option}</button>`).join('');
  answerOptions.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    answerOptions.querySelectorAll('button').forEach(option => option.classList.remove('selected'));
    button.classList.add('selected');
    selectedAnswer = Number(button.dataset.index);
    quizFeedback.textContent = '';
    quizNext.disabled = false;
    quizNext.textContent = 'Check answer →';
  }));
  quizFeedback.textContent = '';
  quizNext.disabled = true;
}
answerOptions?.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {}));
quizNext?.addEventListener('click', () => {
  const item = quizQuestions[quizIndex];
  if (quizNext.textContent.includes('Next') || quizNext.textContent.includes('Finish')) {
    if (quizIndex < quizQuestions.length - 1) { quizIndex += 1; renderQuiz(); } else { quizFeedback.textContent = 'You completed the quick check. Nice work.'; quizNext.disabled = true; }
    return;
  }
  const buttons = answerOptions.querySelectorAll('button');
  buttons[item.answer].classList.add('correct');
  if (selectedAnswer !== item.answer) buttons[selectedAnswer].classList.add('wrong');
  quizFeedback.textContent = selectedAnswer === item.answer ? 'Correct. You have got the concept.' : `Not quite. The answer is: ${item.options[item.answer]}`;
  quizFeedback.style.color = selectedAnswer === item.answer ? '#4f9d7a' : '#ba6358';
  quizNext.textContent = quizIndex === quizQuestions.length - 1 ? 'Finish quiz →' : 'Next question →';
});
if (answerOptions && quizQuestion && quizNext) renderQuiz();

const generateButton = document.querySelector('#generateSyllabus');
generateButton?.addEventListener('click', () => {
  const topic = document.querySelector('#syllabusInput').value.split('\n').filter(Boolean).pop() || 'The water cycle and climate';
  document.querySelector('#generateStatus').textContent = 'Nova drafted a learning arc';
  document.querySelector('#generatedPanel').innerHTML = `<div class="generated-content"><span class="eyebrow">NOVA'S FIRST DRAFT · 4 WEEKS</span><h2>${topic}</h2><div class="syllabus-list"><div class="syllabus-item"><b>01 · Big question</b><span>Where does our water go?</span></div><div class="syllabus-item"><b>02 · Explore</b><span>Interactive cycle lab</span></div><div class="syllabus-item"><b>03 · Make meaning</b><span>Cloud-in-a-jar activity</span></div><div class="syllabus-item"><b>04 · Show what you know</b><span>AI-assisted exit ticket</span></div></div><button class="quiet-button" style="margin-top:20px">Refine with Nova <span>→</span></button></div>`;
});
