<?php 	

	$i = $_POST['i'];
	$n = $_POST['n'];

	$file = fopen('../documents/' . $n . '.txt','w+');
	fwrite($file, $i);
	fclose($file);

 ?>