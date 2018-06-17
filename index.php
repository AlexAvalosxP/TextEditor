<?php
	session_start();

	require_once('conex.php');

	$funciones=new Funciones();
	$con=$funciones->conectar();

	#iniciar sesion
	if(isset($_POST['btnLogin']))
	{
		$username=$_POST['userLogin'];
		$pass=$_POST['passLogin'];

		$buscar="SELECT COUNT(*) AS total
		FROM usuario
		WHERE username='{$username}'
		AND pass=md5('{$pass}');";

		$resultado= $con->query($buscar);
		$total=$resultado->fetch_assoc();

		if($total['total'] == 0)
		{
			echo "<script>alert ('Usuario o contraseña incorrectos');</script>";
		}
		else
		{
			echo "<script>alert ('Puedes iniciar sesion');</script>";
			$buscarUser = "SELECT idUsuario, username
			FROM usuario
			WHERE username = '{$username}' AND pass = md5('{$pass}');";

			#Mandamos la consulta a la BD
			$resBuscarUser = $con->query($buscarUser);

			#Recuperamos el resultado de la columna
			$res = $resBuscarUser->fetch_assoc();

			#Almacenamos el resultado en las correspondientes variables de sesión
			$_SESSION['id'] = $res['idUsuario'];
			$_SESSION['username'] = $res['username'];
			

			header('Location: index.html');

			echo "ID>{$_SESSION['id']}<br>";
			echo "Username>{$_SESSION['username']}<br>";

		}
	}
	#registrar usuario
	if(isset($_POST['btnRegistrar']))
	{
		
		$username=$_POST['username'];
		$pass=$_POST['pass'];
		$pass2=$_POST['pass2'];
		$email=$_POST['correo'];

		if($pass == $pass2)
		{
			$insert="INSERT INTO usuario(username, pass, correo)
					 VALUES('{$username}',md5('{$pass}'), '{$email}');";

			if($con->query($insert))
			{
				echo "<script>alert ('Usuario registrado exitosamente!');</script>";
			}
			else
			{
				echo $con->error."<br/>";
				echo $insert."<br/>";
			}
		}
		else
		{
			echo "<script>alert ('Las contraseñas no coinciden!');</script>";
		}
	}

 ?>


<!DOCTYPE html>
<html>
<head>
	<link href="css/estiloLogin.css" rel="stylesheet" type="text/css">
	<title>Login</title>
	<img src="logo.png" class="logo">
</head>
<body>

<table align="center" class="login">
	<form action="#" method="POST">
		<tr>
			<td><input type="text" name="userLogin" placeholder="Nombre de Usuario" class="logIn" style='width:441px; height:36px' required="required"></td>
		</tr>
			<tr>
				<td><input type="password" name="passLogin" placeholder="Contraseña" class="logIn" style='width:441px; height:36px' required="required"></td>
			</tr>
			<tr>
				<td><input type="submit" name="btnLogin" value="Iniciar Sesión" style='width:200px; height:49px' class="btnLogin"></td>
			</tr>
	</form>
</table>


<table align="center" class="register">
	<form action="#" method="POST">
		<tr>
			<td><input type="username" name="username" placeholder="Nombre de Usuario" class="signUp" style='width:440px; height:36px' required="required"></td>
		</tr>
		<tr>
			<td><input type="password" name="pass" placeholder="Contraseña" class="signUp" style='width:441px; height:36px' required="required"></td>
		</tr>
		<tr>
			<td><input type="password" name="pass2" placeholder="Confirmar Contraseña" class="signUp" style='width:441px; height:36px' required="required"></td>
		</tr>
		<tr>
			<td><input type="email" name="correo" placeholder="Correo Electrónico" class="signUp" style='width:441px; height:36px' required="required"></td>
		</tr>
		<tr>
			<td><input type="submit" name="btnRegistrar" value="Regístrate"  style='width:200px; height:49px' class="btnSignup"></td></td>
		</tr>
	</form>
</table>


</body>
</html>

