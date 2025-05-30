document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const quizArea = document.getElementById('quizArea');
    const resultArea = document.getElementById('resultArea');
    const quizTitle = document.getElementById('quizTitle');
    const studentInfoDisplay = document.getElementById('studentInfo');
    const questionContainer = document.getElementById('questionContainer');
    const optionsContainer = document.getElementById('optionsContainer'); // Pastikan ini ada di HTML
    const nextButton = document.getElementById('nextButton');

    const jumpscareContainer = document.getElementById('jumpscare-container');
    const jumpscareAudio = document.getElementById('jumpscare-audio');
    const applauseContainer = document.getElementById('applause-container');
    const applauseAudio = document.getElementById('applause-audio');

    let currentQuestionIndex = 0;
    let quizData = null;
    let studentAnswers = [];
    let studentDetails = {};

    const SCORE_MC = 7; // 10 MC * 7 = 70
    const SCORE_ESSAY = 6; // 5 Esai * 6 = 30. Total 100.
    const MIN_PASS_SCORE = 75;


    // --- LOGIKA HALAMAN LOGIN (jika di student_login.html) ---
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('studentName').value.trim();
            const className = document.getElementById('studentClass').value.trim();
            const subject = document.getElementById('subject').value;

            if (name && className) {
                studentDetails = { name, className, subject };
                sessionStorage.setItem('studentDetails', JSON.stringify(studentDetails));
                window.location.href = 'quiz.html';
            } else {
                alert('Nama dan Kelas wajib diisi!');
            }
        });
    }

    // --- LOGIKA HALAMAN KUIS (jika di quiz.html) ---
    if (quizArea) { // Hanya jalankan jika elemen quizArea ada (berarti di quiz.html)
        loadQuizDataAndInitialize(); // Ubah nama fungsi agar lebih jelas
        if (nextButton) { // Pastikan nextButton ada sebelum menambah event listener
            nextButton.addEventListener('click', handleNextQuestion);
        }
    }
    
    function loadQuizDataAndInitialize() {
        const storedDetails = sessionStorage.getItem('studentDetails');
        if (!storedDetails) {
            if (!resultArea || resultArea.classList.contains('hidden')) { // Jangan redirect jika sudah di halaman hasil
                alert('Sesi Anda tidak ditemukan atau telah berakhir. Silakan login kembali.');
                window.location.href = 'student_login.html';
            }
            return;
        }
        studentDetails = JSON.parse(storedDetails);

        if (studentInfoDisplay) {
             studentInfoDisplay.innerHTML = `Peserta: <strong>${studentDetails.name}</strong> - Kelas: <strong>${studentDetails.className}</strong>`;
        }

        const rawQuizData = localStorage.getItem('fiqhQuizData');
        if (!rawQuizData) {
            if(quizTitle) quizTitle.textContent = "Kuis Tidak Ditemukan!";
            if(questionContainer) questionContainer.innerHTML = "<p>Belum ada soal yang disiapkan oleh guru. Silakan hubungi guru Anda.</p>";
            if(nextButton) nextButton.classList.add('hidden');
            return;
        }
        quizData = JSON.parse(rawQuizData);
        // Gabungkan soal PG dan Esai menjadi satu array untuk navigasi yang lebih mudah
        quizData.allQuestions = [...(quizData.multipleChoice || []), ...(quizData.essays || [])];

        if (quizTitle) quizTitle.textContent = quizData.title || "Kuis Fiqh";
        displayQuestion();
    }

    function displayQuestion() {
        if (!quizData || !quizData.allQuestions || currentQuestionIndex >= quizData.allQuestions.length) {
            finishQuiz(); // Selesaikan kuis jika tidak ada pertanyaan lagi atau data tidak valid
            return;
        }

        const questionData = quizData.allQuestions[currentQuestionIndex];
        if (questionContainer) {
            questionContainer.innerHTML = `<p><strong>Soal ${currentQuestionIndex + 1} dari ${quizData.allQuestions.length}:</strong></p><p>${questionData.question}</p>`;
        }
        
        if (optionsContainer) {
            optionsContainer.innerHTML = ''; // Kosongkan opsi sebelumnya
            optionsContainer.className = 'options-container'; // Set class default

            if (questionData.options) { // Ini soal Pilihan Ganda
                questionData.options.forEach((option, index) => {
                    const radioId = `option_${index}`;
                    const charCode = String.fromCharCode(65 + index); // A, B, C, D
                    optionsContainer.innerHTML += `
                        <label for="${radioId}">
                            <input type="radio" id="${radioId}" name="answer" value="${index}">
                            ${charCode}. ${option}
                        </label>
                    `;
                });
            } else { // Ini soal Esai
                optionsContainer.innerHTML = `
                    <textarea id="essay_answer" class="essay-answer-area" rows="5" placeholder="Tulis jawaban esai Anda di sini..."></textarea>
                `;
            }
        }

        if (nextButton) {
            if (currentQuestionIndex === quizData.allQuestions.length - 1) {
                nextButton.textContent = 'Selesaikan Kuis';
            } else {
                nextButton.textContent = 'Soal Berikutnya';
            }
        }
    }

    function handleNextQuestion() {
        if (!quizData || !quizData.allQuestions) return; // Pastikan quizData ada

        const questionData = quizData.allQuestions[currentQuestionIndex];
        let answer;

        if (questionData.options) { // Pilihan Ganda
            const selectedOption = document.querySelector('input[name="answer"]:checked');
            if (!selectedOption) {
                alert('Harap pilih salah satu jawaban!');
                return;
            }
            answer = parseInt(selectedOption.value);
        } else { // Esai
            const essayAnswer = document.getElementById('essay_answer');
            if (!essayAnswer.value.trim()) {
                // Peringatan jika esai kosong, tapi tetap lanjutkan jika user mau
                if (!confirm("Anda belum menjawab esai ini. Jawaban kosong tidak akan mendapat poin. Yakin ingin melanjutkan?")) {
                    return;
                }
                answer = ""; 
            } else {
                answer = essayAnswer.value.trim();
            }
        }
        studentAnswers.push(answer);
        currentQuestionIndex++;
        displayQuestion();
    }

    function finishQuiz() {
        if(quizArea) quizArea.classList.add('hidden');
        if(resultArea) resultArea.classList.remove('hidden');

        let score = 0;
        if (quizData && quizData.allQuestions) {
            quizData.allQuestions.forEach((q, index) => {
                if (q.options) { // Pilihan Ganda
                    if (studentAnswers[index] === q.correctAnswer) {
                        score += SCORE_MC;
                    }
                } else { // Esai
                    // Beri skor jika esai dijawab (minimal tidak kosong)
                    // Penilaian kualitas esai tetap manual oleh guru
                    if (studentAnswers[index] && studentAnswers[index].length > 0) { 
                        score += SCORE_ESSAY;
                    }
                }
            });
        }
        
        score = Math.min(score, 100); // Pastikan skor tidak melebihi 100

        if(document.getElementById('resultName')) document.getElementById('resultName').textContent = studentDetails.name || "Siswa";
        if(document.getElementById('resultClass')) document.getElementById('resultClass').textContent = studentDetails.className || "-";
        if(document.getElementById('resultScore')) document.getElementById('resultScore').textContent = score;

        let message = "";
        if (score === 100) {
            message = "LUAR BIASA! Anda memahami materi dengan sempurna!";
            triggerApplause();
        } else if (score >= MIN_PASS_SCORE) {
            message = "Selamat! Anda berhasil melewati batas minimal. Terus tingkatkan pemahaman Anda!";
        } else {
            message = "Sayang sekali, skor Anda di bawah batas minimal. Jangan menyerah, tetap semangat belajar dan coba lagi!";
            triggerJumpscare();
        }
        if(document.getElementById('resultMessage')) document.getElementById('resultMessage').textContent = message;

        saveResultToLeaderboard(studentDetails.name, studentDetails.className, score);
    }
    
    function saveResultToLeaderboard(name, className, score) {
        if (!name || !className) return; // Jangan simpan jika nama/kelas kosong
        const results = JSON.parse(localStorage.getItem('quizResults')) || [];
        results.push({
            name: name,
            className: className,
            score: score,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('quizResults', JSON.stringify(results));
    }

    function triggerJumpscare() {
        if (!jumpscareContainer || !jumpscareAudio) return;
        jumpscareContainer.classList.add('visible'); // Gunakan class 'visible' untuk transisi
        jumpscareAudio.play().catch(e => console.warn("Audio jumpscare gagal diputar: Browser mungkin memblokir autoplay.", e));
        
        setTimeout(() => {
            jumpscareContainer.classList.remove('visible');
        }, 3000); // Durasi jumpscare 3 detik. Anda bisa mengubah nilai ini (misal 5000 untuk 5 detik)
    }

    function triggerApplause() {
        if (!applauseContainer || !applauseAudio) return;
        applauseContainer.classList.add('visible');
        applauseAudio.play().catch(e => console.warn("Audio tepuk tangan gagal diputar: Browser mungkin memblokir autoplay.", e));

        setTimeout(() => {
            applauseContainer.classList.remove('visible');
        }, 4000); // Durasi tepuk tangan 4 detik
    }

    // Inisialisasi jika di halaman kuis dan bukan hasil (untuk kasus refresh halaman)
    if (document.getElementById('quizArea') && (!resultArea || resultArea.classList.contains('hidden'))) {
        loadQuizDataAndInitialize();
    }
});