document.addEventListener("DOMContentLoaded", function () {
    if (typeof initJsPsych === 'undefined') {
        console.error("❌ initJsPsych is not defined! Sprawdź, czy jsPsych jest poprawnie załadowany.");
        return;
    }

    let jsPsych = initJsPsych({
        on_finish: function () {
            jsPsych.data.displayData();
        }
    });

    // Pobranie i parsowanie pliku CSV
    fetch("stimuli.csv")
        .then(response => response.text())
        .then(csvText => {
            console.log("📂 Zawartość CSV:", csvText); // Debugowanie pliku CSV

            // Parsowanie CSV - najpierw spróbuj przecinek, potem średnik
            let stimuli = Papa.parse(csvText, { header: true, delimiter: "," }).data;
            if (!stimuli[0] || !stimuli[0].image1) {
                console.warn("⚠️ CSV może używać średnika! Próbuję ponownie...");
                stimuli = Papa.parse(csvText, { header: true, delimiter: ";" }).data;
            }

            console.log("✅ Parsowane dane z CSV:", stimuli);

            // Konwersja CSV na próbki eksperymentu
            let trials = stimuli
                .map(row => {
                    if (!row.image1 || !row.image2) {
                        console.warn("⚠️ Pominięto wiersz bez wymaganych obrazów:", row);
                        return null;
                    }

                    let img1 = row.image1.trim(); // Usunięcie zbędnych spacji
                    let img2 = row.image2.trim();

                    console.log("🔗 Generowane URL-e:", img1, img2); // Debugowanie

                    return {
                        type: "image-button-response",
                        stimulus: [
                            `https://mikolaj-k-ski.github.io/reverse_correlation/images/${img1}`,
                            `https://mikolaj-k-ski.github.io/reverse_correlation/images/${img2}`
                        ],
                        choices: ['Obraz po lewej', 'Obraz po prawej'],
                        prompt: "<p>Wybierz obraz, który lepiej pasuje do opisu.</p>",
                        data: { chosen_image: img1 }
                    };
                })
                .filter(trial => trial !== null); // Usunięcie błędnych wierszy

            if (trials.length === 0) {
                console.error("❌ Brak poprawnych prób w stimuli.csv!");
                return;
            }

            // Definicja linii czasowej eksperymentu
            let timeline = [
                {
                    type: "html-keyboard-response",
                    stimulus: "<p>Naciśnij spację, aby rozpocząć eksperyment.</p>",
                    choices: [' ']
                },
                ...trials
            ];

            // Uruchomienie eksperymentu
            jsPsych.run(timeline);
        })
        .catch(error => console.error("❌ Błąd wczytywania stimuli.csv:", error));
});
