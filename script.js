function show(id){
document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
document.getElementById(id).classList.add('active');
}

function askAI(){
let q=document.getElementById('q').value.toLowerCase();
let ans='AI Recommendation: Review the lesson.';
if(q.includes('depends')) ans='Depends() injects reusable services like database sessions and authentication.';
if(q.includes('condensation')) ans='Condensation happens when water vapor cools into droplets.';
document.getElementById('answer').innerText=ans;
}

function quiz(correct){
document.getElementById('quizResult').innerHTML=correct ?
'✅ Correct! AI says you understand dependency injection.' :
'❌ Incorrect. AI recommends watching the animation and retrying.';
}

function generate(){
document.getElementById('lesson').innerHTML=`
<div class="card">
<h3>AI Generated Lesson</h3>
<ul>
<li>Learning Objectives</li>
<li>Interactive Visual</li>
<li>Vocabulary Flashcards</li>
<li>Activity</li>
<li>Quiz</li>
<li>Homework</li>
</ul>
</div>`;
}
