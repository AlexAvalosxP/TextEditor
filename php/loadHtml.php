<?php 	

$nombre_fichero = '../documents/' .  $_POST['i'];
$gestor = fopen($nombre_fichero, "r");
$contenido = fread($gestor, filesize($nombre_fichero));
fclose($gestor);

echo $contenido;

/*
echo json_encode(array(
    	"html" => $contenido
));*/

 ?>