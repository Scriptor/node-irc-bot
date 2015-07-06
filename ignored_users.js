module.exports = {
	nicks: ['squishyj'],
	is: function( nick ){
		if( nick in this.nicks )
			return true;
		else
			return false;
	}
}