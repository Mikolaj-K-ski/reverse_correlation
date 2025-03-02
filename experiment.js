let globalCsvText = ""; // Globalna zmienna do debugowania

document.addEventListener("DOMContentLoaded", function() {
    if (typeof initJsPsych === 'undefined') {
        console.error("initJsPsych is not defined. Sprawdź, czy jsPsych jest poprawnie załadowany.");
        return;
    }
    
    let jsPsych = initJsPsych({
        on_finish: function() {
            jsPsych.data.displayData();
        }
    });

        fetch("stimuli.csv")
    .then(response => response.text())
    .then(csvText => {
        console.log("Zawartość CSV:", csvText);  // ✅ Sprawdzenie tekstu CSV

        let stimuli = Papa.parse(csvText, { header: true, delimiter: ";" }).data;
        console.log("Parsowany CSV:", stimuli);  // ✅ Sprawdzenie obiektów po parsowaniu

        // Spróbuj parsować najpierw z przecinkiem, potem z średnikiem
        let stimuli = Papa.parse(csvText, { header: true, delimiter: "," }).data;
        if (!stimuli[0] || !stimuli[0].image1) {
            console.warn("⚠️ CSV może używać średnika! Spróbuję ponownie...");
            stimuli = Papa.parse(csvText, { header: true, delimiter: ";" }).data;
        }

        console.log("✅ Parsowane dane z CSV:", stimuli);








        
       let trials = stimuli.map(row => {
    let img1 = row.image1.trim();  // Usuwa spacje przed/po
    let img2 = row.image2.trim();
    
    console.log("🔗 Generowane URL-e:", img1, img2);  // ✅ Debugowanie

    return {
        type: "image-button-response",
        stimulus: [
            `https://mikolaj-k-ski.github.io/reverse_correlation/images/${img1}`
             ],
         stimulus: [
            `https://mikolaj-k-ski.github.io/reverse_correlation/images/${img2}`
              ],
        ],
        choices: ['Obraz po lewej', 'Obraz po prawej'],
        prompt: "<p>Wybierz obraz, który lepiej pasuje do opisu.</p>",
        data: { chosen_image: img1 }
    };
});
        }).filter(trial => trial !== null); // Usunięcie błędnych wierszy

        if (trials.length === 0) {
            console.error("❌ Brak poprawnych prób w stimuli.csv!");
            return;
        }

        let timeline = [
            {
                type: "html-keyboard-response",
                stimulus: "<p>Naciśnij spację, aby rozpocząć eksperyment.</p>",
                choices: [' ']
            },
            ...trials
        ];

        jsPsych.run(timeline);
    })
    .catch(error => console.error("❌ Błąd wczytywania stimuli.csv:", error));

});
