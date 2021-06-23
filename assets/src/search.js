import lunr from 'lunr';
require("lunr-languages/lunr.stemmer.support")(lunr);
require("lunr-languages/lunr.fr")(lunr);
require('./lunr.unicodeNormalizer')(lunr)

// Lance la recherche et affiche les resultats si l'index existe
if(files_content && !isEmpty(files_content)) {

    // traitement des valeurs vide
    for(const k in files_content) {
        let tmp;
        if (files_content[k].hasOwnProperty('values')) {
            if(files_content[k].values !== null) {
                tmp = files_content[k].values.toString();
            } else {
                // console.info("L'index de la page : '" + files_content[k].title + "' Ne contient pas de données, vérifier les class html ou l'encodage du fichier source.")
                tmp= '';
            }
        } else {
            // console.info("L'Objet de la page : '" + files_content[k].title +"' n'a pas la propriété 'values' il y a un problème avec le fichier source. Une propriété vide va être créé");
            files_content[k].values = '';
            tmp = files_content[k].values.toString();
        }
        files_content[k].content = tmp;
        delete files_content[k].values;
    }

    // Indéxer les contenus
    let index = lunr(function () {
        this.use(lunr.fr);
        this.use(lunr.unicodeNormalizer);
        this.ref('link');
        this.field('content');
        this.field('title');
        this.k1(1.3);
        this.b(0.7);
        this.metadataWhitelist = ['position', 'index'];

        files_content.forEach(function (doc) {
            this.add(doc);
        }, this)
    })
    // Type de recherche : expression exacte ou mots clé
    let searchExpression = false;

    // Cibler les éléments HTML
    let filterRecord = document.getElementById('filterRecords');
    let inputField = document.getElementById('txtSearch');
    let searchCheckbox = document.getElementById('sentenceSearch');

    // Préparer les élément HTML d'affichage
    let resultPageOpen = '<div class="result-page">';
    let resultPageClose = '</div>';
    let resultItemOpen = '<ul class="result-item">';
    let resultItemClose = '</ul>';

    searchCheckbox.addEventListener('change', function() {
        if (this.checked) {
            searchExpression = true;
        } else {
            searchExpression = false;
        }
    });

    inputField.addEventListener('input', function(inputEvent) {
        if( this.value !== '') {
            inputField.addEventListener('keyup', function(keyboardEvent) {
                // console.log(keyboardEvent)
                if (keyboardEvent.code === 'Enter' || keyboardEvent.key === 'Enter') {
                    let userInputs = inputField.value;
                    // si le champs est vide, ne pas lancer de recherche
                    if(userInputs === '')  {
                        filterRecord.innerHTML= '';
                        return;
                    } else if (userInputs.length < 4) {
                        filterRecord.innerHTML = '<div class="search-result-row">Saisir plus 3 lettres</div>';
                        return;
                    }

                    let results;
                    let output = '<div class="search-result-row">';
                    if (searchExpression === true) { //expression exacte activé
                        let r = false;
                        for (const content in files_content) {

                            let expressionToSearch = new RegExp("(?:"+userInputs+")", 'g');
                            let astart = files_content[content].content.search(expressionToSearch);
                            if (astart !== -1) {
                                r = true;
                                output += resultPageOpen;
                                output += setLink(files_content[content].link, files_content[content].title);
                                output += resultItemOpen;
                                let bend = userInputs.length;
                                let excerpt = files_content[content].content.substring(astart - 30, astart + bend + 30);
                                output += displayResult(excerpt, userInputs);
                                output += resultItemClose;
                                output += resultPageClose;
                            }
                        }
                        if( r === false) {
                            output += 'Aucun resultat ne correspond à votre recherche';
                        }
                        output += '</div>';
                        filterRecord.innerHTML = output;
                    } else { // mots clés par defaut
                        results = index.search(userInputs); // + "~1" = fuzzy matches
                        if(results.length > 0) {
                            for(const n in results) {
                                // On regénère le titre de la page ou se trouve le resultat
                                let title = generateTitle(results[n].ref);

                                // Affiche les résultats
                                output += resultPageOpen;
                                output += setLink(results[n].ref, title[0]);
                                Object.keys(results[n].matchData.metadata).forEach(function (term) {
                                    Object.keys(results[n].matchData.metadata[term]).forEach(function (fieldName) {
                                        let termPos =  results[n].matchData.metadata[term][fieldName].position;
                                        output += resultItemOpen;
                                        output += '<li>';
                                        for (const i in files_content) {
                                            if (files_content[i].link === results[n].ref) {
                                                output += '<ul>';
                                                for (const k in termPos) {
                                                    let word = files_content[i].content.substring((termPos[k][0]), (termPos[k][0] + termPos[k][1]));
                                                    let excerpt = files_content[i].content.substring((termPos[k][0] - 30), (termPos[k][0] + termPos[k][1] + 30));
                                                    output += displayResult(excerpt, word);
                                                }
                                                output += '</ul>';
                                            }
                                        }
                                        output += '</li>';
                                        output += resultItemClose;
                                    })
                                })
                                output += resultPageClose;
                            }
                        } else {
                            output += 'Aucun resultat ne correspond à votre recherche';
                        }

                    }

                    if(!userInputs){
                        output += '</div></div><div class="search-result-row">'
                    }
                    output += '</div>';
                    filterRecord.innerHTML = output;
                }
            });
        }
        else {
            filterRecord.innerHTML = '';
        }
    });
} else {
    console.error("Il n'y a pas d'index de recherche, le fichiers est mal formaté ou n'existe pas")
}

function generateTitle(string) {
    let titleElement = string.replace(new RegExp('-', 'g'), ' ').trim();
    if(titleElement === 'index.php') {
        titleElement = 'accueil.php';
    }
    if(titleElement.substring(0, 4) === 'rtie') {
        titleElement = 'Partie ' + titleElement.substring(4);
    }
    let title = titleElement.charAt(0).toUpperCase() + titleElement.slice(1);
    return title.split('.')
}

function setLink(link, title) {
    return '<a href="'+ link +'" title="Voir la page '+title+'">'+title+'</a>';
}

function displayResult(excerpt, word) {
    return '<li>...'+excerpt.replace(word,'<mark>'+word+'</mark>')+'...</li>';
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

// Récupère un paramètre dans l'url par son nom
function getParameterByName(name) {
    let match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Créer un modal HTML
function createModal() {
    // layout modal
    let modal = document.createElement('div')
    modal.setAttribute('id','searchModal');
    modal.setAttribute('style','display: block;position:fixed;z-index:1;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgb(0,0,0);background-color: rgba(0,0,0,0.2);');

    // Create modal elements
    let modalContent = document.createElement('div')
    modalContent.setAttribute('class','search-modal-content');
    modalContent.setAttribute('style','background-color: #fefefe;margin:15%auto;padding:20px;border:1px solid #888;width:20%;');

    let modalContentClose = document.createElement('span');
    modalContentClose.setAttribute('class', 'close');
    modalContentClose.setAttribute('style', 'color:#a0a0a0;float:right;font-size: 32px;line-height:18px;font-weight:bold;cursor:pointer');
    modalContentClose.innerHTML = "&times;";

    let modalContentFindNext = document.createElement('button');
    modalContentFindNext.setAttribute('id', 'ModalfindBtn');
    modalContentFindNext.setAttribute('type', 'button');
    modalContentFindNext.setAttribute('value', 'Prochaine occurence');
    modalContentFindNext.innerText = 'Prochaine occurence';

    // create modal
    modalContent.appendChild(modalContentClose);
    modalContent.appendChild(modalContentFindNext);
    modal.appendChild(modalContent)

    document.body.appendChild(modal);
}