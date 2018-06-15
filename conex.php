<?php

	class Funciones
	{

		public function conectar()
		{
			$host="localhost";
			$user="root";
			$pass="";
			$db="textEditor";

			$conexion=new mysqli($host, $user, $pass, $db);

			if($conexion->connect_errno > 0)
			{
				echo $conexion->error."</br>";
			}
			else
			{
				#echo "Conexion exitosa</br>";
			}

			return $conexion;
		}
	}

 ?>
