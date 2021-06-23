<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>

    <div id="search">
        <input type="search" id="txtSearch" placeholder="Recherche">
        <div class="check-container">
            <input type="checkbox" id="sentenceSearch" name="sentenceSearch">
            <label for="sentenceSearch">Chercher l'expression exacte</label>
        </div>
        <div id="filterRecords"></div>
    </div>

<script src="./file_indexer.php"></script>
<script src="./assets/script/search.js"></script>
</body>
</html>