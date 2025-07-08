document.addEventListener("DOMContentLoaded", function() {

am5.ready(function () {
    let root = am5.Root.new("chartDiv1"); // gestion du premier graphique (taux de mortalité par pays)
    root.setThemes([am5themes_Animated.new(root)]);
  
    let chart = root.container.children.push( // création du graphique 
      am5xy.XYChart.new(root, {
        panX: true, // le graphique peut être déplacé horizontalement
        panY: true, // verticalement aussi
        wheelX: "panX", // défilement horizontal
        wheelY: "zoomX", // défilement vertical
        layout: root.verticalLayout // disposition verticale
      })
    );
  
    let xAxis = chart.xAxes.push( // création de l'axe horizontal
      am5xy.CategoryAxis.new(root, {
        categoryField: "pays",
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 30,
          labels: {
            rotation: -15,
            centerY: am5.p50,
            centerX: am5.p100
          }
        }),
        tooltip: am5.Tooltip.new(root, {})
      })
    );
  
    let yAxis = chart.yAxes.push( // création de l'axe vertical
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );
  
    let series = chart.series.push( // série de données pour le graphique
      am5xy.ColumnSeries.new(root, {
        name: "Taux de mortalité",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "valeur",
        categoryXField: "pays",
        tooltip: am5.Tooltip.new(root, {
          labelText: "[bold]{categoryX}[/]: {valueY.formatNumber('#.###')}"
        })
      })
    );

    series.columns.template.setAll({ // configuration des clonnes du graphique
        cornerRadiusTL: 6,
        cornerRadiusTR: 6,
        strokeOpacity: 0,
        tooltipY: 0
    });
    
    // gestion du hover sur les colonnes
    let hoverState = series.columns.template.states.create("hover", {
        stateAnimationDuration: 400,
        stateAnimationEasing: am5.ease.out(am5.ease.quad)
    });
    hoverState.setAll({
        scale: 1.07,
        fill: am5.color(0x64475b)
    });

    // configuration des données initiales 
    series.columns.template.setAll({
      fill: am5.color(0xad6e7f),
      cornerRadiusTL: 6,
      cornerRadiusTR: 6,
      strokeOpacity: 0,
      tooltipY: 0
    });
  
    // animation des données
    series.appear(1000);
    chart.appear(1000, 100);
  
    // données par année pour le graphique
    const donneesParAnnee = {
      2016: { Fidji: 0.0209, Vanuatu: 0.094, PapouasieNouvelleGuinee: 0.209, Kiribati: 0.179, Samoa: 0.057, Tonga: 0.084 },
      2017: { Fidji: 0.0356, Vanuatu: 0.094, PapouasieNouvelleGuinee: 0.21, Kiribati: 0.112, Samoa: 0.059, Tonga: 0.084 },
      2018: { Fidji: 0.037, Vanuatu: 0.097, PapouasieNouvelleGuinee: 0.199, Kiribati: 0.11, Samoa: 0.058, Tonga: 0.084 },
      2019: { Fidji: 0.038, Vanuatu: 0.093, PapouasieNouvelleGuinee: 0.19, Kiribati: 0.108, Samoa: 0.066, Tonga: 0.125 },
      2020: { Fidji: 0.038, Vanuatu: 0.094, PapouasieNouvelleGuinee: 0.192, Kiribati: 0.076, Samoa: 0.059, Tonga: 0.126 }
    };
  
    // formatage des données pour amcharts
    function formaterDonneesPourAmcharts(annee) {
      const nomsPays = {
        Fidji: "Fidji",
        Vanuatu: "Vanuatu",
        PapouasieNouvelleGuinee: "PapouasieNG",
        Kiribati: "Kiribati",
        Samoa: "Samoa",
        Tonga: "Tonga"
      };
  
      let rawData = donneesParAnnee[annee];
      return Object.entries(rawData).map(([pays, valeur]) => ({
        pays: nomsPays[pays] || pays,
        valeur
      }));
    }
  
    // initialisation des données du graphique
    function afficherGraphiqueParAnnee(annee) {
      let data = formaterDonneesPourAmcharts(annee);
  
      series.data.setAll([]);
      xAxis.data.setAll([]);
      setTimeout(() => {
        series.data.setAll(data);
        xAxis.data.setAll(data);
      }, 100);
    }

    // Connexion du slider au graphique
  let anneeSlider = document.getElementById("anneeSlider");
  let valeurAnnee = document.getElementById("valeurAnnee");

  // Afficher l'année initiale dans le span
  valeurAnnee.textContent = anneeSlider.value;

  // Mettre à jour les graphiques à chaque changement de valeur du slider
  anneeSlider.addEventListener("input", function () {
      let annee = anneeSlider.value;
      valeurAnnee.textContent = annee; // mettre à jour le texte affiché
      afficherGraphiqueParAnnee(annee);
  });

    series.columns.template.events.on("click", function (ev) { // gestion du clic sur une colonne (graphique enchapiné)
      let pays = ev.target.dataItem.dataContext.pays;
      afficherDetailParPays(pays);
    });
  
    function afficherDetailParPays(pays) { // fonction pour le deuxième graphique (affiché seulement après un clic sur une colonne du premier graphique)
        if (window.detailRoot) window.detailRoot.dispose(); // efface (temporairement) l'ancien graphique si il existe
        let detailRoot = am5.Root.new("chartDiv2"); // le deuxième graphique s'affiche
        window.detailRoot = detailRoot; // stocke la référence pour pouvoir le supprimer plus tard
        detailRoot.setThemes([am5themes_Animated.new(detailRoot)]); // création du thème pour le deuxième graphique
      
        let chart = detailRoot.container.children.push(am5percent.PieChart.new(detailRoot, { // graphique circulaire
          layout: detailRoot.verticalLayout,
          innerRadius: am5.percent(50) // pour un graphique en anneau
        }));
      
        // série de données
        let series = chart.series.push(am5percent.PieSeries.new(detailRoot, {
          valueField: "valeur",
          categoryField: "indicateur",
          alignLabels: false
        }));

        // configuration des couleurs du graphique
        let colorSet = am5.ColorSet.new(detailRoot, {
          colors: [
            am5.color(0xad6e7f),
            am5.color(0xffa578),
            am5.color(0xffe5cf)
          ]
        });

        series.set("colors", colorSet); // application des couleurs

        series.labels.template.setAll({ // configuration des labels
          textType: "circular",
          centerX: 0,
          centerY: 0
        });
      
        series.ticks.template.setAll({ // configuration des ticks
          forceHidden: true
        });
      
        // Données des détails par pays
        const baseData = {
          "Fidji": [
            { indicateur: "Accouchements assistés", valeur: 100, },
            { indicateur: "Couverture santé", valeur: 59.43 },
            { indicateur: "Mortalité eau", valeur: 0.0101 }
          ],
          "Vanuatu": [
            { indicateur: "Couverture santé", valeur: 46.37 },
            { indicateur: "Mortalité eau", valeur: 0.0249 }
          ],
          "PapouasieNG": [
            { indicateur: "Couverture santé", valeur: 30.02 },
            { indicateur: "Mortalité eau", valeur: 0.0218 }
          ],
          "Kiribati": [
            { indicateur: "Couverture santé", valeur: 48.1 },
            { indicateur: "Mortalité eau", valeur: 0.0436 }
          ],
          "Samoa": [
            { indicateur: "Accouchements assistés", valeur: 0.089 },
            { indicateur: "Couverture santé", valeur: 55.02 },
            { indicateur: "Mortalité eau", valeur: 0.0098 }
          ],
          "Tonga": [
            { indicateur: "Accouchements assistés", valeur: 89 },
            { indicateur: "Couverture santé", valeur: 56.8 },
            { indicateur: "Mortalité eau", valeur: 0.0071 }
          ]
        };
      
        let donnees = baseData[pays] || [];
      
        series.data.setAll(donnees);
      
        chart.children.push(am5.Legend.new(detailRoot, {
          centerX: am5.percent(50),
          x: am5.percent(50),
          marginTop: 15,
          marginBottom: 15,
        })).data.setAll(series.dataItems);
      
        series.appear(1000, 100);
      }

    // gestion du changement d'année
    window.afficherGraphiqueParAnnee = afficherGraphiqueParAnnee;
    afficherGraphiqueParAnnee(2016);
  });
});