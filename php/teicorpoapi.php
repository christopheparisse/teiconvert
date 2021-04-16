<?php

date_default_timezone_set('Europe/Paris');
$jsonret = [ 
	'value' => 1, 
	'data' => '', 
	'type' => '', 
	'output' => '',
	'error' => ''
];

/*
	input options:
	from: input file type
	to: output file type
	data: input content (if data is not set, then the input content is in $_FILES['data']['tmp_name'])
	cmd: default command (fr.ortolang.teicorpo.TeiCorpo) is replaced by 'cmd'
	options: a string containing options added to the command. Each options is separated by a blank
*/

$exec = "java -cp \"../system/teicorpo.jar\"";

$from = $_POST["from"];
$to = $_POST["to"];

$fileinfo = $_POST["fileinfo"];

if (array_key_exists("data",$_POST)) {
    $jsonret['type'] = '$_POST';
	$indata = $_POST["data"];
//	echo "I found in data: " . $indata . "<br/>\n";
	$file_temp_in = $fileinfo . "tmpin.data";
	file_put_contents($file_temp_in, $indata);
	$file_temp_out = $fileinfo . "tmpout.data";
} else if (array_key_exists("data",$_FILES)) {
    $jsonret['type'] = '$_FILES';
	$file_temp_in = $_FILES['data']['tmp_name'];
	$file_temp_out = $fileinfo . "tmpout.data";
} else {
    $jsonret['error'] = "no data provided.";
	header('Content-type: application/json');
	exit(json_encode( $jsonret ));
}

if (file_exists($file_temp_out)) {
	unlink($file_temp_out);
}

if (array_key_exists("cmd",$_POST)) {
	$cmd = $_POST["cmd"];
} else {
	$cmd = "fr.ortolang.teicorpo.TeiCorpo";
}
if (array_key_exists("options",$_POST)) {
	$options = $_POST["options"];
} else {
	$options = "";
}

/*
echo "1: " . $from . "<br/>";
echo "2: " . $to . "<br/>";
echo "3: " . $cmd . "<br/>";
echo "4: " . $options . "<br/>";
*/

/*
if ($extin === "textgrid") {
    file_put_contents('../dataconvert/errors.txt', ".extin\n", FILE_APPEND);
    file_put_contents($file_temp_in, base64_decode($indata));
} else
*/

// -e \"UTF-8\"
$torun = $exec . " " . $cmd . " " . $options . " -from " . $from . " -to " . $to .  " -i \"" . $file_temp_in . "\" -o \"" . $file_temp_out . "\"";

file_put_contents('trace.txt', $torun . "\n", FILE_APPEND);

exec($torun . ' 2>&1', $output, $res);

if ($res == 0) {
	$jsonret['value'] = 0;
	if (file_exists($file_temp_out)) {
		file_put_contents('trace.txt', "traitmement ok\n", FILE_APPEND);
		$jsonret['data'] = file_get_contents($file_temp_out);
	} else {
		file_put_contents('trace.txt', "erreur de traitmement\n", FILE_APPEND);
	    $jsonret['error'] = "file not processed";
		$jsonret['data'] = '';		
	}
    $jsonret['output'] = $output;
} else {
	file_put_contents('trace.txt', "error: " . $res . "\n", FILE_APPEND);
    $jsonret['error'] = "bad command";
    $jsonret['value'] = $res;
    $jsonret['output'] = $output;
}

/*
	return value
	json with
		error
		value
		output
		data
	if value == 0 then ok and data should be filed with the result and error empty string
	if value != 0 then not good and data should be empty and error contains the explanation
	output always contains the message displayed by the command.
*/

file_put_contents('trace.txt', "FINALISATION\n", FILE_APPEND);

// header('Content-type: application/json');
echo json_encode( $jsonret );

/*
$option = $_GET['option'];

if ( $option == 1 ) {
    $data = [ 'a', 'b', 'c' ];
    // will encode to JSON array: ["a","b","c"]
    // accessed as example in JavaScript like: result[1] (returns "b")
} else {
    $data = [ 'name' => 'God', 'age' => -1 ];
    // will encode to JSON object: {"name":"God","age":-1}  
    // accessed as example in JavaScript like: result.name or result['name'] (returns "God")
}

header('Content-type: application/json');
echo json_encode( $data );
*/

?>
