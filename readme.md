# Moteur de recherche pour site statique

Moteur de recherche basé sur Lunrjs. Les données json sont créer à partir du fichier file_indexer.php qui parse des fichiers php pour la démo, mais le principe reste de passer un json contenant des données dans lesquelles rechercher.
La recherce focntionne mot par mot, c'est à dire rechercher "page exemple" donnera des résultat pour "page" et "exemple", mais aussi par expression exact ; la même recherche ne renverra que les résultats qui contienne "page exemple".

## indexation
L'indexation ce fait avec le fichier file_indexer.php qui parse le html des fichier (ici data.php) il génère un json avec le contenu de la "page" le titre h1 et le nom du fichier qui servirons dans le javascript à avoir le lien de la page ou se trouve le mot rechercher.

Les fichiers sont à renseigner manuellement dans l'entête du fichier.

Pour cette démo le json sera formaté de la manière suivante  : {"page_id" : "", "values" : "", "title" : "", "link" : ""}

En cas de modification il faudra adapter le javascript.