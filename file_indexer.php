<?php
$dom = new DOMDocument();
$count = 0;
$data_file = glob('data.php');
$data2_file = glob('data-2.php');
$files = array_merge($data_file, $data2_file);
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
        $results[] = ["page_id" => $count, "values" => $sanitized_str, 'link' => $id . '.php'];
    }
    $h1 = $page_path->query("//h1[@class='h1']", $dom);
    foreach($h1 as $k => $h1_item){
        $trimmed_title = trim($h1_item->textContent);
        $sanitized_title = preg_replace('/[\s\t\n]{2,}/', ' ', $trimmed_title);
        $results[$count]['title'] = $sanitized_title;
        $count++;
    }

}

try {
    $json = jsonEncodeWithThrow($results);
}
catch(Exception $e ) {
    echo $json = $e->getMessage() ."\n";
}
$escaped = json_decode($json);
$unescaped = json_encode($escaped, JSON_UNESCAPED_UNICODE );
?>
var files_content = <?php echo $unescaped; ?>;