document.addEventListener('DOMContentLoaded', () => {
    const NUM_MC_QUESTIONS = 10;
    const NUM_ESSAY_QUESTIONS = 5;

    const mcQuestionsContainer = document.getElementById('multipleChoiceQuestions');
    const essayQuestionsContainer = document.getElementById('essayQuestions');
    const quizSetupForm = document.getElementById('quizSetupForm');
    const publicationLinkDiv = document.getElementById('publicationLink');
    const generatedLinkInput = document.getElementById('generatedLink');
    const leaderboardBody = document.getElementById('leaderboardBody');
    const refreshLeaderboardBtn = document.getElementById('refreshLeaderboardBtn');

    // Contoh Soal (akan diisi ke form jika form kosong saat load)
    const defaultQuestions = {
        multipleChoice: [
            { q: "Ketetapan Allah SWT yang telah tertulis di Lauhul Mahfuzh sejak zaman azali dan bersifat umum serta menyeluruh atas segala sesuatu disebut...", o: ["Qadha", "Qadhar", "Ikhtiar", "Tawakkal"], a: 0 },
            { q: "Perwujudan atau realisasi dari Qadha Allah SWT yang berkaitan dengan detail ukuran, kadar, atau batasan tertentu bagi setiap makhluk disebut...", o: ["Qadha", "Qadhar", "Takdir Mubram", "Doa"], a: 1 },
            { q: "Beriman kepada Qadha dan Qadhar Allah SWT merupakan salah satu pilar dalam...", o: ["Rukun Islam", "Rukun Iman", "Syarat Sah Shalat", "Sunnah Muakkadah"], a: 1 },
            { q: "Sikap yang benar seorang Muslim dalam menyikapi takdir Allah SWT adalah...", o: ["Pasrah total tanpa melakukan usaha apapun.", "Menyalahkan keadaan jika menemui kegagalan.", "Berusaha semaksimal mungkin (ikhtiar) dan kemudian berserah diri (tawakkal) kepada Allah.", "Meyakini bahwa manusia tidak punya peran sama sekali dalam hidupnya."], a: 2 },
            { q: "Salah satu hikmah utama beriman kepada Qadha dan Qadhar adalah menumbuhkan sifat...", o: ["Sombong ketika berhasil dan putus asa ketika gagal.", "Malas berusaha karena merasa semua sudah ditentukan.", "Sabar dalam menghadapi ujian dan syukur atas nikmat.", "Iri hati terhadap keberhasilan orang lain."], a: 2 },
            { q: "Takdir yang kejadiannya dapat dipengaruhi oleh usaha atau ikhtiar manusia, seperti kesehatan yang terjaga karena pola hidup sehat, disebut...", o: ["Takdir Mubram", "Takdir Mu'allaq", "Lauhul Mahfuzh", "Azali"], a: 1 },
            { q: "Kematian, jenis kelamin, dan jodoh adalah contoh dari takdir yang ketetapannya mutlak dan tidak dapat diubah oleh usaha manusia. Ini disebut...", o: ["Takdir Mu'allaq", "Takdir Mubram", "Ikhtiar Manusia", "Keberuntungan Semata"], a: 1 },
            { q: "Memahami Qadha dan Qadhar akan membuat seorang Muslim terhindar dari sifat...", o: ["Optimis dan penuh harap.", "Rendah hati dan pemaaf.", "Arogan (takabur) saat sukses dan keluh kesah (putus asa) saat gagal.", "Giat bekerja dan berdoa."], a: 2 },
            { q: "Usaha dan upaya maksimal yang dilakukan oleh manusia untuk mencapai sesuatu yang diinginkannya disebut...", o: ["Tawakkal", "Qana'ah", "Ikhtiar", "Syukur"], a: 2 },
            { q: "Setelah melakukan ikhtiar dengan sungguh-sungguh, langkah selanjutnya yang harus dilakukan seorang mukmin adalah...", o: ["Memastikan hasilnya pasti sesuai keinginan.", "Mengeluh jika hasilnya tidak sesuai harapan.", "Bertawakal, yaitu menyerahkan segala hasilnya kepada Allah SWT.", "Merasa bahwa usahanya tidak ada gunanya."], a: 2 }
        ],
        essays: [
            { q: "Jelaskan dengan bahasa Anda sendiri apa yang dimaksud dengan Qadha dan Qadhar Allah SWT! Berikan masing-masing satu contoh nyata dalam kehidupan sehari-hari!" },
            { q: "Mengapa beriman kepada Qadha dan Qadhar menjadi salah satu rukun iman? Jelaskan dampak positifnya bagi kehidupan seorang Muslim!" },
            { q: "Seringkali orang salah paham bahwa jika semua sudah ditakdirkan, maka manusia tidak perlu berusaha. Bagaimana Anda menjelaskan hubungan antara kewajiban manusia untuk berikhtiar dengan keimanan kepada Qadha dan Qadhar?" },
            { q: "Sebutkan dan jelaskan minimal tiga hikmah atau manfaat penting yang dapat diperoleh seorang Muslim dengan meyakini Qadha dan Qadhar Allah SWT!" },
            { q: "Apa perbedaan mendasar antara Takdir Mubram dan Takdir Mu'allaq? Berikan contoh konkret untuk masing-masing jenis takdir tersebut!" }
        ]
    };


    function createMultipleChoiceInput(index, data = {}) {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-block');
        questionDiv.innerHTML = `
            <label for="mc_question_${index}">Soal Pilihan Ganda ${index + 1}:</label>
            <textarea id="mc_question_${index}" name="mc_question_${index}" required>${data.q || ''}</textarea>
            <label>Pilihan Jawaban:</label>
            <input type="text" name="mc_option_${index}_0" placeholder="Pilihan A" value="${data.o ? data.o[0] : ''}" required>
            <input type="text" name="mc_option_${index}_1" placeholder="Pilihan B" value="${data.o ? data.o[1] : ''}" required>
            <input type="text" name="mc_option_${index}_2" placeholder="Pilihan C" value="${data.o ? data.o[2] : ''}" required>
            <input type="text" name="mc_option_${index}_3" placeholder="Pilihan D" value="${data.o ? data.o[3] : ''}" required>
            <label for="mc_correct_${index}">Jawaban Benar:</label>
            <select id="mc_correct_${index}" name="mc_correct_${index}" required>
                <option value="0" ${data.a === 0 ? 'selected' : ''}>A</option>
                <option value="1" ${data.a === 1 ? 'selected' : ''}>B</option>
                <option value="2" ${data.a === 2 ? 'selected' : ''}>C</option>
                <option value="3" ${data.a === 3 ? 'selected' : ''}>D</option>
            </select>
        `;
        return questionDiv;
    }

    function createEssayInput(index, data = {}) {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-block');
        questionDiv.innerHTML = `
            <label for="essay_question_${index}">Soal Esai ${index + 1}:</label>
            <textarea id="essay_question_${index}" name="essay_question_${index}" required>${data.q || ''}</textarea>
        `;
        return questionDiv;
    }

    // Generate form inputs with default questions
    for (let i = 0; i < NUM_MC_QUESTIONS; i++) {
        mcQuestionsContainer.appendChild(createMultipleChoiceInput(i, defaultQuestions.multipleChoice[i]));
    }
    for (let i = 0; i < NUM_ESSAY_QUESTIONS; i++) {
        essayQuestionsContainer.appendChild(createEssayInput(i, defaultQuestions.essays[i]));
    }

    quizSetupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(quizSetupForm);
        const quizData = {
            title: "Kuis Fiqh: Qadha & Qadhar",
            multipleChoice: [],
            essays: []
        };

        for (let i = 0; i < NUM_MC_QUESTIONS; i++) {
            quizData.multipleChoice.push({
                question: formData.get(`mc_question_${i}`),
                options: [
                    formData.get(`mc_option_${i}_0`),
                    formData.get(`mc_option_${i}_1`),
                    formData.get(`mc_option_${i}_2`),
                    formData.get(`mc_option_${i}_3`),
                ],
                correctAnswer: parseInt(formData.get(`mc_correct_${i}`))
            });
        }

        for (let i = 0; i < NUM_ESSAY_QUESTIONS; i++) {
            quizData.essays.push({
                question: formData.get(`essay_question_${i}`)
            });
        }

        try {
            localStorage.setItem('fiqhQuizData', JSON.stringify(quizData));
            alert('Soal berhasil disimpan! Kuis siap dipublikasikan.');

            const studentLoginPage = 'student_login.html';
            // Mendapatkan path dasar dari URL saat ini
            const basePath = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
            generatedLinkInput.value = basePath + studentLoginPage; // Ini adalah path absolut ke file student_login.html
            publicationLinkDiv.classList.remove('hidden');

        } catch (e) {
            alert('Gagal menyimpan soal. LocalStorage mungkin penuh atau tidak didukung.');
            console.error("Error saving to localStorage:", e);
        }
    });

    function loadLeaderboard() {
        leaderboardBody.innerHTML = ''; 
        const results = JSON.parse(localStorage.getItem('quizResults')) || [];
        
        results.sort((a, b) => b.score - a.score);

        if (results.length === 0) {
            const row = leaderboardBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 5;
            cell.textContent = "Belum ada siswa yang mengerjakan kuis.";
            cell.style.textAlign = "center";
            return;
        }
        
        results.forEach((result, index) => {
            const row = leaderboardBody.insertRow();
            row.insertCell().textContent = index + 1;
            row.insertCell().textContent = result.name;
            row.insertCell().textContent = result.className;
            row.insertCell().textContent = result.score;
            row.insertCell().textContent = new Date(result.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short'});
        });
    }

    refreshLeaderboardBtn.addEventListener('click', loadLeaderboard);
    loadLeaderboard(); // Muat leaderboard saat halaman pertama kali dibuka
});