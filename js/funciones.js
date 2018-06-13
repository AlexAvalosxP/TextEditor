function enableEdit()
{
	richTextField.document.designMode = 'on';
}

function changeStyle(sty)
{
	richTextField.document.execCommand(sty, false, null);
}

function changeStyle2(sty, some)
{
	richTextField.document.execCommand(sty, false, some);
}