<?php
$dom = new DOMDocument();
$count = 0;
$data_file = glob('data.php');
$files = array_merge($data_file);
$results = [];
$data = [];

function jsonEncodeWithThrow($data) {
    if( json_encode($data, JSON_PARTIAL_OUTPUT_ON_ERROR ) === false ) {
        throw new Exception( json_last_error_msg () );
    } else {
        return json_encode($data, JSON_PARTIAL_OUTPUT_ON_ERROR );
    }
}

foreach ($files as $filename) {
    $dom->loadHTMLFile($filename);
    $page_path = new DOMXpath($dom);
    $p = pathinfo($filename);
    $id = $p['filename'];
    $elements = $page_path->query("//div[@class='Bloc-de-texte-standard']", $dom);
    foreach ($elements as $el) {
        $trimmed_str = trim($el->nodeValue);
        $sanitized_str = preg_replace('/[\s\t\n]{2,}/', ' ', $trimmed_str);
        $sanitized_str = mb_convert_encoding($sanitized_str, 'UTF-8', 'UTF-8');
        $converted_str = iconv( "UTF-8", "ISO-8859-1//IGNORE", $sanitized_str);
        $results[] = ["page_id" => $count, "values" => $converted_str, 'link' => $id . '.php'];
    }
    $h1 = $page_path->query("//h1[@class='h1']", $dom);
    foreach($h1 as $k => $h1_item){
        $trimmed_title = trim($h1_item->textContent);
        $sanitized_title = preg_replace('/[\s\t\n]{2,}/', ' ', $trimmed_title);
        $sanitized_title = mb_convert_encoding($sanitized_title, 'UTF-8', 'UTF-8');
        $converted_title = iconv( "UTF-8", "ISO-8859-1//IGNORE", $sanitized_title);
        $results[$count]['title'] = $converted_title;
        $count++;
    }
}
try {
    $json = jsonEncodeWithThrow($results);
}
catch(Exception $e ) {
    echo $json = $e->getMessage() ."\n";
}
$d_j = json_decode($json);
$n_j = json_encode($d_j, JSON_UNESCAPED_UNICODE );
?>
var files_content = <?php echo $n_j; ?>;