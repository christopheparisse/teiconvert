<?php

$conversions = "java -cp \"../system/teicorpo.jar\"";

$infile = $_POST["from"];
$outfile = $_POST["to"];
$indata = $_POST["data"];
$cmd = $_POST["cmd"];
if (array_key_exists("options",$_POST)) {
	$options = $_POST["options"];
} else {
	$options = false;
}
$extin = $_POST["extin"];
$extout = $_POST["extout"];

/*
echo "1: " . $infile . "<br/>";
echo "2: " . $outfile . "<br/>";
echo "3: " . $cmd . "<br/>";
echo "4: " . $options . "<br/>";
echo "5: " . $extin . "<br/>";
echo "6: " . $extout . "<br/>";
*/

date_default_timezone_set('Europe/Paris');

$file_temp_in = "../dataconvert/" . $infile . "--" . $extin;
$file_temp_out = "../dataconvert/" . $outfile . "--" . $extout;

/*
$file_temp_in = "../dataconvert/" . $infile . "--" . date('d-m-Y-h-i-s') . $extin;
$file_temp_out = "../dataconvert/" . $outfile . "--" . date('d-m-Y-h-i-s') . $extout;
*/

/*
if ($extin === ".textgrid") {
    file_put_contents('../dataconvert/errors.txt', ".extin\n", FILE_APPEND);
    file_put_contents($file_temp_in, base64_decode($indata));
} else
*/
    file_put_contents($file_temp_in, $indata);

// -e \"UTF-8\"
if ($options)
    $torun = $conversions . " " . $cmd . " " . $options . " -i \"" . $file_temp_in . "\" -o \"" . $file_temp_out . "\"";
else
    $torun = $conversions . " " . $cmd . " -i \"" . $file_temp_in . "\" -o \"" . $file_temp_out . "\"";

file_put_contents('../dataconvert/errors.txt', $torun . "\n", FILE_APPEND);

$res = exec($torun);

//echo $res;

echo file_get_contents($file_temp_out);

?>
