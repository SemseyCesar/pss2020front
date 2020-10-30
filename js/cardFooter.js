function cardFooter(counter) {
	const footer = document.getElementById("footer");
	var footerText;
	if (counter==0)
		footerText = "No hay resultados";
	else
		if (counter==1)
			footerText = "Se encontró " + counter + " resultado";
		else
			footerText = "Se encontraron " + counter + " resultados";
	return footerText;
}